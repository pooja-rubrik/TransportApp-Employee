import React, { Component } from "react";
import {
	StyleSheet,
	Platform, Alert,
	View,
} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { signOut, EventEmitter, createConfig } from '@okta/okta-react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';

import { PaperMenu2 } from '../components/HeaderDropdowniOS';
import { HeaderMenu, Item } from '../components/HeaderDropdownAndroid';
import Wallpapers from "../components/Wallpaper";
import Constants from '../services/Constants';
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import { deviceType } from '../stylesheets/AppDimensions';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';

const platform = Platform.OS;

class AdminHome extends Component {
    constructor(props) {
        super(props);
        // StorageService.removeData('okta_data')
        this.usersStore =  this.props.rootStore.usersStore;
        this.userType = this.usersStore.users.oktaDetail.userType;
    }

    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		if (platform == 'ios' && deviceType == 'ipad') {
			return {
				header: <PaperMenu2 onPressProfile={() => params.logout()} navigation={navigation} />,
				headerLeft: null
			};
		} else {
			return {
				headerRight: (
					<HeaderMenu>
						<Item title="Logout" show="never" onPress={() => params.logout()} />
					</HeaderMenu>
				),
				headerLeft: null
			};
		}

    };
    
    componentDidMount() {
		this.props.navigation.setParams({
			logout: this.logoutProfile
        });
        //okta config and callbacks
		createConfig({
			clientId: `${Constants.CLIENTID}`,
			redirectUri: `${Constants.REDIRECT_URL}`,
			endSessionRedirectUri: `${Constants.ENDSESSION_URL}`,
			discoveryUri:`${Constants.DISCOVERY_URL}`,
			scopes: Constants.SCOPE,
			requireHardwareBackedKeyStore: true
		});
        this.signOutSuccess = EventEmitter.addListener('signOutSuccess', (e: Event) => {
            console.log('sign out>>', e)
            StorageService.removeData('okta_data').then( data => {
				ApiService.removeHeader();
				this.props.navigation.navigate('LoginScreen', { 'pageName': this.userType} );
			})
			
		});
		this.onError = EventEmitter.addListener('onError', (e: Event) => {
			console.log('error in okta login>', e)
			Alert.alert('User has cancelled');
		});
		this.onCancelled = EventEmitter.addListener('onCancelled', (e: Event) => {
			console.log('user has cancelled', e)
			Alert.alert('Failed to log in', e.error_message);
		});
    }

    //okta logout
    logoutProfile = () => {
		signOut();
    }

    //navigate admin menu
    navigateAdmin = (pageName, param) => {
        this.props.navigation.navigate(pageName, param);
    }
    
    render() {
        return(
            <Wallpapers>
                <View style={styles.rootContainer}>
                    <View style={styles.btnContainer}>
                        <RaisedTextButton
                            title={STRCONSTANT.LOGIN_BTN_ADMIN}
                            color={ COLOR.BUTTON_COLOR }
                            titleColor = { COLOR.BUTTON_FONT_COLOR }
                            onPress={() => this.navigateAdmin('AdminLoginLogoutScreen', {pageName: 'Assign Login'})}
                            style={styles.btnStyle}
                            titleStyle={{ fontSize: 16}}
                        />
                        <RaisedTextButton
                            title={STRCONSTANT.LOGOUT_BTN_ADMIN}
                            color={ COLOR.BUTTON_COLOR }
                            titleColor = { COLOR.BUTTON_FONT_COLOR }
                            onPress={() => this.navigateAdmin('AdminLoginLogoutScreen', {pageName: 'Assign Logout'})}
                            style={styles.btnStyle}
                            titleStyle={{ fontSize: 16}}
                        />
                    </View>
                    <View style={styles.btnContainer}>
                        <RaisedTextButton
                            title={STRCONSTANT.DRIVER_LIST_ADMIN}
                            color={ COLOR.BUTTON_COLOR }
                            titleColor = { COLOR.BUTTON_FONT_COLOR }
                            onPress={() => this.navigateAdmin('AdminDriverListScreen')}
                            style={styles.btnStyle}
                            titleStyle={{ fontSize: 16}}
                        />
                        <RaisedTextButton
                            title={STRCONSTANT.EMPLOYEE_LIST_ADMIN}
                            color={ COLOR.BUTTON_COLOR }
                            titleColor = { COLOR.BUTTON_FONT_COLOR }
                            onPress={() => this.navigateAdmin('AdminEmpListScreen')}
                            style={styles.btnStyle}
                            titleStyle={{ fontSize: 16}}
                        />
                    </View>
                </View>
                
            </Wallpapers>
        )
    }
}

export default inject("rootStore")(observer(AdminHome));

const styles = StyleSheet.create({
    rootContainer:{
        top:120
    },
	btnContainer: {
		width: wp('90%'),
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop:30
    },
    btnStyle: {
        width: wp('42%'),
        height: wp('40%'),
        borderRadius: 20,
        marginRight: wp('7%')
    }
})