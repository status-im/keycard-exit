import {FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../Button";

enum PinSteps {
  InsertPin,
  RepeatPin
}

type InitializationScreenProps = {
  onPressFunc: (pin: string) => void;
};

const  InitializationScreen: FC<InitializationScreenProps> = props => {
  const {onPressFunc} = props;
  const [pin, onChangePin] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [step, setStep] = useState(PinSteps.InsertPin);

  const checkPin = (p: string) => {
    pin === p ? setBtnDisabled(false) : setBtnDisabled(true);
  }

  return (
    <View>
      { step == PinSteps.InsertPin &&
      <View>
      <Text style={styles.heading}> Insert pin</Text>
      <TextInput onChangeText={onChangePin} value={pin} keyboardType="number-pad" maxLength={6}/>
      <Button label="Next" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => setStep(PinSteps.RepeatPin)} btnJustifyContent='center'></Button>
      </View>
      }

      { step == PinSteps.RepeatPin &&
      <View>
      <Text style={styles.heading}> Repeat pin</Text>
      <TextInput onChangeText={(val) => {checkPin(val)}} keyboardType="number-pad" maxLength={6}/>
      <Button label="Next" disabled={btnDisabled} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => {onPressFunc(pin)}} btnJustifyContent='center'></Button>
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