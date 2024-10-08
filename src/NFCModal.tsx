import React, {FC} from "react";
import {Platform, Text, View } from "react-native";
import Modal from "react-native-modal/dist/modal";
import Icon from 'react-native-vector-icons/Feather';
import Button from "./components/Button";
import Styles from "./Styles";

type NFCModalProps = {
  isVisible: boolean;
  onChangeFunc: () => void;
};

const NFCModal: FC<NFCModalProps> = props => {
  const {isVisible, onChangeFunc} = props;

  return (
    <Modal isVisible={(Platform.OS === 'android') && isVisible} style={Styles.modalContainer}>
        <View style={Styles.modalContent}>
          <Text style={Styles.modalHeader}>Ready to Scan</Text>
          <View style={Styles.modalIconContainer}>
          <Icon name="smartphone" size={40} style={Styles.modalIcon}/>
          </View>
          <Text style={Styles.modalPrompt}>Tap your Keycard</Text>
          <Button label="Cancel" disabled={false} onChangeFunc={() => onChangeFunc()}></Button>
        </View>
    </Modal>
  )};

export default NFCModal;