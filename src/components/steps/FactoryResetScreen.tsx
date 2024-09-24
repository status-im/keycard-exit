import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

type FactoryResetScreenProps = {
  pinRetryCounter: number;
  onPressFunc: () => void;
  onCancelFunc: () => void;
};

const  FactoryResetScreen: FC<FactoryResetScreenProps> = props => {
  const {pinRetryCounter, onPressFunc, onCancelFunc} = props;

  return (
    <View>
      <View>
        <Text style={styles.heading}>Factory reset</Text>
        <Text style={styles.prompt}>This will remove the keys from your card. Are you sure?</Text>
        <Button label="Next" disabled={false} btnColor="#199515" btnBorderColor="#199515" btnFontSize={17} btnBorderWidth={1} btnWidth="100%" onChangeFunc={onPressFunc} btnJustifyContent='center'></Button>
        <Button label="Cancel" disabled={false} btnColor="#199515" btnBorderColor="#199515" btnFontSize={17} btnBorderWidth={1} btnWidth="100%" onChangeFunc={onCancelFunc} btnJustifyContent='center'></Button>
        </View>
    </View>
  )};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Inconsolata Medium',
    color: '#199515',
    marginTop: '50%'
  },
  prompt: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Inconsolata Regular',
    color: 'white',
    marginTop: '5%'
  }
});

export default FactoryResetScreen;