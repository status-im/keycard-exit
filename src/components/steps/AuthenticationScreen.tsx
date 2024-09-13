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
        <Button label="Cancel" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={onCancelFunc} btnJustifyContent='center'></Button>
        </View>
    </View>
  )};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 16
  }
});

export default AuthenticationScreen;