import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DiscoveryScreen from './components/steps/DiscoveryScreen';
import InitializationScreen from './components/steps/InitializationScreen';
import MnemonicScreen from './components/steps/MnemonicScreen';
import AuthenticationScreen from './components/steps/AuthenticationScreen';
import FactoryResetScreen from './components/steps/FactoryResetScreen';
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
  const PIN_MAX_RETRY = 3;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [step, setStep] = useState(Step.Discovery);
  const [pinCounter, setPinCounter] = useState(PIN_MAX_RETRY);

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
    return (err == "Tag was lost.") || /"NFCError:10[02]"/.test(err)
  }

  const wrongPINCounter = (err) => {
    const matches = /Unexpected error SW, 0x63C(\d)|wrongPIN\(retryCounter: (\d+)\)/.exec(err)

    if (matches) {
      if (matches[1] !== undefined) {
        return parseInt(matches[1])
      } else {
        return parseInt(matches[2])
      }
    }

    return null
  }

  const keycardConnectHandler = async () => {
    if (!isListeningCard.current) {
      return;
    }

    var newPinCounter = pinCounter;

    try {
      const appInfo = await Keycard.getApplicationInfo();
      if (appInfo["new-pairing"]) {
        await addPairing(appInfo["instance-uid"], appInfo["new-pairing"]);
      }

      if (appInfo["pin-retry-counter"] !== null) {
        newPinCounter = appInfo["pin-retry-counter"];
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
        pinRef.current = ""
        newPinCounter = pinRetryCounter;
        console.log("wrong PIN. Retry counter: " + pinRetryCounter);
      } else {
        console.log(err);
      }
    }

    if (newPinCounter == 0) {
      setStep(Step.FactoryReset);
    }

    setPinCounter(newPinCounter);
    
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

  const startFactoryReset = async () => {
    stepRef.current = Step.FactoryReset;
    setStep(Step.FactoryReset);
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

  const pinDisplayCounter = () => {
    return pinCounter == PIN_MAX_RETRY ? -1 : pinCounter;
  }

  return (
    <SafeAreaView style={styles.container}>
      {step == Step.Discovery && <DiscoveryScreen onPressFunc={connectCard} onFactoryResetFunc={startFactoryReset}></DiscoveryScreen>}
      {step == Step.Initialization && <InitializationScreen onPressFunc={initPin} onCancelFunc={cancel}></InitializationScreen>}
      {step == Step.Loading && <MnemonicScreen pinRequired={pinRef.current ? false : true} pinRetryCounter={pinDisplayCounter()} onPressFunc={loadMnemonic} onCancelFunc={cancel}></MnemonicScreen>}
      {step == Step.Authentication && <AuthenticationScreen pinRetryCounter={pinDisplayCounter()} onPressFunc={() => {} } onCancelFunc={cancel}></AuthenticationScreen>}
      {step == Step.FactoryReset && <FactoryResetScreen  pinRetryCounter={pinDisplayCounter()}  onPressFunc={connectCard} onCancelFunc={cancel}></FactoryResetScreen>}
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

