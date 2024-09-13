import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";
import React, {FC,  useState } from "react";
import DialpadKeypad from "./DialpadKeypad";
import Button from "./Button";
import DialpadPin from "./DialpadPin";

 const { width } = Dimensions.get("window");

 type DialpadProps = {
  prompt: string;
  onCancelFunc: () => void;
  onNextFunc: (p?: any) => boolean;
};

const Dialpad: FC<DialpadProps> = props => {
  const {prompt, onNextFunc, onCancelFunc} = props;
  const dialPadContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "X"];
  const dialPadSize = width * 0.2;
  const dialPadTextSize = dialPadSize * 0.36;
  const [code, setCode] = useState([]);
  const pinLength = 6;
  const pinContainerSize = width / 2;
  const pinSize = (pinContainerSize / pinLength) + 8;

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
    if (!onNextFunc(code.join(''))) {
      setCode([]);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.textContainer}>
       <Text style={styles.pinText}>{prompt}</Text>
       <Text style={styles.pinSubText}>Enter your secure six-digit code</Text>
       <DialpadPin pinLength={pinLength} pinSize={pinSize} code={code} dialPadContent={dialPadContent} />
       <DialpadKeypad dialPadContent={dialPadContent} dialPadSize={dialPadSize} dialPadTextSize={dialPadTextSize} updateCodeFunc={updateCode} code={code}/>
     </View>
     <View style={styles.btnContainer}>
     <Button label="Cancel" disabled={false} btnColor="white" btnBorderColor="white" btnBorderWidth={1} btnWidth="50%" onChangeFunc={onCancelFunc} btnJustifyContent='flex-start'></Button>
     <Button label="Next" disabled={false} btnColor="white" btnBorderColor="white" btnBorderWidth={1} btnWidth="50%" onChangeFunc={onNext} btnJustifyContent='flex-end'></Button>
     </View>
   </SafeAreaView>
  )};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222222",
    height: '100%',
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    position: "relative",
  },
  pinText: {
    fontSize: 28,
    fontFamily: 'Inconsolata Medium',
    color: "white",
  },
  pinSubText: {
    fontSize: 18,
    fontFamily: 'Inconsolata Regular',
    color: "white",
    marginVertical: 30,
  },
  btnContainer: {
    flexDirection: 'row',
    width: '74%',
    marginLeft: '13%',
    marginRight: '13%',
    alignItems: 'center'
  }
  });

export default Dialpad;