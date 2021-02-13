import React, { } from 'react';
import { TouchableOpacity, Text, StyleSheet, ColorValue } from 'react-native';
import { Colors } from 'react-native-elements';

interface Props {
   buttonText:string,
   buttonColor: ColorValue,
   buttonTextColor: ColorValue,
   onPress: () => void
}

export default function CustomButton (props:Props) {
   return (
      <TouchableOpacity
         style={styles(props).button}
         onPress={props.onPress}
      >
         <Text style={styles(props).buttonText}>{props.buttonText}</Text>
      </TouchableOpacity>
   );
}

const styles = (props:Props) => StyleSheet.create({
   button: {
      backgroundColor: props.buttonColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 23,
      paddingHorizontal: 7,
      paddingVertical: 5,
      shadowOpacity: 0.5,
      shadowRadius: 2.0,
      shadowOffset: {
         width: 0.0,
         height: 4.0
      },
      elevation: 20
   },
   buttonText: {
      fontSize: 23,
      color: props.buttonTextColor,
      fontWeight: 'bold',
      fontFamily: 'cursive'
   }
})