import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ScaledSize, StyleSheet, useWindowDimensions } from 'react-native';
import CustomAppBar from '../components/CustomAppBar';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import database from '../configs/firebase.config';
import GLOBALS from '../constants/globals';
import { List, Divider } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import { useNavigation, DrawerActions, StackActions } from '@react-navigation/native';

interface ItemInterface {
   name: string,
   description: string,
   timeStamp: Date
}

interface Props {
   navigation: any
}

function ExchangeScreen(props:Props) {

   const [itemsList, setItemsList] = useState<any[]>([]);
   const [lastItemFetchedTimestamp, setLastItemFetchedTimestamp] = useState<Date | null>(null);
   const [docID, setDocID] = useState<string>();

   const dimensions = useWindowDimensions();

   const navigation = useNavigation();

   useEffect(() => {
      if(itemsList.length == 0) fetchItems(null)
   }, []);

   const styles = (dimensions: ScaledSize) => StyleSheet.create({
      exchangeButtonContainer: {
         height: '50%',
         width: dimensions.width * 0.2
      },
      divider: {
         backgroundColor: 'rgba(0,0,0,0.3)'
      }
   })

   const fetchItems = (lastItemFetchedTimestamp?: Date | null) => {
      try {
         let dbRef;
         lastItemFetchedTimestamp != null ?
         dbRef = database.collection(GLOBALS.firebase.firestore.collections.names.itemsToExchange).where('sent', '==', false).orderBy('timeStamp').startAfter(lastItemFetchedTimestamp).limit(1)
         :
         dbRef = database.collection(GLOBALS.firebase.firestore.collections.names.itemsToExchange).where('sent', '==', false).limit(1)

         dbRef
            .onSnapshot(snapshot => {
               let dataList = [];
               dataList = snapshot.docs.map(doc => {
                  let data = doc.data();
                  data['docID'] = doc.id
                  return data;
               }); 
               console.log(dataList);
               setItemsList(oldList => {
                  oldList.push(...dataList);
                  return oldList;
               });
               if(dataList.length > 0) setLastItemFetchedTimestamp((oldTimestamp) => dataList[dataList.length - 1].timeStamp);
            })
      } catch (e) {
         alert(`Some error Occurred in fetching the data!`);
         console.log(e);
      }
   }

   const renderItem = ({ item, index }) => {
      return (
         <View>
            <View>
               <List.Item
                  theme={{
                     colors: {
                        text: 'black'
                     }
                  }}
                  left={(prop) => <List.Icon icon='table-furniture' color='black'/>}
                  right={(prop) => (
                     <View style={styles(dimensions).exchangeButtonContainer}>
                        <CustomButton
                           buttonText='Exchange'
                           buttonTextColor='white'
                           buttonColor='red'
                           onPress={() => exchangeItem(item)}
                        />
                     </View>
                  )}
                  title={item.name}
                  description={item.description}
               />
               <Divider style={styles(dimensions).divider} />
            </View>
         </View>
      );
   }

   const exchangeItem = (item: any) => {
      props.navigation.navigate('itemDetailScreen', {item: item, navigation: props.navigation});
   }

   let onEndReachedCalledDuringMomentum = true;

   return (
      <View>
         <CustomAppBar title='Exchange Screen' color='#ffca28' drawerAvailable={true}/>
         <View>
            <FlatList
               data={itemsList}
               renderItem={renderItem}
               keyExtractor={(item, index) => index.toString()}
               onEndReachedThreshold={7}
               onEndReached={() => {
                  if(!onEndReachedCalledDuringMomentum) fetchItems(lastItemFetchedTimestamp)
               }}
               onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
            />
         </View>
      </View>
   )
}

export default ExchangeScreen;