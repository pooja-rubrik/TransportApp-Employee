import React, { Component } from "react";
// import { createAppContainer } from 'react-navigation';
import {
  StatusBar, Alert, Text
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// import Geocoder from 'react-native-geocoding';

import RootStore, { Provider } from './app/mobx/store';
import RootNavigator from './app/RootNavigator';
import { firebase } from '@react-native-firebase/messaging';

const rootStore = new RootStore();

// const AppContainer = createAppContainer(RootNavigator);

class App extends Component {

  constructor (props) {
    super(props)
    Text.defaultProps = Text.defaultProps || {}
    Text.defaultProps.style =  { fontFamily: 'Helvetica' }
  }

	async componentDidMount() {
		console.log('component mounted>>>>API', rootStore.mapStore.mapData.currentAPIKey );
    SplashScreen.hide();
      // Geocoder.init(rootStore.mapStore.mapData.currentAPIKey);
      await rootStore.usersStore.getAllEmployee();
      await rootStore.usersStore.getUtility();
      this.checkPermission();
      // this.messageListener();
  }
  
  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getFcmToken();
    } else {
        this.requestPermission();
    }
  }
  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log('token fcm>>>>',fcmToken);
      this.showAlert('Your Firebase Token is:', fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  }
  requestPermission = async () => {
    try {
      const perm = await firebase.messaging().requestPermission();
      // this.showAlert('');
      // User has authorised
    } catch (error) {
      console.log(error);
      // this.showAlert('Your Firebase Token is:', error);
        // User has rejected permissions
    }
  }
  messageListener = async () => {
    this.notificationListener = firebase.messaging().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    this.notificationOpenedListener = firebase.messaging().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    const notificationOpen = await firebase.messaging().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
  
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  }
  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }
  
  onCLose = () => {
    StatusBar.setHidden(true);
  };

  render() {
      return (
    <Provider 
      rootStore={rootStore}
    >
      <RootNavigator />
    </Provider>
      );
  }
}

export default App