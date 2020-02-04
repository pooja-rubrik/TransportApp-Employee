import React from "react";
import {
	Text, StyleSheet,
	View, Alert,
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import moment from 'moment';
import CardView from 'react-native-cardview';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RaisedTextButton } from 'react-native-material-buttons';

import DateTime from '../components/DateTimePicker';
import STRCONSTANT from '../services/StringConstants';
import COLOR from '../services/AppColor';

class EmpRoster extends React.PureComponent {

    constructor(props){
        super(props);
        this.empStore =  this.props.rootStore.empStore;
        this.usersStore =  this.props.rootStore.usersStore;
        this.empId = this.usersStore.users.oktaDetail.empid;
        this.isCheckIn = this.props.isCheckIn;
        this.state = {
            timePickValue: '',
			toPickValue: '',
			fromPickValue: '',
            loginMin: 30,
            formatTime: 'HH:mm',
            format: 'YYYY-MM-DD',
            datePickerMode: 'date',
            fromPlaceHolder: 'From Date',
            toPlaceHolder: 'To Date',
            pickPlaceHolder: 'Check-In Time',
        }
        console.log('mintime>>>', this.props.loginMaxTime, this.isCheckIn);
    }

    componentWillReceiveProps () {
        this.setState({
            timePickValue: '',
			toPickValue: '',
            fromPickValue: '',
            pickPlaceHolder: !this.props.isCheckIn ? 'Check-In Time': 'Check-Out Time'
        })
    }

    componentWillUpdate() {
        this.setState({pickPlaceHolder: this.props.isCheckIn ? 'Check-In Time': 'Check-Out Time'})
    }

    updateDefault = () => {
        if(!this.state.timePickValue){
            Alert.alert(`Please enter check-in time.`);
        } else {
            this.props.showConfirm('confirmHome', '', 'updateDefault' )
        }
    }

    callUpdateDefault = () => {
        this.empStore.setDefaultTime( this.empId, moment(this.state.timePickValue, 'HH:mm').format('HH:mm:ss'), this.props.isCheckIn ).then( () => {
            console.log('default time update>>', toJS(this.empStore.empData.defaultTime))
            if( this.empStore.empData.defaultTime.code == 200 || this.empStore.empData.defaultTime.code == 201 ) {
                this.props.isCheckIn ? Alert.alert(`Default Check In time has been updated`):
                Alert.alert(`Default Check Out time has been updated`);
            }
        })
    }
    
    updateRoster = () => {
        console.log(this.state.fromPickValue, this.state.toPickValue, this.state.timePickValue)
        if( !this.state.fromPickValue) {
            Alert.alert(`Please enter from date.`);
        } else if( !this.state.toPickValue) {
            Alert.alert(`Please enter to date.`);
        } else if ( !this.state.timePickValue ) {
            Alert.alert(`Please enter check-in time.`);
        } else {
           this.props.showConfirm('confirmHome', '', 'updateRoster' )
            
        }
        
    }
    
    callUpdateRoster = () => {
        type = this.props.isCheckIn? 'pick': 'drop'
        timeParam = (this.props.isCheckIn) ? {fromDate: this.state.fromPickValue, toDate: this.state.toPickValue, loginTime: moment(this.state.timePickValue, 'HH:mm').format('HH:mm:ss'), empID: this.empId, status: 'ASSIGN'}
                    : {fromDate: this.state.fromPickValue, toDate: this.state.toPickValue, logoutTime: moment(this.state.timePickValue, 'HH:mm').format('HH:mm:ss'), empID: this.empId, status: 'ASSIGN'}
        this.empStore.updateRoster( this.empId, timeParam, type ).then( () => {
            console.log(toJS(this.empStore.empData.updateRoster))
            if( this.empStore.empData.updateRoster.code == 200 ) {
                Alert.alert(`Trip updated successfully.`);
            }
        });        
    }

	cancelRoster = () => {
        console.log(this.state.fromPickValue, this.state.toPickValue)
        if( !this.state.fromPickValue) {
            Alert.alert(`Please enter from date.`);
        } else if( !this.state.toPickValue) {
            Alert.alert(`Please enter to date.`);
        } else {
            this.props.showConfirm('confirmHome', '', 'cancelRoster' )
        }
        
    }
    
    callCancelRoster = () => {
        type = this.props.isCheckIn? 'pick': 'drop'
        timeParam = {fromDate: this.state.fromPickValue, toDate: this.state.toPickValue, empID: this.empId, status: 'CANCEL'}
        this.empStore.cancelRoster( this.empId, timeParam, type ).then( () => {
            console.log(this.empStore.empData.cancelRoster)
            if( this.empStore.empData.cancelRoster.code == 200 ) {
                Alert.alert(`Trip cancelled successfully`);
            }
        });
    }
    

    render() {
        let { loginMinTime, loginMaxTime,} = this.props
        let { pickPlaceHolder, formatTime, loginMin,
            fromPickValue, datePickerMode, fromPlaceHolder, format,
            toPickValue, toPlaceHolder, timePickValue

        } = this.state;
        return (
            <View >
                <CardView
                    cardElevation={4}
                    cardMaxElevation={4}
                    cornerRadius={5}
                    style={styles.cardView}
                >
                    <View style={styles.cardHead}>
                        <Text style={styles.headText}>
                            Update Recurring Trips
                        </Text>
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeftView}>
                            <DateTime 
                                date = {fromPickValue} 
                                changeDate = {(fromPickValue) => {this.setState({fromPickValue: fromPickValue})}} 
                                mode={datePickerMode} 
                                placeholder = {fromPlaceHolder}
								format = {format}
                                inputStyle = {styles.timeinputStyle}
                                placeholderTextStyle = {{paddingRight:30 }}
								iconStyle = {{left:0, height: 20, width: 20}}
								style = {styles.timeStyle}
                                dayAhead = {1}
                            />   
                            <DateTime 
                                date = {toPickValue} 
                                changeDate = {(toPickValue) => {this.setState({toPickValue: toPickValue})}} 
                                mode={datePickerMode} 
                                placeholder = {toPlaceHolder}
                                format = {format}
                                inputStyle = {styles.timeinputStyle}
                                placeholderTextStyle = {{ paddingRight:50 }}
								iconStyle = {{left:0, height: 20, width: 20}}
								style = {styles.timeStyle}
                                dayAhead = {1}
                            />
                            <DateTime 
                                date = {timePickValue} 
								changeDate = {(timePickValue) => {this.setState({timePickValue: timePickValue})}} 
                                placeholder = {pickPlaceHolder}
                                format = {formatTime}
                                inputStyle = {styles.timeinputStyle}
                                placeholderTextStyle = {{ paddingRight:5 }}
                                iconStyle = {{left:0, height: 20, width: 20}}
								style = {styles.timeStyle}
                                minDate = {loginMinTime}
                                maxDate = {loginMaxTime}
                                minuteInterval={loginMin}
                            /> 
                        </View>
                        <View style={styles.cardRightView}>
                            <RaisedTextButton
                                title={STRCONSTANT.DEL_ROSTER}
                                color={COLOR.BUTTON_COLOR_EMP}
                                titleColor={COLOR.BUTTON_FONT_COLOR_EMP}
                                onPress={ () => this.cancelRoster() }
                                style={styles.buttonTrip}
                                titleStyle={styles.titleStyle}
                            />
                            <RaisedTextButton
                                title={STRCONSTANT.UPDATE_ROSTER}
                                color={COLOR.BUTTON_COLOR_EMP}
                                titleColor={COLOR.BUTTON_FONT_COLOR_EMP}
                                onPress={ () => this.updateRoster() }
                                style={styles.buttonTrip}
                                titleStyle={styles.titleStyle}
                            />
                            <RaisedTextButton
                                title={STRCONSTANT.SET_DEFAULT}
                                color={COLOR.BUTTON_COLOR_EMP}
                                titleColor={COLOR.BUTTON_FONT_COLOR_EMP}
                                onPress={this.updateDefault}
                                style={styles.buttonTrip}
                                titleStyle={styles.titleStyle}
                            />
                        </View>
                    </View>
                </CardView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    cardView:{
        backgroundColor: COLOR.CARD_BG_COLOR,
        width: wp('97%'),
        // height: hp('14%'),
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 10,
        //paddingLeft: 6,
        paddingRight:6,
        paddingBottom:14
    },
    cardHead: {
        paddingTop:5,
        borderBottomWidth:.8,
        borderBottomColor: '#AAADAF',
        paddingBottom: 2,
        paddingLeft: 7
    },
    headText: {
        color: COLOR.HEADER_TXT_COLOR,
        fontWeight: '700',
        fontSize: 16
    },
    cardContent: {
        flexDirection:'row',
    },
    cardLeftView: {
        // backgroundColor: '#AFCEB2',
        width: wp('48%'),
        // borderRadius: 10,
        //marginTop: 3,
        marginLeft: 4
    },
    cardRightView: {
        width: wp('48%'),
        alignItems: 'center',
        paddingTop:6
    },
    
    timeinputStyle: {
		marginLeft:0, 
        backgroundColor: '#fff', 
		// paddingRight: 5,
		// paddingLeft: -50,
        borderWidth: 0, 
        height: 22,
        borderRadius: 10,
        borderWidth: .3,
        borderColor: '#333'
        // alignContent: 'flex-start'
    },
    timeStyle:{ 
        'width': wp('45%'), 
        marginBottom:0,
        height: 25,
    },
    buttonTrip: {
        borderRadius: 20,
        // marginBottom: 20,
        height: 21,
        marginTop: 4,
        width: wp('45%'),
        // marginLeft: 60
    },
    titleStyle: {
        fontSize: 13,
        textTransform: 'capitalize'
    }

})

export default inject("rootStore")(observer(EmpRoster));