import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from "../../Styles";

type InfoScreenProps = {
  icon: string;
  title: string;
  message: string;
  onPressFunc: () => void;
};

const InfoScreen: FC<InfoScreenProps> = props => {
  const {icon, title, message, onPressFunc} = props;

  return (
    <View style={Styles.container}>
      <View style={styles.messageContainer}>
        <View style={{flexDirection: "row", justifyContent: 'center', marginBottom: 15}}>
          <View style={styles.iconBackground}></View>
          <Icon name={icon} color="#320430" size={62} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={Styles.heading}>{title}</Text>
          <Text style={[Styles.sublinkText, {textAlign: 'center', marginVertical: 15}]}>{message}</Text>
        </View>
      </View>
      <View style={Styles.footer}>
        <Button label="Continue" disabled={false} onChangeFunc={onPressFunc}></Button>
      </View>
        
    </View>
  )};

const styles = StyleSheet.create({
  messageContainer: {
    marginTop: '60%'
  },
  infoTextContainer: {
    width: '70%',
    marginHorizontal: '15%',
    alignContent: 'center'
  },
  iconBackground: {
    backgroundColor: "#F29AE9", 
    position: "absolute", 
    width: 50, 
    height: 50, 
    borderRadius: 100, 
    top: 6
  }
});

export default InfoScreen;