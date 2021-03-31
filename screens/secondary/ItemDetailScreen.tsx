import React from 'react';
import { View, Text, ScaledSize, StyleSheet, useWindowDimensions } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';
import { useRoute } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import CustomButton from '../../components/CustomButton';

import database from '../../configs/firebase.config';
import GLOBALS from '../../constants/globals';
import firebase from 'firebase';

interface ItemDetail {
   keyName: string,
   itemKeyNameInItemObject: string
}

function ItemDetailScreen() {
   const route = useRoute();
   const dimensions = useWindowDimensions();

   const { item }:any = route.params;
   const { navigation }:any = route.params;

   const itemDetailsList:ItemDetail[] = [
      {
         keyName: 'Item Name',
         itemKeyNameInItemObject: 'name'
      },
      {
         keyName: 'Item Description',
         itemKeyNameInItemObject: 'description'
      },
      {
         keyName: 'Time of Request',
         itemKeyNameInItemObject: 'timeStamp'
      },
      {
         keyName: 'Reciever ID',
         itemKeyNameInItemObject: 'userID'
      }
   ]
   const styles = (dimensions:ScaledSize) => StyleSheet.create({
      itemKey: {
         fontWeight: 'bold',
         fontSize: 20
      },
      itemValue: {
         fontSize: 20
      },
      sendButtonContainer: {
         paddingTop: 20,
         paddingRight: dimensions.width / 2 - ((dimensions.width / 3) / 2),
         paddingLeft: dimensions.width / 2 - ((dimensions.width / 3) / 2),
      }
   });

   const updateItemStatusAndNavigate = () => {
      navigation.navigate('myBartersScreen');

      database.collection(GLOBALS.firebase.firestore.collections.names.barters).doc(item.docID).set({
         donorID: firebase.auth().currentUser?.email,
         receiverID: item.userID,
         itemName: item.name,
         itemDescription: item.description,
         status: 'notSent',
         docID: item.docID
      });
   }
   
   return (
      <View>
         <CustomAppBar title='Item Details Screen' backButtonAvailable={true} />
         <View>
            {
               itemDetailsList.map(detail => {
                  return (
                     <View>
                        <Card containerStyle={{borderRadius: 15.0}}>
                           <Text style={styles(dimensions).itemValue}>
                              <Text style={styles(dimensions).itemKey}>{detail.keyName}: </Text>
                              {item[detail.itemKeyNameInItemObject].toString()}
                           </Text>
                        </Card>
                     </View>
                  )
               })
            }
            <View>
               <View style={styles(dimensions).sendButtonContainer}>
                  <CustomButton onPress={updateItemStatusAndNavigate} buttonColor='red' buttonText='Send' buttonTextColor='white'/>
               </View>
            </View>
         </View>
      </View>
   )
}

export default ItemDetailScreen;