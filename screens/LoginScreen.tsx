import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScaledSize, Dimensions, ColorValue } from "react-native";
import CustomAppBar from '../components/CustomAppBar';
import CustomTextInput from '../components/CustomTextInput';
import { Avatar } from 'react-native-elements';
import CustomButton from '../components/CustomButton';
import EmailValidator from 'email-validator';
import { Modal, Portal } from 'react-native-paper';

import firebase from 'firebase';
import database from '../configs/firebase.config';

import GLOBALS from '../constants/globals';

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
   emailBadlyFormatted,
   userNotFound,
   userDisabled,
   operationNotAllowed,
   weakPassword,
   emailAlreadyInUse
} 

interface Props {
   navigation: any,
}

export default function LoginScreen(props:Props) {

   useEffect(() => {
      Dimensions.addEventListener('change', ({ window, screen }: { window: ScaledSize; screen: ScaledSize }) => {
         setDimensions(window);
      });
   });

   let [ dimensions, setDimensions ] = useState<ScaledSize>(Dimensions.get('window'));
   
   let [ email, setEmail ] = useState<string>('');
   let [ password, setPassword ] = useState<string>('');

   let [ modalVisible, setModalVisible ] = useState<boolean>(false);
   let [ emailIDInModal, setEmailIDInModal ] = useState<string>('');
   let [ address, setAddress ] = useState<string>('');
   let [ contactNo, setContactNo ] = useState<string>('');
   let [ name, setName ] = useState<string>('');

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
                  alert(`Wrong credentials`);
               break;
               case Status.successful:
                  props.navigation.replace('exchangeViewTabNavigator')
               break;
               case Status.userNotFound:
                  alert(`User not found`)
               break;
               case Status.userDisabled:
                  alert(`User disabled`)
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
                  // alert(`User added successfully`)
                  setModalVisible(true);
               break;
               case Status.emailAlreadyInUse:
                  alert(`Email already in use`)
               break;
               case Status.weakPassword:
                  alert(`Weak password`)
               break;
               case Status.operationNotAllowed:
                  alert(`Operation not allowed`)
               break;
               default: alert(`Some unknown error occurred`)
            }
         }
      }
   ]

   let signUpModalDetailsTextInput:TextInputDetail[] = [
      {
         placeholder: 'Name',
         onChangeText: (text:string) => setName(text),
         value: name,
      },
      {
         placeholder: 'Email ID',
         onChangeText: (text:string) => setEmailIDInModal(text),
         value: emailIDInModal,
      },
      {
         placeholder: 'Address',
         onChangeText: (text:string) => setAddress(text),
         value: address,
      },
      {
         placeholder: 'Contact No.',
         onChangeText: (text:string) => setContactNo(text),
         value: contactNo,
      }
   ]

   let modalButtonDetails:ButtonDetail[] = [
      {
         buttonText: 'Submit',
         buttonColor: 'purple',
         onPress: async () => {
            setModalVisible(false);
            let userDetailsRegisteredStatus:Status = await setUserDetailsInFirestore(name, emailIDInModal, address, contactNo);
            
            switch (userDetailsRegisteredStatus) {
               case Status.successful:
                  props.navigation.navigate('exchangeViewTabNavigator')
               break;
               default:
                  alert(`Some Error Occurred`);
            }
         }
      },
      {
         buttonText: 'Cancel',
         buttonColor: 'red',
         onPress: () => setModalVisible(false)
      }
   ] 

   const styles = (dimensions: ScaledSize) => StyleSheet.create({
      background: {
         backgroundColor:'#F8BE85',
         height: '100vh',      
      }, 
      modal: {
         marginLeft: dimensions.width / 2 - ((dimensions.width / 2) / 2), // dimensions.width / 2 is the width of the modal
         marginTop: dimensions.height / 2 - ((dimensions.height / 2) / 2), // dimensions.height / 2 is the width of the modal
         width: dimensions.width / 2,
         height: dimensions.height / 1.9,
         shadowOpacity: 0.5,
         shadowRadius: 2.0,
         shadowOffset: {
            width: 0.0,
            height: 6.0
         },
         elevation: 20.0,
         backgroundColor: '#FFC107',
         borderRadius: 20.0,
      },
      modalContent: {
         justifyContent: 'flex-start',
         alignItems: 'center',
         height: '100%',
         width: '100%',
         borderRadius: 20.0
      },
      modalHeadingContainer: {
         paddingVertical: 1,
         alignItems: 'center',
         width: '100%',
      },
      modalHeading: {
         fontFamily: 'cursive',
         fontSize: 30,
         fontWeight: 'bold'
      },
      modalButtonGroupContainer: {
         paddingTop: 5,
      },
      modalButtonContainer: {
         paddingBottom: dimensions.height / 60,
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
         let errCode = err.code;
   
         switch(errCode) {
            case 'auth/wrong-password':
               return Status.badCredentials
            break;
            case 'auth/user-not-found':
               return Status.userNotFound
            break;
            case 'auth/user-disabled':
               return Status.userDisabled
            break;
            case 'auth/invalid-email':
               return Status.emailBadlyFormatted
            break;
            default: return Status.unknownError
         } 
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
         let errCode = err.code;
   
         switch(errCode) {
            case 'auth/email-already-in-use':
               return Status.emailAlreadyInUse
            break;
            case 'auth/invalid-email':
               return Status.emailBadlyFormatted
            break;
            case 'auth/operation-not-allowed':
               return Status.operationNotAllowed
            break;
            case 'auth/weak-password':
               return Status.weakPassword
            break;
            default: return Status.unknownError
         } 
      };
   }

   const setUserDetailsInFirestore = async (name:string, emailID:string, address:string, contactNo:string):Promise<Status> => {
      try {
         const res = await database.collection(GLOBALS.firebase.firestore.collections.names.users).add({
            name: name,
            emailID: emailID,
            address: address,
            contactNo: contactNo
         });
         return Status.successful;
      } catch (err) {
         console.error(err);
         return Status.unknownError;
      }
   }

   return (
      <View style={styles(dimensions).background}>
         <View>
            <CustomAppBar title='Login'/>
               <Portal>
                  <Modal
                     dismissable={false}
                     visible={modalVisible}
                     contentContainerStyle={styles(dimensions).modalContent}
                     style={styles(dimensions).modal}
                  >
                     <View style={styles(dimensions).modalHeadingContainer}>
                        <Text style={styles(dimensions).modalHeading}>
                           Information:
                        </Text>
                     </View>
                     <View>
                        {
                           signUpModalDetailsTextInput.map((detail:TextInputDetail) => {
                              return (
                                 <View>
                                    <CustomTextInput 
                                       placeholder={detail.placeholder}
                                       onChangeText={detail.onChangeText}
                                       value={detail.value}
                                       obscureText={false}
                                       width={(dimensions.width / 2) / 2} //dimensions.width / 2 is the width of the modal
                                    />
                                 </View>
                              )
                           })
                        }
                        <View style={styles(dimensions).modalButtonGroupContainer}>
                        {
                           modalButtonDetails.map((detail:ButtonDetail) => {
                              return (
                                 <View style={styles(dimensions).modalButtonContainer}>
                                    <CustomButton 
                                       buttonText={detail.buttonText}
                                       buttonColor={detail.buttonColor}
                                       onPress={detail.onPress}
                                       buttonTextColor='white'
                                    />
                                 </View>
                              )
                           })
                        }
                        </View>
                     </View>
                  </Modal>
               </Portal>
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