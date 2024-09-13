import {FC } from "react";
import { DimensionValue, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ButtonProps = {
  label: string;
  disabled: boolean;
  btnColor: string;
  btnWidth: string;
  btnFontSize?: number;
  btnBorderColor?: string;
  btnBorderWidth?: number;
  btnJustifyContent: string;
  onChangeFunc: () => void;
};

const  Button: FC<ButtonProps> = props => {
  const {label, disabled, btnColor, btnWidth, btnJustifyContent, btnFontSize, btnBorderWidth, btnBorderColor, onChangeFunc} = props;

  return (
    <View style={[buttonStyle.textBtnContainer, {width: btnWidth as DimensionValue, justifyContent: btnJustifyContent as any}]}>
      <TouchableOpacity key={label} disabled={disabled} style={buttonStyle.button} onPress={onChangeFunc}>
        <Text style={[buttonStyle.title, {color: btnColor, borderBottomColor: btnBorderColor || 'none', borderBottomWidth: btnBorderWidth || 0, fontSize: btnFontSize}]}>{label}</Text>
      </TouchableOpacity>
    </View>
  )};

const buttonStyle = StyleSheet.create({
    textBtnContainer: {
      flexDirection: 'row',
      textAlign: 'center',
      paddingTop: 25,
      paddingBottom: 15,
      justifyContent: 'flex-start',
    },
    button: {
    },
    title: {
      textTransform: 'uppercase',
      fontFamily: 'Inconsolata Medium',
    },
  });

export default Button;