import React from "react";
import {
	Text, StyleSheet,
	View, TouchableOpacity
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Color from '../services/AppColor';

export default class EmpListTab extends React.PureComponent {

    constructor(props){
        super(props);
        
    }
    empSwitch = (date) => {
        console.log('switch>>>', date)
        this.props.empSwitch(date);
    }

    render() {
        let {empTabVisible} = this.props
        return (
            <View style={styles.adminTab}>
                <TouchableOpacity onPress= {() => this.empSwitch('today')}>
                    <View style={empTabVisible ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                        
                        <Text style={empTabVisible ? [styles.tabTextStyle, styles.activeTextStyle]: [styles.tabTextStyle]}>
                            Today
                        </Text> 
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress= {() => this.empSwitch('tomorrow')}>
                    <View style={!empTabVisible ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                        
                        <Text style={!empTabVisible ? [styles.tabTextStyle, styles.activeTextStyle]: [styles.tabTextStyle]}>
                            Tomorrow
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
        // marginBottom: 5,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#333'
    },
    
    singleTab: {
        width: wp('48%'),
        alignItems: 'center',
        paddingTop: 14,
        height: hp('4.5%'),
        borderBottomLeftRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        
    },
    activeTab: {
        borderBottomWidth: 1, 
        borderBottomColor: Color.ACTIVE_TXT_COLOR,
    },
    tabTextStyle : {
        fontSize: 13,
        color: '#676767'
    },
    activeTextStyle: {
        color: Color.ACTIVE_TXT_COLOR,
        fontWeight: 'bold'
    },
    inActiveTab: {
        borderBottomWidth: 0 ,
        borderBottomColor: '#fff'
    }

})