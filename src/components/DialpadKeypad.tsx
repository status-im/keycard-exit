import {FC } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type DialpadKeypadProps = {
  dialPadContent: any[];
  dialPadSize: number;
  dialPadTextSize: number;
  updateCodeFunc: (item: never) => void;
};

const  DialpadKeypad: FC<DialpadKeypadProps> = props => {
  const {dialPadContent, dialPadSize, dialPadTextSize, updateCodeFunc} = props;

  return (
    <FlatList data={dialPadContent} numColumns={3} keyExtractor={(_, index) => index.toString()} renderItem={({ item }) => {
       return (
         <TouchableOpacity  disabled={item === ""} onPress={() => updateCodeFunc(item as never)}>
           <View style={[
               {
                 borderWidth: item === "" || item === "X" ? 0 : 1,
                 width: dialPadSize,
                 height: dialPadSize,
               },
               styles.dialPadContainer,
             ]}
           >
             {item === "X" ? (
               <Icon name="backspace-outline" size={24} color="white" />
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
    margin: 8,
    padding: 0,
    borderColor: "white",
  },
  dialPadText: {
    color: "white",
    fontFamily: 'Inter'
  }
  });

export default DialpadKeypad;