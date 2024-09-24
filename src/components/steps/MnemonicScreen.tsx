import {FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../Button";
import { MNEMONIC } from "../../MnemonicList";
import Dialpad from "../Dialpad";

enum LoadMnemonicSteps {
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
  const [errMessage, setErrMessage] = useState('');
  const [step, setStep] = useState(LoadMnemonicSteps.InsertMnemonic);

  const updateMnemonic = (str: string) => {
    const mn = str.split(' ').filter((el: string) => el != "").map((word: string) => word.trim().toLowerCase());

    if (!mn.every((val: string | any) => MNEMONIC.includes(val))) {
      setErrMessage("Wrong mnemonic. Please try again.");
      return;
    }

    if(mn.length != 12 && mn.length != 18 && mn.length != 24) {
      setErrMessage("Wrong mnemonic length. Please try again.");
      return;
    }

    setErrMessage("");

    if(pinRequired) {
      setStep(LoadMnemonicSteps.InsertPin);
    } else {
      onPressFunc(mn.join(' '));
    }
  }

  const submitPin = (p: string) => {
    onPressFunc(mnemonic, p);
    return true;
  }

  return (
    <View>
      { step == LoadMnemonicSteps.InsertMnemonic &&
      <View style={styles.container}>
        <Text style={styles.heading}> Load mnemonic</Text>
        <View style={styles.mnemonicContainer}>
          <TextInput editable multiline onChangeText={(val) => setMnemonic(val)} value={mnemonic} style={styles.mnemonic} placeholder="Type your passphrase"/>
        </View>
        <View style={styles.btnContainer}>
          <Button label="Cancel" disabled={false} btnColor="white" btnBorderColor="white" btnBorderWidth={1} btnWidth="50%" onChangeFunc={onCancelFunc} btnJustifyContent='flex-start'></Button>
          <Button label="Next" disabled={false} btnColor="white" btnBorderColor="white" btnBorderWidth={1} btnWidth="50%" onChangeFunc={() => updateMnemonic(mnemonic)} btnJustifyContent='flex-end'></Button>
        </View>
        <Text style={styles.errorMessage}>{errMessage}</Text>
        </View>
      }
      { step == LoadMnemonicSteps.InsertPin && <Dialpad pinRetryCounter={pinRetryCounter} prompt={"Enter PIN"} onCancelFunc={() => setStep(LoadMnemonicSteps.InsertMnemonic)} onNextFunc={submitPin}></Dialpad>}
    </View>
  )};

const styles = StyleSheet.create({
  container: {
    width: '89%',
    marginLeft: '5.5%',
    marginRight: '5.5%'
  },
  heading: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 28,
    fontFamily: 'Inconsolata Medium',
    color: "white",
    paddingBottom: 20
  },
  mnemonicContainer: {
    width: '100%',
    height: 300,
    borderColor: '#199515',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed'
  },
  mnemonic: {
    color: "white",
    textAlignVertical: 'bottom',
    fontFamily: 'Inconsolata Regular',
    fontSize: 16
  },
  btnContainer: {
    flexDirection: 'row',
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    alignItems: 'center'
  },
  errorMessage: {
    color: "white",
    fontFamily: 'Inconsolata Regular',
    textAlign: 'center',
    paddingTop: '10%'
  }
});

export default MnemonicScreen;