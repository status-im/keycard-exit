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

  const isSamePin = (p: string) => {
    return pin === p;
  }

  const submitPin = (p: string) => {
    if(!isSamePin(p)) {
      return false;
    }

    onPressFunc(pin);
    return true;
  }

  return (
    <View>
      { step == PinSteps.InsertPin && <Dialpad prompt={"Choose PIN"} onCancelFunc={onCancelFunc} onNextFunc={insertPin}></Dialpad> }
      { step == PinSteps.RepeatPin && <Dialpad prompt={"Repeat PIN"} onCancelFunc={() => setStep(PinSteps.InsertPin)} onNextFunc={submitPin}></Dialpad> }
    </View>
  )};

const styles = StyleSheet.create({
});

export default InitializationScreen;