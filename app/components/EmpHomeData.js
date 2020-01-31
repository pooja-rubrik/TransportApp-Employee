import React from "react";
import {
	Text, StyleSheet,
    View, Platform,
    Alert
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { FAB, Portal, Provider } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CheckInTab from '../components/CheckInTabs';
import EmpCurrent from '../components/EmpCurrent';
import EmpRoster from '../components/EmpRoster';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomIcon from '../components/CustomIcon.js'
import ProfileModal from '../components/ProfileModal';
import Color from '../services/AppColor';
const platform = Platform.OS;

class EmpHomeData extends React.PureComponent {

    constructor(props){
        super(props);
        this.mapStore = this.props.rootStore.mapStore;
		this.empStore =  this.props.rootStore.empStore;
		this.usersStore =  this.props.rootStore.usersStore;
		this.empDetail = this.usersStore.users.empDetail;
		this.driverStore = this.props.rootStore.driverStore;
		this.userType = this.usersStore.users.oktaDetail.userType;
		this.empAddr = this.usersStore.users.empDetail.empHomeAddress;
		this.utilities  = this.usersStore.utilities;
        this.empId = this.usersStore.users.oktaDetail.empid
        this.loginInterval = toJS( this.utilities.loginInterval );
		this.logoutInterval = toJS( this.utilities.logoutInterval );
		this.driverStore.driverData = [];
        this.state = {
			accessToken: '',
			address: 'IT Park, Dehradun',
			loginMinTime: this.utilities.loginTime.split('-')[0],
			loginMaxTime: this.utilities.loginTime.split('-')[1],
			checkInTabVisible: true,
			showAlertError: false,
			showAlertLoader: false,
			errorText: '',
			alertTitle: 'Oops!',
			showConfirm: false,
			showCancel: true,
			profileModalVisible: false,
			profileField: '',
			location: '',
			profileData: '',
			accountStatus: ''
        };
        console.log(this.empStore.empData.dailyLogin);
    }
    componentDidMount() {
        //get lat longs from string address
		this.setMapMarker();
		
		//set daily login data
		this.setDailyLogin();
		this.getProfileData();
    }

    getProfileData = () => {
		this.usersStore.getEmployee().then(() => {
			console.log(toJS(this.usersStore.users.empDetail))
			this.setState({profileData: this.usersStore.users.empDetail})
		})
	}

	setMapMarker = () => {
		Geocoder.init(this.mapStore.mapData.currentAPIKey);
		// Geocoder.from(`House-102, 3rd cross, 2nd stage, ashraya layout, garudacharpalya, bangalore, 560048`)
		Geocoder.from(`${this.empAddr}`)
			.then(json => {
				var location = json.results[0].geometry.location;
				this.setState({"location": json.results[0].formatted_address})
				console.log('location>>>', json)
				console.log(location);
				this.mapStore.locateMap(location, 'employee');
			})
			.catch(error => console.warn(error));
		
	}

	setDailyLogin = () => {
		this.empStore.dailyLogin( this.empId ).then( () => {
			console.log('default login success>>', toJS(this.empStore.empData.dailyLogin), this.empStore.empData.dailyLogin.vehicleNumber)
			if ( this.empStore.empData.dailyLogin && this.empStore.empData.dailyLogin.code == 200 ) {
				this.setState({accountStatus : ''})
				// if( this.empStore.empData.dailyLogin.vehicleNumber ) {
				this.setDriverData(this.empStore.empData.dailyLogin.vehicleNumber);
				// } 
				
			} else if( this.empStore.empData.dailyLogin.status == 404 ) {
				this.setState({accountStatus : 'Your account will be activated after 1 day.'})
			} else {
				this.setState({accountStatus : ''})
			}
		})
	}

	setDailyLogout = () => {
		this.empStore.dailyLogout( this.empId ).then( () => {
			console.log('default logout success>>', toJS(this.empStore.empData.dailyLogout))
			if( this.empStore.empData.dailyLogout && this.empStore.empData.dailyLogout.code == 200 ) {
				this.setState({accountStatus : ''})
				// if(this.empStore.empData.dailyLogout.vehicleNumber){
				this.setDriverData(this.empStore.empData.dailyLogout.vehicleNumber);
				// } 
			} else if( this.empStore.empData.dailyLogin.status == 404 ) {
				this.setState({accountStatus : 'Your account will be activated after 1 day.'})
			} else {
				this.setState({accountStatus : ''})
			}
		})
	}

	setDriverData = (vehicleNo) => {
		this.driverStore.setDriverData( vehicleNo ).then( () => {
			console.log( 'driver data>>', toJS(this.driverStore.driverData));
		})
	}

	//hide email modal
	closeModalFunc = (visible) => {
		this.setState({ profileModalVisible: visible });
	}


	cancelTime = (cancelType) => {
		console.log('cancel>>');
		this.submitChange(null, 'CANCEL', cancelType);
	}

	
	submitChange = ( date, submitType, changeType ) => {
		this.empStore.submitEmpTime( date, this.empId, submitType, changeType ).then( () => {
			console.log( 'success>>', toJS(this.empStore.empData.submitTime), changeType )
			if ( this.empStore.empData.submitTime && this.empStore.empData.submitTime.code == 200 ) {
				if(changeType == 'pick') {
					this.setDailyLogin();
				} else {
					this.setDailyLogout();
				}
				Alert.alert( submitType == 'ASSIGN' ? 'Trip updated successfully.' : 'Trip cancelled successfully' )
			} else {
				Alert.alert( 'Something went wrong.' )
			}
		})
    }
    
    tabSwitch = (tab) => {
		this.setState({
			checkInTabVisible: (tab=='checkin') ? true : false,
			loginMinTime: (tab=='checkin') ? this.utilities.loginTime.split('-')[0] : this.utilities.logoutTime.split('-')[0],
			loginMaxTime: (tab=='checkin') ? this.utilities.loginTime.split('-')[1] : this.utilities.logoutTime.split('-')[1]
		})
		if(tab == 'checkin') {
			this.setDailyLogin()
		} else {
			this.setDailyLogout()
		}
		
	}

	// openUrl = () => {
	// 	console.log('open url>>');
	// 	this.props.navigation.navigate('ProfileScreen');
	// }

	
	floatIconBtn = (fieldName) => {
		this.setState({profileModalVisible: true, profileField: fieldName})
	}

	//submit profile data
	submitProfile= (profileParam) => {
		this.setState({profileModalVisible: false});
		
		// if(this.empDetail.admID){
		// 	profileParam.admID = this.empDetail.admID;
		// } else {
			profileParam.empID = this.empDetail.empID;
		// }
		profileParam.empType = this.userType;
		console.log('epdetail>>', profileParam, this.usersStore.users.oktaDetail.accessToken)
		this.empStore.updateProfile(profileParam, this.usersStore.users.oktaDetail.accessToken).then(() => {
            console.log('profileUpdate success>>', toJS(this.empStore.empData.profileUpdate), this.userType)
            if (this.empStore.empData.profileUpdate.code == 200 || this.empStore.empData.profileUpdate.code == 201) {
				this.usersStore.getEmployee().then(() => {
					this.setState({profileData: this.usersStore.users.empDetail})
					this.empAddr = this.usersStore.users.empDetail.empHomeAddress;
					this.setMapMarker();
					Alert.alert(`User profile has been updated.`);
				})
			} else {
				Alert.alert('Something went wrong!')
			}

        })
	}
	
	callConfirmAction = (data) => {
		console.log('data>>', data);
		if(data.type == 'pickDrop' ) {
			this.empCurrent.callConfirmAction(data)
		} else if ( data.type == 'cancelTime' ) {
			this.cancelTime(data.date);
		} else if ( data.type == 'updateRoster' ) {
			this.empRoster.callUpdateRoster();
		} else if ( data.type == 'cancelRoster' ) {
			this.empRoster.callCancelRoster();
		} else if ( data.type == 'updateDefault' )  {
			this.empRoster.callUpdateDefault();
		}
		
	}
    
    render() {
       let { 
            checkInTabVisible, profileModalVisible, profileField, location, profileData
        } = this.state;
       
        return (
            <View style={styles.mainContainer}>
                <View style={ this.userType == 'ADMIN' ? styles.mapContainer : styles.mapContainerEmp }>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        scrollEnabled={true}
                        followsUserLocation={true}
                        zoomEnabled={true}
                        pitchEnabled={true}
                        rotateEnabled={true}
                        region={toJS(this.mapStore.mapData.region)}
                    >

                        <MapView.Marker
                            coordinate={{ "latitude": this.mapStore.mapData.region.latitude, "longitude": this.mapStore.mapData.region.longitude }}>
                                <MapView.Callout
                                    // onPress={this.openUrl.bind(this)}
                                    style={styles.callout}
                                >
                                    <Text style = {styles.markerText}>
                                        {location}
                                    </Text>
                                </MapView.Callout>
                        </MapView.Marker>
                    </MapView>
					{/* OTP  */}
					{/* <View style={styles.otpView}>
						<Text style = {styles.otpText}>
							121212
						</Text>
					</View> */}
                </View>
                <View style={styles.contentSection}>
					<View style = {styles.checkInContainer}>
						<CheckInTab checkInTabVisible = {checkInTabVisible} tabSwitch = {this.tabSwitch}/>
					</View>
                    
					<EmpCurrent
						isCheckIn={checkInTabVisible} 
						submitChange = {this.submitChange} 
						loginMinTime = {this.state.loginMinTime} 
						loginMaxTime = {this.state.loginMaxTime}
						cancelTime = {this.cancelTime}
						accountStatus = {this.state.accountStatus}
						showConfirm = {this.props.showConfirm}
						ref={child => {this.empCurrent = child}}
					/>
					<EmpRoster
						isCheckIn={checkInTabVisible} 
						loginMinTime = {this.state.loginMinTime} 
						loginMaxTime = {this.state.loginMaxTime}
						showConfirm = {this.props.showConfirm}
						ref={child => {this.empRoster = child}}
					/>
					
                </View>
				<View >
					<ProfileModal profileModalVisible = {profileModalVisible} closeModalFunc = {this.closeModalFunc} submitProfile = {this.submitProfile} profileField = {profileField} profileData = {toJS(profileData)}/>
				</View>
				{/* <View style={{ position: 'relative' }}> */}
					{
						platform == 'ios' ? 
						<Provider >
							<Portal>
								<FAB.Group
									open={this.state.open}
									fabStyle = {{fontSize:30, zIndex: 999}}
									// icon='keyboard-arrow-up'
									// icon='arrow-upward'
									icon='more-horiz'
									theme={{ colors: { accent: Color.BUTTON_COLOR_EMP } }}
									actions={[
										{
											icon: ()=><CustomIcon name='contact_new'  size={26} color = "#fff"/> ,
											// icon: ()=><MaterialIconsCom name="home-map-marker" size={28} color="#fff"  />,  
											style : { backgroundColor: '#228574', paddingRight:6, paddingBottom: 6, padding:4},
											onPress: () => { }
										},
										{
											icon: ()=><MaterialIcons name="call" size={20} color="#fff"  />,  
											// icon: ()=> <Image source = {contactImg} height = {10} width = {10}/>,
											style : { backgroundColor: '#228574',padding:4},
											onPress: () => { this.floatIconBtn('phone_number');}
										},
										{
											icon: ()=><CustomIcon name='emergency_new'  size={33} color = "#fff"/> ,  
											// icon: ()=> <Image source = {contactImg} height = {10} width = {10}/>,
											style : {paddingRight: 8, paddingBottom: 8, backgroundColor: '#228574'},
											onPress: () => { this.floatIconBtn('emergency_contact');}
										},
										{
											icon: ()=><CustomIcon name='location_new'  size={33} color = "#fff"/> ,  
											// icon: ()=> <Image source = {contactImg} height = {10} width = {10}/>,
											style : { backgroundColor: '#228574', alignItem:'center',paddingRight: 8, paddingBottom: 8,},
											onPress: () => { this.floatIconBtn('address');}
										}
									]}
									onStateChange={({ open }) => this.setState({ open })}
									onPress={() => {
										if (this.state.open) {
											// do something if the speed dial is open
											console.log('open>>')
										}
									}}
								/>
							</Portal>
						</Provider>
						:
						null
					}

					
				{/* </View> */}
				
				
            </View>
        )
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
		// backgroundColor: '#E2F1E4',
		backgroundColor: Color.HEADER_BG_COLOR,
		
	},
	mapContainer: {
		width: wp('97%'),
		alignSelf: 'center',
	},
	mapContainerEmp: {
		width: wp('97%'),
		alignSelf: 'center',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		overflow: 'hidden' ,
		marginTop: 10,
	},
	map: {
		height: hp('28%'),
    },
    contentSection: {
        // backgroundColor: '#E2F1E4',
		flex:2,
		// zIndex: 99
	},
	floatPlus: {
		// backgroundColor: 'red'
	},
	markerText:{
		width: wp('60%')
	},
	checkInContainer: {
		height: hp('6%'), 
		backgroundColor: Color.TAB_BG_COLOR, 
		borderBottomLeftRadius: 10, 
		borderBottomRightRadius: 10
	},
	otpView: {
		top:10,
		right: 10,
		position: 'absolute',
		backgroundColor: Color.HEADER_BG_COLOR, 
		height: 40, 
		width: 80, 
		borderColor: '#333', 
		borderRadius: 8, 
		alignItems: 'center', 
		paddingTop: 8
	},
	otpText: {
		fontSize: 20, 
		color: '#fff', 
		fontWeight:'bold'
	}
})
export default inject("rootStore")(observer(EmpHomeData));