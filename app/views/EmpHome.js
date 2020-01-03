import React, { Component } from 'react';
import {
	StyleSheet,
	Platform, Alert,
	View, 
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { signOut, EventEmitter, createConfig } from '@okta/okta-react-native';

import Constants from '../services/Constants';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';
import { HeaderMenu, Item } from '../components/HeaderDropdownAndroid';
import { AppAlert } from '../components/Alert';
// import MaterialIconsCom from 'react-native-vector-icons/MaterialCommunityIcons';

import EmpHomeData from '../components/EmpHomeData';

const platform = Platform.OS;

class EmpHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
			showAlertError: false,
			showAlertLoader: false,
			errorText: '',
			alertTitle: 'Oops!',
			showConfirm: false,
			showCancel: true,
			confirmAction: 'confirm',
		};
		this.usersStore =  this.props.rootStore.usersStore;
        this.empID = this.usersStore.users.empDetail.empID;
    }

    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		
        return {
            headerRight: (
                <HeaderMenu>
                    <Item title="Opt Out" show="never" onPress={() => params.optOut()} />
                    <Item title="Sign Out" show="never" onPress={() => params.logout()} />
                </HeaderMenu>
            ),
            
        };

    };
    
	componentDidMount() {
		console.log('utilities>>>', toJS(this.utilities));
		this.props.navigation.setParams({
			// handleMenu: this.navigateMenu,
            logout: this.logoutProfile,
            optOut: this.optOutEmp,
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
			// StorageService.removeData('okta_data').then( data => {
			// 	ApiService.removeHeader();
			// 	this.props.navigation.navigate('LoginScreen' );
			// })
			this.loginRedirect();
			
		});
		this.onError = EventEmitter.addListener('onError', (e: Event) => {
			console.log('error in okta login>', e)
			this.setState({ errorText: 'User has cancelled'})
            this.showAlert('error')
		});
		this.onCancelled = EventEmitter.addListener('onCancelled', (e: Event) => {
			console.log('Failed to log in', e)
			this.setState({ errorText: 'Failed to log in' + e.error_message})
            this.showAlert('error')
		});

		// //get lat longs from string address
		// this.setMapMarker();
		
		// //set daily login data
		// this.setDailyLogin();
		
		//set daily logout data
		// this.setDailyLogout();
	}

	// navigateMenu = (pageName) => {
	// 	this.props.navigation.navigate(pageName);
	// }

	logoutProfile = () => {
		signOut();
	}
	
    loginRedirect = () => {
		StorageService.removeData('okta_data').then( data => {
			ApiService.removeHeader();
			this.props.navigation.navigate('LoginScreen' );
		})
	}
    
    optOutEmp = () => {
		this.setState({'confirmAction': 'optout'})
		this.showAlert('optout')
	}
	
	showAlert = (type) => {
		if (type == 'error') {
			this.setState({
				showAlertError: true
			});
		} else if(type == 'confirm') {
			this.setState({
				showAlertError: true,
				showConfirm: true,
				errorText: 'Do you want to logout?', 
				alertTitle: 'Confirm!'
			});
			
		} else if(type == 'optout') {
			this.setState({
				showAlertError: true,
				showConfirm: true,
				errorText: 'Please confirm if you want to opt out of cab service. You will not be assigned cab from tomorrow onwards.', 
				alertTitle: 'Confirm!'
			});
		} else {
			this.setState({
				showAlertLoader: true
			});
		}

	};

	hideAlert = (type) => {
		if (type == 'error') {
			this.setState({
				showAlertError: false
			});
        } else if(type == 'confirm') { 
            this.setState({
				showAlertError: false
			});
			//logic of logout
		} else {
			this.setState({
				showAlertLoader: false
			});
		}
    };

	

	// openUrl = () => {
	// 	console.log('open url>>');
	// 	this.props.navigation.navigate('ProfileScreen');
	// }

	confirmBtnAlert = () => {
		console.log('data>>', data)
		this.hideAlert('confirm');
		if( this.state.confirmAction == 'optout' ) {
			this.usersStore.removeEmp(this.empID).then(() => {
				console.log(toJS(this.usersStore.users.remove))
				if(this.usersStore.users.remove.status == 'Deleted') {
					setTimeout(()=>{
						this.loginRedirect();
					}, 2000)
					// this.setState({ errorText: 'Admin has been Opted out successfully.'})
            		// this.showAlert('error')
				} else {
					Alert.alert(this.usersStore.users.remove.message ? this.usersStore.users.remove.message : 'Something went wrong')
				}
			})
		} 
		
	}

    render() {
		let { showAlertError, showAlertLoader, errorText,
			alertTitle, showCancel, showConfirm,} = this.state;
        return (
			<View style={styles.mainContainer}>
				<EmpHomeData />
				<AppAlert
					show={showAlertError}
					showProgress={false}
					title={alertTitle}
					message={errorText}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={true}
                    showCancelButton={showCancel}
                    showConfirmButton={showConfirm}
                    cancelText="Cancel"
                    confirmText="Okay"
					cancelButtonColor="red"
					confirmButtonColor = "#59997E"
					onCancelPressed={() => {
						this.hideAlert('error');
                    }}
                    onConfirmPressed={(data) => { this.confirmBtnAlert()}}
					contentContainerStyle = {{backgroundColor: '#317770'}}
					messageStyle = {{color: '#fff'}}
					titleStyle = {{color: '#fff'}}
				/>
				<AppAlert
					show={showAlertLoader}
					showProgress={true}
					title="Loading.."
					closeOnTouchOutside={false}
					closeOnHardwareBackPress={false}
				/> 
			</View>
            
        )
    }
    componentWillUnmount() {
		this.signOutSuccess.remove();
		this.onError.remove();
		this.onCancelled.remove();
	}

}
const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
    },
	
})
export default inject("rootStore")(observer(EmpHome));