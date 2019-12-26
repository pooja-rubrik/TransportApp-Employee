import React, { Component } from 'react';
import {
	Text, StyleSheet,
	Platform, Alert,
	View
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'
import { signOut, EventEmitter, createConfig } from '@okta/okta-react-native';
import { RaisedTextButton } from 'react-native-material-buttons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { FAB, Portal, Provider } from 'react-native-paper';

import { PaperMenu2 } from '../components/HeaderDropdowniOS';
import { HeaderMenu, Item } from '../components/HeaderDropdownAndroid';
import Wallpapers from "../components/Wallpaper";
import { deviceType } from '../stylesheets/AppDimensions';
import Constants from '../services/Constants';
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import EmailModel from '../components/EmailModal';
import DateTime from '../components/DateTimePicker';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';

const platform = Platform.OS;

class Home extends Component {
	constructor(props) {
		super(props);
		this.mapStore = this.props.rootStore.mapStore;
		this.empStore =  this.props.rootStore.empStore;
		this.usersStore =  this.props.rootStore.usersStore;
		this.driverStore = this.props.rootStore.driverStore;
		this.userType = this.usersStore.users.oktaDetail.userType;
		this.empAddr = this.usersStore.users.empDetail.empHomeAddress;
		this.utilities  = this.usersStore.utilities;
		this.empId = this.usersStore.users.oktaDetail.empid
		console.log('employee store>>>', this.empStore)
		this.state = {
			accessToken: '',
			isEditPick: false,
			isEditDrop: false,
			timePick: '',
			timeDrop: '',
			emailModalVisible: false,
			address: 'IT Park, Dehradun',
			formatTime: 'HH:mm:ss',
			pickPlaceHolder: 'hh:mm:ss',
			dropPlaceHolder: 'hh:mm:ss',
			loginHour: 0,
			loginMin: 30,
			logoutMin: 30,
			logoutHour: 0,
			loginMinTime: this.utilities.loginTime.split('-')[0],
			loginMaxTime: this.utilities.loginTime.split('-')[1],
			logoutMinTime: this.utilities.logoutTime.split('-')[0],
			logoutMaxTime: this.utilities.logoutTime.split('-')[1],
			vehicleNoLogin: '',
			vehicleNoLogout: '',
			driverNameLogin: '',
			driverNameLogout: '',
			driverContactLogin: '',
			driverContactLogout: ''
		};
		this.loginInterval = toJS( this.utilities.loginInterval );
		this.logoutInterval = toJS( this.utilities.logoutInterval );
		
		console.log( this.mapStore.mapData.currentAPIKey, this.userType );
		console.log( 'emp address', this.empAddr );
		
	}

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		if (platform == 'ios' && deviceType == 'ipad') {
			return {
				header: <PaperMenu2 onPressProfile={ () => params.handleMenu() } navigation = {navigation}/>,
			};
		} else {
			return {
				headerRight: (
					<HeaderMenu>
						<Item title="Update Roster" show="never" onPress={() => params.handleMenu('UpdateRosterScreen')} />
						<Item title="Profile" show="never" onPress={() => params.handleMenu('ProfileScreen')} />
						{/* <Item title="Logout" show="never" onPress={() => params.logout()} /> */}
					</HeaderMenu>
				),
				headerLeft: null
			};
		}

	};

	componentDidMount() {
		
		console.log('utilities>>>', toJS(this.utilities));
		this.props.navigation.setParams({
			handleMenu: this.navigateMenu,
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
			console.log('Failed to log in', e)
			Alert.alert('Failed to log in', e.error_message);
		});

		//get lat longs from string address
		this.setMapMarker();
		
		//login interval 
		// this.setPickerInterval();

		//set daily login data
		this.setDailyLogin();
		
		//set daily logout data
		this.setDailyLogout();
	}

	navigateMenu = (pageName) => {
		this.props.navigation.navigate(pageName);
	}

	logoutProfile = () => {
		signOut();
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

	setPickerInterval = () => {
		// if(this.loginInterval >= 60){
		// 	this.setState({loginHour : Math.floor(this.loginInterval/60)});
		// 	this.setState({loginMin : this.loginInterval%60});
		// } else {
		// 	this.setState({loginHour : 0});
		// 	this.setState({loginMin : this.loginInterval});
		// }
		// if(this.logoutInterval >= 60){
		// 	this.setState({logoutHour : Math.floor(this.logoutInterval/60)});
		// 	this.setState({logoutMin : this.logoutInterval%60});
		// } else {
		// 	this.setState({logoutHour : 0});
		// 	this.setState({logoutMin : this.logoutInterval});
		// }
	}

	setDailyLogin = () => {
		this.empStore.dailyLogin( this.empId ).then( () => {
			// console.log('default login success>>', toJS(this.empStore.empData.dailyLogin.code))
			if ( this.empStore.empData.dailyLogin && this.empStore.empData.dailyLogin.code == 200 ) {
				this.setState( {"timePick": this.empStore.empData.dailyLogin.loginTime} )
				if(this.empStore.empData.dailyLogin.vehicleNumber){
					this.setState( {"vehicleNoLogin": this.empStore.empData.dailyLogin.vehicleNumber } )
					this.setDriverData(this.empStore.empData.dailyLogin.vehicleNumber, 'LOGIN');
				} else {
					this.setState( {"vehicleNoLogin": 'No Vehicle', "driverNameLogin": 'No Driver', "driverContactLogin": 'No Driver Contact'} )
				}
				
			} else {
				// Alert.alert('User will be activated tomorrow!');
				this.setState( {"vehicleNoLogin": 'No Vehicle', "driverNameLogin": 'No Driver', "driverContactLogin": 'No Driver Contact'} )
			}
		})
	}

	setDailyLogout = () => {
		this.empStore.dailyLogout( this.empId ).then( () => {
			console.log('default logout success>>', toJS(this.empStore.empData.dailyLogout))
			if( this.empStore.empData.dailyLogout && this.empStore.empData.dailyLogout.code == 200 ) {
				this.setState( { "timeDrop": this.empStore.empData.dailyLogout.logoutTime } )
				if(this.empStore.empData.dailyLogout.vehicleNumber){
					this.setState( {"vehicleNoLogout": this.empStore.empData.dailyLogout.vehicleNumber } )
					this.setDriverData(this.empStore.empData.dailyLogout.vehicleNumber, 'LOGOUT');
				} else {
					this.setState( {"vehicleNoLogout": 'No Vehicle', "driverNameLogout": 'No Driver', "driverContactLogout": 'No Driver Contact'} )
				}
				//this.setState( {"vehicleNoLogout": this.empStore.empData.dailyLogout.vehicleNumber ? this.empStore.empData.dailyLogout.vehicleNumber : 'No Vehicle'} )
			} else {
				this.setState( {"vehicleNoLogout": 'No Vehicle', "driverNameLogout": 'No Driver', "driverContactLogout": 'No Driver Contact'} )
			}
		})
	}

	setDriverData = (vehicleNo, type) => {
		this.driverStore.setDriverData( vehicleNo ).then( () => {
			console.log( 'driver data>>', toJS(this.driverStore.driverData));
			let driver = this.driverStore.driverData;
			if( driver.code == 200 ) {
				// if(type == 'LOGIN') {
					this.setState( {"driverNameLogin": driver.driverName, "driverContactLogin": driver.driverPhone} )
				// } else {
				// 	this.setState( {"driverNameLogout": driver.driverName, "driverContactLogout": driver.driverPhone} )
				// }

			}
			
		})
	}

	//hide email modal
	closeModalFunc = (visible) => {
		this.setState({ emailModalVisible: visible });
	}


	editPickDrop = (editType) => {
		this.setState((editType == 'Pick') ? { isEditPick: true, isEditDrop: false } : { isEditDrop: true, isEditPick: false })
		this.TimePicker.open()
	}

	onChangeDate = (date, changeType) => {
		//submit value
		console.log('>>>>>>', date)
		// this.setState({timePick: date})
		if(changeType == 'drop') {
			if(date !== this.state.timeDrop){
				this.submitChange(date, 'ASSIGN', changeType);
				this.setState({timeDrop: date});
			}
		}
		if(changeType == 'pick'){
			if(date !== this.state.timePick){
				this.submitChange(date, 'ASSIGN', changeType);
				this.setState({timePick: date});
			}
		}
	}

	cancelTime = (cancelType) => {
		this.submitChange(null, 'CANCEL', cancelType);
	}

	submitChange = ( date, submitType, changeType ) => {
		this.empStore.submitEmpTime( date, this.empId, submitType, changeType ).then( () => {
			console.log( 'success>>', toJS(this.empStore.empData.submitTime) )
			if ( this.empStore.empData.submitTime && this.empStore.empData.submitTime.code == 200 ) {
				this.setDailyLogin();
				this.setDailyLogout();
				this.setDriverData();
				Alert.alert( submitType == 'ASSIGN' ? 'Time updated successfully.' : 'Time cancelled successfully.' )
			} else {
				Alert.alert( 'Something went wrong.' )
			}
		})
	}

	openUrl = () => {
		console.log('open url>>');
		this.props.navigation.navigate('ProfileScreen');
	}

	render() {
		let { 
			timePick, timeDrop, 
			location, pickPlaceHolder,
			dropPlaceHolder, formatTime,
			loginMin, loginHour,
			logoutMin, logoutHour,
			loginMinTime, loginMaxTime,
			logoutMinTime, logoutMaxTime,
			vehicleNoLogin, vehicleNoLogout,
			driverNameLogin, driverNameLogout,
			driverContactLogin, driverContactLogout
		} = this.state;
		
		return (
			// <View style = { [{flex:1},this.state.emailModalVisible ? { backgroundColor: 'rgba(0,0,0,0.5)' } : '']}>
				<Wallpapers>
					<View style={styles.rootContainer}>
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
							onRegionChange={this.onRegionChange}
						>

							<MapView.Marker
								// title="This is a title"
								// description={`${location}`}
								coordinate={{ "latitude": this.mapStore.mapData.region.latitude, "longitude": this.mapStore.mapData.region.longitude }}>
									<MapView.Callout
										onPress={this.openUrl.bind(this)}
										style={styles.callout}
									>
										<Text style = {styles.markerText}>
										{/* {location} */}
										Home
										</Text>
									</MapView.Callout>
							</MapView.Marker>
								
							
						</MapView>
					</View>

					<CardView
						cardElevation={4}
						cardMaxElevation={4}
						cornerRadius={5}
						style={styles.cardView}>
						
						<View style = {styles.cardContent}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={[styles.cardText, styles.cardTextAlign]}>
									Pick : 
								</Text>
								<DateTime 
									date = {timePick} 
									changeDate = {(timePick) => {this.onChangeDate(timePick, 'pick');}} 
									placeholder = {pickPlaceHolder}
									format = {formatTime}
									style = {{width:wp('30%'), height: 45}}
									inputStyle = {{marginLeft: 0, backgroundColor: '#fff', paddingRight:30}}
									minDate = {loginMinTime}
									maxDate = {loginMaxTime}
									minuteInterval={loginMin}
									hourInterval = {loginHour}
								/>
								
							</View>
							<Text style={styles.cardText}>
								Driver Name : {driverNameLogin}
							</Text>
							<Text style={styles.cardText}>
								Vehicle : {vehicleNoLogin}
							</Text>
							<Text style={styles.cardText}>
								Contact : {driverContactLogin}
							</Text>
							
						</View>
						
						<View style={styles.buttonSec}>
							<RaisedTextButton
								title={STRCONSTANT.CANCEL_PICK}
								color={COLOR.BUTTON_COLOR_CANCEL}
								titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
								onPress={ () => this.cancelTime('pick') }
								style={styles.cancelStyle}
							/>
						</View>
					</CardView>
					<CardView
						cardElevation={4}
						cardMaxElevation={4}
						cornerRadius={5}
						style={styles.cardView}>
						
						<View style = {styles.cardContent}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={[styles.cardText, styles.cardTextAlign]}>
									Drop :  
								</Text>
								<DateTime 
									date = {timeDrop} 
									changeDate = {(timeDrop) => { this.onChangeDate(timeDrop, 'drop');}} 
									// changeDate = {this.onChangeDate}
									placeholder = {dropPlaceHolder}
									format = {formatTime}
									minDate = {logoutMinTime}
									maxDate = {logoutMaxTime}
									minuteInterval={logoutMin}
									hourInterval = {logoutHour}
									style = {{width:wp('30%'), height: 45}}
									inputStyle = {{marginLeft: 0, backgroundColor: '#fff', paddingRight:30}}
								/>
								
							</View>
							<Text style={styles.cardText}> 
								Driver Name : {driverNameLogout} 
							</Text>
							<Text style={styles.cardText}>
								Vehicle : {vehicleNoLogout}
							</Text>
							<Text style={styles.cardText}>
								Contact : {driverContactLogout}
							</Text>
							
						</View>
						
						<View style={styles.buttonSec}>
							<RaisedTextButton
								title={STRCONSTANT.CANCEL_DROP}
								color={COLOR.BUTTON_COLOR_CANCEL}
								titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
								onPress={ () => this.cancelTime('drop') }
								style={styles.cancelStyle}
							/>
						</View>
					</CardView>
					
					<Provider>
						<Portal>
							<FAB.Group
								open={this.state.open}
								icon={this.state.open ? 'today' : 'add'}
								actions={[
									{
										icon: 'email', label: 'Email', onPress: () => {
											console.log('Pressed email');
											this.setState({ emailModalVisible: true })
										}
									},
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
					<View >
						<EmailModel emailModalVisible = {this.state.emailModalVisible} closeModalFunc = {this.closeModalFunc}/>
					</View>

				</Wallpapers>
			// </View>
			

		);
	}
	componentWillUnmount() {
		this.signOutSuccess.remove();
		this.onError.remove();
		this.onCancelled.remove();
	}
}

const styles = StyleSheet.create({
	rootContainer: {
		width: wp('90%'),
		alignSelf: 'center',
	},
	map: {
		top: 10,
		height: hp('30%'),
		marginBottom: 10
	},
	cardView: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('24%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
	},
	cardText: {
		fontSize: 15,
		marginLeft: 10,
		marginBottom: 5,
		marginRight: 15,
		// height: 30,	
		fontWeight: 'bold',
		color: '#5b5a5a', 
		
	},
	cardTextAlign:{
		alignSelf: 'center'
	},
	buttonSec: {
		paddingLeft: 10,
		paddingTop: 7,
		flex: 1,
		flexDirection: 'row',
		// backgroundColor: 'grey',
		alignSelf: 'center',
		shadowOffset: { width: 0, height: .5 },
		shadowColor: '#f00',
		shadowOpacity: .2,
	},
	cancelStyle: {
		borderColor: '#f00',
		borderWidth: 1,
		borderRadius: 20,
	},
	iconView: {
		height: 22,
		width: 32,
		backgroundColor: '#6a6a6a',
		alignItems: 'center',
		borderRadius: 5
	},
	cardContent: {
		width: wp('85%'),
		borderColor: '#6a6a6a',
		borderWidth: .5,
		alignSelf: 'center',
		backgroundColor:'#e9e9e9',
		padding: 10,
		borderRadius: 5
	},
	markerText:{
		width: wp('40%')
	}
})


export default inject("rootStore")(observer(Home));