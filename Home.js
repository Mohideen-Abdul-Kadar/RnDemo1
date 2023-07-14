import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
const Home = () => {
  const [userInfo, setUserInfo] = useState();
  const [info, setinfo] = useState();
  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId:
      '73452624038-45c3dvsi82eachesjhn7fv8fnvmtqc8k.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    profileImageSize: 120,
  });
  const signIn = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.signIn();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signInSilently();
      console.log(userInfo);
      console.log(userInfo?.user?.email);
      console.log(userInfo?.user?.name);
      const response = await axios.post(
        'http://192.168.101.26:3001/api/login',
        {
          email: userInfo?.user?.email,
        },
      );
      console.log(response.data.token);
      // console.log(userInfo);
      // setinfo(response);
      setUserInfo({userInfo});
    } catch (error) {
      console.log(error, 'errrrrrrrrrr');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      }
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo({user: null});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
      <Text style={styles.text}>Name: {userInfo?.userInfo?.user?.name}</Text>
      <Text style={styles.text}>Email: {userInfo?.userInfo?.user?.email}</Text>
      <Text style={styles.text}>
        Family Name: {userInfo?.userInfo?.user?.familyName}
      </Text>
      <Text style={styles.text}>
        GivenName: {userInfo?.userInfo?.user?.givenName}
      </Text>
      {/* <FlatList
        data={userInfo}
        renderItem={({item}) => <Text style={styles.text}>{item.scopes}</Text>}
        keyExtractor={item => item.id}
      /> */}
      <TouchableOpacity onPress={signOut} style={styles.con}>
        <Text style={[styles.text, {color: 'white'}]}>SIGN-OUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    left: 10,
    color: '#000',
  },
  con: {
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 6,
    padding: 5,
    backgroundColor: 'black',
    marginTop: 20,
    width: '40%',
    alignSelf: 'center',
  },
});

//https://192.168.101.17:3001/users
