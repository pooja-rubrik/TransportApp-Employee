import React, { Component } from "react";
import {
	View, StyleSheet,
	Image, TextInput,
} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { Alert } from 'react-native';
import { createConfig, signIn, EventEmitter, isAuthenticated, getUser } from '@okta/okta-react-native';
import { observer, inject } from "mobx-react";

import { AppAlert } from '../components/Alert';
import Wallpapers from "../components/Wallpaper";
import logo from '../assets/icons/logorubrik.png';
import Constants from '../services/Constants';
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import { deviceType } from '../stylesheets/AppDimensions';
import EmpSignupModal from '../components/EmpSignupModal';
import AdminSignupModal from '../components/AdminSignupModal';

class Login extends Component {
	constructor(props) {
		super(props);
		this.usersStore = this.props.rootStore.usersStore;
		this.loginName = 'employee';
	}

	state = {
		empID: '',
		showAlertError: false,
		showAlertLoader: false,
		hasLoggedInOnce: false,
		accessToken: '',
		signupModalVisible: false,
		adminModalVisible: false,
		errorText: '',
        alertTitle: 'Oops!',
        showConfirm: false,
        showCancel: true
	};


	componentDidMount() {
		createConfig({
			clientId: `${Constants.CLIENTID}`,
			redirectUri: `${Constants.REDIRECT_URL}`,
			endSessionRedirectUri: `${Constants.ENDSESSION_URL}`,
			discoveryUri:`${Constants.DISCOVERY_URL}`,
			scopes: Constants.SCOPE,
			requireHardwareBackedKeyStore: true
		});
		
		this.signInSuccess = EventEmitter.addListener('signInSuccess', (e: Event) => {
			console.log(e)
			this.hideAlert('loader');
			isAuthenticated().then((auth) => {
				// console.log(auth.authenticated, e.access_token, e)
				this.setState({ accessToken: e.access_token })
				getUser().then( (data) => {
					console.log('user>>>', data);
					data.accessToken = this.state.accessToken;
					// data.userType = this.loginName;
					this.usersStore.addOktaDetail(data).then( () => {
						this.usersStore.getEmployee().then( () => {
							if(this.usersStore.users.empDetail.status == 404) {
								this.setState({signupModalVisible: true})
							} else {
								if(this.usersStore.users.empDetail.userType == 'EMPLOYEE') {
									this.loginName = 'EMPLOYEE'
									data.userType = this.loginName;
									console.log('data for okta>>', data)
									this.usersStore.addOktaDetail(data);
									this.navigateHome();
								} else {
									this.loginName = 'ADMIN'
									// this.usersStore.getAdmin().then( () => {
										data.userType = this.loginName;
										console.log('data for okta>>', data)
										this.usersStore.addOktaDetail(data);
										// if(this.usersStore.users.empDetail.status == 404) {
										// 	this.setState({adminModalVisible: true})
										// } else {
											this.navigateAdmin();
										// }
									// })
								}
							}
						
						});
					});
				})
				

			})

		});

		this.onError = EventEmitter.addListener('onError', (e: Event) => {
			this.hideAlert('loader');
			console.log('error in okta login>', e)
			// Alert.alert('User has cancelled');
			this.setState({ errorText: 'User has cancelled'})
            this.showAlert('error')
		});

		this.onCancelled = EventEmitter.addListener('onCancelled', (e: Event) => {
			this.hideAlert('loader');
			console.log('user has cancelled', e)
			// Alert.alert('Failed to log in', e.error_message);
			this.setState({ errorText: 'Failed to log in' + e.error_message})
            this.showAlert('error')
		});
	}

	authorize = () => {
		this.showAlert('loader');
		signIn().then(()=>{
			// this.hideAlert('loader');
		});
	}


	navigateHome = () => {
		this.props.navigation.navigate('EmpHomeScreen');
	}

	navigateAdmin = () => {
		this.props.navigation.navigate('AdminHomeNewScreen');
	}

	showAlert = (type) => {
		if (type == 'error') {
			this.setState({
				showAlertError: true
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
		} else {
			this.setState({
				showAlertLoader: false
			});
		}
	};

	submitSignup = (data) => {
		console.log('signup data>>', data)
		this.usersStore.registerUser(this.loginName, data).then(()=>{
			if(this.loginName == 'EMPLOYEE'){
				if(this.usersStore.users.empDetail.code == 200 || this.usersStore.users.empDetail.code == 201){
					this.setState({signupModalVisible: false})
					this.navigateHome();
				}
				
			} else {
				if(this.usersStore.users.empDetail.code == 200 || this.usersStore.users.empDetail.code == 201){
					this.setState({adminModalVisible: false})
					this.navigateAdmin();
				}
			}
			
		});
	};

	renderOTPInput = () => {
		if (this.state.showOTPInput) {
			return (
				<TextInput
					label=''
					value={`${this.state.enterOTP}`}
					onChangeText={(enterOTP) => this.setState({ enterOTP })}
					style={styles.textFieldStylesOwn}
					labelFontSize={18}
					autoFocus={true}
					placeholder={STRCONSTANT.ENTER_OTP}
					lineWidth={0}
					activeLineWidth={0}
					autoCapitalize='none'
					autoCorrect={false}
				/>
			);
		}
	}
	
	closeModalFunc = (visible) => {
		console.log('parent visible>>>', visible)
		this.setState({ signupModalVisible: visible });
	}

	render() {
		console.disableYellowBox = true;
		let { showAlertError, showAlertLoader, alertTitle, showCancel, showConfirm, errorText } = this.state;

		return (
			<Wallpapers>
				<Image style={styles.logoStyles} source={logo} />
				<View style={styles.TextInputView}>
					{/* <View style={styles.textViewStyle}> */}
						<RaisedTextButton
							title={STRCONSTANT.OKTA_LOGIN}
							color={COLOR.BUTTON_COLOR_EMP}
							titleColor={COLOR.BUTTON_FONT_COLOR}
							onPress={this.authorize}
							style={styles.buttonHelp}
							titleStyle = {styles.titleStyle}
						/>
						{/* {!!accessToken && <RaisedTextButton onPress={this.revoke} title={ STRCONSTANT.REVOKE_BTN_TITLE }  color="#EF525B"/>} */}
					{/* </View> */}
				</View>
				<View >
					<EmpSignupModal signupModalVisible = {this.state.signupModalVisible} closeModalFunc = {this.closeModalFunc} submitSignup = {this.submitSignup} userName = {this.usersStore.users.oktaDetail? this.usersStore.users.oktaDetail.name: ''}/>
					<AdminSignupModal adminModalVisible = {this.state.adminModalVisible} closeModalFunc = {this.closeModalFunc} submitSignup = {this.submitSignup}/>
				</View>
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
                    contentContainerStyle = {{backgroundColor: COLOR.HEADER_BG_COLOR}}
                    cancelButtonTextStyle = {{color: '#fff', fontSize: 15}}
					cancelButtonStyle = {{borderWidth: .5, borderColor: '#fff', width: wp('20%'), alignItems: 'center'}}
					messageStyle = {{color: '#fff'}}
					titleStyle = {{color: '#fff'}}
					confirmButtonStyle = {{borderWidth: .5, borderColor: '#165155', width: wp('20%'), alignItems: 'center'}}
					confirmButtonTextStyle = {{color: '#165155', fontSize: 15}}
					onCancelPressed={() => {
						this.hideAlert('error');
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert('success');
                    }}

				/>
				<AppAlert
					show={showAlertLoader}
					showProgress={true}
					title="Loading.."
					closeOnTouchOutside={false}
					closeOnHardwareBackPress={false}
				/>
			</Wallpapers>
		);
	}
	componentWillUnmount() {
		this.signInSuccess.remove();
		this.onError.remove();
		this.onCancelled.remove();
	}
};

const styles = StyleSheet.create({

	logoStyles: {
		alignSelf: 'center',
		width: wp('45%'),
		height: hp('34%')
	},
	textFieldStylesOwn: {
		backgroundColor: 'white',
		paddingLeft: 10,
		height: hp('5%'),
		borderRadius: 20,
		marginTop: 15,
		borderWidth: 0,
	},
	TextInputView: {
		width: wp('95%'),
		marginTop: -20,
		alignSelf: 'center',
	},
	buttonHelp: {
		borderRadius: 20,
		// marginBottom: 20,
		height: (deviceType == 'iphone') ? 38 : 50,
		marginTop: 10
	},
	titleStyle:{
		fontSize: 18
	}


})

export default inject("rootStore")(observer(Login));