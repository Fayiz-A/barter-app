import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScaledSize, Dimensions } from "react-native";
import CustomAppBar from '../components/CustomAppBar';
import CustomTextInput from '../components/CustomTextInput';

interface TextInputDetails {
   placeholder:string,
   onChangeText: (text:string) => void,
   value: string,
   obscureText?: boolean
}

export default function LoginScreen() {

   let [ dimensions, setDimensions ] = useState<ScaledSize>(Dimensions.get('window'));
   
   let [ email, setEmail ] = useState<string>('');
   let [ password, setPassword ] = useState<string>('');

   let textInputDetails:TextInputDetails[] = [
      {
         placeholder:'Email',
         onChangeText: (email:string) => setEmail(email),
         value: email,
      },
      {
         placeholder:'Password',
         onChangeText: (password:string) => setPassword(password),
         value: password,
         obscureText: true
      }
   ]

   return (
      <View style={styles(dimensions).background}>
         <View>
            <CustomAppBar title='Login'/>
            <View style={styles(dimensions).detailsContainer}>
               {
                  textInputDetails.map((detail:TextInputDetails) => {
                     return (
                        <View style={styles(dimensions).textInputContainer}>
                           <CustomTextInput 
                              placeholder={detail.placeholder} 
                              width={dimensions.width / 2}
                              value={detail.value}
                              onChangeText={detail.onChangeText}
                              obscureText={detail.obscureText}
                           />
                        </View>
                     )
                  })
               }
            </View>
         </View>
      </View> 
   );
}

const styles = (dimensions: ScaledSize) => StyleSheet.create({
   background: {
      backgroundColor:'#F8BE85',
      height: '100vh',      
   }, 
   detailsContainer: {
      height: dimensions.height - 60, //60 is the height of the appbar
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
   },
   textInputContainer: {
      paddingTop: 20,
   }
})