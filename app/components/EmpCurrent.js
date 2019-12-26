import React from "react";
import {
	Text, StyleSheet,
	View, TouchableOpacity
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

class EmpCurrent extends React.PureComponent {

    constructor(props){
        super(props);
        this.empStore =  this.props.rootStore.empStore;
        this.driverStore = this.props.rootStore.driverStore;
        this.state = {
            timePick: '',
            pickPlaceHolder: this.props.isCheckIn ? 'CHECK-IN TIME': 'CHECK-OUT TIME',
            loginMin: 30,
            formatTime: 'HH:mm',
        }
        
        console.log(this.empStore.empData.dailyLogin);
    }
    
    componentWillUpdate() {
        this.setState({timePick:  this.props.isCheckIn ? this.empStore.empData.dailyLogin ? this.empStore.empData.dailyLogin.loginTime: '': 
        this.empStore.empData.dailyLogout? this.empStore.empData.dailyLogout.logoutTime: ''})
        // console.log(this.props.isCheckIn, this.state.timePick, this.empStore.empData.dailyLogin ? moment(this.empStore.empData.dailyLogin.loginTime, 'HH:mm:ss').format('HH:mm'): '' )
    }

    onChangeDate = (date) => {
		//submit value
		console.log('>>>>>>', date, moment(date, 'HH:mm').format('HH:mm:ss'))
		date = moment(date, 'HH:mm').format('HH:mm:ss')
        changeType = this.props.isCheckIn ? 'pick': 'drop'
        if(date !== this.state.timePick) {
            this.props.submitChange( date, 'ASSIGN', changeType );
            this.setState( {timePick: date} );
        }
    }
    // componentWillReceiveProps() {
    //     console.log(this.props.driverData.vehicleNo? this.props.driverData.vehicleNo: '');
    // }
    
    cancelTime = () => {
        cancelType = this.props.isCheckIn ? 'pick': 'drop'
        this.props.cancelTime(cancelType);
    }

    render() {
        let {loginMinTime, loginMaxTime, isCheckIn} = this.props
        let {timePick, pickPlaceHolder, formatTime, loginMin } = this.state;
        let {empData} = this.empStore;
        let {driverData} = this.driverStore;
        return (
            <View>
                <CardView
                    cardElevation={4}
                    cardMaxElevation={4}
                    cornerRadius={5}
                    style={styles.cardView}
                >
                    <View style={styles.cardHead}>
                        <Text style={styles.headText}>
                            CURRENT DATE
                        </Text>
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeftView}>
                            <Text style={styles.leftText}>
                                {isCheckIn? empData.dailyLogin && empData.dailyLogin.loginTime != null ? moment(empData.dailyLogin.loginTime, 'HH:mm:ss').format('HH:mm'): 'No Trip'
                                                    : empData.dailyLogout && empData.dailyLogout.logoutTime != null? moment(empData.dailyLogout.logoutTime ,'HH:mm:ss').format('HH:mm'): 'No Trip'}
                                                   
                            </Text>
                            <Text style={styles.leftText}>
                                {driverData.code ==200? driverData.vehicleNo: 'No Vehicle'}
                            </Text>
                            <Text style={styles.leftText}>
                                {driverData.code ==200? driverData.driverPhone: 'No Driver Contact'}
                            </Text>
                        </View>
                        <View style={styles.cardRightView}>
                            <DateTime 
                                date = {timePick} 
                                changeDate = {(timePick) => {this.onChangeDate(timePick);}} 
                                placeholder = {pickPlaceHolder}
                                format = {formatTime}
                                inputStyle = {styles.timeinputStyle}
								iconStyle = {{left:0, height: 20, width: 20}}
								style = {styles.timeStyle}
                                minDate = {loginMinTime}
                                maxDate = {loginMaxTime}
                                minuteInterval={loginMin}
                            />
                            <RaisedTextButton
                                title={STRCONSTANT.CANCEL_PICK}
                                color={COLOR.BUTTON_COLOR_EMP}
                                titleColor={COLOR.BUTTON_FONT_COLOR_EMP}
                                onPress={ () => this.cancelTime() }
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
        backgroundColor: '#C4DCC8',
        width: wp('98%'),
        // height: hp('12%'),
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 10,
        //paddingLeft: 6,
        paddingRight:6,
        paddingBottom:5
    },
    cardHead: {
        paddingTop:5,
        borderBottomWidth:.8,
        borderBottomColor: '#AAADAF',
        paddingBottom: 2,
        paddingLeft: 7
    },
    headText: {
        color: '#4D554D',
        fontWeight: '700',
        fontSize: 16
    },
    cardContent: {
        flexDirection:'row',
    },
    cardLeftView: {
        backgroundColor: '#AFCEB2',
        width: wp('48%'),
        borderRadius: 10,
        marginTop: 3,
        marginLeft: 4
    },
    cardRightView: {
        width: wp('48%'),
        alignItems: 'center'
    },
    leftText: {
        color: '#455147',
        fontSize: 13.5,
        paddingTop: 3,
        paddingLeft: 3
    },
    timeinputStyle: {
		marginLeft:0, 
        backgroundColor: '#fff', 
		paddingRight:0, 
		// paddingLeft: 10,
        borderWidth: 0, 
        height: 22,
        borderRadius: 10
    },
    timeStyle:{ 
        'width': wp('43%'), 
        marginBottom:0,
        height: 35,
    },
    buttonTrip: {
        borderRadius: 20,
        // marginBottom: 20,
        height: 19,
        marginTop: 0,
        width: wp('43%'),
        // marginLeft: 60
    },
    titleStyle: {
        fontSize: 12
    }

})
export default inject("rootStore")(observer(EmpCurrent));