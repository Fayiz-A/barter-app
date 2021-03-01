import React, { useState, useEffect } from 'react';
import { Text, View, useWindowDimensions, StyleSheet, ScaledSize } from 'react-native';
import CustomAppBar from '../components/CustomAppBar';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import database from '../configs/firebase.config';
import GLOBALS from '../constants/globals';
import firebase from 'firebase';

interface TextInputDetail {
   placeholder:string,
   onChangeText: (text:string) => void,
   value: string,
   maxLength?: number,
   multiline?: boolean,
   height?: number
}

function SettingsScreen() {

   const [name, setName] = useState<string>('');
   const [emailID, setEmailID] = useState<string>('');
   const [address, setAddress] = useState<string>('');
   const [contactNo, setContactNo] = useState<string>('');

   const [userDocId, setUserDocId] = useState<string>('');

   const windowDetails = useWindowDimensions();

   useEffect(() => {
      let currentUserEmail:string|null|undefined = firebase.auth().currentUser?.email;

      if(currentUserEmail) {
         getAndSetUserDetails(currentUserEmail);
      } else {
         alert('User not signed in');
      }
   }, []);

   

   const styles = (windowDetails:ScaledSize) => StyleSheet.create({
      background: {
         backgroundColor: '#CDDC39',
         height: '100vh',      
      },
      textInputContainer: {
         paddingTop: windowDetails.height / 50,
         alignItems: 'center'
      },
      buttonContainer: {
         paddingTop: windowDetails.height / 50,
         paddingLeft: (windowDetails.width / 2) - ((windowDetails.width / 4) / 2),
         paddingRight: (windowDetails.width / 2) - ((windowDetails.width / 4) / 2),
      }
   });

   const firestore = GLOBALS.firebase.firestore;

   const getAndSetUserDetails = (currentUserEmailID:string) => {
      try {
         database.collection(firestore.collections.names.users).where('emailID', '==', currentUserEmailID).limit(1) //get unique result
         .onSnapshot(
            (snapshot) => {
               snapshot.docs.map(doc => {
   
                  setUserDocId(doc.id);
   
                  let data = doc.data();
   
                  setName(data.name);
                  setEmailID(data.emailID);
                  setAddress(data.address);
                  setContactNo(data.contactNo);
   
               })
            }
         )
      } catch(e) {
         console.error(e);
         alert(`Some error occurred while fetching the details.`)
      }
      
   }

   const updateProfile = (name:string, emailID:string, address:string, contactNo:string) => {

      try {
         database.collection(firestore.collections.names.users).doc(userDocId).update({
            name: name,
            emailID: emailID,
            address: address,
            contactNo: contactNo,
         });
         alert(`User details updated successfully`)
      } catch(e) {
         console.error(e);
         alert(`Some error occured in saving the user details`);
      }
   }

   let textInputDetails:TextInputDetail[] = [
      {
         placeholder: 'Name',
         onChangeText: (text:string) => setName(text),
         value: name,
      },
      {
         placeholder: 'Email ID',
         onChangeText: (text:string) => setEmailID(text),
         value: emailID,
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
      },
   ]

   return (
      <View style={styles(windowDetails).background}>
         <CustomAppBar title='Settings Screen' color='#1e9c91' drawerAvailable={true}/>
         <View>
            <View>
               {
                  textInputDetails.map(detail => {
                     return (
                        <View style={styles(windowDetails).textInputContainer}>
                           <CustomTextInput 
                              placeholder={detail.placeholder}
                              onChangeText={detail.onChangeText}
                              value={detail.value}
                              obscureText={false}
                              outlinedBorder={true}
                              height={windowDetails.height / 12}
                              width={windowDetails.width / 2}
                           />
                        </View>
                     )
                  })
               }
            </View>
            <View style={styles(windowDetails).buttonContainer}>
               <CustomButton 
                 buttonColor='rgba(88,111,121,1.0)'
                 buttonText='Submit'
                 buttonTextColor='white'
                 onPress={() => updateProfile(name, emailID, address, contactNo)} 
               />
            </View>
         </View>
      </View>
   );
}

export default SettingsScreen;