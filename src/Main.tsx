import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DiscoveryScreen from './components/steps/DiscoveryScreen';
import InitializationScreen from './components/steps/InitializationScreen';
import MnemonicScreen from './components/steps/MnemonicScreen';
import AuthenticationScreen from './components/steps/AuthenticationScreen';
import NFCModal from './NFCModal';

//@ts-ignore
import Keycard from "react-native-status-keycard";

enum Step {
  Discovery,
  Initialization,
  Loading,
  Authentication,
  FactoryReset,
}

const Main = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [step, setStep] = useState(Step.Discovery);

  const didMount = useRef(false);
  const stepRef = useRef(step);
  const pinRef = useRef("");
  const mnemonicRef = useRef("");
  const isListeningCard = useRef(false);

  const getPairings = async () => {
    const pairingJSON = await AsyncStorage.getItem("pairings");
    return pairingJSON ? JSON.parse(pairingJSON) : {};
  }

  const addPairing = async (instanceUID, pairing) => {
    const pairings = await getPairings();
    pairings[instanceUID] = {pairing: pairing};
    return AsyncStorage.setItem("pairings", JSON.stringify(pairings));
  }

  const isCardLost = (err) => {
    return (err == "Tag was lost.") || err.includes("NFCError:100");
  }

  const wrongPINCounter = (err) => {
    const matches = /Unexpected error SW, 0x63C(\d+)|wrongPIN\(retryCounter: (\d+)\)/.exec(err)

    if (matches && matches.length == 2) {
      return parseInt(matches[1])
    }

    return null
  }

  const keycardConnectHandler = async () => {
    if (!isListeningCard.current) {
      return;
    }

    try {
      const appInfo = await Keycard.getApplicationInfo();
      if (appInfo["new-pairing"]) {
        await addPairing(appInfo["instance-uid"], appInfo["new-pairing"]);
      }

      switch (stepRef.current) {
        case Step.Discovery:
          if (appInfo["initialized?"]) {
            if (appInfo["has-master-key?"]) {
              setStep(Step.Authentication);
            } else {
              setStep(Step.Loading);
            }
          } else {
            setStep(Step.Initialization);
          }
          break;
        case Step.Initialization:
          await Keycard.init(pinRef.current);
          setStep(Step.Loading);
          break;
        case Step.Loading:
          await Keycard.saveMnemonic(mnemonicRef.current, pinRef.current);
          setStep(Step.Authentication);
          break;
        case Step.Authentication:
          setStep(Step.Discovery);
          break;
        case Step.FactoryReset:
          await Keycard.factoryReset();
          setStep(Step.Discovery);
          break;
        default:
          setStep(Step.Discovery);
          break;
      }
    } catch (err: any) {
      if (isCardLost(err.message)) {
        console.log("connection to card lost");
        return;
      }

      const pinRetryCounter = wrongPINCounter(err.message);

      if (pinRetryCounter !== null) {
        //TODO: better handling
        console.log("wrong PIN. Retry counter: " + pinRetryCounter);
        return;
      }

      console.log(err);
    }

    await Keycard.stopNFC("");
    setIsModalVisible(false);
  }

  useEffect(() => {
    stepRef.current = step;
    isListeningCard.current = isModalVisible;

    const eventEmitter = new NativeEventEmitter(Keycard);
    let onConnectedListener = eventEmitter.addListener('keyCardOnConnected', keycardConnectHandler);
    let onDisconnectedListener = eventEmitter.addListener('keyCardOnDisconnected', () => console.log("keycard disconnected"));
    let onNFCEnabledListener = eventEmitter.addListener('keyCardOnNFCEnabled', () => console.log("nfc enabled"));
    let onNFCDisabledListener = eventEmitter.addListener('keyCardOnNFCDisabled', () => console.log("nfc disabled"));

    if (!didMount.current) {
      didMount.current = true;

      const loadPairing = async () => {
        await Keycard.setPairings(await getPairings());
      };

      loadPairing().catch(console.log);
    }

    return () => {
      onConnectedListener.remove();
      onDisconnectedListener.remove();
      onNFCEnabledListener.remove();
      onNFCDisabledListener.remove();
    };
  });

  const connectCard = async () => {
    if (await Keycard.nfcIsSupported() && !await Keycard.nfcIsEnabled()) {
      await Keycard.openNfcSettings();
    }

    await Keycard.startNFC("Tap your Keycard");

    setIsModalVisible(true);
  }

  const factoryResetCard = async () => {
    stepRef.current = Step.FactoryReset;
    setStep(Step.FactoryReset);
    return connectCard();
  }

  const initPin = async (p: string) => {
    pinRef.current = p;
    return connectCard();
  }

  const loadMnemonic = (mnemonic: string, p?: string) => {
    if (p) {
      pinRef.current = p;
    }

    mnemonicRef.current = mnemonic;

    return connectCard();
  }

  const cancel = () => {
    setStep(Step.Discovery);
  }

  return (
    <SafeAreaView style={styles.container}>
      {step == Step.Discovery && <DiscoveryScreen onPressFunc={connectCard} onFactoryResetFunc={factoryResetCard}></DiscoveryScreen>}
      {step == Step.Initialization && <InitializationScreen onPressFunc={initPin} onCancelFunc={cancel}></InitializationScreen>}
      {step == Step.Loading && <MnemonicScreen onPressFunc={loadMnemonic} pinRequired={pinRef.current ? false : true} onCancelFunc={cancel}></MnemonicScreen>}
      {step == Step.Authentication && <AuthenticationScreen onPressFunc={() => {} } onCancelFunc={cancel}></AuthenticationScreen>}
      <NFCModal isVisible={isModalVisible} onChangeFunc={setIsModalVisible}></NFCModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222222',
    width: '100%',
    height: '100%'
  },
});

export default Main;

