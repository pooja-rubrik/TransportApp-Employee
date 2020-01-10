import React from "react";
import {
	Text, StyleSheet, Image, Alert,
	View, TouchableOpacity, ScrollView
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import cabStatusIcon from '../assets/icons/car.png';
import empIcon from '../assets/icons/employee.png';
import driverIcon from '../assets/icons/driver.png';
import adminIcon from '../assets/icons/admin.png';
import CabStatus from '../components/CabStatus';
import EmpList from '../components/EmpList';
import DriverList from '../components/DriverList';
import AdminList from '../components/AdminList';
import Color from '../services/AppColor'

export default class AdminSubSections extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            currentTab: 'cab-status'
        }
    }
    adminSubSwitch = (type) => {
        console.log('switch>>>', type)
        this.setState({currentTab: type});
        this.props.adminSubSwitch(type);
    }
    addDriver = () =>{
        this.props.addDriver();
    }
    showAlert = (type, admId) => {
        this.props.showAlertChild(type, admId)
    }

    callPickService = (pickChangeData) => {
        // Alert.alert('called')
        // console.log(pickChangeData)
        this.cabStatus.callPickService(pickChangeData)
    }

    render() {
        let {adminSubTab, userType} = this.props;
        let {currentTab} = this.state;
        return (
            <View style = {{backgroundColor: Color.HEADER_BG_COLOR, }}>
                {
                    userType == 'SERVICE' ?
                    <View style={{flexDirection: 'row'} }>
                        <TouchableOpacity onPress= {() => this.adminSubSwitch('cab-status')}>
                            <View style={ adminSubTab == 'cab-status' ? [currentTab == 'cab-status' || currentTab == 'emp-list' ? styles.singleTab : styles.singleTabChangeFirst, styles.activeTab, styles.adminOnlyFirst]: [currentTab == 'cab-status' || currentTab == 'emp-list' ? styles.singleTab : styles.singleTabChangeFirst, styles.inActiveTab, styles.adminOnlyFirst]}>
                                <Image style={styles.subTabImg} source={cabStatusIcon} />
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress= {() => this.adminSubSwitch('emp-list')}>
                            <View style={adminSubTab == 'emp-list' ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                                <Image style={styles.subTabImg} source={empIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress= {() => this.adminSubSwitch('driver-list')}>
                            <View style={adminSubTab == 'driver-list' ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                                <Image style={styles.subTabImg} source={driverIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress= {() => this.adminSubSwitch('admin-list')}>
                            <View style={adminSubTab == 'admin-list' ? [currentTab == 'cab-status' || currentTab == 'emp-list' ? styles.singleTab: styles.singleTabChangeLast, styles.activeTab, styles.adminOnlyLast]: [currentTab == 'cab-status' || currentTab == 'emp-list' ? styles.singleTab: styles.singleTabChangeLast, styles.inActiveTab, styles.adminOnlyLast]}>
                                <Image style={styles.subTabImg} source={adminIcon} />
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                    :
                    <View style={styles.adminTab }>
                        <TouchableOpacity onPress= {() => this.adminSubSwitch('cab-status')}>
                            <View style={ adminSubTab == 'cab-status' ? [currentTab == 'cab-status' || currentTab == 'emp-list' ? styles.singleTab : styles.singleTabChangeFirst, styles.activeTab]: [currentTab == 'cab-status' || currentTab == 'emp-list' ? styles.singleTab : styles.singleTabChangeFirst, styles.inActiveTab]}>
                                <Image style={styles.subTabImg} source={cabStatusIcon} />
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress= {() => this.adminSubSwitch('emp-list')}>
                            <View style={adminSubTab == 'emp-list' ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                                <Image style={styles.subTabImg} source={empIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress= {() => this.adminSubSwitch('driver-list')}>
                            <View style={adminSubTab == 'driver-list' ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                                <Image style={styles.subTabImg} source={driverIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress= {() => this.adminSubSwitch('admin-list')}>
                            <View style={adminSubTab == 'admin-list' ? [currentTab == 'cab-status' || currentTab == 'emp-list' ? styles.singleTab: styles.singleTabChangeLast, styles.activeTab]: [currentTab == 'cab-status' || currentTab == 'emp-list' ? styles.singleTab: styles.singleTabChangeLast, styles.inActiveTab]}>
                                <Image style={styles.subTabImg} source={adminIcon} />
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                }
                <ScrollView>
                {
                    currentTab == 'cab-status' ? <CabStatus confirmPickChange = {this.props.confirmPickChange} ref={child => {this.cabStatus = child}}/> :
                    currentTab == 'emp-list' ? <EmpList /> :
                    currentTab == 'driver-list' ? <DriverList addDriver = {this.addDriver} showAlert = {this.showAlert}/> : <AdminList showAlert = {this.showAlert}/>
                }
                </ScrollView>
                
            </View>
            
        )
    }
}
const styles = StyleSheet.create({
    adminTab:{
        flexDirection: 'row',
        borderTopWidth: .5,
        borderTopColor: '#333',
        borderBottomWidth: .5,
        borderBottomColor: '#333',
        paddingTop:0.5,
        paddingBottom:.5,
    },
    adminOnlyFirst: {
        borderTopLeftRadius: 10
    },
    adminOnlyLast: {
        borderTopRightRadius: 10
    },
    singleTab: {
        width: wp('24.3%'),
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    singleTabChangeFirst : {
        width: wp('24.3%'),
        alignItems: 'center',
        // backgroundColor: 'red', 
        borderBottomLeftRadius: 10, 
        paddingTop: 5,
        paddingBottom: 5
    },
    singleTabChangeLast : {
        width: wp('24.3%'),
        alignItems: 'center',
        // backgroundColor: 'red', 
        borderBottomRightRadius: 10, 
        paddingTop: 5,
        paddingBottom: 5
    },
    activeTab: {
        backgroundColor: '#AAADAF'
    },
    inActiveTab: {
        backgroundColor: '#fff'
    },
    subTabImg: {
        height: wp('21.3%'),
        width: wp('21.3%')
    }

})