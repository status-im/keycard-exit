import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

type SuccessScreenProps = {
  title: string;
  message: string;
  onPressFunc: () => void;
};

const SuccessScreen: FC<SuccessScreenProps> = props => {
  const {title, message, onPressFunc} = props;

  return (
    <View>
      <View>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.prompt}>{message}</Text>
        <Button label="Next" disabled={false} onChangeFunc={onPressFunc}></Button>
        </View>
    </View>
  )};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Inter',
    color: '#199515',
    marginTop: '50%'
  },
  prompt: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Inter',
    color: 'white',
    marginTop: '5%'
  }
});

export default SuccessScreen;