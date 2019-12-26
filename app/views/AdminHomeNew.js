import React, { Component } from "react";
import {
	StyleSheet,
	Platform, Alert,
	View, ScrollView
} from "react-native";
import { signOut, EventEmitter, createConfig } from '@okta/okta-react-native';
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';

import { HeaderMenu, Item } from '../components/HeaderDropdownAndroid';
import Constants from '../services/Constants';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';
import { AppAlert } from '../components/Alert';
import AdminTab from '../components/AdminTabs';
import AdminSubSections from '../components/AdminSubSections';
import EmpHomeData from '../components/EmpHomeData';

const platform = Platform.OS;

class AdminHomeNew extends Component {
    constructor(props) {
        super(props);
        // StorageService.removeData('okta_data')
        this.usersStore =  this.props.rootStore.usersStore;
    }

    state = {
        showAlertError: false,
        showAlertLoader: false,
        errorText: '',
        alertTitle: 'Oops!',
        showConfirm: false,
        showCancel: true,
        checkInTabVisible: true,
        adminTabVisible: true,
        adminSubTab: 'cab-status'
    };

    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		
        return {
            headerRight: (
                <HeaderMenu>
                    <Item title="OPT OUT" show="never" onPress={() => params.optOut()} />
                    <Item title="SIGNOUT" show="never" onPress={() => params.logout()} />
                </HeaderMenu>
            ),
            title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
            
        };

    };
    componentDidMount() {
		console.log('utilities>>>', toJS(this.utilities));
		this.props.navigation.setParams({ title: 'CAB STATUS' })
		this.props.navigation.setParams({
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
			StorageService.removeData('okta_data').then( data => {
				ApiService.removeHeader();
				this.props.navigation.navigate('LoginScreen' );
			})
			
		});
		this.onError = EventEmitter.addListener('onError', (e: Event) => {
			console.log('error in okta login>', e)
			this.setState({ errorText: 'User has cancelled'})
            this.showAlert('error')
		});
		this.onCancelled = EventEmitter.addListener('onCancelled', (e: Event) => {
			this.setState({ errorText: 'Failed to log in' + e.error_message})
            this.showAlert('error')
		});
    }
    
    logoutProfile = () => {
		signOut();
    }
    
    optOutEmp = () => {
		this.setState({'confirmAction': 'confirm'})
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

    adminSwitch = (tab) => {
        this.setState({
			adminTabVisible: (tab=='admin') ? true : false,
		})
    }

    tabSwitch = (tab) => {
		this.setState({
			checkInTabVisible: (tab=='checkin') ? true : false,
		})
		
    }

    adminSubSwitch = (tab) => {
        this.setState({
			adminSubTab: tab,
		})
	
		this.props.navigation.setParams(
			{ 
				title: tab == 'cab-status' ? 'CAB STATUS': 
						tab == 'emp-list' ? 'EMPLOYEE LIST' : 
						tab == 'driver-list' ? 'DRIVER LIST' : 
						'ADMIN LIST' 
			})
    }
    
    render() {
        let { 
             showAlertError, showAlertLoader, errorText, alertTitle, showCancel, 
            showConfirm, adminTabVisible, adminSubTab
       } = this.state;
        return(
            <View style={styles.mainContainer}>
				<AdminTab adminTabVisible = {adminTabVisible} adminSwitch = {this.adminSwitch}/>
				{
					adminTabVisible?
					<ScrollView>
						<AdminSubSections adminSubTab = {adminSubTab} adminSubSwitch = {this.adminSubSwitch} />
					</ScrollView>
					
					: <EmpHomeData />
				}
                
                
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
}
const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
    },
})
export default inject("rootStore")(observer(AdminHomeNew));