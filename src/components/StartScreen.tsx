import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import NFCModal from "../NFCModal";
import Button from "./Button";

type StartScreenProps = {
  onExitBtnFunc: () => void;
  isModalVisible: boolean;
  modalVisibilityFunc: (val: boolean) => void;
};

const  StartScreen: FC<StartScreenProps> = props => {
  const {onExitBtnFunc, isModalVisible, modalVisibilityFunc} = props;

  return (
    <View>
      <View>
        <Text style={styles.heading}> We are recruiting Operators to be the founders of a new, self-sovereign world in cyberspace</Text>
        <Button label="Exit" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={onExitBtnFunc} btnJustifyContent='center'></Button>
      </View>
      <View>
      <NFCModal isVisible={isModalVisible} onChangeFunc={modalVisibilityFunc}></NFCModal>
    </View>
    </View>
  )};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 16
  }
});

export default StartScreen;