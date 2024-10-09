import {FC, useState } from "react";
import { KeyboardAvoidingView, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import Button from "../Button";
import Dialpad from "../Dialpad";
import Styles from "../../Styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

enum LoadMnemonicSteps {
  Home,
  CreateMnemonic,
  InsertMnemonic,
  InsertPin
}

type MnemonicScreenProps = {
  pinRequired: boolean;
  pinRetryCounter: number;
  onPressFunc: (mn: string, pin?: string) => void;
  onCancelFunc: () => void;
};

const  MnemonicScreen: FC<MnemonicScreenProps> = props => {
  const {pinRequired, pinRetryCounter, onPressFunc, onCancelFunc} = props;
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [step, setStep] = useState(LoadMnemonicSteps.Home);

  const cleanMnemonic = (str: string) => {
    return str.split(' ').filter((el: string) => el != "").map((word: string) => word.trim().toLowerCase()).join(' ');
  }

  const updateMnemonic = (str: string) => {
    setMnemonic(str);
    const mn = cleanMnemonic(str);

    if (bip39.validateMnemonic(mn, wordlist)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }

  const submitMnemonic = () => {
    if(pinRequired) {
      setStep(LoadMnemonicSteps.InsertPin);
    } else {
      onPressFunc(cleanMnemonic(mnemonic));
    }    
  }

  const submitPin = (p: string) => {
    onPressFunc(cleanMnemonic(mnemonic), p);
    return true;
  }

  const generateMnemonic = () => {
    setIsValid(true);
    setMnemonic(bip39.generateMnemonic(wordlist));
    setStep(LoadMnemonicSteps.CreateMnemonic);
  }

  const goBack = () => {
    setIsValid(false);
    setMnemonic("");
    setStep(LoadMnemonicSteps.Home);  
  }

  const toggleVisibility = () => {
    setShowMnemonic(!showMnemonic);
  }

  return (
    <View style={Styles.container}>
      { step == LoadMnemonicSteps.Home &&
      <View style={Styles.container}>
        <View style={styles.mnemonicTextContainer}>
          <Text style={Styles.headingLarge}>Logos Wallet</Text>
          <Text style={Styles.subtitle}>Use your wallet to store your Logos Operator</Text>
        </View>
        <View style={Styles.footer}>
          <Button label="Import using seed phrase" disabled={false} onChangeFunc={() => setStep(LoadMnemonicSteps.InsertMnemonic)} type="secondary"></Button>
          <View style={{height: 18}}></View>
          <Button label="Create a new wallet" disabled={false} onChangeFunc={generateMnemonic}></Button>
        </View>
      </View>
      }
      { step == LoadMnemonicSteps.InsertMnemonic &&
      <View style={Styles.container}>
        <View style={{paddingTop: 30}}>
          <Text style={Styles.heading}> Import from Seed</Text>
          <View style={styles.mnemonicInputContainer}>
            <Text style={styles.mnemonicInputPlaceholder}>Seed phrase</Text>
            <TouchableOpacity style={styles.mnemonicVisibilityIcon} onPress={toggleVisibility}><Icon name={showMnemonic ? "eye-off-outline" : "eye-outline"} size={16} color="white" /></TouchableOpacity>
            <TextInput autoCapitalize="none" autoComplete="off" autoCorrect={false} secureTextEntry={!showMnemonic} multiline={showMnemonic} editable onChangeText={updateMnemonic} value={mnemonic} style={styles.mnemonic}/>
          </View>
        </View>
        <KeyboardAvoidingView keyboardVerticalOffset={20} behavior="padding" style={Styles.footer}>
          <View style={[Styles.sublinkContainer, {paddingBottom: 25}]}>
            <Text style={Styles.sublinkText}>By proceeding, you agree to these </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://logos.co')}>
              <Text style={Styles.sublinkAction}>Terms and Conditions</Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.navContainer}>
            <Button type="cancel" disabled={false} onChangeFunc={goBack}></Button>
            <Button label="Import" disabled={!isValid} onChangeFunc={submitMnemonic}></Button>
          </View>
        </KeyboardAvoidingView>
      </View>
      }
      { step == LoadMnemonicSteps.CreateMnemonic &&
      <View style={Styles.container}>
        <Text> {mnemonic}</Text>
        <Button type="cancel" disabled={false} onChangeFunc={goBack}></Button>
        <Button label="Next" disabled={false} onChangeFunc={submitMnemonic}></Button>
      </View>
      }
      { step == LoadMnemonicSteps.InsertPin && <Dialpad pinRetryCounter={pinRetryCounter} prompt={"Enter PIN"} onCancelFunc={() => setStep(LoadMnemonicSteps.InsertMnemonic)} onNextFunc={submitPin}></Dialpad>}
    </View>
  )};

const styles = StyleSheet.create({
  mnemonicTextContainer: {
    justifyContent: 'center',
    height: '70%',
    width: '100%',
  },
  mnemonicInputContainer: {
    width: '90%',
    marginHorizontal: '5%',
    marginVertical: 20
  },
  mnemonicInputPlaceholder: {
    color: 'grey',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    width: '100%',
  },
  mnemonic: {
    color: "white",
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: 'white',
    width: '100%',
    marginVertical: 15,
    paddingVertical: 12,
    paddingLeft: 10,
    paddingRight: 38
  },
  btnContainer: {
    flexDirection: 'row',
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    alignItems: 'center'
  },
  mnemonicVisibilityIcon: {
    position: 'absolute',
    right: 0,
    top: '42%',
    zIndex: 1,
    padding: 10
  }
});

export default MnemonicScreen;