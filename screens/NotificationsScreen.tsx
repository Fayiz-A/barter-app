import React, { useState, useEffect } from 'react';
import { View, Text, ScaledSize, useWindowDimensions, StyleSheet, Animated } from 'react-native';
import CustomAppBar from '../components/CustomAppBar';
import { List, Divider } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import { SwipeListView } from 'react-native-swipe-list-view';
import database from '../configs/firebase.config';
import GLOBALS from '../constants/globals';
import firebase from 'firebase';
import { ListItem, Icon } from 'react-native-elements';

function NotificationsScreen() {

   const [notifications, setNotifications] = useState<any[]>([]);

   const dimensions = useWindowDimensions();

   useEffect(() => {

      let notificationsList: any[] = [];

      let currentUserEmail: string | null | undefined = firebase.auth().currentUser?.email;

      try {
         const firestore = GLOBALS.firebase.firestore;

         if (onEndReachedCalledDuringMomentum) {
            if (currentUserEmail) {
               database.collection(firestore.collections.names.notifications).where('receiverID', '==', currentUserEmail).where('read', '==', false)
                  .onSnapshot((snapshot) => {
                     snapshot.docs.map(doc => {
                        let data = doc.data();
                        notificationsList.push(data);
                     });

                     setNotifications(notificationsList);
                  });
            } else {
               alert(`User not signed in`);
            }
         }

      } catch (e) {
         console.error(e);
         alert(`Some error occurred in fetching the barters`);
      }

   }, []);

   const styles = (dimensions: ScaledSize) => StyleSheet.create({
      rowBehind: {
         alignItems: "center",
         backgroundColor: "#29b6f6",
         flex: 1,
         flexDirection: "row",
         justifyContent: "space-between",
         paddingLeft: 15
      },
      container: {
         backgroundColor: "white",
         flex: 1
      },
      backTextWhite: {
         color: "#FFF",
         fontWeight: "bold",
         fontSize: 15,
         textAlign: "center",
         alignSelf: "flex-start"
      },
      rowBack: {
         alignItems: "center",
         backgroundColor: "#29b6f6",
         flex: 1,
         flexDirection: "row",
         justifyContent: "space-between",
         paddingLeft: 15
      },
      backRightBtn: {
         alignItems: "center",
         bottom: 0,
         justifyContent: "center",
         position: "absolute",
         top: 0,
         width: 100
      },
      backRightBtnRight: {
         backgroundColor: "#29b6f6",
         right: 0
      }
   })

   const markNotificationAsReadAndRemoveItem = (swipeData) => {

      const { key, value } = swipeData;

      if ((value > dimensions.width || value < -dimensions.width) && notifications[key] != undefined) {
         let docID: string = notifications[key].docID;

         let newData = [...notifications];

         newData.splice(key, 1);
         setNotifications(newData);
         database.collection(GLOBALS.firebase.firestore.collections.names.notifications).doc(docID).update({
            read: true
         })
      }

   }

   const renderItem = ({ item, index }) => {
      return (
         <Animated.View>
            <ListItem
               key={index}
               bottomDivider
            >
               <ListItem.Chevron>
                  <Icon name="notification" type="font-awesome" color='#696969' size={50} />
               </ListItem.Chevron>
               <ListItem.Content>
                  <ListItem.Title style={{ color: 'black', fontWeight: 'bold' }}>{item.itemName}</ListItem.Title>
                  <ListItem.Subtitle>{'Donor interested'}</ListItem.Subtitle>
               </ListItem.Content>
            </ListItem>
            <Divider />
         </Animated.View>
      )
   }

   const renderHiddenItem = () => {
      return (
         <View style={styles(dimensions).rowBack}>
            <View style={[styles(dimensions).backRightBtn, styles(dimensions).backRightBtnRight]}>
               <Text style={styles(dimensions).backTextWhite}>Mark as read</Text>
            </View>
         </View>
      );
   }

   let onEndReachedCalledDuringMomentum = true;

   return (
      <View>
         <CustomAppBar title='Notifications Screen' drawerAvailable={true} />
         <View>
            <SwipeListView
               data={notifications}
               keyExtractor={(item, index) => index.toString()}
               renderItem={renderItem}
               disableLeftSwipe
               leftOpenValue={dimensions.width}
               renderHiddenItem={renderHiddenItem}
               onSwipeValueChange={markNotificationAsReadAndRemoveItem}
               onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
               previewRowKey={"0"}
               previewOpenValue={-40}
               previewOpenDelay={3000}
            />
         </View>
      </View>
   );
}

export default NotificationsScreen;