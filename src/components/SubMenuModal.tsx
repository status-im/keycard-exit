import React, {FC} from "react";
import {StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal/dist/modal";
import Styles from "../Styles";
import Button from "./Button";

type SubMenuProps = {
  isVisible: boolean;
  onLogout: () => void;
  onFactoryReset: () => void;
  onChangeFunc: () => void;
};

const SubMenuModal: FC<SubMenuProps> = props => {
  const {isVisible, onLogout, onFactoryReset, onChangeFunc} = props;

  return (
    <Modal isVisible={isVisible} backdropOpacity={0} onBackdropPress={onChangeFunc} style={styles.container} animationIn={"bounceIn"} animationOut={"bounceOut"}>
        <View style={styles.submenuContent}>
            <TouchableOpacity onPress={onFactoryReset} style={styles.itemContainer}>
                <Text style={styles.menuText}>Factory Reset</Text>
            </TouchableOpacity>
            <View style={{borderBottomColor: 'white', borderBottomWidth: StyleSheet.hairlineWidth}}
/>
            <TouchableOpacity onPress={onLogout} style={styles.itemContainer}>
                <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
        </View>
    </Modal>
  )};

  const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        top: '15%',
        right: '2.5%',
        margin: 0,
        position: 'absolute',
        backgroundColor: '#333333',
        borderRadius: 5,
      },
    submenuContent: {

    },
    itemContainer: {
        paddingVertical: 20,
        paddingLeft: 20,
        paddingRight: 80
    },
    menuText: {
        color: 'white',
        fontFamily: 'Inter',
        fontSize: 14
    }
  });

export default SubMenuModal;