import React from "react";
import {
	Text, StyleSheet,
	View, TouchableOpacity
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

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