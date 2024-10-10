import {FC, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../Button";
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera";
import { hexToBytes } from "@noble/hashes/utils";
import { bech32 } from "bech32";
import { ripemd160 } from "@noble/hashes/ripemd160";
import { sha256 } from "@noble/hashes/sha256";
import ReceiveModal from "../../ReceiveModal";
import Dialpad from "../Dialpad";
import Styles from "../../Styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SubMenuModal from "../SubMenuModal";
import IconButton from "../IconButton";

enum HomeSteps {
  Home,
  ScanCode,
  InsertPin
}

type HomeScreenProps = {
  pinRequired: boolean;
  pinRetryCounter: number;
  walletKey: string;
  onPressFunc: (sessionId: string, challenge: string, p?: string) => void;
  onCancelFunc: () => void;
  onFactoryResetFunc: () => void;
};

const  HomeScreen: FC<HomeScreenProps> = props => {
  const {pinRequired, pinRetryCounter, walletKey, onPressFunc, onCancelFunc, onFactoryResetFunc} = props;
  const [step, setStep] = useState(HomeSteps.Home);
  const [receiveVisible, setReceiveVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const challengeRef = useRef("");
  const sessionRef = useRef("");
  
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

        challengeRef.current = payload["challenge"];
        sessionRef.current = payload["session-id"];

        if (pinRequired) {
          setStep(HomeSteps.InsertPin);
        } else {
          onPressFunc(sessionRef.current, challengeRef.current)
          setStep(HomeSteps.Home);
        }
      } catch(e) {}
    }
  });

  const submitPin = (p: string) => {
    onPressFunc(sessionRef.current, challengeRef.current, p);
    return true;
  }  

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

  const openSubMenu = () => {
    setMenuVisible(true);
  }

  useEffect(() => {
    if (!hasPermission) {
      if (!requestPermission()) {
        onCancelFunc();
      };
    }
  });

  return <View style={Styles.container}>
    {step == HomeSteps.Home && 
    <View>
      <View style={styles.homeTextContainer}>
        <Text style={styles.homeHeading}>My Operators</Text>
        <TouchableOpacity style={styles.subMenu} onPress={openSubMenu}><Icon name="dots-horizontal" size={24} color="white" /></TouchableOpacity>
      </View>
      <SubMenuModal isVisible={isMenuVisible} onFactoryReset={onFactoryResetFunc} onLogout={onCancelFunc} onChangeFunc={() => {setMenuVisible(false)}}/>
      <View style={styles.homeScreenBtns}>
        <View style={{width: '50%'}}>
          <IconButton label="Receive" disabled={false} rotate="90deg" backgroundColor="#320430" labelColor="#F29AE9" icon="page-last" onChangeFunc={() => setReceiveVisible(true)} />
        </View>
        <View style={{width: '50%'}}>
          <IconButton label="Scan" disabled={false} rotate="0deg" backgroundColor="#321504" labelColor="#FE740C" icon="line-scan" onChangeFunc={() => setStep(HomeSteps.ScanCode)}/> 
        </View>
        </View>
      <ReceiveModal address={walletAddress()} isVisible={receiveVisible} onChangeFunc={() => {setReceiveVisible(false)} } />
    </View>
    }
    {step == HomeSteps.ScanCode && 
    <View style={Styles.container}>
      <Camera style={StyleSheet.absoluteFill} device={cameraDevice!} isActive={true} codeScanner={codeScanner}/>
    </View>
    }
    {step == HomeSteps.InsertPin && <Dialpad pinRetryCounter={pinRetryCounter} prompt={"Enter PIN"} onCancelFunc={() => setStep(HomeSteps.Home)} onNextFunc={submitPin}></Dialpad>}
  </View>    
};

const styles = StyleSheet.create({
  homeTextContainer: {
    paddingVertical: 40,
    flexDirection: 'row',
    width: '95%',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  homeHeading: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'Inter',
    color: 'white',
    lineHeight: 36,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto'
  },
  subMenu: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 24,
    justifyContent: 'center'
  },
  prompt: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Inter',
    color: 'white',
    marginTop: '5%'
  },
  homeScreenBtns: {
    flexDirection: 'row',
    width: '95%',
    marginHorizontal: '2.5%'
  },
});

export default HomeScreen;