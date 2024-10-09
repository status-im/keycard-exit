import {FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ButtonProps = {
  label?: string;
  disabled: boolean;
  type?: string;
  onChangeFunc: () => void;
};

const  Button: FC<ButtonProps> = props => {
  const {label, disabled, type = "primary", onChangeFunc} = props;

  const textContainer = () => {
    if(type == 'cancel') {
      return style.cancelBtnContainer;
    } else if (type == 'secondary') {
      return style.secondaryBtnContainer;
    } else {
      return style.primarytBtnContainer;
    }
  }

  return (
    <View style={[textContainer(), disabled ? style.disabledBtn : null]}>
      <TouchableOpacity key={label} disabled={disabled} style={style.button} onPress={onChangeFunc}>
        {type == "cancel" && <Icon name="chevron-left" size={16} style={style.cancelIcon}/>}
        {type == "primary" && <Text style={style.primaryText}>{label}</Text>}
        {type == "secondary" && <Text style={style.secondaryText}>{label}</Text>}
      </TouchableOpacity>
    </View>
  )};

const style = StyleSheet.create({
    primarytBtnContainer: {
      flexDirection: 'row',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      marginLeft: '5%',
      marginRight: '5%',
      height: 62,
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 'auto'
    },
    cancelBtnContainer: {
      textAlign: 'center',
      justifyContent: 'center',
      paddingTop: 15,
      paddingBottom: 15,
      borderWidth: 1,
      borderColor: 'white',
      width: 62,
      height: 62,
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 62
    },
    secondaryBtnContainer: {
      flexDirection: 'row',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      marginLeft: '5%',
      marginRight: '5%',
      height: 62,
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 'auto',
      borderWidth: 1,
      borderColor: 'white',
    },
    button: {
      justifyContent: 'center'
    },
    disabledBtn: {
      opacity: 0.5,
    },
    primaryText: {
      color: 'black',
      fontFamily: 'Inter',
      fontSize: 14,
    },
    secondaryText: {
      color: 'white',
      fontFamily: 'Inter',
      fontSize: 14
    },
    cancelIcon: {
      color: 'white',
      textAlign: 'center'
    }
  });

export default Button;