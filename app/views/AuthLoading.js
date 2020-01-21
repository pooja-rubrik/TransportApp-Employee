import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native';
import StorageService from '../services/StorageService';
// import ApiService from '../services/ApiService';

class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }


    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        StorageService.retrieveData('okta_data').then( data => {
            // console.log('users_dataaaa>>', data);
            const userToken = data ? JSON.parse(data).accessToken : {};
            const userType = data ? JSON.parse(data).userType : ''
            console.log('userToken>>',userToken, userType);
            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            
            this.props.navigation.navigate(
                userToken && Object.entries(userToken).length !== 0 && userType == 'EMPLOYEE' ? 'EmpApp' 
                // : userToken && Object.entries(userToken).length !== 0 && userType == 'Driver Login' ? 'DriverApp'
                : userToken && Object.entries(userToken).length !== 0 && userType == 'ADMIN' ? 'AdminApp'
                :'Auth');
        });
        
        
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
export default AuthLoadingScreen;