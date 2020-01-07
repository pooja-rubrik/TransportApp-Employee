import React from "react";
import {
	Text, StyleSheet, Image, Alert,
    View,  Platform, TouchableOpacity
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';

import DateTime from '../components/DateTimePicker';
import CheckInTab from '../components/CheckInTabs';
import AdminEmpListCab from './AdminEmpListCab';
import cancelTime from '../assets/icons/cancel.png';
import Color from '../services/AppColor';

const platform = Platform.OS;

class CabStatus extends React.PureComponent {

    constructor(props){
        super(props);
        this.usersStore =  this.props.rootStore.usersStore;
        this.utilities  = this.usersStore.utilities;
        this.adminStore = this.props.rootStore.adminStore;
        this.state = {
            checkInTabVisible : true,
            datePickerMode: 'date',
			datePlaceHolder: 'select Date',
			timePlaceHolder: 'Select Time',
			format: 'YYYY-MM-DD',
			formatTime: 'HH:mm',
			loginMinTime: this.utilities.loginTime.split('-')[0],
			loginMaxTime: this.utilities.loginTime.split('-')[1],
            loginMin: 30,
            selectDate: moment().format('YYYY-MM-DD'),
            selectTime: '',
            empDetails: '',
            assignType: 'Assign Login'
        }
    }

    componentDidMount() {
		this.getAssignData('', this.state.assignType, '');
	}

    tabSwitch = (tab) => {
		this.setState({
			checkInTabVisible: (tab=='checkin') ? true : false,
			loginMinTime: (tab=='checkin') ? this.utilities.loginTime.split('-')[0] : this.utilities.logoutTime.split('-')[0],
            loginMaxTime: (tab=='checkin') ? this.utilities.loginTime.split('-')[1] : this.utilities.logoutTime.split('-')[1],
            assignType: (tab=='checkin') ? 'Assign Login' : 'Assign Logout'
		})
		if(tab == 'checkin'){
			this.getAssignData(this.state.selectDate, 'Assign Login', this.state.selectTime);
		} else {
			this.getAssignData(this.state.selectDate, 'Assign Logout', this.state.selectTime);
		}
    }

    filterByDate = (selectDate) => {
		this.setState({selectDate: selectDate});
		this.getAssignData(selectDate, this.state.assignType, this.state.selectTime);
	}

	filterByTime = (selectTime) => {
		if(this.state.selectDate != '') {
			this.setState({selectTime: selectTime});
			this.getAssignData(this.state.selectDate, this.state.assignType, selectTime);
		}
		
    }
    
    getAssignData = async (changeDate = '', assignType, changeTime = '') => {
        // console.log(changeDate, assignType, changeTime)
		await this.adminStore.getDailyLoginData(assignType, changeDate, changeTime?changeTime +':00': '').then(()=> {
			console.log(toJS(this.adminStore.adminData.empDetails))
			this.usersStore.filterEmployeeForAssign(this.adminStore.adminData.empDetails).then(()=>{
                employees =  toJS(this.usersStore.users.filterEmployees).filter(user=> (user.empType == 'ADMIN' || user.empType == 'EMPLOYEE'))
				this.setState({empDetails: employees})
			})
			
		});
    }
    
    
    removeTime = () => {
		this.setState({selectTime: ''})
		this.getAssignData(this.state.selectDate, this.state.assignType, '');
    }
    
    refreshEmployee = () => {
        this.getAssignData(this.state.selectDate, this.state.assignType, this.state.selectTime);
    }

    showMessage = (message) => {
        this.getAssignData(this.state.selectDate, this.state.assignType, this.state.selectTime).then(() => {
            console.log('mesaaee>>>', message);
            Alert.alert(message)
        })
    }
    
    render() {
        let {checkInTabVisible, selectDate, datePlaceHolder, timePlaceHolder, format, selectTime, 
            formatTime, loginMin, loginMinTime, loginMaxTime, datePickerMode, empDetails, assignType } = this.state;
        return (
            
                <View style = {{flex:1}}>
                    <CheckInTab checkInTabVisible = {checkInTabVisible} tabSwitch = {this.tabSwitch}/>
                    <View style={styles.filterSection}>
                        <DateTime 
                            date = {selectDate} 
                            mode={datePickerMode} 
                            // changeDate = {(pickDateValue) => {this.setState({pickDateValue: pickDateValue})}} 
                            changeDate = { (selectDate) => { this.filterByDate(selectDate) } } 
                            placeholder = {datePlaceHolder}
                            format = {format}
                            inputStyle = {styles.dateinputStyle}
                            futureDate = {1}
                            style = {styles.dateStyle}
                            iconStyle = {{left:5, height: 30, width: 30}}

                        />
                        <DateTime 
                            date = {selectTime} 
                            changeDate = { (selectTime) => { this.filterByTime(selectTime) }} 
                            placeholder = {timePlaceHolder}
                            format = {formatTime}
                            inputStyle = {styles.timeinputStyle}
                            iconStyle = {{left:5, height: 30, width: 30}}
                            style = {styles.timeStyle}
                            minDate = {loginMinTime}
                            maxDate = {loginMaxTime}
                            minuteInterval={loginMin}
                        />
                        <View style={(platform == "ios") ? styles.iconOuterIOS: styles.iconOuter}>
                            
                            <TouchableOpacity onPress={() => this.removeTime()}>
                                <Image style={styles.iconCancel} source={cancelTime} />
                            </TouchableOpacity>
                            
                        </View>
                        
                    </View>
                    
                    <AdminEmpListCab 
                        empData = {empDetails} 
                        assignType = {assignType} 
                        isCheckIn = {checkInTabVisible} 
                        loginMinTime = {loginMinTime} 
                        loginMaxTime = {loginMaxTime} 
                        checkInDate = {selectDate} 
                        checkInTime = {selectTime}
                        refreshEmployee = {this.refreshEmployee}
                        showMessage = {this.showMessage}
                    />
                </View>
            
        )
    }
}
const styles = StyleSheet.create({
    filterSection: {
        // flex:1,
        flexDirection:'row',
        
        backgroundColor: Color.HEADER_BG_COLOR,
        height: hp('5%'),
       
    },
    dateinputStyle: {
        marginLeft:0, 
        backgroundColor: '#fff', 
        paddingRight:20, 
        borderWidth: 0, 
        borderBottomLeftRadius: 10, 
	},
	timeinputStyle: {
		marginLeft:0, 
        backgroundColor: '#fff', 
		paddingRight:0, 
		paddingLeft: 10,
        borderWidth: 0, 
        
	},
    dateStyle:{ 
		flex:1,
        'width': wp('49%'), 

	},
	timeStyle:{ 
        'width': wp('40%'), 
        marginLeft:3, 
    }, 
	iconCancel: {
		height: 22,
		width: wp('5.5%')
	},
	iconOuter: {
		backgroundColor: '#fff',
		width: wp('9%'),
		padding:7,
        paddingTop:9,
        borderBottomRightRadius: 10
	}, 
	iconOuterIOS: {
		backgroundColor: '#fff',
		// height: hp('5%'),
		width: wp('9%'),
		padding:7,
        paddingTop:9,
        borderBottomRightRadius: 10
	}, 
    
})
export default inject("rootStore")(observer(CabStatus));