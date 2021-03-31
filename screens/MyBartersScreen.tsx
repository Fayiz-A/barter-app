import React, { useState, useEffect } from 'react';
import { View, FlatList, ScaledSize, useWindowDimensions } from 'react-native';
import CustomAppBar from '../components/CustomAppBar';
import { List, Divider } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import database from '../configs/firebase.config';
import GLOBALS from '../constants/globals';
import firebase from 'firebase';

function MyBartersScreen() {

   const [myBarters, setMyBarters] = useState<any[]>([]);

   const dimensions = useWindowDimensions();

   useEffect(() => {

      let bartersList:any[] = [];

      let currentUserEmail:string | null | undefined = firebase.auth().currentUser?.email;

      try {
         const firestore = GLOBALS.firebase.firestore;

         if(onEndReachedCalledDuringMomentum) {
            if(currentUserEmail) {
               database.collection(firestore.collections.names.barters).where(firestore.collections.barters.names.donorID,'==', currentUserEmail)
               .onSnapshot((snapshot) => {
                  snapshot.docs.map(doc => {
                     let data = doc.data();
                     bartersList.push(data);
                  });
                  // console.log(`Barters list: ${bartersList}`)
                  setMyBarters(bartersList);
               });
            } else {
               alert(`User not signed in`);
            }
         }
      
      } catch(e) {
         console.error(e);
         alert(`Some error occurred in fetching the barters`);
      }

   }, []);

   const styles = (dimensions:ScaledSize) => {

   }

   const updateItemInDatabase = async (item:any) => {
      await database.collection(GLOBALS.firebase.firestore.collections.names.itemsToExchange).doc(item.docID).update({
         sent: true
      });

      await database.collection(GLOBALS.firebase.firestore.collections.names.barters).doc(item.docID).update({
         status: 'sent'
      });

      await database.collection(GLOBALS.firebase.firestore.collections.names.notifications).doc(item.docID).set({
         docID: item.docID,
         receiverID: item.receiverID,
         donorID: item.donorID,
         itemName: item.itemName,
         itemDescription: item.itemDescription,
         read: false
      })

      alert(`Item ${item.itemName} sent to ${item.receiverID}`);
   }

   const renderItem = ({ item, index }) => {
      return (
         <View>
            <List.Item
               theme={{
                  colors: {
                     text: 'black'
                  }
               }}
               left={(prop) => <List.Icon icon='table-furniture' color='black' />}
               right={(prop) => (
                  <View>
                     <CustomButton
                        buttonText='Send'
                        buttonTextColor='white'
                        buttonColor='red'
                        onPress={() => updateItemInDatabase(item)}
                     />
                  </View>
               )}
               title={item.itemName}
               description={`Status: ${item.status}`}
            />
            <Divider />
         </View>
      )
   }

   let onEndReachedCalledDuringMomentum = true;

   return (
      <View>
         <CustomAppBar title='My Barters Screen' drawerAvailable={true} />
         <View>
            <FlatList
               data={myBarters}
               keyExtractor={(item, index) => index.toString()}
               renderItem={renderItem}
               onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
            />
         </View>
      </View>
   );
}

export default MyBartersScreen;