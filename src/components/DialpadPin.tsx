import {FC, useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";

type DialpadPinProps = {
  pinSize: number;
  pinLength: number;
  code: any[];
  dialPadContent: any[];
};

const  DialpadPin: FC<DialpadPinProps> = props => {
  const {dialPadContent, pinLength, code, pinSize} = props;
  const animatedValue = useRef(new Animated.Value(0)).current;

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 3],
          outputRange: [1, 1.3],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: code.length,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [code]);

  return (
    <View style={styles.dialPadPinContainer}>
     {Array(pinLength)
       .fill(undefined)
       .map((_, index) => {
         const item = dialPadContent[index];
         const isSelected = typeof item === "number" && code[index] !== undefined;
         return (
           <View
             key={index}
             style={{
               width: pinSize,
               height: pinSize,
               borderRadius: pinSize / 2,
               overflow: "hidden",
               margin: 8,
             }}
           >
             <View
               style={[
                 {
                   borderColor: 'white',
                   borderRadius: pinSize,
                   borderWidth: 1
                 },
                 styles.pinContentContainer,
               ]}
             >
              {isSelected && (<Animated.View style={[
            {
           width: pinSize,
           height: pinSize,
           borderRadius: pinSize,
            },
            animatedStyle,
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
    marginTop: 30,
    marginBottom: 50,
    alignItems: "flex-end",
  },
  pinContentContainer: {
    flex: 1,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pinContent: {
    backgroundColor: "white",
  }
  });

export default DialpadPin;