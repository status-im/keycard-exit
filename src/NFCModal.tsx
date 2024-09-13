import React, {FC, useEffect, useState } from "react";
import {Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import Modal from "react-native-modal/dist/modal";
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from "react-native/Libraries/NewAppScreen";
import Button from "./components/Button";

type NFCModalProps = {
  isVisible: boolean;
  onChangeFunc: (val: boolean) => void;
};

const NFCModal: FC<NFCModalProps> = props => {
  const {isVisible, onChangeFunc} = props;
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Modal isVisible={(Platform.OS === 'android') && isVisible} style={modalStyle.modalContainer}>
        <View style={[modalStyle.container, {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}]}>
          <Text style={modalStyle.header}>Ready to Scan</Text>
          <View style={modalStyle.iconContainer}>
          <Icon name="smartphone" size={40} style={modalStyle.icon}/>
          </View>
          <Text style={modalStyle.prompt}>Tap your Keycard</Text>
          <Button label="Cancel" disabled={false} btnColor="white" btnBorderColor="white" btnFontSize={13} btnBorderWidth={1} btnWidth="100%" onChangeFunc={() => onChangeFunc(!isVisible)} btnJustifyContent='center'></Button>
        </View>
    </Modal>
  )};

const modalStyle = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0
  },
  container: {
    height: 350,
    paddingBottom: 20,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
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

export default NFCModal;