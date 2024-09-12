import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

type LoadingScreenProps = {
  onPressFunc: () => void;
};

const  LoadingScreen: FC<LoadingScreenProps> = props => {
  const {onPressFunc} = props;

  return (
    <View>
      <View>
        <Text style={styles.heading}> Load mnemonic</Text>
        <Button label="Next" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={onPressFunc} btnJustifyContent='center'></Button>
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

export default LoadingScreen;