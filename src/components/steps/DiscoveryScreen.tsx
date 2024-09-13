import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

type DiscoveryScreenProps = {
  onPressFunc: () => void;
};

const  DiscoveryScreen: FC<DiscoveryScreenProps> = props => {
  const {onPressFunc} = props;

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}> We are recruiting Operators to be the founders of a new, self-sovereign world in cyberspace</Text>
      </View>
      <View style={styles.btnContainer}>
      <Button label="Connect" disabled={false} btnColor="#199515" btnBorderColor="#199515" btnFontSize={17} btnBorderWidth={1} btnWidth="100%" onChangeFunc={onPressFunc} btnJustifyContent='center'></Button>
      </View>
      <View>
    </View>
    </View>
  )};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  headingContainer: {
    width: '100%',
    paddingLeft: '5.5%',
    paddingRight: '5.5%',
    paddingTop: '50%',
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Inconsolata Regular'
  },
  btnContainer: {
    paddingTop: '7%'
  }
});

export default DiscoveryScreen;