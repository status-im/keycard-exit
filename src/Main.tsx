import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, NativeEventEmitter, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DiscoveryScreen from './components/steps/DiscoveryScreen';
import InitializationScreen from './components/steps/InitializationScreen';
import MnemonicScreen from './components/steps/MnemonicScreen';
import HomeScreen from './components/steps/HomeScreen';
import FactoryResetScreen from './components/steps/FactoryResetScreen';
import NFCModal from './NFCModal';

//@ts-ignore
import Keycard from "react-native-status-keycard";
import Dialpad from './components/Dialpad';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import Styles from './Styles';

enum Step {
  Discovery,
  Initialization,
  Loading,
  Authentication,
  Home,
  FactoryReset,
}

const Main = () => {
  const PIN_MAX_RETRY = 3;
  const WALLET_DERIVATION_PATH = "m/84'/0'/0'/0/0";
  const LOGIN_ENDPOINT = "https://exit.logos.co/keycard/auth";

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [step, setStep] = useState(Step.Discovery);
  const [pinCounter, setPinCounter] = useState(PIN_MAX_RETRY);

  const didMount = useRef(false);
  const stepRef = useRef(step);
  const pinRef = useRef("");
  const mnemonicRef = useRef("");
  const walletKey = useRef("");
  const sessionRef = useRef("")
  const challengeRef = useRef("")

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

  const loginRequest = async () => {
    var req = {'session-id': sessionRef.current};

    const identChallenge = bytesToHex(sha256('Keycard auth' + challengeRef.current));  
    const data = await Keycard.verifyCard(identChallenge);
    req['keycard-auth'] = data['tlv-data'];

    const walletChallenge = bytesToHex(sha256('Wallet auth' + challengeRef.current));
    req['wallet-auth'] = await Keycard.signWithPath(pinRef.current, WALLET_DERIVATION_PATH, walletChallenge);

    challengeRef.current = "";
    sessionRef.current = "";

    return JSON.stringify(req);
  }

  const keycardConnectHandler = async () => {
    var newPinCounter = pinCounter;
    var loginReq = "";

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
          //fallthrough
        case Step.Authentication:
          walletKey.current = await Keycard.exportKeyWithPath(pinRef.current, WALLET_DERIVATION_PATH);
          await AsyncStorage.setItem("wallet-key", walletKey.current);
          setStep(Step.Home);
          break;
        case Step.Home:
          loginReq = await loginRequest();
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
    
    await stopNFC();

    if (loginReq) {
      console.log(loginReq);
      
      try {
        const resp = await fetch(LOGIN_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: loginReq,
        });

        const respJson = await resp.json();
        if (respJson['error']) {
          //TODO: handle error
        }

        //TODO: handle success
      } catch (e) {
        //TODO: handle error
      }
    }
  }

  useEffect(() => {
    stepRef.current = step;

    const eventEmitter = new NativeEventEmitter(Keycard);
    let onConnectedListener = eventEmitter.addListener('keyCardOnConnected', keycardConnectHandler);
    let onDisconnectedListener = eventEmitter.addListener('keyCardOnDisconnected', () => console.log("keycard disconnected"));
    let onNFCEnabledListener = eventEmitter.addListener('keyCardOnNFCEnabled', () => console.log("nfc enabled"));
    let onNFCDisabledListener = eventEmitter.addListener('keyCardOnNFCDisabled', () => console.log("nfc disabled"));

    if (!didMount.current) {
      didMount.current = true;

      const loadData = async () => {
        await Keycard.setPairings(await getPairings());
        const tmp = await AsyncStorage.getItem("wallet-key");
        walletKey.current = tmp !== null ? tmp : "";

        if (walletKey.current) {
          setStep(Step.Home);
        }
      };

      loadData().catch(console.log);
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

  const authenticate = (pin: string) => {
    pinRef.current = pin
    connectCard();
    return true;
  }

  const login = (sessionId: string, challenge: string, p?: string) => {
    if (p) {
      pinRef.current = p;
    }

    sessionRef.current = sessionId;
    challengeRef.current = challenge;
    return connectCard();
  }

  const cancel = () => {
    walletKey.current = "";
    AsyncStorage.removeItem("wallet-key");
    setStep(Step.Discovery);
  }

  const pinDisplayCounter = () => {
    return pinCounter == PIN_MAX_RETRY ? -1 : pinCounter;
  }

  const stopNFC = async () => {
    await Keycard.stopNFC("");
    setIsModalVisible(false);
  }

  return (
    <ImageBackground source={require("./images/gradient.png")} resizeMode='stretch' style={Styles.mainContainer}>
      {step == Step.Discovery && <DiscoveryScreen onPressFunc={connectCard}></DiscoveryScreen>}
      {step == Step.Initialization && <InitializationScreen onPressFunc={initPin} onCancelFunc={cancel}></InitializationScreen>}
      {step == Step.Loading && <MnemonicScreen pinRequired={pinRef.current ? false : true} pinRetryCounter={pinDisplayCounter()} onPressFunc={loadMnemonic} onCancelFunc={cancel}></MnemonicScreen>}
      {step == Step.Authentication && <Dialpad pinRetryCounter={pinDisplayCounter()} prompt={"Enter PIN"} onCancelFunc={cancel} onNextFunc={authenticate}></Dialpad>}
      {step == Step.Home && <HomeScreen pinRequired={pinRef.current ? false : true} pinRetryCounter={pinDisplayCounter()} walletKey={walletKey.current} onPressFunc={login} onCancelFunc={cancel} onFactoryResetFunc={startFactoryReset}></HomeScreen>}
      {step == Step.FactoryReset && <FactoryResetScreen pinRetryCounter={pinDisplayCounter()} onPressFunc={connectCard} onCancelFunc={cancel}></FactoryResetScreen>}
      <NFCModal isVisible={isModalVisible} onChangeFunc={stopNFC}></NFCModal>
    </ImageBackground>
  );
}

export default Main;

