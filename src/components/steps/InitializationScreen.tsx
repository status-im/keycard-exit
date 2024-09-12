import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

type InitializationScreenProps = {
  onPressFunc: (pin: string) => void;
};

const  InitializationScreen: FC<InitializationScreenProps> = props => {
  const {onPressFunc} = props;

  return (
    <View>
      <View>
        <Text style={styles.heading}> Hello world</Text>
        <Button label="Next" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={() => {onPressFunc("000000")}} btnJustifyContent='center'></Button>
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