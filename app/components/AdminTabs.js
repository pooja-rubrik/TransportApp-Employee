import React from "react";
import {
	Text, StyleSheet,
	View, TouchableOpacity
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Color from '../services/AppColor'

export default class AdminTab extends React.PureComponent {

    constructor(props){
        super(props);
    }
    adminSwitch = (type) => {
        console.log('switch>>>', type)
        this.props.adminSwitch(type);
    }

    render() {
        let {adminTabVisible} = this.props
        return (
            <View style={styles.adminTab}>
                <TouchableOpacity onPress= {() => this.adminSwitch('admin')}>
                    <View style={adminTabVisible ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                        
                        <Text style={adminTabVisible ? [styles.tabTextStyle, styles.activeTextStyle]: [styles.tabTextStyle]}>
                            Administrator
                        </Text> 
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress= {() => this.adminSwitch('employee')}>
                    <View style={!adminTabVisible ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                        
                        <Text style={!adminTabVisible ? [styles.tabTextStyle, styles.activeTextStyle]: [styles.tabTextStyle]}>
                            Employee
                        </Text>
                    
                    </View>
                </TouchableOpacity>
                
                        
                
            </View>
        )
    }
}
const styles = StyleSheet.create({
    adminTab:{
        flexDirection: 'row',
        height: hp('5%'),
        marginBottom: 5,
        backgroundColor: Color.TAB_BG_COLOR,
        borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
        borderTopColor: Color.TAB_BG_COLOR,
        borderTopWidth: 1
    },
    
    singleTab: {
        width: wp('48%'),
        alignItems: 'center',
        paddingTop: 14,
        height: hp('5%'),
        // textDecorationLine: 'underline'
    },
    activeTab: {
        borderBottomWidth: 1, 
        // borderBottomColor: '#CA0B52',
        borderBottomColor:Color.ACTIVE_TXT_COLOR
    },
    tabTextStyle : {
        fontSize: 13,
        color: Color.INACTIVE_TXT_COLOR
    },
    activeTextStyle: {
        color:Color.ACTIVE_TXT_COLOR,
        fontWeight: 'bold'
    },
    inActiveTab: {
        borderBottomWidth: 0 ,
        borderBottomColor: '#fff'
    }

})