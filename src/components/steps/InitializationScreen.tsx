import {FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../Button";

type InitializationScreenProps = {
  onPressFunc: (pin: string) => void;
};

const  InitializationScreen: FC<InitializationScreenProps> = props => {
  const {onPressFunc} = props;
  const [pin, onChangePin] = useState('');

  return (
    <View>
      <View>
        <Text style={styles.heading}> Insert pin</Text>
        <TextInput onChangeText={onChangePin} value={pin} placeholder="******" keyboardType="number-pad" maxLength={6}/>
        <Button label="Next" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => {onPressFunc(pin)}} btnJustifyContent='center'></Button>
      </View>
      <View>
    </View>
    </View>
  )};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 16
  }
});

export default InitializationScreen;