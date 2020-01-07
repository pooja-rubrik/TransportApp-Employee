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
import deleteDriverIcon from '../assets/icons/removeuser.png'

const platform = Platform.OS;
class AdminDriver extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            currOpenId: '',
            isExpand: false,
            showDelete: false
        }
        console.log(this.props, toJS(this.adminStore))
    }

    
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps')
        this.setState({showDelete: false})
    }
   

    expandCard = (isExpand, currId) => {
        console.log('>>>>>>', isExpand, currId, this.state.currOpenId)
        this.setState(this.state.showDelete? { showDelete: false }: {showDelete: true})
        if (this.state.currOpenId == currId) {
            this.setState({
                currOpenId: ''
            });
        } else {
            this.setState(isExpand ? { isExpand: false, currOpenId: currId } : { isExpand: true, currOpenId: currId })
            console.log(this.state, currId);
        }
    }

    removeDriver = (vehicleNo) => {
        this.props.removeDriver(vehicleNo);
    }
   
    render() {
        let { isExpand, currOpenId, showDelete} = this.state;
        let { driver, } = this.props;
        // employee = employee.empDetail
        
        return (
            <CardView
                cardElevation={4}
                cardMaxElevation={4}
                cornerRadius={5}
                style={(currOpenId == driver.vehicleNumber) ? styles.cardViewChange : styles.cardView}
                // style={styles.cardViewChange}
            >
                <TouchableOpacity onPress={() => this.expandCard(isExpand, driver.vehicleNumber )}>
                    <View style={styles.cardHead}>
                        <Text style={platform == "ios" ? styles.headTextIOS : styles.headText}>
                            {driver.driverName}
                        </Text>
                        <View style={platform == "ios" ? styles.iconViewIOS : styles.iconView}>
                            {(showDelete == true)?
                                <TouchableOpacity onPress={() => this.removeDriver( driver.vehicleNumber )}>
                                    <Image style={styles.statusIcon} source={deleteDriverIcon} />
                                </TouchableOpacity>
                                
                                : null
                                // :<Image style={styles.statusIcon} source={statusIconBook} />
                            }
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    (currOpenId == driver.vehicleNumber) ?
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextAddr}>
                                <Text style={[styles.cardText, styles.fontAddr]}>
                                    {driver.driverAddress}
                                </Text>
                            </View>
                                <View style={styles.leftSec}>
                                    {/* <Text style={[styles.cardText, styles.textPadTop]}>
                                        {employee.empPhoneNumber}
                                    </Text> */}
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        License Number: {driver.licenseNumber}
                                            
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        Vehicle Number: {driver.vehicleNumber}
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        Phone Number: {driver.driverPhone}
                                    </Text>
                                    
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
        backgroundColor: '#fff',
        width: wp('97%'),
        height: hp('5%'),
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 10
    },
    cardViewChange: {
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
        height: 30,
        width: 30,
        right: 0,
    },
    iconView: {
        right: 10,
        paddingTop: 3,

    },
    iconViewIOS: {
        right: 10,
        paddingTop: 3,

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
        marginTop: 5,
        // paddingRight:wp('8%')
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
        // width: wp('48%'),
    },
    rightSec:{
        width: wp('48%'),
        alignItems: 'center'
    },
    textPadTop: {
        paddingTop: 2
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


export default AdminDriver;