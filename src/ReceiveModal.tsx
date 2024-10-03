import React, {FC} from "react";
import {StyleSheet, View } from "react-native";
import Modal from "react-native-modal/dist/modal";
import Button from "./components/Button";
import QRCode from "react-qr-code";

type ReceiveModalProps = {
  address: string;
  isVisible: boolean;
  onChangeFunc: () => void;
};

const ReceiveModal: FC<ReceiveModalProps> = props => {
  const {address, isVisible, onChangeFunc} = props;

  return (
    <Modal isVisible={isVisible} style={modalStyle.modalContainer}>
        <View style={modalStyle.container}>
          <QRCode value={address} />
        <Button label="Cancel" disabled={false} btnColor="black" btnBorderColor="white" btnFontSize={13} btnBorderWidth={1} btnWidth="100%" onChangeFunc={() => onChangeFunc()} btnJustifyContent='center'></Button>
        </View>
    </Modal>
  )};

const modalStyle = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: 350,
    padding: 40,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white'
  },
  header: {
    paddingTop: '7%',
    fontSize: 22,
    fontFamily: 'Inconsolata Regular'
  },
  prompt: {
    paddingTop: '10%',
    fontSize: 16,
    fontFamily: 'Inconsolata Regular'
  },
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#0e4e0b',
    borderWidth: 3,
    borderRadius: 80,
    marginTop: '7%',
  },
  icon: {
    color: '#0e4e0b'
  }
});

export default ReceiveModal;