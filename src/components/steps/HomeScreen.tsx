import {FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import { useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera";

type HomeScreenProps = {
  walletKey: string;
  onPressFunc: (sessionId: string, challenge: string) => void;
  onCancelFunc: () => void;
};

const  HomeScreen: FC<HomeScreenProps> = props => {
  const {walletKey, onPressFunc, onCancelFunc} = props;
  const cameraDevice = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission();
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`)
    }
  });

  const walletAddress = () => {
    return walletKey;
  }

  useEffect(() => {
    if (!hasPermission) {
      if (!requestPermission()) {
        onCancelFunc();
      };
    }
  });

  return (
    <View>
      <View>
        <Text style={styles.heading}> Success</Text>
        <Text style={styles.prompt}>{walletAddress()}</Text>
        <Button label="Home" disabled={false} btnColor="#199515" btnBorderColor="#199515" btnFontSize={17} btnBorderWidth={1} btnWidth="100%" onChangeFunc={onCancelFunc} btnJustifyContent='center'></Button>
        </View>
    </View>
  )};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Inconsolata Medium',
    color: '#199515',
    marginTop: '50%'
  },
  prompt: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Inconsolata Regular',
    color: 'white',
    marginTop: '5%'
  }
});

export default HomeScreen;