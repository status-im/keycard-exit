import React, {FC, useEffect, useState } from "react";
import {StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal/dist/modal";

type NFCModalProps = {
  isVisible: boolean;
  onChangeFunc: (val: boolean) => void;
};

const NFCModal: FC<NFCModalProps> = props => {
  const {isVisible, onChangeFunc} = props;

  return (
    <Modal isVisible={isVisible} onSwipeComplete={() => onChangeFunc(!isVisible)} swipeDirection={['up', 'left', 'right', 'down']} style={modalStyle.modalContainer}>
        <View style={modalStyle.container}>
          <Text style={modalStyle.header}>Ready to Scan</Text>
          <Text style={modalStyle.prompt}>Tap your Keycard</Text>
        </View>
    </Modal>
  )};

const modalStyle = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0
  },
  container: {
    backgroundColor: '#4A646C',
    height: 250,
    paddingBottom: 20,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    paddingTop: '5%',
    fontSize: 24
  },
  prompt: {
    paddingTop: '10%',
    paddingBottom: '10%',
    fontSize: 15
  }
});

export default NFCModal;