import {FC } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

type DialpadPinProps = {
  pinSize: number;
  pinLength: number;
  code: any[];
  dialPadContent: any[];
};

const  DialpadPin: FC<DialpadPinProps> = props => {
  const {dialPadContent, pinLength, code, pinSize} = props;

  return (
    <View style={styles.dialPadPinContainer}>
     {Array(pinLength)
       .fill(undefined)
       .map((_, index) => {
         const item = dialPadContent[index];
         const isSelected =
           typeof item === "number" && code[index] !== undefined;
         return (
           <View
             key={index}
             style={{
               width: pinSize,
               height: pinSize,
               borderRadius: pinSize / 2,
               overflow: "hidden",
               margin: 5,
             }}
           >
             <View
               style={[
                 {
                   borderRadius: pinSize / 2,
                   borderColor: !isSelected ? "lightgrey" : "#3F1D38",
                 },
                 styles.pinContentContainer,
               ]}
             >
               {isSelected && (
                 <View
                   style={[
                     {
                       width: pinSize * 0.5,
                       height: pinSize * 0.5,
                       borderRadius: pinSize * 0.35,
                     },
                     styles.pinContent,
                   ]}
                 />
               )}
             </View>
           </View>
         );
       })}
   </View>
  )
};

const styles = StyleSheet.create({
  dialPadPinContainer: {
    flexDirection: "row",
    marginBottom: 30,
    alignItems: "flex-end",
  },
  pinContentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pinContent: {
    backgroundColor: "#5E454B",
  }
  });

export default DialpadPin;