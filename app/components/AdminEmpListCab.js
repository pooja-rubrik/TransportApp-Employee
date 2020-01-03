import React from "react";
import {
    Text, StyleSheet, TouchableOpacity,
    View, Platform
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'
import AdminEmployeeCab from './AdminEmployeeCab';


const platform = Platform.OS;

export default class AdminEmpListCab extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isExpand: false,
            isBooked: true,
            currOpenId: '',
            currIndex: 0,
            currEndTripEmp: 0,
        }
    }
    componentDidMount() {
        console.log(this.props)
    }

    refreshEmployee = () => {
        this.props.refreshEmployee()
    }

    showMessage = (message) => {
        this.props.showMessage(message);
    }
    
    render() {
        let { empData, assignType, isCheckIn, loginMinTime, loginMaxTime, checkInDate, checkInTime } = this.props;
        
        empList = empData.length != 0 ?
            empData.map((employee, index) => {
            employee.show = 0;
                return (
                    <AdminEmployeeCab
                        employee={employee} 
                        tripAction={this.tripAction} 
                        key={index} 
                        isCheckIn = {isCheckIn} 
                        loginMinTime = {loginMinTime} 
                        loginMaxTime = {loginMaxTime}
                        checkInDate = {checkInDate} 
                        checkInTime = {checkInTime}
                        assignType = {assignType}
                        refreshEmployee = {this.refreshEmployee}
                        showMessage = {this.showMessage}
                    />
                        
                )
            }) :
           null
           
        return (
            <View>
                    {/* */}
                        {(empList == null || empList[0] == null)? 
                            <CardView
                                cardElevation={4}
                                cardMaxElevation={4}
                                cornerRadius={5}
                                style={styles.cardView}>
                                <View style={styles.cardHead}>
                                    <Text style={platform == "ios" ? styles.headTextIOS: styles.headText}>
                                        No Employee!
                                    </Text>
                                </View>
                            </CardView>:
                            empList
                            
                        }
                </View>
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
    
    cardHead: {
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
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
   
})

