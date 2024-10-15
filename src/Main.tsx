import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, NativeEventEmitter, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DiscoveryScreen from './components/steps/DiscoveryScreen';
import InitializationScreen from './components/steps/InitializationScreen';
import MnemonicScreen from './components/steps/MnemonicScreen';
import HomeScreen from './components/steps/HomeScreen';
import NFCModal from './NFCModal';

//@ts-ignore
import Keycard from "react-native-status-keycard";
import Dialpad from './components/Dialpad';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import Styles from './Styles';
import InfoScreen from './components/steps/InfoScreen';

enum Step {
  Discovery,
  Initialization,
  Loading,
  LoadSuccess,
  Authentication,
  Home,
  LoginSuccess,
  LoginError,
  FactoryReset,
  NotAuthentic,
}

const Main = () => {
  const PIN_MAX_RETRY = 3;
  const WALLET_DERIVATION_PATH = "m/84'/0'/0'/0/0";
  const LOGIN_ENDPOINT = "https://exit.logos.co/keycard/auth";

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [step, setStep] = useState(Step.Discovery);
  const [pinCounter, setPinCounter] = useState(PIN_MAX_RETRY);
  const [errorMessage, setErrorMessage] = useState("");

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

      if (appInfo["authentic?"] === false) {
        setStep(Step.NotAuthentic);
        await stopNFC(); 
        return;
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
          walletKey.current = await Keycard.exportKeyWithPath(pinRef.current, WALLET_DERIVATION_PATH);
          await AsyncStorage.setItem("wallet-key", walletKey.current);
          setStep(Step.LoadSuccess)
          break;
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
          walletKey.current = "";
          AsyncStorage.removeItem("wallet-key");
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
          setErrorMessage(respJson['error']);
          setStep(Step.LoginError);
        }

        setStep(Step.LoginSuccess)
      } catch (e) {
        setErrorMessage("Login failed. Please try again.");
        setStep(Step.LoginError);
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
        await Keycard.setCertificationAuthorities(["029ab99ee1e7a71bdf45b3f9c58c99866ff1294d2c1e304e228a86e10c3343501c"]);
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

  const cancelFactoryReset = () => {
    if (walletKey.current) {
      setStep(Step.Home);
    } else {
      setStep(Step.Discovery);
    }
  }

  const pinDisplayCounter = () => {
    return pinCounter == PIN_MAX_RETRY ? -1 : pinCounter;
  }

  const stopNFC = async () => {
    await Keycard.stopNFC("");
    setIsModalVisible(false);
  }

  const toHome = async () => {
    setStep(Step.Home);
  }

  const factoryResetMessage = () => {
    if (pinCounter) {
      return "This will remove all keys from this card and completely reset it. Do you want to proceed?";
    } else {
      return "This card is blocked. You can only continue using it by performing a factory reset. Factory reset will remove all keys and reset the card.";
    }
  }

  return (
    <ImageBackground source={require("./images/gradient.png")} resizeMode='stretch' style={Styles.mainContainer}>
      {step == Step.Discovery && <DiscoveryScreen onPressFunc={connectCard}></DiscoveryScreen>}
      {step == Step.Initialization && <InitializationScreen onPressFunc={initPin} onCancelFunc={cancel}></InitializationScreen>}
      {step == Step.Loading && <MnemonicScreen pinRequired={pinRef.current ? false : true} pinRetryCounter={pinDisplayCounter()} onPressFunc={loadMnemonic} onCancelFunc={cancel}></MnemonicScreen>}
      {step == Step.LoadSuccess && <InfoScreen icon="check-circle" title="Congratulations!" message="You've successfully protected your wallet. Remember to keep your seed phrase safe, it's your responsibility!" onPressFunc={toHome}></InfoScreen>}
      {step == Step.Authentication && <Dialpad pinRetryCounter={pinDisplayCounter()} prompt={"Enter PIN"} onCancelFunc={cancel} onNextFunc={authenticate}></Dialpad>}
      {step == Step.Home && <HomeScreen pinRequired={pinRef.current ? false : true} pinRetryCounter={pinDisplayCounter()} walletKey={walletKey.current} onPressFunc={login} onCancelFunc={cancel} onFactoryResetFunc={startFactoryReset}></HomeScreen>}
      {step == Step.FactoryReset && <InfoScreen icon="alert-circle" title="Factory Reset" message={factoryResetMessage()} onPressFunc={connectCard} onCancelFunc={cancelFactoryReset}></InfoScreen>}
      {step == Step.LoginSuccess && <InfoScreen icon="check-circle" title="Success!" message="Login successful. You can now proceed to the Operator Dashboard in your browser" onPressFunc={toHome}></InfoScreen>}
      {step == Step.LoginError && <InfoScreen icon="close-circle" title="Error" message={errorMessage} onPressFunc={toHome}></InfoScreen>}
      {step == Step.NotAuthentic && <InfoScreen icon="close-circle" title="Error" message="We couldn't verify that this is an authentic Keycard. Please contact your distributor." onPressFunc={cancel}></InfoScreen>}
      <NFCModal isVisible={isModalVisible} onChangeFunc={stopNFC}></NFCModal>
    </ImageBackground>
  );
}

export default Main;

