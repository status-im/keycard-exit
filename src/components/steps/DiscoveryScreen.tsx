import {FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

type DiscoveryScreenProps = {
  onPressFunc: () => void;
};

const  DiscoveryScreen: FC<DiscoveryScreenProps> = props => {
  const {onPressFunc} = props;

  return (
    <View>
      <View>
        <Text style={styles.heading}> We are recruiting Operators to be the founders of a new, self-sovereign world in cyberspace</Text>
        <Button label="Discover" disabled={false} btnColor="#4A646C" btnWidth="100%" onChangeFunc={onPressFunc} btnJustifyContent='center'></Button>
      </View>
      <View>
    </View>
    </View>
  )};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 16
  }
});

export default DiscoveryScreen;