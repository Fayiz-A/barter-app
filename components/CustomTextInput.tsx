import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface Props {
   placeholder:string,
   width: number,
   onChangeText: (text:string) => void,
   value: string,
   obscureText: boolean
}

export default function CustomTextInput(props:Props) {
   return (
      <TextInput 
         placeholder={props.placeholder}
         style={styles(props).textInput}
         onChangeText={props.onChangeText}
         value={props.value}
         secureTextEntry={props.obscureText}
      />
   );
}

const styles = (props:Props) => StyleSheet.create({
   textInput: {
      width: props.width,
      fontSize: 23,
      padding: 3,
      borderBottomWidth: 2,
   }
})