import React from "react";
import {
    Text, StyleSheet, TouchableOpacity,
    View, Image, Platform, Alert
} from "react-native";
import CardView from 'react-native-cardview'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RaisedTextButton } from 'react-native-material-buttons';
import moment from 'moment';
import ModalDropdown from 'react-native-modal-dropdown';
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import { Button } from 'react-native-paper';

import DateTime from './DateTimePicker';
import statusIconBook from '../assets/icons/cabbooked.png'
import statusIconNotBook from '../assets/icons/cabnotbooked.png'
import STRCONSTANT from '../services/StringConstants';
import COLOR from '../services/AppColor';


const platform = Platform.OS;
class AdminEmployee extends React.PureComponent {

    constructor(props) {
        super(props);
        this.adminStore = this.props.rootStore.adminStore;
        this.driverStore = this.props.rootStore.driverStore;
        this.empStore = this.props.rootStore.empStore;
        this.currentDate = moment().format('YYYY-MM-DD');
        this.state = {
            currOpenId: '',
            isExpand: false,
            timePick: '',
            pickPlaceHolder: this.props.isCheckIn ? 'Pick Time': 'Drop Time',
            loginMin: 30,
            formatTime: 'HH:mm',
            driverList: [
                // {value: 'driver1', vehicle: 'vehicle1', status: '2 seats left'},
                // {value: 'driver2', vehicle: 'vehicle2', status: '1 seats left'},
                // {value: 'driver3', vehicle: 'vehicle3', status: '3 seats left'}
            ],
            selectedDriver: '',
            assignDisable: true,
            defaultSelect: 'Select Driver',
            driverName: ''
        }
        console.log(this.props, toJS(this.adminStore))
    }

    getAvailDriver = (tripDate = '', tripTime = '') => {
        this.adminStore.getDriverListByTime( tripDate, tripTime).then(()=> {
            console.log(toJS(this.adminStore.adminData.availableDriverList))
            if(this.props.employee.assignDriver=='') {
                this.setState({driverList: toJS(this.adminStore.adminData.formattedDriverList), defaultSelect: 'Select Driver'})
            } else {
                this.setState({driverList: toJS(this.adminStore.adminData.formattedDriverList), defaultSelect: this.props.employee.assignDriver})
            }
		});
    }

    callPickService = (pickChangeData) => {
        this.adminStore.addPickTime(`${pickChangeData.timePick}:00`, pickChangeData.empid, this.props.checkInDate).then(() => {
            console.log(this.adminStore.adminData.pickData);
            // this.props.refreshEmployee()
            if(this.adminStore.adminData.pickData.code == 200 ){
                
                this.props.showMessage('Pickup time has been updated.')
                
            }  else {
                Alert.alert('Something went wrong!')
            }
            
        })
    }
    

    expandCard = (isExpand, currId, tripTime) => {
        console.log('>>>>>>', isExpand, currId, this.state.currOpenId)
        if (this.state.currOpenId == currId) {
            this.setState({
                currOpenId: ''
            });
        } else {
            this.setState(isExpand ? { isExpand: false, currOpenId: currId } : { isExpand: true, currOpenId: currId })
            console.log(this.state, currId);
        }
        if(this.props.employee.assignDriver!=''){
            this.callDriverData(this.props.employee.assignDriver);
        }
        this.getAvailDriver( this.props.checkInDate, tripTime )
    }

    callDriverData = (vehicleNo) => {
        this.driverStore.setDriverData( vehicleNo ).then(()=> {
            console.log(this.driverStore.driverData.driverName, this.props.employee.assignDriver )
            this.setState({'driverName': this.driverStore.driverData.driverName? this.driverStore.driverData.driverName: '' })
        } )
    }

    onChangePick = (timePick, empid, changeType = '') => {
        //api hit
        //refresh data
        if(changeType == ''){
            this.props.confirmPickChange(timePick, empid);
            
        } else {
            this.empStore.submitEmpTime( `${timePick}:00`, empid, 'ASSIGN', 'drop' ).then( () => {
                console.log( 'success>>', toJS(this.empStore.empData.submitTime) )
                if ( this.empStore.empData.submitTime && this.empStore.empData.submitTime.code == 200 ) {
                    this.props.showMessage('Time updated successfully.')
                } else {
                    Alert.alert( 'Something went wrong.' )
                }
            })
        }
        
    }

    renderPrompt = (rowData) => {
        console.log('render prompt..', rowData);
        this.props.employee.assignDriver = '';
        this.setState({ selectedDriver: rowData.vehicle, assignDisable: false })
        return rowData.vehicle;
    }

    assignDriver = (empId) => {
        assignType = this.props.assignType == 'Assign Login' ? 'LOGIN':'LOGOUT'
        param  = {empID: empId, type: assignType, tripDay: this.props.checkInDate, vehicleNumber: this.state.selectedDriver};
        this.adminStore.assignDriver( param ).then(()=> {
            console.log(toJS(this.adminStore.adminData.assignDriver))
            this.setState({assignDisable: true})
            if(this.adminStore.adminData.assignDriver.code == 200) {
                this.props.refreshEmployee();
                this.callDriverData(this.state.selectedDriver);
                Alert.alert('Driver has been assigned successfully.')
            } else {
                Alert.alert('Please try again!')
            }
			
		});
    }

    sendOTP = () => {

    }

    render() {
        let { isExpand, currOpenId, pickPlaceHolder, formatTime, 
            loginMin, driverList, assignDisable, defaultSelect, driverName } = this.state;
        let { employee, loginMinTime, loginMaxTime, isCheckIn,  } = this.props;
        loginMaxTime = isCheckIn ? employee.tripTime ? moment(employee.tripTime, 'HH:mm:ss').format('HH:mm') : loginMaxTime : loginMaxTime;
        
        return (
            <CardView
                cardElevation={4}
                cardMaxElevation={4}
                cornerRadius={5}
                style={(currOpenId == employee.empID) ? styles.cardViewChange : styles.cardView}
                // style={styles.cardViewChange}
            >
                <TouchableOpacity onPress={() => this.expandCard(isExpand, employee.empID, employee.tripTime )}>
                    <View style={styles.cardHead}>
                        <Text style={platform == "ios" ? styles.headTextIOS : styles.headText}>
                            {employee.empName}
                        </Text>
                        <View style={platform == "ios" ? styles.iconViewIOS : styles.iconView}>
                            {(employee.status == 'ASSIGN' || employee.status == null)?
                                <Image style={styles.statusIcon} source={statusIconNotBook} />
                                : (employee.status == 'BOOKED')?
                                <Image style={styles.statusIcon} source={statusIconBook} />
                                : null
                                // :<Image style={styles.statusIcon} source={statusIconBook} />
                            }
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    (currOpenId == employee.empID) ?
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextAddr}>
                                    
                                <Text style={[styles.cardText, styles.fontAddr]}>
                                    {employee.empHomeAddress}
                                    
                                </Text>
                            </View>
                            <View style={styles.cardAction}>
                                <View style={styles.leftSec}>
                                    {/* <Text style={[styles.cardText, styles.textPadTop]}>
                                        {employee.empPhoneNumber}
                                    </Text> */}
                                    {
                                    isCheckIn?
                                        <Text style={[styles.cardText, styles.textPadTop]}>
                                            Check-In: {employee.tripTime && employee.tripTime != null ? moment(employee.tripTime, 'HH:mm:ss').format('HH:mm'): 'No Trip'}
                                            
                                        </Text>
                                        :
                                        <Text style={[styles.cardText, styles.textPadTop]}>
                                            Check-Out: {employee.tripTime && employee.tripTime != null ? moment(employee.tripTime, 'HH:mm:ss').format('HH:mm'): 'No Trip'}
                                        </Text>
                                    }
                                    
                                    <View>
                                    {(employee.status == 'ASSIGN' || employee.status == null || employee.status == 'BOOKED' ) ?
                                        isCheckIn ?
                                            <DateTime 
                                                date = {employee.pickupTime} 
                                                changeDate = {(timePick) => {this.onChangePick( timePick, employee.empID );}} 
                                                placeholder = {pickPlaceHolder}
                                                format = {formatTime}
                                                inputStyle = {styles.timeinputStyle}
                                                iconStyle = {{left:0, height: 20, width: 20}}
                                                style = {styles.timeStyle}
                                                minDate = {loginMinTime}
                                                maxDate = {loginMaxTime}
                                                minuteInterval={loginMin}
                                            />:
                                            <DateTime 
                                                date = {employee.tripTime} 
                                                changeDate = {(timePick) => {this.onChangePick(timePick, employee.empID, 'logout');}} 
                                                placeholder = {pickPlaceHolder}
                                                format = {formatTime}
                                                inputStyle = {styles.timeinputStyle}
                                                iconStyle = {{left:0, height: 20, width: 20}}
                                                style = {styles.timeStyle}
                                                minDate = {loginMinTime}
                                                maxDate = {loginMaxTime}
                                                minuteInterval={loginMin}
                                            />
                                        : null
                                    }
                                    </View>
                                </View>
                                <View style={styles.rightSec}>
                                {(employee.status == 'ASSIGN' || employee.status == null || employee.status == 'BOOKED' )?
                                    (employee.assignDriver != '') ? 
                                    <View>
                                        <View style = {styles.dropSec}>
                                            <ModalDropdown 
                                                options={driverList}
                                                renderRow={({ vehicle, status }) => 
                                                <View style={styles.driverOption}>
                                                    {/* <Text style={styles.dropTextVisible}>{value} ({vehicle})</Text> */}
                                                    <Text style={styles.dropTextVisible}>{vehicle}</Text>
                                                    <Text style={styles.driverStatus}>{status}</Text>
                                                </View>}
                                                style={styles.driverDrop}
                                                textStyle={styles.dropTextVisible}
                                                defaultValue = {defaultSelect}
                                                renderButtonText={this.renderPrompt}
                                                // dropdownTextStyle={styles.dropdownText}
                                                dropdownStyle={styles.dropdownStyle}
                                            >
                                            </ModalDropdown>
                                            <Text style= {styles.dropImg}>
                                            ▼
                                            </Text>
                                        </View>
                                        
                                        <Text style={[styles.cardText, styles.textPadTop, styles.textPadLeft]}>
                                            {driverName}
                                        </Text>
                                        
                                        <RaisedTextButton
                                            title={STRCONSTANT.RESEND_OTP}
                                            color={COLOR.BUTTON_COLOR_EMP}
                                            titleColor={COLOR.BUTTON_FONT_COLOR_EMP}
                                            onPress={this.sendOTP}
                                            style={styles.buttonTrip}
                                            titleStyle={styles.titleStyle}
                                        />
                                        
                                    </View>
                                    :
                                    <View>
                                        <View style = {styles.dropSec}>
                                            <ModalDropdown 
                                                options={driverList}
                                                renderRow={({ vehicle, status }) => 
                                                <View style={styles.driverOption}>
                                                    {/* <Text style={styles.dropTextVisible}>{value} ({vehicle})</Text> */}
                                                    <Text style={styles.dropTextVisible}>{vehicle}</Text>
                                                    <Text style={styles.driverStatus}>{status}</Text>
                                                </View>}
                                                style={styles.driverDrop}
                                                textStyle={styles.dropTextVisible}
                                                defaultValue = {defaultSelect}
                                                renderButtonText={this.renderPrompt}
                                                // dropdownTextStyle={styles.dropdownText}
                                                dropdownStyle={styles.dropdownStyle}
                                            >
                                            </ModalDropdown>
                                            <Text style= {styles.dropImg}>
                                            ▼
                                            </Text>
                                        </View>
                                        
                                        <RaisedTextButton
                                            title={STRCONSTANT.ASSIGN_TRIP}
                                            color={COLOR.BUTTON_COLOR_EMP}
                                            titleColor={COLOR.BUTTON_FONT_COLOR_EMP}
                                            onPress={()=>this.assignDriver(employee.empID)}
                                            style={styles.buttonTrip}
                                            titleStyle={styles.titleStyle}
                                            disabled={assignDisable}
                                        />
                                       
                                        <RaisedTextButton
                                            title={STRCONSTANT.SEND_OTP}
                                            color={COLOR.BUTTON_COLOR_EMP}
                                            titleColor={COLOR.BUTTON_FONT_COLOR_EMP}
                                            onPress={this.sendOTP}
                                            style={styles.buttonTrip}
                                            titleStyle={styles.titleStyle}
                                        />
                                    </View>
                                    :
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        TRIP CANCELLED
                                    </Text>
                                    }

                                </View>
                            </View>
                        </View>
                        :
                        <View></View>
                }
            </CardView>
        )
    }
}
const styles = StyleSheet.create({
    cardView: {
        // backgroundColor: '#94EBC5',
        backgroundColor: '#fff',
        width: wp('97%'),
        height: hp('5%'),
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 10
    },
    buttonHelp: {
		borderRadius: 20,
		// marginBottom: 20,
		height: 25,
		marginTop: 10,
        // fontSize: 18,
        width: wp('43%'),
        // paddingTop: -15,
        // paddingBottom: -15
		// textTransform: 'none'
	},
    cardViewChange: {
        // backgroundColor: '#94EBC5',
        backgroundColor: '#fff',
        width: wp('97%'),
        // height: hp('15%'),
        alignSelf: 'center',
        marginTop: 5,
        paddingBottom: 10,
        
    },
    cardHead: {
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statusIcon: {
        height: 28,
        width: 34,
        right: 0,
    },
    iconView: {
        right: 10,
        paddingTop: 5,

    },
    iconViewIOS: {
        right: 10,
        paddingTop: 7,

    },
    headTextIOS: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.HEADER_TXT_COLOR,
        paddingTop: 10,
    },
    headText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.HEADER_TXT_COLOR,
        paddingTop: 6,
        paddingBottom: 6
    },
    cardContent: {
        // paddingLeft: 10,
        borderTopWidth: .5,
        borderTopColor: '#9A9C9B',
        width: wp('93%'),
        alignSelf: 'center',
        marginTop: 5
    },
    cardTextAddr: {
        borderBottomWidth: .5,
        borderBottomColor: '#9A9C9B',

    },
    cardText: {
        color: '#406353'
    },
    leftSec: {
        flexDirection: 'column',
        paddingTop: 2,
        width: wp('48%'),
    },
    rightSec:{
        width: wp('48%'),
        alignItems: 'center'
    },
    textPadTop: {
        paddingTop: 2
    },
    textPadLeft: {
        paddingLeft: 7
    },
    cardAction: {
        flexDirection: 'row'
    },
    titleStyle: {
        fontSize: 12,
        // textTransform: 'capitalize'
    },
    buttonTrip: {
        borderRadius: 20,
        // marginBottom: 20,
        height: 19,
        marginTop: 5,
        width: wp('43%'),
        // marginLeft: 60
    },

    fontAddr: {
        fontSize: 14
    },
    timeinputStyle: {
		marginLeft:0, 
        backgroundColor: '#fff', 
		paddingRight:0, 
		// paddingLeft: 10,
        borderWidth: 0, 
        height: 22,
        borderRadius: 10,
        borderColor: '#333',
        borderWidth: .2
    },
    timeStyle:{ 
        'width': wp('43%'), 
        marginBottom:0,
        height: 35,
    },
    dropdownStyle: {
        width: wp('38%'),
        alignItems: 'center',
        borderWidth: 2,
        backgroundColor: '#EFEEEE',
        // marginRight: -1
        marginLeft: 10,
        height: hp('38%')
    },
    
    dropTextVisible:{
        color: '#406353',
    },
    
    driverDrop:{
        marginTop: 5,
        paddingLeft: 7,
        width: wp('38%')
    },
    driverOption: {
        borderBottomWidth: .4,
        height: hp('6%'),
        paddingTop: 6,
        width: wp('35%')
    },
    dropSec: {
        flexDirection: 'row'
    },
    dropImg: {
        color: '#406353',
        fontSize: 13,
        paddingTop: 5
    }
})


export default inject("rootStore")(observer(AdminEmployee));