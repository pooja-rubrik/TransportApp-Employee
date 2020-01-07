import React from "react";
import {
    Text, StyleSheet,
    View, Platform
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'
import AdminDriver from './AdminDriver';
import Color from '../services/AppColor'

const platform = Platform.OS;

export default class AdminDriverList extends React.PureComponent {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log(this.props)
    }
    removeDriver = (vehicleNo) => {
        this.props.removeDriver(vehicleNo);
    }

    render() {
        let { driverData } = this.props;
        
        empList = driverData.length != 0 ?
            driverData.map((driver, index) => {
                driver.show = 0;
                return (
                    <AdminDriver
                        driver={driver} 
                        key={index} 
                        removeDriver = {this.removeDriver}
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
                                        No Drivers!
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
        backgroundColor: '#fff',
        width: wp('97%'),
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