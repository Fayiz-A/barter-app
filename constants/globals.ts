export default {
   firebase: {
      firestore: {
         collections: {
            names: {
               users: 'users',
               itemsToExchange: 'itemsToExchange',
               barters: 'barters',
               notifications: 'notifications'
            },
            users: {
               names: {
                  name: 'name',
                  emailID: 'emailID'
               }
            },
            barters: {
               names: {
                  donorID: 'donorID',
               }
            }
         }
      }
   }
}