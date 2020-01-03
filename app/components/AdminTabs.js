import React from "react";
import {
	Text, StyleSheet,
	View, TouchableOpacity
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
        marginBottom: 5
    },
    
    singleTab: {
        width: wp('50%'),
        alignItems: 'center',
        paddingTop: 14,
        height: hp('5%'),
        // textDecorationLine: 'underline'
    },
    activeTab: {
        borderBottomWidth: 1, 
        borderBottomColor: '#CA0B52',
    },
    tabTextStyle : {
        fontSize: 13,
        color: '#676767'
    },
    activeTextStyle: {
        color: '#333',
        fontWeight: 'bold'
    },
    inActiveTab: {
        borderBottomWidth: 0 ,
        borderBottomColor: '#fff'
    }

})