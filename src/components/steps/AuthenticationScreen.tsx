import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

type AuthenticationScreenProps = {
  onPressFunc: () => void;
  onCancelFunc: () => void;
};

const  AuthenticationScreen: FC<AuthenticationScreenProps> = props => {
  const {onPressFunc, onCancelFunc} = props;

  return (
    <View>
      <View>
        <Text style={styles.heading}> Success</Text>
        <Text style={styles.prompt}>Work in progress...</Text>
        <Button label="Home" disabled={false} btnColor="#199515" btnBorderColor="#199515" btnFontSize={17} btnBorderWidth={1} btnWidth="100%" onChangeFunc={onCancelFunc} btnJustifyContent='center'></Button>
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

export default AuthenticationScreen;