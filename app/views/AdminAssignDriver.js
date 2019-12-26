import React, { Component } from "react";
import { 
	View, StyleSheet, Text, Alert
} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';
import { observer, inject } from "mobx-react";
import {toJS} from 'mobx';
import moment from 'moment';

import Wallpapers from "../components/Wallpaper";
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';

class AdminAssignDriver extends Component {
    constructor(props){
        super(props);
        this.empData = JSON.parse(this.props.navigation.getParam('pageName'));
        this.adminStore = this.props.rootStore.adminStore;
        this.currentDate = moment().format('YYYY-MM-DD');
        console.log('empdata>>', this.empData)
    }
    static navigationOptions = ({ navigation }) => ({
		title: 'Assign Driver'
    });
    state={
        driverList: [
            // {value: 'driver1', vehicle: 'vehicle1', status: '2 seats left'},
            // {value: 'driver2', vehicle: 'vehicle2', status: '1 seats left'},
            // {value: 'driver3', vehicle: 'vehicle3', status: '3 seats left'}
        ],
        selectedDriver: '',
        assignDisable: true
    }

    componentDidMount () {
        this.getAvailDriver(this.empData.tripDate, this.empData.tripTime);
    }

    getAvailDriver = (tripDate = '', tripTime = '') => {
        this.adminStore.getDriverListByTime( tripDate, tripTime).then(()=> {
			console.log(toJS(this.adminStore.adminData.availableDriverList))
			this.setState({driverList: toJS(this.adminStore.adminData.formattedDriverList)})
			
		});
    }

    renderPrompt = (rowData) => {
        console.log('render prompt..', rowData);
        this.setState({ selectedDriver: rowData.vehicle, assignDisable: false })
        return rowData.vehicle;
    }

    assignDriver = () => {
        param  = {empID: this.empData.empId, type: this.empData.type, tripDay: this.empData.tripDate? this.empData.tripDate: this.currentDate, vehicleNumber: this.state.selectedDriver};
        this.adminStore.assignDriver( param ).then(()=> {
            console.log(toJS(this.adminStore.adminData.assignDriver))
            if(this.adminStore.adminData.assignDriver.code == 200) {
                Alert.alert(null, 'Driver has assigned successfully.', [{text: 'OK', 
                onPress: () => {
                    this.props.navigation.goBack()
                    this.props.navigation.state.params.getAssignData();
                }}])
            } else {
                Alert.alert('Please try again!')
            }
			
		});
    }
      
    render() {
        let {driverList, assignDisable} = this.state;
        return(
            <Wallpapers>
                <View style = {styles.contentSec}>
                    <View style = {styles.menuContainer}>
                        <Text style = {styles.menuTextLeft}>
                            Driver 
                        </Text>
                        <View style = {styles.menuTextRight}>
                            <Text style={styles.dotView}>
                                :
                            </Text>
                            <View style={styles.dropdownView}>
                                
                                <ModalDropdown 
                                    options={driverList}
                                    renderRow={({ vehicle, status }) => 
                                    <View style={styles.driverOption}>
                                        {/* <Text style={styles.dropTextVisible}>{value} ({vehicle})</Text> */}
                                        <Text style={styles.dropTextVisible}>{vehicle}</Text>
                                        <Text style={styles.driverStatus}>{status}</Text>
                                    </View>}
                                    style={styles.driverDrop}
                                    textStyle={styles.dropTextVisible}
                                    defaultValue = {"Select Driver ▼"}
                                    renderButtonText={this.renderPrompt}
                                    // dropdownTextStyle={styles.dropdownText}
                                    dropdownStyle={styles.dropdownStyle}
                                >
                                </ModalDropdown>
                                
                            </View>
                        </View>
                        
                    </View>
                    {/* <View style = {styles.menuContainer}>
                        <Text style = {styles.menuTextLeft}>
                            Driver Contact
                        </Text>
                        <Text style = {styles.menuTextRight}>
                            :  3223483248
                        </Text>
                    </View>
                    */}
                    <View style = {styles.buttonSec}>
                        <RaisedTextButton
                            title={STRCONSTANT.ASSIGN_TRIP}
                            color={COLOR.BUTTON_COLOR}
							titleColor={COLOR.BUTTON_FONT_COLOR}
                            onPress={this.assignDriver}
                            style={styles.cancelStyle}
                            disabled={assignDisable}
                        />
                    </View>    

                </View>
             </Wallpapers>
        )
    }
};
const styles = StyleSheet.create({
    contentSec : {
        backgroundColor: '#EFEEEE',
        marginTop: 25,
        flex :1, 
        width: wp('90%'),
        // height: hp('60%'),
        alignSelf: 'center',
        marginBottom: 500,
        borderRadius: 10
    },
    menuContainer: {
        height: hp('10%'), 
        borderColor:'#ccc', 
        borderBottomWidth:1, 
        flexDirection:'row', 
        alignItems: 'center',
    },
    menuTextLeft: {
        color: '#5b5a5a',
        fontWeight: 'bold',
        width: wp('25%'),
        marginLeft: 20,
        fontSize: 16
    },
    menuTextRight: {
        fontSize: 16,
        color: '#5b5a5a',
        fontWeight: 'bold',
        width: wp('60%'),
        flexDirection: 'row',
        flex: 1,
        alignSelf: 'center'
    },
    buttonSec: {
        alignSelf: 'center',
        marginTop: 30
    },
    cancelStyle: {
        borderRadius: 20,
        width: wp('65%'),
        height: hp('5.5%')
    },
    dotView:{
        width: wp('5%'),
        color: '#5b5a5a',
        fontWeight: 'bold',
    },
    dropdownView:{
        width:wp('50%')
    },
    driverDrop: {
        borderColor: '#5b5a5a', 
        borderWidth:.5,
        width: wp('40%'),
        height: hp('4%'),
        alignItems: 'center',
        paddingTop: 5,
        // flex: 1,
        
    },
    dropTextVisible: {
        color: '#5b5a5a', 
        fontSize: 16, 
        fontWeight: 'bold'
    },
    // dropdownText: {
    //     // fontSize: 19, 
    // },
    dropdownStyle: {
        width: wp('45%'),
        // marginLeft: -20,
        alignItems: 'center',
        borderWidth: 2,
        backgroundColor: '#EFEEEE',
        // marginLeft: 30
    },
    driverStatus: {
        fontStyle: 'italic'
    },
    driverOption: {
        borderBottomWidth: .4,
        height: hp('6.5%'),
        paddingTop: 6,
        width: wp('40%')
    }
})
export default inject("rootStore")(observer(AdminAssignDriver));