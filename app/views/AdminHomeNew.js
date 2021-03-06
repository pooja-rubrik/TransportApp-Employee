import React, { Component } from "react";
import {
	StyleSheet, Alert,
	View, Platform
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
import Color from '../services/AppColor'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
// import Ionicons from 'react-native-vector-icons/Ionicons';
const platform = Platform.OS;

class AdminHomeNew extends Component {
    constructor(props) {
        super(props);
        // StorageService.removeData('okta_data')
		this.usersStore =  this.props.rootStore.usersStore;
		this.adminStore = this.props.rootStore.adminStore;
		this.admId = this.usersStore.users.empDetail.empID;
		this.userType = this.usersStore.users.empDetail.userType;
		this.pickChangeData = {timePick:'', empid: ''}
		this.assignDriverData = {empid: '', selectedDriver: ''}
		this.empHomeData = { date: '', type :''}
    }

    state = {
        showAlertError: false,
        showAlertLoader: false,
        errorText: '',
        alertTitle: 'ERROR!',
        showConfirm: false,
        showCancel: true,
        checkInTabVisible: true,
        adminTabVisible: true,
		adminSubTab: 'cab-status',
		confirmAction: 'confirm',
		otherAdmId: 0,
		adminModalVisible: false,
		firstLaunch: null
    };

    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		console.log('userType>>>>>', navigation, params.userType )
        return {
            headerRight: (
                <HeaderMenu>
					{
						params.userType != 'SERVICE' ?
						<Item title="Opt Out of Employee Role" show="never" onPress={() => params.optOut('optoutEmp')} />
						: null
					}
                    {
						params.userType != 'SERVICE' ?
						<Item title="Opt Out of Admin Role" show="never" onPress={() => params.optOut('optoutAdmin')} />
						: null
					}
					{
						platform == 'android' ?
						<Item title="Profile" show="never" onPress={() => params.handleMenu('AdminProfileScreen')} />
						: null
					}
					{/* <Item title="Opt Out of All Roles" show="never" onPress={() => params.optOut('optoutAll')} /> */}
                    <Item title="Sign Out" show="never" onPress={() => params.logout()} />
                </HeaderMenu>
			),
			// headerLeft: <Ionicons 
			// 				name={'ios-refresh-circle'}
			// 				name={'ios-refresh-circle'} 
			// 				size={28} 
			// 				color="#fff"
			// 				style={styles.icon}
			// 				onPress={ () => { params.refreshPage() }} 
			// 			/>,
            title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
            
        };

    };
    componentDidMount() {
		console.log('utilities>>>', toJS(this.utilities));
		this.props.navigation.setParams({ title: 'Cab Status' })
		this.props.navigation.setParams({
			logout: this.logoutProfile,
			optOut: this.optOutEmp,
			userType: this.usersStore.users.empDetail.userType,
			handleMenu: this.navigateMenu,
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
		StorageService.retrieveData("alreadyLaunched").then(value => {
			console.log('check already launch>>', value)
            if(value){
				StorageService.storeData('alreadyLaunched', true); 
				this.setState({firstLaunch: true});
            }
            else{
                 this.setState({firstLaunch: false});
			}
		}) 
		
	}

	navigateMenu = (pageName) => {
		this.props.navigation.navigate(pageName);
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
    
    optOutEmp = (role) => {
		this.setState({ 'confirmAction': role })
		this.showAlert(role)
	}
	
	closeModalFunc = (visible) => {
		console.log('parent visible>>>', visible)
		this.setState({ adminModalVisible: visible });
	}


	submitSignup = (data) => {
		if(data.empID == '') {
			Alert.alert('Employee ID is required!')
		} else {
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
					
				} else {
					// this.setState({'errorText': 'Error'})
					// this.showAlert('error')
				}
			});
		}
	}

    showAlert = (type) => {
		console.log(this.state.otherAdmId, type);
		if (type == 'error') {
			this.setState({
				showAlertError: true,
				showConfirm: false,
				errorText: this.state.errorText,
				alertTitle: 'ERROR!'
			});
		} else if(type == 'confirm') {
			this.setState({
				showAlertError: true,
				showConfirm: true,
				errorText: 'Do you want to logout?', 
				alertTitle: 'Confirm!'
			});
			
		} else if(type == 'optoutEmp' || type == 'optoutAdmin' || type == 'pickChange' || type == 'driverAssign' || type == 'confirmHome') {
			this.setState({
				showAlertError: true,
				showConfirm: true,
				errorText: 'Press Okay to confirm!', 
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
		if( this.state.confirmAction == 'optoutEmp' ||  this.state.confirmAction == 'optoutAdmin' ) {
			let optoutType = this.state.confirmAction == 'optoutEmp' ? 'EMPLOYEE' : 'ADMIN';
			this.usersStore.removeEmp(this.admId, optoutType).then(() => {
				console.log(toJS(this.usersStore.users.remove))
				if(this.usersStore.users.remove && this.usersStore.users.remove.status == 'Deleted') {
					setTimeout(()=>{
						this.loginRedirect();
					}, 3000)
					this.setState({ errorText: 'Admin has been Opted out successfully.'})
            		this.showAlert('error')
				} else {
					Alert.alert(this.usersStore.users.remove.message ? this.usersStore.users.remove.message : 'Something went wrong')
				}
			})
		} else if( this.state.confirmAction == 'confirmDelete' ) {
			// Alert.alert('confirm')otherAdmId
			// console.log(this.state.otherAdmId)
			this.usersStore.removeEmp(this.state.otherAdmId, 'ADMIN').then(() => {
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
		} else if( this.state.confirmAction == 'pickChange' ) {
			this.child.callPickService(this.pickChangeData)
		} else if( this.state.confirmAction == 'driverAssign' ) {
			this.child.callDriverAssign(this.assignDriverData )
		} else if( this.state.confirmAction == 'confirmHome') {
			this.home.callConfirmAction(this.empHomeData);
		}
	}

	hideAlert = (type) => {
		if(type == 'error' || type == 'confirm' || type == 'optoutEmp' || type == 'optoutAdmin' || type == 'pickChange' || type == 'confirmDelete' || type == 'confirmDeleteDriver' || type == 'driverAssign' || type == 'confirmHome') { 
            this.setState({
				showAlertError: false
			});
			//logic of logout
		} else if(type == 'pickChangeCancel') {
			this.child.callPickService('cancel')
			this.setState({
				showAlertError: false
			});
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

	confirmPickChange = (timePick, empid) => {
		this.pickChangeData = {timePick, empid};
		this.setState({'confirmAction': 'pickChange'})
		this.showAlert('pickChange');
	}

	confirmDriverAssign = (empid, selectedDriver) => {
		console.log(empid);
		this.assignDriverData = {empid, selectedDriver}
		this.setState({'confirmAction': 'driverAssign'})
		this.showAlert('driverAssign');
	}

	showConfirmHome = (action, date, type) => {
		this.empHomeData = {date, type};
		this.setState({'confirmAction': action})
		this.showAlert(action);
	}

    render() {
		console.disableYellowBox = true;
        let { 
             showAlertError, showAlertLoader, errorText, alertTitle, showCancel, 
            showConfirm, adminTabVisible, adminSubTab, firstLaunch
       } = this.state;
        return(
            <View style={styles.mainContainer}>
				
				{
					adminTabVisible?
					<View style={this.userType != 'SERVICE' ? styles.childContainer : styles.childContainerService}>
						{
							this.userType != 'SERVICE' ?
							<AdminTab adminTabVisible = {adminTabVisible} adminSwitch = {this.adminSwitch}/>
							: null
						}
						
						<AdminSubSections 
							adminSubTab = {adminSubTab} 
							adminSubSwitch = {this.adminSubSwitch} 
							addDriver = {this.addDriver} 
							showAlertChild ={this.showAlertChild} 
							userType = {this.userType} 
							confirmPickChange = {this.confirmPickChange}
							ref={child => {this.child = child}}
							firstLaunch = {firstLaunch}
							confirmDriverAssign = {this.confirmDriverAssign}
						/>
					</View> : 
					<View style = {styles.childContainerEmployee}>
						{
							this.userType != 'SERVICE' ?
							<AdminTab adminTabVisible = {adminTabVisible} adminSwitch = {this.adminSwitch}/>
							: null
						}
						<EmpHomeData 
							ref={home => {this.home = home}}
							showConfirm = {this.showConfirmHome}
						/>
					</View>
					
				}
				
				{
					adminSubTab == 'driver-list'?
					<FAB
						style={styles.fab}
						size={18}
						icon = 'person-add'
						// theme={{ colors: { accent: '#C9004F' } }}
						theme={{ colors: { accent: Color.BUTTON_COLOR_EMP } }}
						onPress={() => this.addDriver()}
					/> :  
					adminSubTab == 'admin-list'?
					<FAB
						style={styles.fab}
						size={18}
						icon = 'person-add'
						theme={{ colors: { accent: Color.BUTTON_COLOR_EMP } }}
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
					cancelButtonColor="#1A3E50"
					confirmButtonColor = "#FFFFFF"
					onCancelPressed={() => {
						if(this.state.confirmAction == 'pickChange') {
							this.hideAlert('pickChangeCancel');
						} else {
							this.hideAlert(this.state.confirmAction);
						}
						
                    }}
                    onConfirmPressed={(data) => { this.confirmBtnAlert()}}
					contentContainerStyle = {{backgroundColor: Color.HEADER_BG_COLOR}}
					cancelButtonTextStyle = {{color: '#fff', fontSize: 15}}
					cancelButtonStyle = {{borderWidth: .5, borderColor: '#fff', width: wp('20%'), alignItems: 'center'}}
					confirmButtonStyle = {{borderWidth: .5, borderColor: '#165155', width: wp('20%'), alignItems: 'center'}}
					confirmButtonTextStyle = {{color: '#165155', fontSize: 15}}
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
		backgroundColor: Color.HEADER_BG_COLOR
	},
	childContainer: { 
		// flex: 2,
		backgroundColor: Color.TAB_BG_COLOR, 
		width: wp('97%'),
		alignSelf: 'center',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
        borderTopColor: Color.TAB_BG_COLOR,
		borderTopWidth: 1,
		marginTop: 10,
		marginBottom: platform == 'ios' ? hp('36%') : 0
	},
	icon: {
        paddingLeft: 10
    },
	childContainerEmployee: {
		flex: 1,
		backgroundColor: Color.TAB_BG_COLOR, 
		width: wp('97%'),
		alignSelf: 'center',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
        borderTopColor: Color.TAB_BG_COLOR,
		borderTopWidth: 1,
		marginTop: 10
	},
	childContainerService: {
		backgroundColor: Color.TAB_BG_COLOR, 
		width: wp('97%'),
		alignSelf: 'center',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
        borderTopColor: Color.TAB_BG_COLOR,
		borderTopWidth: 1,
		marginTop: 10,
		marginBottom: hp('25%')
	},
	fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 20,
      
    },
})
export default inject("rootStore")(observer(AdminHomeNew));