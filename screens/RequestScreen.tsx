import React, { useEffect, useState } from 'react';
import { View, Text, Button, ColorValue, Dimensions, ScaledSize, StyleSheet } from 'react-native';
import CustomAppBar from '../components/CustomAppBar';
import CustomTextInput from '../components/CustomTextInput';
import { TextInput, ThemeProvider } from 'react-native-paper';
import { DarkTheme, useTheme, DefaultTheme } from '@react-navigation/native';

interface TextInputDetail {
   placeholder:string,
   onChangeText: (text:string) => void,
   value: string,
   maxLines?: boolean,
   length?: number
}

interface ButtonDetail {
   buttonText:string,
   onPress: () => void,
   buttonColor: ColorValue
}

function RequestScreen() {

   useEffect(() => {
      Dimensions.addEventListener('change', ({ window, screen }: { window: ScaledSize; screen: ScaledSize }) => {
         setDimensions(window);
      });
   });

   let [ dimensions, setDimensions ] = useState<ScaledSize>(Dimensions.get('window'));
   
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
         length: 3000,
         maxLines: true
      },
   ]

   const styles = (dimensions:ScaledSize) => StyleSheet.create({
      allTextInputsContainer: {
         paddingLeft: -(dimensions.width / 3 - (dimensions.width / 2)), // dimensions.width / 2 is the width of the textinput
         paddingRight: -(dimensions.width / 3 - (dimensions.width / 2)), // dimensions.width / 2 is the width of the textinput
      },
      textInputContainer: {
         paddingTop: 20,
      },
      textInput: {
         height: 200,
         fontSize: 20,
      }
   })

   return (
      <View>
         <CustomAppBar title='Request Screen' color='#96D25A'/>
         <View style={styles(dimensions).allTextInputsContainer}>
         {
            textInputDetails.map(
               (detail:TextInputDetail) => {
                  return (
                     <View style={styles(dimensions).textInputContainer}>
                        <TextInput 
                           style={styles(dimensions).textInput}
                           theme={{
                              dark: false,
                              mode: 'adaptive',
                              colors: {
                                 text: 'black',
                                 background: 'white',
                                 placeholder: 'purple'
                              },
                              roundness: 50,
                           }}
                           underlineColor='purple'
                           mode='outlined'
                           placeholder={detail.placeholder}
                           onChangeText={detail.onChangeText}
                           value={detail.value}
                           multiline={false || detail.maxLines}
                        />
                     </View>
                  )
               }
            )
         }
         </View>
      </View>
   )
}

export default RequestScreen;