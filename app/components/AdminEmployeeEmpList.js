import React from "react";
import {
    Text, StyleSheet, TouchableOpacity,
    View, Image, Platform, Alert
} from "react-native";
import CardView from 'react-native-cardview'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';

const platform = Platform.OS;
class AdminEmployeeEmpList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.adminStore = this.props.rootStore.adminStore;
        this.currentDate = moment().format('YYYY-MM-DD');
        this.state = {
            currOpenId: '',
            isExpand: false,
            
        }
        console.log(this.props, toJS(this.adminStore))
    }


    expandCard = (isExpand, currId) => {
        console.log('>>>>>>', isExpand, currId, this.state.currOpenId)
        if (this.state.currOpenId == currId) {
            this.setState({
                currOpenId: ''
            });
        } else {
            this.setState(isExpand ? { isExpand: false, currOpenId: currId } : { isExpand: true, currOpenId: currId })
            console.log(this.state, currId);
        }
    }


    renderPrompt = (rowData) => {
        console.log('render prompt..', rowData);
        this.setState({ selectedDriver: rowData.vehicle, assignDisable: false })
        return rowData.vehicle;
    }

    assignDriver = (empId) => {
        param  = {empID: empId, type: this.props.assignType, tripDay: this.props.checkInDate, vehicleNumber: this.state.selectedDriver};
        this.adminStore.assignDriver( param ).then(()=> {
            console.log(toJS(this.adminStore.adminData.assignDriver))
            if(this.adminStore.adminData.assignDriver.code == 200) {
                Alert.alert('Driver has assigned successfully.')
            } else {
                Alert.alert('Please try again!')
            }
			
		});
    }


    render() {
        let { isExpand, currOpenId, } = this.state;
        let { employee,  } = this.props;
        // employee = employee.empDetail
        
        return (
            <CardView
                cardElevation={4}
                cardMaxElevation={4}
                cornerRadius={5}
                style={(currOpenId == employee.empDetail.empID) ? styles.cardViewChange : styles.cardView}
                // style={styles.cardViewChange}
            >
                <TouchableOpacity onPress={() => this.expandCard(isExpand, employee.empDetail.empID )}>
                    <View style={styles.cardHead}>
                        <Text style={platform == "ios" ? styles.headTextIOS : styles.headText}>
                            {employee.empDetail.empName}
                        </Text>
                    </View>
                </TouchableOpacity>
                {
                    (currOpenId == employee.empDetail.empID) ?
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextAddr}>
                                <Text style={[styles.cardText, styles.fontAddr]}>
                                    {employee.empDetail.empHomeAddress}
                                </Text>
                            </View>
                            <View style={styles.cardAction}>
                                <View style={styles.leftSec}>
                                    {/* <Text style={[styles.cardText, styles.textPadTop]}>
                                        {employee.empPhoneNumber}
                                    </Text> */}
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        Check-In: {employee.login.loginTime && employee.login.loginTime != null ? moment(employee.login.loginTime, 'HH:mm:ss').format('HH:mm'): 'Cancelled'}
                                            
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        {employee.login.status == 'BOOKED' ? 'Vehicle No: ' + employee.login.vehicleNo : employee.login.status == 'CANCEL' ? '' : 'Vehicle Not Assigned'}
                                    </Text>
                                    
                                    
                                </View>
                                <View style={styles.rightSec}>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        Check-Out: {employee.logout.logoutTime && employee.logout.logoutTime != null ? moment(employee.logout.logoutTime, 'HH:mm:ss').format('HH:mm'): 'Cancelled'}
                                            
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        {employee.logout.status == 'BOOKED' ? 'Vehicle No: ' + employee.logout.vehicleNo : employee.logout.status == 'CANCEL' ? '' : 'Vehicle Not Assigned'}
                                    </Text>
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
        backgroundColor: '#94EBC5',
        width: wp('98%'),
        height: hp('5%'),
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 10
    },
    cardViewChange: {
        backgroundColor: '#94EBC5',
        width: wp('98%'),
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
        width: 30,
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
        color: '#375346',
        paddingTop: 10,
    },
    headText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#375346',
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
        color: '#406353',
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
    cardAction: {
        flexDirection: 'row'
    },
    titleStyle: {
        fontSize: 12
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
    
})


export default inject("rootStore")(observer(AdminEmployeeEmpList));