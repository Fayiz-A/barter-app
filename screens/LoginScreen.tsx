import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScaledSize, Dimensions, TouchableOpacity, ColorValue } from "react-native";
import CustomAppBar from '../components/CustomAppBar';
import CustomTextInput from '../components/CustomTextInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';
import CustomButton from '../components/CustomButton';
import GLOBALS from '../constants/globals';
import EmailValidator from 'email-validator';

import firebase from 'firebase';
import firestore from '../configs/firebase.config.ts';

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

enum Status {
   successful,
   unknownError,
   badCredentials,
   emptyEmail,
   emptyPassword,
   emailBadlyFormatted
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
         onPress: async () => {
            let authStatus:Status = await authenticateUserWithEmailAndPassword(email, password);

            switch(authStatus) {
               case Status.emptyEmail:
                  alert(`Empty email`)
               break;
               case Status.emptyPassword:
                  alert(`Empty password`)
               break;
               case Status.emailBadlyFormatted:
                  alert(`Email badly formatted`)
               break;
               case Status.badCredentials:
                  alert(`Bad Credentials`);
               break;
               case Status.successful:
                  alert(`User added successfully`)
               break;
               default: alert(`Some unknown error occurred`)
            }
         }
      },
      {
         buttonColor: '#3F51B5',
         buttonText: 'Sign Up',
         onPress: async () => {
            let authStatus:Status = await signUpUser(email, password);

            switch(authStatus) {
               case Status.emptyEmail:
                  alert(`Empty email`)
               break;
               case Status.emptyPassword:
                  alert(`Empty password`)
               break;
               case Status.emailBadlyFormatted:
                  alert(`Email badly formatted`)
               break;
               case Status.successful:
                  alert(`User added successfully`)
               break;
               default: alert(`Some unknown error occurred`)
            }
         }
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

const validateCredentials = (email:string, password:string):Status => {
   if(email == null || email.trim().length == 0) return Status.emptyEmail
   if(password == null || password.trim().length == 0) return Status.emptyPassword
   if(!EmailValidator.validate(email)) return Status.emailBadlyFormatted
   return Status.successful;
}

const authenticateUserWithEmailAndPassword = async (email:string, password: string) => {
   let credentialsValidStatus:Status = validateCredentials(email, password);
   if(credentialsValidStatus != Status.successful) return credentialsValidStatus;

   try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return Status.successful;
   } catch(err) {
      console.error(err);
      return Status.unknownError
   };
}

const signUpUser = async (email:string, password: string):Promise<Status> => {
   
   let credentialsValidStatus:Status = validateCredentials(email, password);
   if(credentialsValidStatus != Status.successful) return credentialsValidStatus;

   try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      return Status.successful;
   } catch(err) {
      console.error(err);
      return Status.unknownError
   };
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