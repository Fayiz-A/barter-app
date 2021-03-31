import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ColorValue } from 'react-native';
import { Appbar, Badge } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import database from '../configs/firebase.config';
import globals from '../constants/globals';
import firebase from 'firebase';

interface Props {
   title:string,
   color?: ColorValue,
   drawerAvailable?: boolean,
   backButtonAvailable?: boolean,
   displayNotifications?: boolean
}

export default function CustomAppBar(props: Props) {

   const [notificationCount, setNotificationCount] = useState<number>(0);
   
   const navigation = useNavigation();
   
   useEffect(() => {
      if(props.displayNotifications) {
         database.collection(globals.firebase.firestore.collections.names.notifications).where('receiverID', '==', firebase.auth().currentUser?.email).where('read', '==', false).onSnapshot(snapshot => {
            let notificationList = snapshot.docs.map(doc => doc.data());
            setNotificationCount(notificationList.length);
         });
      }
   })

   return(
      <Appbar.Header
         style={{backgroundColor: props.color ? props.color:'#6d4c41'}}
      >
         {
            props.drawerAvailable ? <Appbar.Action 
               icon={'menu'}
               size={30}
               onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
            />
            :
            props.backButtonAvailable ? <Appbar.Action 
               icon={'chevron-left'}
               size={30}
               onPress={() => {
                  if(navigation.canGoBack()) navigation.goBack()
               }}
            />
            :
            <View></View>
         }
         <Appbar.Content 
            title={props.title} 
            style={{alignItems: "center"}}
         />
         {
            props.displayNotifications ? <View>
               <Appbar.Action 
                  icon={'bell'}
                  size={30}
                  onPress={() => navigation.navigate('notificationsScreen')}
               />
               <Badge style={styles.badge} visible={true}>{notificationCount.toString()}</Badge>
            </View>
            :
            <View></View>
         }
      </Appbar.Header>
   );
}

CustomAppBar.defaultProps = {
   displayNotifications: true
};

const styles = StyleSheet.create({
   centerComponent: {
      fontSize: 20
   },
   badge: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'red'
   }
})