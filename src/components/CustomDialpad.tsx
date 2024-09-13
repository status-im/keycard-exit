import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";
import React, {FC,  useState } from "react";
import DialpadKeypad from "./DialpadKeypad";
import Button from "./Button";

 const { width, height } = Dimensions.get("window");

 type CustomDialpadProps = {
  onCancelFunc: () => void;
  onNextFunc: (p?: string) => void;
};

const CustomDialpad: FC<CustomDialpadProps> = props => {
  const {onNextFunc, onCancelFunc} = props;
  const dialPadContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "X"];
  const dialPadSize = width * 0.2;
  const dialPadTextSize = dialPadSize * 0.36;
  const [code, setCode] = useState([]);

  const pinLength = 6;

  const updateCode = (item: never) => {
    if (item === "X") {
      setCode((prev) => prev.slice(0, -1));
    } else {
      setCode((prev) => [...prev, item]);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.textContainer}>
       <Text style={styles.pinText}>Create PIN</Text>
       <Text style={styles.pinSubText}>Enter your secure six-digit code</Text>
       <DialpadKeypad dialPadContent={dialPadContent} pinLength={pinLength} dialPadSize={dialPadSize} dialPadTextSize={dialPadTextSize} setCode={updateCode} code={code}/>
     </View>
     <View style={styles.btnContainer}>
     <Button label="Cancel" disabled={false} btnColor="#4A646C" btnWidth="50%" onChangeFunc={onCancelFunc} btnJustifyContent='center'></Button>
     <Button label="Next" disabled={false} btnColor="#4A646C" btnWidth="50%" onChangeFunc={onNextFunc} btnJustifyContent='center'></Button>
     </View>
   </SafeAreaView>
  )};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4A646C55",
    height: '100%'
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    position: "relative",
  },
  pinText: {
    fontSize: 30,
    fontWeight: "medium",
    color: "white",
  },
  pinSubText: {
    fontSize: 18,
    fontWeight: "medium",
    color: "white",
    marginVertical: 30,
  },
  btnContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  }
  });

export default CustomDialpad;