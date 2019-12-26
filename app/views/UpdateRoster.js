import React, { Component } from 'react';
import {
	Text, StyleSheet,
	View, TouchableOpacity,
	Alert,
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import moment from 'moment';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RaisedTextButton } from 'react-native-material-buttons';
import { FAB, Portal, Provider } from 'react-native-paper';

import Wallpapers from "../components/Wallpaper";
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import EmailModel from '../components/EmailModal';
import DateTime from '../components/DateTimePicker';


class UpdateRoster extends Component {
	constructor(props) {
		super(props);
		this.empStore =  this.props.rootStore.empStore;
		this.usersStore =  this.props.rootStore.usersStore;
		this.utilities  = this.usersStore.utilities;
		this.empId = this.usersStore.users.oktaDetail.empid
        this.state = {
			accessToken: '',
			isEditPick: false,
			isEditDrop: false,
			isEditCancel: false,
			isDefaultUpdate: false,
			timePick: 'HH:MM',
			timeDrop: 'HH:MM',
			fromDatePick: 'DD/MM/YYYY',
			toDatePick: 'DD/MM/YYYY',
			fromDateDrop: 'DD/MM/YYYY',
			toDateDrop: 'DD/MM/YYYY',
			fromDateCancel: 'DD/MM/YYYY',
			toDateCancel: 'DD/MM/YYYY',
			emailModalVisible: false,
			date: '',
			datePickerMode: 'date',
			timePlaceHolder: 'select time',
			fromPlaceHolder: 'select date',
			format: 'YYYY-MM-DD',
			formatTime: 'HH:mm:ss',
			timePickValue: '',
			toPickValue: '',
			fromPickValue: '',
			fromCancelValue: '',
			toCancelValue: '',
			timeDropValue: '',
			fromDropValue: '',
			toDropValue: '',
			pickDefaultValue: '',
			dropDefaultValue: '',
			timePickChangeFormat: '',
			loginMinTime: this.utilities.loginTime.split('-')[0],
			loginMaxTime: this.utilities.loginTime.split('-')[1],
			logoutMinTime: this.utilities.logoutTime.split('-')[0],
			logoutMaxTime: this.utilities.logoutTime.split('-')[1],
			loginMin: 30,
			logoutMin: 30,
		};
		
	}

	static navigationOptions = ({ navigation }) => ({
        title: 'Update Roster'

	});

	componentDidMount() {
		//set default login data
		this.setDefaultLogin();
		
		//set default logout data
		this.setDefaultLogout();
	}

	//hide email modal
	closeModalFunc = (visible) => {
		this.setState({ emailModalVisible: visible });
	}

	setDefaultLogin = () => {
		this.empStore.defaultLogin( this.empId ).then( () => {
			// console.log('default login success>>', toJS(this.empStore.empData.defaultLogin.code))
			if ( this.empStore.empData.defaultLogin.code == 200 ) {
				this.setState( {"pickDefaultValue": this.empStore.empData.defaultLogin.loginTime} )
			}
		})
	}

	setDefaultLogout = () => {
		this.empStore.defaultLogout( this.empId ).then( () => {
			console.log('default login success>>', toJS(this.empStore.empData.defaultLogout))
			if( this.empStore.empData.defaultLogout.code == 200 ) {
				this.setState( { "dropDefaultValue": this.empStore.empData.defaultLogout.logoutTime } )
			}
		})
	}

	updateRoster = (type) => {
		console.log(this.state.fromPickValue, this.state.toPickValue, this.state.timePickValue)
		timeParam = (type == 'pick') ? {fromDate: this.state.fromPickValue, toDate: this.state.toPickValue, loginTime: this.state.timePickValue, empID: this.empId, status: 'ASSIGN'}
					: {fromDate: this.state.fromDropValue, toDate: this.state.toDropValue, logoutTime: this.state.timeDropValue, empID: this.empId, status: 'ASSIGN'}
		this.empStore.updateRoster( this.empId, timeParam, type ).then( () => {
			console.log(toJS(this.empStore.empData.updateRoster))
			if( this.empStore.empData.updateRoster.code == 200 ) {
				Alert.alert(`User ${type} time has updated`);
			}
		});
	}

	cancelRoster = (type) => {
		console.log(this.state.fromPickValue, this.state.toPickValue, this.state.timePickValue)
		timeParam = (type == 'pick') ? {fromDate: this.state.fromPickValue, toDate: this.state.toPickValue, empID: this.empId, status: 'CANCEL'}
					: {fromDate: this.state.fromDropValue, toDate: this.state.toDropValue, empID: this.empId, status: 'CANCEL'}
		this.empStore.cancelRoster( this.empId, timeParam, type ).then( () => {
			console.log(this.empStore.empData.cancelRoster)
			if( this.empStore.empData.cancelRoster.code == 200 ) {
				Alert.alert(`User ${type} time has cancelled`);
			}
		});
	}

	cancelRosterAll = () => {
		console.log(this.state.fromPickValue, this.state.toPickValue, this.state.timePickValue)
		timeParam = {fromDate: this.state.fromCancelValue, toDate: this.state.toCancelValue, empID: this.empId, status: 'CANCEL'}
		this.empStore.cancelRoster( this.empId, timeParam, 'pick' ).then( () => {
			console.log(this.empStore.empData.cancelRoster)
			if( this.empStore.empData.cancelRoster.code == 200 ) {
				this.empStore.cancelRoster( this.empId, timeParam, 'drop' ).then( () => {
					if( this.empStore.empData.cancelRoster.code == 200 ) {
						Alert.alert(`User pick and drop time has cancelled`);
					}
				})
			}
		});
	}


	editPickDrop = (editType) => {
		this.setState((editType == 'Pick') ? 
			{ isEditPick: true, isEditDrop: false, isEditCancel: false, isDefaultUpdate: false } : 
			(editType == 'Drop')?
				{ isEditDrop: true, isEditPick: false, isEditCancel: false, isDefaultUpdate: false }:
				(editType == 'Default')?
				{ isEditCancel: false, isEditPick: false, isEditDrop: false, isDefaultUpdate: true }:
				{ isEditCancel: true, isEditPick: false, isEditDrop: false, isDefaultUpdate: false })
		// this.TimePicker.open()
	}

	cancelEdit = (type) => {
		//submit value
		this.setState((type == 'Pick') ? 
			{ isEditPick: false } : 
			(type == 'Drop')?
				{ isEditDrop: false }:
				{ isEditCancel: false})
	}

	updateDefault = () => {
		this.empStore.setDefaultTime( this.empId, this.state.pickDefaultValue, this.state.dropDefaultValue ).then( () => {
			console.log('default time update>>', toJS(this.empStore.empData.defaultTime))
			if( this.empStore.empData.defaultTime.code == 200 ) {
				Alert.alert(`User default time has updated`);
			}
		})
	}

	render() {
		let { isEditDrop, isEditPick, timePickValue, toPickValue, 
			fromPickValue, datePickerMode, formatTime, timePlaceHolder, 
			format, fromPlaceHolder, isEditCancel, timeDropValue, 
			fromDropValue, toDropValue, fromCancelValue, toCancelValue, 
			isDefaultUpdate, pickDefaultValue, dropDefaultValue, timePickChangeFormat, 
			loginMinTime, loginMaxTime, logoutMinTime, logoutMaxTime, loginMin, logoutMin} = this.state;
		return (
			<Wallpapers>
				{ // Update Pickup
				}
				<CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={(!isEditPick) ? styles.cardView: styles.cardViewChange}>
						<TouchableOpacity onPress={() => this.editPickDrop('Pick')}>
							<View style={styles.cardHead}>
								<Text style = {styles.headText}>
									Update Pickup	
								</Text>
								{(!isEditPick) ?
								<View style={styles.iconView}>
									<MaterialIcons name="plus-circle" size={22} color="#5b5a5a" />
								</View>:
								<View style={styles.iconView}>
									<MaterialIcons name="minus-circle" size={22} color="#5b5a5a" />
								</View>
								}
							</View>
						</TouchableOpacity>
					
					{
					(!isEditPick) ?
					<View ></View>
					:
					<View style = {styles.cardContent}>
						
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextChange}>
								From :
								
							</Text>
							<DateTime 
								date = {fromPickValue} 
								mode={datePickerMode} 
								changeDate = {(fromPickValue) => {this.setState({fromPickValue: fromPickValue})}} 
								placeholder = {fromPlaceHolder}
								format = {format}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								dayAhead = {1}
								/>
						</View>
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextChange}>
								To : 
								
							</Text>
							<DateTime 
								date = {toPickValue} 
								mode={datePickerMode} 
								changeDate = {(toPickValue) => {this.setState({toPickValue: toPickValue})}} 
								placeholder = {fromPlaceHolder}
								format = {format}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								dayAhead = {2}
								/>
						</View>
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextChange}>
								Time :
								
							</Text>
							<DateTime 
								date = {timePickChangeFormat} 
								changeDate = {(timePickValue) => {this.setState({timePickValue: timePickValue, timePickChangeFormat: moment(timePickValue, 'HH:mm:ss').format('HH:mm')})}} 
								placeholder = {timePlaceHolder}
								format = {formatTime}
								// style = {{width:wp('35%')}}
									// iconStyle = {{height: 18}}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								minDate = {loginMinTime}
								maxDate = {loginMaxTime}
								minuteInterval={loginMin}
								/>
						</View>
					</View>
					}
					
					
						
					{(isEditPick) ?
						<View style={styles.buttonSec}>
							<RaisedTextButton
								title={STRCONSTANT.CANCEL_PICK}
								color={COLOR.BUTTON_COLOR_CANCEL}
								titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
								onPress={ () => this.cancelRoster('pick') }
								style={styles.cancelStyle}
							/>
							<RaisedTextButton
								title={STRCONSTANT.UPDATE_PICK}
								color={COLOR.BUTTON_COLOR_CANCEL}
								titleColor={COLOR.BUTTON_COLOR}
								onPress={ () => this.updateRoster('pick') }
								style={styles.UpdateStyle}
							/>
						</View>
						:
						<View></View>
					}
					
				</CardView>
				{
					//update drop
				}
				<CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={(!isEditDrop) ? styles.cardView: styles.cardViewChange}>
						<TouchableOpacity onPress={() => this.editPickDrop('Drop')}>
							<View style={styles.cardHead}>
								<Text style = {styles.headText}>
									Update Drop	
								</Text>
								{(!isEditDrop) ?
								<View style={styles.iconView}>
									<MaterialIcons name="plus-circle" size={22} color="#5b5a5a" />
								</View>:
								<View style={styles.iconView}>
									<MaterialIcons name="minus-circle" size={22} color="#5b5a5a" />
								</View>
								}
							</View>
						</TouchableOpacity>
					
					{(!isEditDrop) ?
					<View ></View>
					:
					<View style = {styles.cardContent}>
						
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextChange}>
								From :
								
							</Text>
							<DateTime 
								date = {fromDropValue} 
								mode={datePickerMode} 
								changeDate = {(fromDropValue) => {this.setState({fromDropValue: fromDropValue})}} 
								placeholder = {fromPlaceHolder}
								format = {format}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								dayAhead = {1}
								/>
						</View>
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextChange}>
								To : 
								
							</Text>
							<DateTime 
								date = {toDropValue} 
								mode={datePickerMode} 
								changeDate = {(toDropValue) => {this.setState({toDropValue: toDropValue})}} 
								placeholder = {fromPlaceHolder}
								format = {format}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								dayAhead = {2}
								/>
						</View>
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextChange}>
								Time :
								
							</Text>
							<DateTime 
								date = {timeDropValue} 
								changeDate = {(timeDropValue) => {this.setState({timeDropValue: timeDropValue})}} 
								placeholder = {timePlaceHolder}
								format = {formatTime}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								minDate = {logoutMinTime}
								maxDate = {logoutMaxTime}
								minuteInterval={logoutMin}
								/>
						</View>
					</View>
					}
					{(isEditDrop) ?
						<View style={styles.buttonSec}>
							<RaisedTextButton
								title={STRCONSTANT.CANCEL_DROP}
								color={COLOR.BUTTON_COLOR_CANCEL}
								titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
								onPress={ () => this.cancelRoster('drop') }
								style={styles.cancelStyle}
							/>
							
							<RaisedTextButton
								title={STRCONSTANT.UPDATE_DROP}
								color={COLOR.BUTTON_COLOR_CANCEL}
								titleColor={COLOR.BUTTON_COLOR}
								onPress={ () => this.updateRoster('drop') }
								style={styles.UpdateStyle}
							/>
						</View>
						:
						<View></View>}
					
				</CardView>

				{
					//Cancel trip
				}
                <CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={(!isEditCancel) ? styles.cardView: styles.cardViewCancel}>
						<TouchableOpacity onPress={() => this.editPickDrop('Cancel')}>
							<View style={styles.cardHead}>
								<Text style= {styles.headText}>
									Cancel Trip	
								</Text>
								{(!isEditCancel) ?
								<View style={styles.iconView}>
									<MaterialIcons name="plus-circle" size={22} color="#5b5a5a" />
								</View>:
								<View style={styles.iconView}>
									<MaterialIcons name="minus-circle" size={22} color="#5b5a5a" />
								</View>
								}
							</View>
						</TouchableOpacity>
					
					{
					(!isEditCancel) ?
					<View></View>
					:
					<View style = {styles.cardContent}>
						
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextChange}>
								From :
								
							</Text>
							<DateTime 
								date = {fromCancelValue} 
								mode={datePickerMode} 
								changeDate = {(fromCancelValue) => {this.setState({fromCancelValue: fromCancelValue})}} 
								placeholder = {fromPlaceHolder}
								format = {format}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								dayAhead = {1}
								/>
						</View>
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextChange}>
								To : 
								
							</Text>
							<DateTime 
								date = {toCancelValue} 
								mode = {datePickerMode} 
								changeDate = {(toCancelValue) => {this.setState({toCancelValue: toCancelValue})}} 
								placeholder = {fromPlaceHolder}
								format = {format}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								dayAhead = {2}
								/>
						</View>
					</View>
					}
					{(isEditCancel) ?
					<View style={styles.buttonSec}>
						<RaisedTextButton
							title={STRCONSTANT.CANCEL_TRIP}
							color={COLOR.BUTTON_COLOR_CANCEL}
							titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
							onPress={ () => {this.cancelRosterAll();  }}
							style={styles.cancelStyle}
						/>
					</View>
					: <View></View>
					}
				</CardView>

				{
					//Default time
				}
                <CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={(!isDefaultUpdate) ? styles.cardView: styles.cardViewCancel}>
						<TouchableOpacity onPress={() => this.editPickDrop('Default')}>
							<View style={styles.cardHead}>
								<Text style= {styles.headText}>
									Default Pick/Drop	
								</Text>
								{(!isDefaultUpdate) ?
								<View style={styles.iconView}>
									<MaterialIcons name="plus-circle" size={22} color="#5b5a5a" />
								</View>:
								<View style={styles.iconView}>
									<MaterialIcons name="minus-circle" size={22} color="#5b5a5a" />
								</View>
								}
							</View>
						</TouchableOpacity>
					
					{
					(!isDefaultUpdate) ?
					<View></View>
					:
					<View style = {styles.cardContent}>
						
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextDefault}>
								Default Pick:
								
							</Text>
							<DateTime 
								date = {pickDefaultValue} 
								changeDate = {(pickDefaultValue) => {this.setState({pickDefaultValue: pickDefaultValue})}} 
								placeholder = {timePlaceHolder}
								format = {formatTime}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								minDate = {loginMinTime}
								maxDate = {loginMaxTime}
								minuteInterval={loginMin}
								/>
						</View>
						<View style = {{ flexDirection: 'row', height: hp('5%')}}>
							<Text style={styles.cardTextDefault}>
								Default Drop: 
							</Text>
							<DateTime 
								date = {dropDefaultValue} 
								changeDate = {(dropDefaultValue) => {this.setState({dropDefaultValue: dropDefaultValue})}} 
								placeholder = {timePlaceHolder}
								format = {formatTime}
								minDate = {logoutMinTime}
								maxDate = {logoutMaxTime}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								minuteInterval={loginMin}
								/>
						</View>
					</View>
					}
					{(isDefaultUpdate) ?
					<View style={styles.buttonSec}>
						<RaisedTextButton
							title={STRCONSTANT.UPDATE_TIME}
							color={COLOR.BUTTON_COLOR_CANCEL}
							titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
							onPress={this.updateDefault}
							style={styles.cancelStyle}
						/>
					</View>
					: <View></View>
					}
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

		);
	}
	
}

const styles = StyleSheet.create({
	rootContainer: {
		width: wp('90%'),
		alignSelf: 'center',
	},
	
	cardView: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('5%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
	},
	cardViewChange:{
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('30%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
	},
	cardViewCancel:{
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('25%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
	},
	
	cardTextChange:{
		fontSize: 15,
		marginBottom: 5,
		width: wp('20%'),
		alignSelf: 'center',
		fontWeight: 'bold',
		color: '#5b5a5a', 
	},
	cardTextDefault:{
		fontSize: 15,
		marginBottom: 5,
		width: wp('25.5%'),
		alignSelf: 'center',
		fontWeight: 'bold',
		color: '#5b5a5a', 
	},
	buttonSec: {
		// paddingLeft: 10,
		paddingTop: 13,
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
		marginRight: 10
	},
	UpdateStyle: {
		borderColor: COLOR.BUTTON_COLOR,
		borderWidth: 1,
		borderRadius: 20,
	},
	iconView: {
		// height: 22,
		// width: 32,
		// backgroundColor: '#6a6a6a',
		// alignItems: 'center',
		// borderRadius: 5,
		// marginLeft:10,
		position: 'absolute',
		right: 10,
	},
	headText: {
		fontWeight: 'bold',
		color: '#5b5a5a', 
		fontSize: 18
	},
	cardHead:{
		paddingLeft:10,
		paddingBottom: 10,
		flexDirection: 'row',
		// paddingRight: 20
	},
	cardContent: {
		width: wp('85%'),
		borderColor: '#6a6a6a',
		borderWidth: .5,
		alignSelf: 'center',
		backgroundColor:'#e9e9e9',
		padding: 10,
		borderRadius: 5
	}
})


export default inject("rootStore")(observer(UpdateRoster));