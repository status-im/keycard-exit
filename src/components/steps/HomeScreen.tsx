import {FC, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { bech32 } from "bech32";
import { ripemd160 } from "@noble/hashes/ripemd160";
import { sha256 } from "@noble/hashes/sha256";
import ReceiveModal from "../../ReceiveModal";

enum HomeSteps {
  Home,
  ScanCode
}

type HomeScreenProps = {
  walletKey: string;
  onPressFunc: (sessionId: string, challenge: string) => void;
  onCancelFunc: () => void;
};

const  HomeScreen: FC<HomeScreenProps> = props => {
  const {walletKey, onPressFunc, onCancelFunc} = props;
  const [step, setStep] = useState(HomeSteps.Home);
  const [receiveVisible, setReceiveVisible] = useState(false)
  const cameraDevice = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if ((codes.length != 1) || !codes[0].value) {
        return;
      }

      try {
        const payload = JSON.parse(codes[0].value);

        if (!payload["challenge"] || !payload["session-id"]) {
          return;
        }

        setStep(HomeSteps.Home);
        onPressFunc(payload["session-id"], payload["challenge"]);
      } catch(e) {}
    }
  });

  const walletAddress = () => {
    var pubkey = hexToBytes(walletKey);
    if (pubkey[0] == 0x04 && (pubkey.length == 65)) {
      pubkey[0] = 0x02 | (pubkey[64] & 1);
      pubkey = pubkey.slice(0, 33);
    }

    const hash = ripemd160(sha256(pubkey));
    
    var words = bech32.toWords(hash);
    words.unshift(0);

    return bech32.encode('bc', words);
  }

  useEffect(() => {
    if (!hasPermission) {
      if (!requestPermission()) {
        onCancelFunc();
      };
    }
  });

  if (step == HomeSteps.Home) {
    return <SafeAreaView>
      <Button label="Scan" disabled={false} btnColor="#199515" btnBorderColor="#199515" btnFontSize={17} btnBorderWidth={1} btnWidth="100%" onChangeFunc={() => setStep(HomeSteps.ScanCode)} btnJustifyContent='center'></Button>
      <Button label="Receive" disabled={false} btnColor="#199515" btnBorderColor="#199515" btnFontSize={17} btnBorderWidth={1} btnWidth="100%" onChangeFunc={() => setReceiveVisible(true)} btnJustifyContent='center'></Button>
      <Button label="Cancel" disabled={false} btnColor="#199515" btnBorderColor="#199515" btnFontSize={17} btnBorderWidth={1} btnWidth="100%" onChangeFunc={onCancelFunc} btnJustifyContent='center'></Button>
      <ReceiveModal address={walletAddress()} isVisible={receiveVisible} onChangeFunc={() => {setReceiveVisible(false)} } />
    </SafeAreaView>
  } else if (step == HomeSteps.ScanCode) {
    return <Camera style={StyleSheet.absoluteFill} device={cameraDevice!} isActive={true} codeScanner={codeScanner}/>
  }
};

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