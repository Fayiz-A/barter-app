import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Input } from 'react-native-elements';

export interface Props {
   placeholder:string,
   width: number,
   height?: number,
   onChangeText: (text:string) => void,
   value: string,
   obscureText: boolean,
   multiline?: boolean,
   maxLength?: number,
   outlinedBorder?:boolean
}

export default function CustomTextInput(props:Props) {
   return (
      <TextInput 
         placeholder={props.placeholder}
         style={styles(props).textInput}
         onChangeText={props.onChangeText}
         value={props.value}
         secureTextEntry={props.obscureText}
         multiline={props.multiline || false}
         maxLength={props.maxLength || undefined}
      />
   );
}

const styles = (props:Props) => StyleSheet.create({
   textInput: {
      width: props.width,
      height: props.height || undefined,
      fontSize: 23,
      padding: 3,
      borderBottomWidth: props.outlinedBorder ? undefined:2,
      borderColor: 'black',
      borderWidth: props.outlinedBorder ? 5:undefined,
      borderRadius: props.outlinedBorder ? 25:0
   }
})