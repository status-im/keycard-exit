import {FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../Button";
import CustomDialpad from "../CustomDialpad";

enum PinSteps {
  NumPad,
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
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [step, setStep] = useState(PinSteps.NumPad);

  const checkPin = (p: string) => {
    pin === p ? setBtnDisabled(false) : setBtnDisabled(true);
  }

  return (
    <View>
      <CustomDialpad onCancelFunc={() => {}} onNextFunc={(code: string | undefined) => {console.log(code)}}></CustomDialpad>
      { step == PinSteps.InsertPin &&
      <View>
      <Text style={styles.heading}> Insert pin</Text>
      <TextInput onChangeText={onChangePin} value={pin} keyboardType="number-pad" maxLength={6}/>
      <Button label="Next" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => setStep(PinSteps.RepeatPin)} btnJustifyContent='center'></Button>
      <Button label="Cancel" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={onCancelFunc} btnJustifyContent='center'></Button>
      </View>
      }

      { step == PinSteps.RepeatPin &&
      <View>
      <Text style={styles.heading}> Repeat pin</Text>
      <TextInput onChangeText={(val) => {checkPin(val)}} keyboardType="number-pad" maxLength={6}/>
      <Button label="Next" disabled={btnDisabled} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => {onPressFunc(pin)}} btnJustifyContent='center'></Button>
      <Button label="Back" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => setStep(PinSteps.InsertPin)} btnJustifyContent='center'></Button>
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

export default InitializationScreen;