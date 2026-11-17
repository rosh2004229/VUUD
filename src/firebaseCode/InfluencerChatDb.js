import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import moment from 'moment';

var usersCollection;
var onValueChange;

function InfluencerChatDb() {
  // { route, navigation }
  // const {userObj} = route.params;

  useEffect(() => {
    getUserIdAndInit();
    // Stop listening for updates when no longer required
    return () => usersCollection.off('value', onValueChange);
  }, []);

  const getUserIdAndInit = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    console.log('db user_id ===> ', user_id);

    usersCollection = database().ref(`/users/${user_id}`);

    onValueChange = usersCollection.on('value', (snapshot) => {
      console.log('User data: ', snapshot.val());
    });

    usersCollection
      .set({
        user_id: user_id,
        name: 'My name',
        profile_pic: '',
      })
      .then(() => console.log('Data set.'));

    const newReference = database().ref('/messages').push();
    console.log('Auto generated key: ', newReference.key);
    newReference
      .set({
        date: moment().format('DD-MM-yyyy'),
        message: 'Hello',
        type: 'text', // text/image
        from: user_id,
        to: '1',
      })
      .then(() => console.log('Data updated.'));
  };

  return null;
}

export default InfluencerChatDb;
