import React from "react";
import {
    Text, StyleSheet,
    View, Platform
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'
import AdminEmployeeEmpList from './AdminEmployeeEmpList';
import Color from '../services/AppColor'
import  deviceInfo  from '../stylesheets/AppDimensions';

// const platform = Platform.OS;
const screenHgt = deviceInfo.DEVICE_HEIGHT;
const hightVariation = deviceInfo.HEIGHT_VARIATION
const platform = Platform.OS;

export default class AdminEmpList extends React.PureComponent {

    constructor(props) {
        super(props);
        
    }
    componentDidMount() {
        console.log(this.props)
    }

    render() {
        let { empData } = this.props;
        
        empList = empData.length != 0 ?
            empData.map((employee, index) => {
            employee.show = 0;
                return (
                    <AdminEmployeeEmpList
                        employee={employee} 
                        key={index} 
                    />
                        
                )
            }) :
           null
           
        return (
            <View style = {{backgroundColor: Color.HEADER_BG_COLOR}}>
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
        backgroundColor: Color.CARD_BG_COLOR,
        width: wp('97%'),
        height: screenHgt >= hightVariation ? hp('5%') : hp('6%'),
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
        color: Color.HEADER_TXT_COLOR,
        paddingTop: 10,
    },
    headText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Color.HEADER_TXT_COLOR,
        paddingTop: 6,
        paddingBottom: 6
    },
   
})

