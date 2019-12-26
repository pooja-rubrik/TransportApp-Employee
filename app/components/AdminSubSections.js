import React from "react";
import {
	Text, StyleSheet, Image,
	View, TouchableOpacity
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

    render() {
        let {adminSubTab} = this.props;
        let {currentTab} = this.state;
        return (
            <View>
                <View style={styles.adminTab}>
                    <TouchableOpacity onPress= {() => this.adminSubSwitch('cab-status')}>
                        <View style={adminSubTab == 'cab-status' ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
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
                        <View style={adminSubTab == 'admin-list' ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                            <Image style={styles.subTabImg} source={adminIcon} />
                        </View>
                    </TouchableOpacity>
                    
                </View>
                {
                    currentTab == 'cab-status' ? <CabStatus /> :
                    currentTab == 'emp-list' ? <EmpList /> :
                    currentTab == 'driver-list' ? <DriverList /> : <AdminList />
                }
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
        paddingTop:3,
        paddingBottom:3
    },
    singleTab: {
        width: wp('25%'),
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#AAADAF'
    },
    inActiveTab: {
        backgroundColor: '#fff'
    },
    subTabImg: {
        height: wp('22%'),
        width: wp('22%')
    }

})