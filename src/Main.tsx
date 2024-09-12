import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, useColorScheme, DeviceEventEmitter } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import DiscoveryScreen from './components/steps/DiscoveryScreen';

//@ts-ignore
import Keycard from "react-native-status-keycard";
import InitializationScreen from './components/steps/InitializationScreen';
import NFCModal from './NFCModal';

enum Step {
  Discovery,
  Initialization,
  Loading,
  Authentication
}

const Main = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [step, setStep] = useState(Step.Discovery);

  const didMount = useRef(false);
  const stepRef = useRef(step);
  const pinRef = useRef("");

  const keycardConnectHandler = async () => {
    try {
      const appInfo = await Keycard.getApplicationInfo();

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
          setStep(Step.Authentication);
          break;
        case Step.Authentication:
          setStep(Step.Discovery);
          break;
        default:
          setStep(Step.Discovery);
          break;
      }

      if (pinRef.current) {
        await Keycard.unpair(pinRef.current);
      }
    } catch (err) {
      console.log(err);
    }

    await Keycard.stopNFC("");
    setIsModalVisible(false);
  }
  useEffect(() => {
    stepRef.current = step;

    if (!didMount.current) {
      didMount.current = true;
      DeviceEventEmitter.addListener("keyCardOnConnected", keycardConnectHandler);
      DeviceEventEmitter.addListener("keyCardOnDisconnected", () => console.log("keycard disconnected"));
      DeviceEventEmitter.addListener("keyCardOnNFCEnabled", () => console.log("nfc enabled"));
      DeviceEventEmitter.addListener("keyCardOnNFCDisabled", () => console.log("nfc disabled"));
    }
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const connectCard = async () => {
    if (await Keycard.nfcIsSupported() && !await Keycard.nfcIsEnabled()) {
      await Keycard.openNfcSettings();
    }

    await Keycard.startNFC("Tap your Keycard");

    if (Platform.OS === 'android') {
      setIsModalVisible(true);
    }
  }

  const initPin = async (p: string) => {
    pinRef.current = p;
    return connectCard();
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      {step == Step.Discovery && <DiscoveryScreen onPressFunc={connectCard}></DiscoveryScreen>}
      {step == Step.Initialization && <InitializationScreen onPressFunc={initPin} ></InitializationScreen>}
      <NFCModal isVisible={isModalVisible} onChangeFunc={setIsModalVisible}></NFCModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '30%',
    height: '100%',
    paddingLeft: '6%',
    paddingRight: '6%'
  },
});

export default Main;
