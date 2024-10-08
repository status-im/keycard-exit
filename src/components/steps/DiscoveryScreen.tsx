import {FC } from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import Button from "../Button";
import Styles from "../../Styles";

type DiscoveryScreenProps = {
  onPressFunc: () => void;
};

const  DiscoveryScreen: FC<DiscoveryScreenProps> = props => {
  const {onPressFunc} = props;

  return (
    <View style={Styles.container}>
      <View style={Styles.textContainer}>
        <Text style={Styles.heading}>Welcome, Operator!</Text>
        <Text style={Styles.subtitle}>Let's start by connecting your Multipass</Text>
      </View>
      <Image style={Styles.multipassImg} source={require('../../images/multipass.png')} />
      <View style={Styles.footer}>
        <Button label="Connect" disabled={false} onChangeFunc={onPressFunc}></Button>
        <View style={Styles.sublinkContainer}>
          <Text style={Styles.sublinkText}>Don’t have Multipass? Find out how to get one </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://keycard.tech')}>
            <Text style={Styles.sublinkAction}>here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )};

export default DiscoveryScreen;