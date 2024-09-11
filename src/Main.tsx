import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, useColorScheme, DeviceEventEmitter } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import StartScreen from './components/StartScreen';

//@ts-ignore
import Keycard from "react-native-status-keycard";

const Main = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const didMount = useRef(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      DeviceEventEmitter.addListener("keyCardOnConnected", async () => {
        console.log(await Keycard.getApplicationInfo());
        setIsModalVisible(false);
      });
      DeviceEventEmitter.addListener("keyCardOnDisconnected", () => console.log("keycard disconnected"));
      DeviceEventEmitter.addListener("keyCardOnNFCEnabled", () => console.log("nfc enabled"));
      DeviceEventEmitter.addListener("keyCardOnNFCDisabled", () => console.log("nfc disabled"));
    }
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const exitFunc = async () => {
    if (await Keycard.nfcIsSupported() && !await Keycard.nfcIsEnabled()) {
      await Keycard.openNfcSettings();
    }

    await Keycard.startNFC("Tap your Keycard");

    if (Platform.OS === 'android') {
      setIsModalVisible(true);
    }
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StartScreen onExitBtnFunc={exitFunc} isModalVisible={isModalVisible} modalVisibilityFunc={setIsModalVisible}></StartScreen>
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

