import React, {FC} from "react";
import {StyleSheet, View } from "react-native";
import Modal from "react-native-modal/dist/modal";
import QRCode from "react-qr-code";
import Styles from "./Styles";
import IconButton from "./components/IconButton";

type ReceiveModalProps = {
  address: string;
  isVisible: boolean;
  onChangeFunc: () => void;
  onCancelFunc: () => void;
};

const ReceiveModal: FC<ReceiveModalProps> = props => {
  const {address, isVisible, onChangeFunc, onCancelFunc} = props;

  const addressLabel = () => {
    return address.substring(0, 5) + "\u2026" + address.substring(address.length - 5);
  }

  return (
    <Modal isVisible={isVisible} style={modalStyle.modalContainer} onBackdropPress={onCancelFunc}>
        <View style={modalStyle.container}>
          <View>
           <QRCode value={address} size={220} bgColor="#320430" fgColor="#F29AE9" />
          </View>
          <View style={Styles.footer}>
            <IconButton label={addressLabel()} disabled={false} onChangeFunc={onChangeFunc} rotate="0deg" backgroundColor="white" labelColor="black" icon="content-copy"/>
          </View>
        </View>
    </Modal>
  )};

const modalStyle = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: 420,
    padding: 40,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#320430'
  },
  header: {
    paddingTop: '7%',
    fontSize: 22,
    fontFamily: 'Inter'
  },
  prompt: {
    paddingTop: '10%',
    fontSize: 16,
    fontFamily: 'Inter'
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