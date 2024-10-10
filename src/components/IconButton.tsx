import {FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type IconButtonProps = {
  label: string;
  disabled: boolean;
  rotate: string;
  backgroundColor: string;
  labelColor: string;
  icon: string;
  onChangeFunc: () => void;
};

const  IconButton: FC<IconButtonProps> = props => {
  const {label, disabled, rotate, backgroundColor, labelColor, icon, onChangeFunc} = props;

  return (
    <View style={[styles.btnContainer, disabled ? styles.disabledBtn : null]}>
      <TouchableOpacity onPress={onChangeFunc} style={[styles.button, {backgroundColor: backgroundColor}]}>
          <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name={icon} size={16} color={labelColor} style={{transform: [{ rotate: rotate}], textAlign: 'center', lineHeight: 20}}/>
            <Text style={[styles.labelText, {color: labelColor}]}>{label}</Text>
          </View>  
        </TouchableOpacity>
    </View>
  )};

const styles = StyleSheet.create({
    btnContainer: {
      flexDirection: 'row',
      textAlign: 'center',
      justifyContent: 'center',
      width: "100%",
      height: 62
    },
    button: {
      justifyContent: 'center',
      width: "100%"
    },
    disabledBtn: {
      opacity: 0.5,
    },
    labelText: {
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      paddingLeft: 10
    },
  });

export default IconButton;