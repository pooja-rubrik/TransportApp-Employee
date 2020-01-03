import React, { Component } from "react";
import {
	StyleSheet,
	Platform, Alert,
	View, ScrollView
} from "react-native";
import { signOut, EventEmitter, createConfig } from '@okta/okta-react-native';
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import { FAB } from 'react-native-paper';

import { HeaderMenu, Item } from '../components/HeaderDropdownAndroid';
import Constants from '../services/Constants';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';
import { AppAlert } from '../components/Alert';
import AdminTab from '../components/AdminTabs';
import AdminSubSections from '../components/AdminSubSections';
import EmpHomeData from '../components/EmpHomeData';
import AdminSignupModal from '../components/AdminSignupModal';

const platform = Platform.OS;

class AdminHomeNew extends Component {
    constructor(props) {
        super(props);
        // StorageService.removeData('okta_data')
		this.usersStore =  this.props.rootStore.usersStore;
		this.adminStore = this.props.rootStore.adminStore;
		this.admId = this.usersStore.users.empDetail.empID;
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
		adminSubTab: 'cab-status',
		confirmAction: 'confirm',
		otherAdmId: 0,
		adminModalVisible: false,
    };

    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		
        return {
            headerRight: (
                <HeaderMenu>
                    <Item title="Opt Out" show="never" onPress={() => params.optOut()} />
                    <Item title="Sign Out" show="never" onPress={() => params.logout()} />
                </HeaderMenu>
            ),
            title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
            
        };

    };
    componentDidMount() {
		console.log('utilities>>>', toJS(this.utilities));
		this.props.navigation.setParams({ title: 'Cab Status' })
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
			this.loginRedirect();
			
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
	
	loginRedirect = () => {
		StorageService.removeData('okta_data').then( data => {
			ApiService.removeHeader();
			this.props.navigation.navigate('LoginScreen' );
		})
	}
    
    logoutProfile = () => {
		console.log('logout');
		signOut();
    }
    
    optOutEmp = () => {
		this.setState({'confirmAction': 'optout'})
		this.showAlert('optout')
	}
	
	closeModalFunc = (visible) => {
		console.log('parent visible>>>', visible)
		this.setState({ adminModalVisible: visible });
	}


	submitSignup = (data) => {
		this.usersStore.registerUser(this.usersStore.users.oktaDetail.userType, data).then(()=> {
			console.log('signup>>>',toJS(this.usersStore.users.empDetail));
			if(this.usersStore.users.empDetail.code == 200 || this.usersStore.users.empDetail.code == 201){
				this.setState({adminModalVisible: false})
				
				this.setState({adminTabVisible: true, adminSubTab: 'cab-status'})
				setTimeout(()=>{
					this.setState({adminSubTab: 'admin-list'})
				}, 1000)
				
				// this.setState({'errorText': 'User profile has been created'})
				// this.showAlert('error')
				
			}
		});
	}

    showAlert = (type) => {
		console.log(this.state.otherAdmId);
		if (type == 'error') {
			this.setState({
				showAlertError: true,
				showConfirm: false,
				errorText: this.state.errorText,
				alertTitle: 'Oops!'
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
		} else if(type == 'confirmDelete') {
			this.setState({
				showAlertError: true,
				showConfirm: true,
				errorText: 'Please confirm if you want to delete admin!', 
				alertTitle: 'Confirm!'
			});
		} else if(type == 'confirmDeleteDriver') {
			this.setState({
				showAlertError: true,
				showConfirm: true,
				errorText: 'Please confirm if you want to delete driver!', 
				alertTitle: 'Confirm!'
			});
		} else {
			this.setState({
				showAlertLoader: true
			});
		}

	};

	confirmBtnAlert = () => {
		this.hideAlert(this.state.confirmAction)
		if( this.state.confirmAction == 'optout' ) {
			this.usersStore.removeEmp(this.admId).then(() => {
				console.log(toJS(this.usersStore.users.remove))
				if(this.usersStore.users.remove && this.usersStore.users.remove.status == 'Deleted') {
					setTimeout(()=>{
						this.loginRedirect();
					}, 2000)
					this.setState({ errorText: 'Admin has been Opted out successfully.'})
            		this.showAlert('error')
				} else {
					Alert.alert(this.usersStore.users.remove.message ? this.usersStore.users.remove.message : 'Something went wrong')
				}
			})
		} else if( this.state.confirmAction == 'confirmDelete' ) {
			// Alert.alert('confirm')otherAdmId
			// console.log(this.state.otherAdmId)
			this.usersStore.removeEmp(this.state.otherAdmId).then(() => {
				console.log(toJS(this.usersStore.users.remove))
				
				if(this.usersStore.users.remove.status == 'Deleted') {
					this.setState({adminSubTab: 'cab-status'})
					setTimeout(()=>{
						this.setState({adminSubTab: 'admin-list'})
					}, 1000)
					// this.setState({ errorText: 'Admin has been deleted successfully.'})
            		// this.showAlert('error')
				} else {
					// this.hideAlert(this.state.confirmAction);
					Alert.alert(this.usersStore.users.remove.message ? this.usersStore.users.remove.message : 'Something went wrong')
				}
			})
		} else if( this.state.confirmAction == 'confirmDeleteDriver' ) {
			console.log( 'vehicle no:',this.state.otherAdmId );
			this.adminStore.removeDriver(this.state.otherAdmId).then(()=> {
				console.log(toJS(this.adminStore.adminData.removeDriver))
				if(this.adminStore.adminData.removeDriver.status == 'Deleted') {
					this.setState({adminSubTab: 'cab-status'})
					setTimeout(()=>{
						this.setState({adminSubTab: 'driver-list'})
					}, 1000)
					// Alert.alert('Driver has deleted successfully.');
				} else {
					Alert.alert(this.adminStore.adminData.removeDriver.message ? this.adminStore.adminData.removeDriver.message : 'Something went wrong')
				}
			});
		}
	}

	hideAlert = (type) => {
		if (type == 'error') {
			this.setState({
				showAlertError: false
			});
        } else if(type == 'confirm' || type == 'optout' || type == 'confirmDelete' || type == 'confirmDeleteDriver') { 
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
		this.setState(tab == 'admin'? {adminTabVisible: true, adminSubTab: 'cab-status'} : {adminTabVisible: false, adminSubTab: '' })
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
				title: tab == 'cab-status' ? 'Cab Status': 
						tab == 'emp-list' ? 'Employee List' : 
						tab == 'driver-list' ? 'Driver List' : 
						'Admin List' 
			})
	}
	
	refreshDriverList = () => {
		console.log('refresh driver list>>>');
		this.setState({adminTabVisible: true, adminSubTab: 'cab-status'})
		setTimeout(()=>{
			this.setState({adminSubTab: 'driver-list'})
		}, 1000)
		
	}
	
	addDriver = () => {
		this.props.navigation.navigate('DriverRegisterScreen',{refreshDriverList: this.refreshDriverList});
	}

	addAdmin = () => {
		this.setState({adminModalVisible: true})
	}

	showAlertChild = (type, admid) => {
		console.log(admid);
		this.setState({'confirmAction': type, 'otherAdmId': admid})
		this.showAlert(type);
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
						<AdminSubSections adminSubTab = {adminSubTab} adminSubSwitch = {this.adminSubSwitch} addDriver = {this.addDriver} showAlertChild ={this.showAlertChild}/>
					</ScrollView>
					
					: <EmpHomeData />
				}
				{
					adminSubTab == 'driver-list'?
					<FAB
						style={styles.fab}
						size={18}
						icon = 'person-add'
						theme={{ colors: { accent: '#C9004F' } }}
						onPress={() => this.addDriver()}
					/> :  adminSubTab == 'admin-list'?
					<FAB
						style={styles.fab}
						size={18}
						icon = 'person-add'
						theme={{ colors: { accent: '#C9004F' } }}
						onPress={() => this.addAdmin()}
					/> :
					null
				}
                
                <AdminSignupModal adminModalVisible = {this.state.adminModalVisible} closeModalFunc = {this.closeModalFunc} submitSignup = {this.submitSignup}/>
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
	fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 20,
      
    },
})
export default inject("rootStore")(observer(AdminHomeNew));