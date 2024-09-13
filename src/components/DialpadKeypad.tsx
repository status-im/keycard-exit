import {FC } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

type DialpadKeypadProps = {
  dialPadContent: any[];
  pinLength: number;
  dialPadSize: number;
  dialPadTextSize: number;
  code: number[];
  updateCodeFunc: (item: never) => void;
};

const  DialpadKeypad: FC<DialpadKeypadProps> = props => {
  const {dialPadContent, pinLength, dialPadSize, dialPadTextSize, code, updateCodeFunc} = props;

  return (
    <FlatList data={dialPadContent} numColumns={3} keyExtractor={(_, index) => index.toString()} renderItem={({ item }) => {
       return (
         <TouchableOpacity  disabled={item === ""} onPress={() => updateCodeFunc(item as never)}>
           <View style={[
               {
                 backgroundColor: item === "" ? "transparent" : "#fff",
                 width: dialPadSize,
                 height: dialPadSize,
               },
               styles.dialPadContainer,
             ]}
           >
             {item === "X" ? (
               <Icon name="delete" size={24} color="#3F1D38" />
             ) : (
               <Text
                 style={[{ fontSize: dialPadTextSize }, styles.dialPadText]}
               >
                 {item}
               </Text>
             )}
           </View>
         </TouchableOpacity>
       );
     }}
   />
  )};

const styles = StyleSheet.create({
  dialPadContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    borderRadius: 45,
    padding: 0,
    borderColor: "transparent",
  },
  dialPadText: {
    color: "#3F1D38",
  }
  });

export default DialpadKeypad;