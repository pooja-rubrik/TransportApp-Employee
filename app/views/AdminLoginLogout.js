import React, { Component } from "react";
import {
	Text, StyleSheet,
	View
} from "react-native";
import Wallpapers from "../components/Wallpaper";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import { observer, inject } from "mobx-react";
import {toJS} from 'mobx';
import moment from 'moment';

import DateTime from '../components/DateTimePicker';
import STRCONSTANT from '../services/StringConstants';
import COLOR from '../services/AppColor';
import { ScrollView } from "react-native-gesture-handler";

class AdminLoginLogout extends Component {
    constructor(props) {
		console.log('constructor>>')
		super(props);
		this.usersStore =  this.props.rootStore.usersStore;
		this.adminStore = this.props.rootStore.adminStore;
		this.utilities  = this.usersStore.utilities;
        this.state = {
            format: 'YYYY-MM-DD',
            formatTime: 'HH:mm:ss',
            timePlaceHolder: 'Select Time',
            datePlaceHolder: 'Select Date',
            selectDate: moment().format('YYYY-MM-DD'),
            // selectDate: '',
			datePickerMode: 'date',
			empDetails: '',
			loginMinTime: this.props.navigation.getParam('pageName') == 'Assign Login' ? this.utilities.loginTime.split('-')[0] : this.utilities.logoutTime.split('-')[0],
			loginMaxTime: this.props.navigation.getParam('pageName') == 'Assign Login' ? this.utilities.loginTime.split('-')[1] : this.utilities.logoutTime.split('-')[1],
			loginMin: 30,
		}
		this.assignType = this.props.navigation.getParam('pageName') == 'Assign Login' ? 'LOGIN' : 'LOGOUT';
    }
    static navigationOptions = ({ navigation }) => ({
		title: (navigation.state.params.pageName) ? `${navigation.state.params.pageName}` : 'Assign Login',
	});
	
	componentDidMount() {
		this.getAssignData();
		
	}

	getAssignData = (changeDate = '', changeTime = '') => {
		this.adminStore.getDailyLoginData(this.props.navigation.getParam('pageName'), changeDate, changeTime).then(()=> {
			console.log(toJS(this.adminStore.adminData.empDetails))
			this.usersStore.filterEmployeeForAssign(this.adminStore.adminData.empDetails).then(()=>{
				this.setState({empDetails: toJS(this.usersStore.users.filterEmployees)})
			})
			
		});
	}

	assignDriver = (empId, tripTime) => {
		this.props.navigation.navigate('AdminAssignDriverScreen', { 'pageName':
			JSON.stringify({
				type: this.assignType, 
				tripDate: this.state.selectDate, 
				tripTime,
				empId
			}),
			getAssignData: this.getAssignData
		});
	}

	filterByDate = (selectDate) => {
		this.setState({selectDate: selectDate});
		this.getAssignData(selectDate, this.state.selectTime);
	}

	filterByTime = (selectTime) => {
		if(this.state.selectDate != '') {
			this.setState({selectTime: selectTime});
			this.getAssignData(this.state.selectDate, selectTime);
		}
		
	}
    
    render() {
		let {selectDate, selectTime, datePlaceHolder, format, timePlaceHolder, 
			formatTime, datePickerMode, empDetails, loginMinTime, loginMaxTime, loginMin } = this.state;
		var empList = empDetails.length != 0 ? empDetails.map((employee, index) => (
			<CardView
				cardElevation={4}
				cardMaxElevation={4}
				cornerRadius={5}
				style={styles.cardView}
				key = {index}>
				<View style={styles.leftCardView}>
					<Text style={styles.cardText}>
						Name : {employee.empName}
					</Text>
					<Text style={styles.cardText}>
						Contact : {employee.empPhoneNumber}
					</Text>
					<Text style={styles.cardText}>
						Address : {employee.empHomeAddress}
					</Text>
				</View>
				<View style={styles.rightCardView}>
				
					{(employee.status == null || employee.status == 'ASSIGN')? 
						<RaisedTextButton
							title={STRCONSTANT.ASSIGN_TRIP}
							color={COLOR.BUTTON_COLOR}
							titleColor={COLOR.BUTTON_FONT_COLOR}
							onPress={() => this.assignDriver(employee.empID, employee.tripTime)}
							style={styles.assignStyle}
						/>
						: 
						(employee.status == 'CANCEL')? 
							<RaisedTextButton
								title={STRCONSTANT.CANCELSTATUS}
								color={COLOR.EMAIL_BUTTON_COLOR_CANCEL}
								titleColor={COLOR.BUTTON_COLOR_CANCEL}
								// onPress={() => this.assignDriver(employee.empID, employee.tripTime)}
								style={styles.assignStyleCancel}
								disabled={true}
								titleStyle = {styles.btnTitle}
							/> 
							:
							<RaisedTextButton
								title={STRCONSTANT.BOOKED}
								color={COLOR.EMAIL_BUTTON_COLOR_CANCEL}
								titleColor={COLOR.BUTTON_COLOR_CANCEL}
								// onPress={() => this.assignDriver(employee.empID, employee.tripTime)}
								style={styles.assignStyle}
								// disabled={true}
							/>
					}
					
				</View>
			</CardView>
		)): 
		<CardView
		cardElevation={4}
		cardMaxElevation={4}
		cornerRadius={5}
		style={styles.cardView}
		>
			<View style={styles.leftCardViewEmpty}>
				<Text style={styles.cardText}>
					No Employees!
				</Text>
			</View>
		</CardView>;

        return(
            <Wallpapers>
                <CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={styles.cardViewHead}>
                        <View style={styles.headerFormat}>
                            <DateTime 
                                date = {selectDate} 
                                changeDate = { (selectDate) => { this.filterByDate(selectDate) } } 
                                placeholder = {datePlaceHolder}
                                format = {format}
								mode={datePickerMode} 
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								futureDate = {1}
                                />    
                            <DateTime 
                                date = {selectTime} 
                                changeDate = { (selectTime) => { this.filterByTime(selectTime) }} 
                                placeholder = {timePlaceHolder}
								format = {formatTime}
								inputStyle = {{marginLeft:16, backgroundColor: '#fff', paddingRight:40}}
								minDate = {loginMinTime}
								maxDate = {loginMaxTime}
								minuteInterval={loginMin}
                                />   
                        </View>
                     
                </CardView>
				<ScrollView>
				{empList}
				</ScrollView>
			</Wallpapers>
        )
    }
}
const styles = StyleSheet.create({
	rootContainer: {
		width: wp('90%'),
		alignSelf: 'center',
    },
    cardViewHead: {
        backgroundColor: 'white',
		width: wp('90%'),
		height: hp('7.5%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
    },
	cardView: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('11%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10,
		flexDirection: 'row'
	},
	cardText: {
		fontSize: 14,
		marginLeft: 10,
		marginBottom: 5,
		marginRight: 15
    },	
    headerFormat:{
        flexDirection: 'row',
        flex: 1
	},
	leftCardView: {
		width: wp('60%')
	},
	rightCardView: {
		width: wp('40%'),
		alignSelf: 'center',
	},
	assignStyle:{
		width: wp('25%'),
		// borderColor: '#f00',
		// borderWidth: .4
	},
	assignStyleCancel: {
		width: wp('27%'),
		// marginRight: 10
	},
	leftCardViewEmpty: {
		alignSelf: 'center'
	},
	btnTitle: {
		marginLeft: -12,
		marginRight: -12
	}
})

export default inject("rootStore")(observer(AdminLoginLogout));