import {FC } from "react";
import { DimensionValue, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ButtonProps = {
  label: string;
  disabled: boolean;
  onChangeFunc: () => void;
};

const  Button: FC<ButtonProps> = props => {
  const {label, disabled, onChangeFunc} = props;

  return (
    <View style={buttonStyle.textBtnContainer}>
      <TouchableOpacity key={label} disabled={disabled} style={buttonStyle.button} onPress={onChangeFunc}>
        <Text style={buttonStyle.title}>{label}</Text>
      </TouchableOpacity>
    </View>
  )};

const buttonStyle = StyleSheet.create({
    textBtnContainer: {
      flexDirection: 'row',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      width: '90%',
      marginLeft: '5%',
      marginRight: '5%',
      paddingTop: 15,
      paddingBottom: 15
    },
    button: {
    },
    title: {
      color: "black",
      fontFamily: 'Inter',
      fontSize: 14
    },
  });

export default Button;