import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScaledSize, Dimensions, TouchableOpacity, ColorValue } from "react-native";
import CustomAppBar from '../components/CustomAppBar';
import CustomTextInput from '../components/CustomTextInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';
import CustomButton from '../components/CustomButton';

interface TextInputDetail {
   placeholder:string,
   onChangeText: (text:string) => void,
   value: string,
   obscureText?: boolean
}

interface ButtonDetail {
   buttonText:string,
   onPress: () => void,
   buttonColor: ColorValue
}

export default function LoginScreen() {

   useEffect(() => {
      Dimensions.addEventListener('change', ({ window, screen }: { window: ScaledSize; screen: ScaledSize }) => {
         setDimensions(window);
      });
   });

   let [ dimensions, setDimensions ] = useState<ScaledSize>(Dimensions.get('window'));
   
   let [ email, setEmail ] = useState<string>('');
   let [ password, setPassword ] = useState<string>('');

   let textInputDetails:TextInputDetail[] = [
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

   let buttonDetails:ButtonDetail[] = [
      {
         buttonColor: '#4CAF50',
         buttonText: 'Sign In',
         onPress: () => console.log(`Tapped`)
      },
      {
         buttonColor: '#3F51B5',
         buttonText: 'Sign Up',
         onPress: () => console.log(`Tapped`)
      }
   ]

   return (
      <View style={styles(dimensions).background}>
         <View>
            <CustomAppBar title='Login'/>
            <View style={styles(dimensions).imageContainer}>
               <Avatar 
                  rounded
                  overlayContainerStyle={styles(dimensions).avatar}
                  size = {dimensions.height / 3}
                  icon={{
                     type:'ionicon',
                     name: 'leaf',
                     color: '#63b175',
                  }}
               />
            </View>
            <View style={styles(dimensions).detailsContainer}>
               {
                  textInputDetails.map((detail:TextInputDetail) => {
                     return (
                        <View style={styles(dimensions).textInputContainer}>
                           <CustomTextInput 
                              placeholder={detail.placeholder} 
                              width={dimensions.width / 2}
                              value={detail.value}
                              onChangeText={detail.onChangeText}
                              obscureText={detail.obscureText ? detail.obscureText:false}
                           />
                        </View>
                     )
                  })
               }
               <View>
                  {
                     buttonDetails.map((detail:ButtonDetail) => {
                        return (
                           <View style={styles(dimensions).buttonContainer}>
                              <CustomButton 
                                 buttonText={detail.buttonText}
                                 buttonTextColor='white'
                                 buttonColor={detail.buttonColor}
                                 onPress={detail.onPress}
                              />
                           </View>
                        );
                     })
                  }
               </View>
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
   imageContainer: {
      paddingVertical: 20,
      justifyContent: "center",
      alignItems: 'center',
   },
   avatar: {
      backgroundColor: 'white', 
      borderWidth: 5
   },
   detailsContainer: {
      width: '100%',
      alignItems: 'center'
   },
   textInputContainer: {
      paddingTop: 20,
   },
   buttonContainer: {
      paddingTop: 15,
   }
})