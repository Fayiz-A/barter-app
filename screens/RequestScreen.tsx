import React, { useEffect, useState } from 'react';
import { View, Dimensions, ScaledSize, StyleSheet, useWindowDimensions } from 'react-native';
import CustomAppBar from '../components/CustomAppBar';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

import Status from '../constants/status';
import GLOBALS from '../constants/globals';

import database from '../configs/firebase.config';
import firebase from 'firebase';

interface TextInputDetail {
   placeholder:string,
   onChangeText: (text:string) => void,
   value: string,
   maxLength?: number,
   multiline?: boolean,
   height?: number
}

function RequestScreen() {

   const dimensions = useWindowDimensions();
      
   let [ name, setName ] = useState<string>('');
   let [ description, setDescription ] = useState<string>('');
   
   let textInputDetails:TextInputDetail[] = [
      {
         placeholder: 'Name',
         onChangeText: (text:string) => setName(text),
         value: name,
      },
      {
         placeholder: 'Description',
         onChangeText: (text:string) => setDescription(text),
         value: description,
         maxLength: 200,
         height: dimensions.height * 0.6,
         multiline: true
      },
   ]

   const styles = (dimensions:ScaledSize) => StyleSheet.create({
      allTextInputsContainer: {
         paddingLeft: (dimensions.width / 2 - ((dimensions.width / 2) / 2)), // dimensions.width / 2 is the width of the textinput
      },
      textInputContainer: {
         paddingTop: 20,
      },
      textInput: {
         fontSize: 20,
      },
      submitButtonContainer: {
         paddingTop: 20,
         paddingLeft: (dimensions.width / 2) - (100 / 2),// 100 is the width of the button
         paddingRight: (dimensions.width / 2) - (100 / 2)// 100 is the width of the button
      }
   })

   const validateAndSubmitDetails = async (name:string, description:string) => {
      console.log(`Name and Description: ${name} ${description}`)
      if(name == null || name.trim().length == 0) return Status.emptyField1;
      if(description == null || description.trim().length == 0) return Status.emptyField2;

      if(description.trim().length < 10) return Status.shortDetails;

      return await database.collection(GLOBALS.firebase.firestore.collections.names.itemsToExchange).add({
         name: name,
         description: description,
         timeStamp: firebase.firestore.Timestamp.now(),
         userID: firebase.auth().currentUser?.email,
         sent: false
      })
      .then(res => Status.successful)
      .catch(err => Status.unknownError);
   }

   return (
      <View>
         <CustomAppBar title='Request Screen' color='#96D25A'/>
         <View style={styles(dimensions).allTextInputsContainer}>
         {
            textInputDetails.map(
               (detail:TextInputDetail) => {
                  return (
                     <View style={styles(dimensions).textInputContainer}>
                        <CustomTextInput 
                           placeholder={detail.placeholder}
                           onChangeText={detail.onChangeText}
                           value={detail.value}
                           obscureText={false}
                           width={dimensions.width / 2}
                           height={detail.height || undefined}
                           multiline={detail.multiline || false}
                           maxLength={detail.maxLength || undefined}
                           outlinedBorder={true}
                        />
                     </View>
                  )
               }
            )
         }
         </View>
         <View style={styles(dimensions).submitButtonContainer}>
            <CustomButton 
               buttonColor='red'
               buttonText='Submit'
               buttonTextColor='white'
               onPress={async () => {
                  let dataSubmittedStatus:Status = await validateAndSubmitDetails(name, description);
                  switch(dataSubmittedStatus) {
                     case Status.emptyField1:
                        alert(`Please fill the name field!`);
                     break;
                     case Status.emptyField2:
                        alert(`Please fill the description field!`)
                     break;
                     case Status.shortDetails:
                        alert(`Description too short!`);
                     break;
                     case Status.successful:
                        alert(`Data submitted successfully!`)
                     break;
                     default: alert(`Some error occurred!`)
                  }
               }}
            />
         </View>
      </View>
   )
}

export default RequestScreen;