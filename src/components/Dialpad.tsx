import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";
import React, {FC,  useState } from "react";
import DialpadKeypad from "./DialpadKeypad";
import Button from "./Button";
import DialpadPin from "./DialpadPin";
import Styles from "../Styles";

 const { width } = Dimensions.get("window");

 type DialpadProps = {
  pinRetryCounter: number;
  prompt: string;
  onCancelFunc: () => void;
  onNextFunc: (p?: any) => boolean;
};

const Dialpad: FC<DialpadProps> = props => {
  const {pinRetryCounter, prompt, onNextFunc, onCancelFunc} = props;
  const dialPadContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "X"];
  const dialPadSize = width * 0.2;
  const dialPadTextSize = dialPadSize * 0.36;
  const [code, setCode] = useState([]);
  const [wrongRepeat, setWrongRepeat] = useState(false);
  const pinLength = 6;
  const pinSize = 14;

  const updateCode = (item: never) => {
    if (item === "X") {
      setCode((prev) => prev.slice(0, -1));
    } else {
      if (code.length === pinLength) {
        return;
      }
      setCode((prev) => [...prev, item]);
    }
  }

  const onNext = () =>  {
    setWrongRepeat(!onNextFunc(code.join('')));
    setCode([]);
  }

  return (
    <SafeAreaView style={Styles.container}>
     <View style={styles.textContainer}>
       <Text style={Styles.heading}>{prompt}</Text>
       {pinRetryCounter >= 0 && <Text style={styles.pinAttempts}>Remaining attempts: {pinRetryCounter}</Text>}
       {wrongRepeat && <Text style={styles.pinAttempts}>The PINs do not match</Text>}
       <DialpadPin pinLength={pinLength} pinSize={pinSize} code={code} dialPadContent={dialPadContent} />
       <DialpadKeypad dialPadContent={dialPadContent} dialPadSize={dialPadSize} dialPadTextSize={dialPadTextSize} updateCodeFunc={updateCode}/>
     </View>
     <View style={Styles.footer}>
      <View style={Styles.navContainer}>
        <Button disabled={false} onChangeFunc={onCancelFunc} type="cancel"></Button>
        <Button label="Continue" disabled={false} onChangeFunc={onNext}></Button>
      </View>
     </View>
   </SafeAreaView>
  )};

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    position: "relative",
  },
  pinAttempts: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: "white",
    marginTop: 10
  }
});

export default Dialpad;