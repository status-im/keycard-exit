import {FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../Button";
import { MNEMONIC } from "../../MnemonicList";

enum LoadMnemonicSteps {
  InsertMnemonic,
  InsertPin
}

type MnemonicScreenProps = {
  pinRequired: boolean;
  onPressFunc: (mn: string, pin?: string) => void;
  onCancelFunc: () => void;
};

const  MnemonicScreen: FC<MnemonicScreenProps> = props => {
  const {pinRequired, onPressFunc, onCancelFunc} = props;
  const [mnemonic, setMnemonic] = useState('');
  const [pin, setPin] = useState('');
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

  return (
    <View>
      { step == LoadMnemonicSteps.InsertMnemonic &&
      <View>
        <Text style={styles.heading}> Load mnemonic</Text>
        <TextInput editable multiline numberOfLines={6} onChangeText={(val) => setMnemonic(val)} value={mnemonic} style={{backgroundColor: '#4A646C'}} />
        <Button label="Next" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => updateMnemonic(mnemonic)} btnJustifyContent='center'></Button>
        <Button label="Cancel" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={onCancelFunc} btnJustifyContent='center'></Button>
        <Text>{errMessage}</Text>
        </View>
      }
      { step == LoadMnemonicSteps.InsertPin &&
      <View>
        <Text style={styles.heading}> Insert pin</Text>
        <TextInput onChangeText={setPin} value={pin} keyboardType="number-pad" maxLength={6}/>
        <Button label="Next" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => {onPressFunc(mnemonic, pin)}} btnJustifyContent='center'></Button>
        <Button label="Back" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => setStep(LoadMnemonicSteps.InsertMnemonic)} btnJustifyContent='center'></Button>
      </View>
      }
    </View>
  )};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 16
  }
});

export default MnemonicScreen;