import {FC, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import Button from "../Button";
import Dialpad from "../Dialpad";
import Styles from "../../Styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

enum LoadMnemonicSteps {
  Home,
  CreateMnemonic,
  ConfirmMnemonic,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const shuffledWords = useRef([] as string[]);
  const verifyIndexes = useRef([] as number[]);

  const cleanMnemonic = (str: string) => {
    return str.replaceAll("\n", " ").split(' ').filter((el: string) => el != "").map((word: string) => word.trim().toLowerCase()).join(' ');
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
    const mn = bip39.generateMnemonic(wordlist, 128);
    shuffledWords.current = mn.split(' ');
    setMnemonic(mn);
    setStep(LoadMnemonicSteps.CreateMnemonic);
  }

  const goBack = () => {
    setIsValid(false);
    setMnemonic("");
    setStep(LoadMnemonicSteps.Home);  
  }

  const confirmMnemonic = () => {
    shuffle(shuffledWords.current);
    verifyIndexes.current = [...Array(12).keys()];
    setCurrentIndex(0);
    shuffle(verifyIndexes.current);
    setStep(LoadMnemonicSteps.ConfirmMnemonic);  
  }

  const resetConfirm = () => {
    shuffledWords.current = mnemonic.split(' ');
    setStep(LoadMnemonicSteps.CreateMnemonic);  
  }

  const toggleVisibility = () => {
    setShowMnemonic(!showMnemonic);
  }

  const shuffle = (array: any[]) => {
    var currentIndex = array.length;
  
    while (currentIndex != 0) {
      var randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }

  const wordAt = (idx: number) => {
    return mnemonic.split(' ')[idx];
  }

  const verifyWord = (selected: number) => {
    if (shuffledWords[selected] == wordAt(currentIndex)) {
      if (currentIndex == 2) {
        submitMnemonic();
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      resetConfirm();
    }
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
        <View style={{paddingTop: 45}}>
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
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 55}}>
          <View style={styles.currentStep}></View>
          <View style={styles.nextStep}></View>
        </View>
        <Text style={[Styles.heading, {paddingTop: 25, paddingBottom: 30, width: '65%', marginHorizontal: '17.5%'}]}>Write Down Your Seed Phrase</Text>
        <Text style={styles.createMnemonicText}>This is your seed phrase. Write it down on a paper and keep it in a safe place. You'll be asked to re-enter this phrase (in order) on the next step.</Text>
        <FlatList 
        data={shuffledWords.current} 
        numColumns={3} 
        style={styles.mnemonicList} 
        renderItem={({ item, index }) => 
          <View style={styles.mnemonicWordContainer}>
            <Text style={styles.mnemonicIndex}>{index + 1}</Text>
            <Text style={styles.mnemonicWord}> {item}</Text>
          </View>
      }
        />
        <View style={Styles.footer}>
          <View style={Styles.navContainer}>
            <Button type="cancel" disabled={false} onChangeFunc={goBack}></Button>
            <Button label="Continue" disabled={false} onChangeFunc={confirmMnemonic}></Button>
          </View>
        </View>
      </View>
      }
      { step == LoadMnemonicSteps.ConfirmMnemonic &&
      <View style={Styles.container}>
        <Text> {mnemonic}</Text>
        <View style={Styles.footer}>
          <View style={Styles.navContainer}>
            <Button type="cancel" disabled={false} onChangeFunc={resetConfirm}></Button>
            <Button label="Next" disabled={false} onChangeFunc={submitMnemonic}></Button>
          </View>
        </View>
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
  },
  createMnemonicText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Inter",
    color: "white",
    width: "80%",
    marginHorizontal: '10%',
    textAlign: 'center'
  },
  mnemonicList: {
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: 55
  },
  mnemonicWordContainer: {
    width: '30%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    margin: '1.65%'
  },
  mnemonicIndex: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 16,
    color: 'white',
    paddingBottom: 6
  },
  mnemonicWord: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    color: 'white'
  },
  currentStep: {
    width: 50,
    backgroundColor: 'white',
    height: 5,
    borderRadius: 5,
    marginHorizontal: 2
  },
  nextStep: {
    width: 50,
    backgroundColor: 'grey',
    height: 5,
    borderRadius: 5,
    marginHorizontal: 2
  }
});

export default MnemonicScreen;