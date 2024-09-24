import {FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../Button";
import Dialpad from "../Dialpad";

enum PinSteps {
  InsertPin,
  RepeatPin
}

type InitializationScreenProps = {
  onPressFunc: (pin: string) => void;
  onCancelFunc: () => void;
};

const  InitializationScreen: FC<InitializationScreenProps> = props => {
  const {onPressFunc, onCancelFunc} = props;
  const [pin, onChangePin] = useState('');
  const [step, setStep] = useState(PinSteps.InsertPin);

  const insertPin = (p: string) => {
    onChangePin(p);
    setStep(PinSteps.RepeatPin);
    return true;
  }

  const submitPin = (p: string) => {
    if(pin == p) {
      onPressFunc(pin);
      return true;
    }

    return false;
  }

  return (
    <View>
      { step == PinSteps.InsertPin && <Dialpad pinRetryCounter={-1} prompt={"Choose PIN"} onCancelFunc={onCancelFunc} onNextFunc={insertPin}></Dialpad> }
      { step == PinSteps.RepeatPin && <Dialpad pinRetryCounter={-1} prompt={"Repeat PIN"} onCancelFunc={() => setStep(PinSteps.InsertPin)} onNextFunc={submitPin}></Dialpad> }
    </View>
  )};

const styles = StyleSheet.create({
});

export default InitializationScreen;