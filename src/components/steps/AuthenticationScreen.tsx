import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type AuthenticationScreenProps = {
  onPressFunc: () => void;
};

const  AuthenticationScreen: FC<AuthenticationScreenProps> = props => {
  const {onPressFunc} = props;

  return (
    <View>
      <View>
        <Text style={styles.heading}> Success</Text>
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