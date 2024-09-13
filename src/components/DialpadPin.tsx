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
               margin: 5,
             }}
           >
             <View
               style={[
                 {
                   borderColor: 'transparent',
                   borderRadius: pinSize / 2
                 },
                 styles.pinContentContainer,
               ]}
             >
              {isSelected && (<Animated.View style={[
            {
           width: pinSize * 0.28,
           height: pinSize * 0.28,
           borderRadius: pinSize * 0.35,
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
    marginBottom: 25,
    alignItems: "flex-end",
  },
  pinContentContainer: {
    flex: 1,
    backgroundColor: "#ffffff11",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pinContent: {
    backgroundColor: "#199515",
  }
  });

export default DialpadPin;