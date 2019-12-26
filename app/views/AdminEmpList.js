import React, { Component } from "react";
import {
	Text, StyleSheet,
	View
} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import { observer, inject } from "mobx-react";
import {toJS} from 'mobx';
import moment from 'moment';

import Wallpapers from "../components/Wallpaper";
import DateTime from '../components/DateTimePicker';
import STRCONSTANT from '../services/StringConstants';
import COLOR from '../services/AppColor';
import { ScrollView } from "react-native-gesture-handler";


class AdminEmpList extends Component {
    constructor (props) {
        super(props);
        this.usersStore =  this.props.rootStore.usersStore;
		this.adminStore = this.props.rootStore.adminStore;
    }

    static navigationOptions = ({ navigation }) => ({
		title: 'Employee List'
    });
    
    state = {
        // selectDate: '',
        selectDate: moment().format('YYYY-MM-DD'),
        datePlaceHolder: 'Trip Date',
        format: 'YYYY-MM-DD',
        datePickerMode: 'date',
        goDisabled: true,
        empDetails: ''
    }

    componentDidMount () {
        this.getEmployeeData();
    }

    getEmployeeData = (changeDate = '', changeTime = '') => {
        console.log('changeDate>>>', changeDate)
        this.adminStore.getDailyLoginData( 'Assign Login', changeDate, changeTime ).then(()=> {
			console.log(toJS(this.adminStore.adminData.empDetails))
			this.usersStore.filterEmployeeForLogin(this.adminStore.adminData.empDetails).then(()=>{
                console.log(toJS(this.usersStore.users.filterEmployees))
                this.adminStore.getDailyLoginData( 'Assign Logout', changeDate, changeTime ).then(()=> {
                    this.usersStore.filterEmployeeForLogout(this.adminStore.adminData.empDetails).then(()=>{
                        console.log(toJS(this.usersStore.users.filterEmployees))
                        this.setState({empDetails: toJS(this.usersStore.users.filterEmployees)})
                    })
                })
			})
			
		});
    }

    searchEmp = () => {
        this.getEmployeeData(this.state.selectDate);
    }

    render() {
        let {selectDate, datePlaceHolder, format, datePickerMode, goDisabled, empDetails} = this.state;
        var empList = empDetails.length != 0 ? empDetails.map((employee, index) => (
            <CardView
                cardElevation={4}
                cardMaxElevation={4}
                cornerRadius={5}
                style={styles.cardView}
                key = {index}>
                
                <View style={styles.cardHead}>
                    <Text style = {styles.headText}>
                        {employee.empDetail.empName} ({employee.empDetail.empPhoneNumber})
                    </Text>
                </View>
                <View style = {styles.cardContent}>
                    <View style={ styles.rowAlign}>
                        <Text style={styles.cardText}>
                            Pickup :  
                        </Text>
                        <View style={styles.pickContainer}>

                            <Text>Login Time : {employee.login.loginTime}</Text>
                            <Text>Vehicle Number : {employee.login.status == 'BOOKED' ? employee.login.vehicleNo : employee.login.status == 'CANCEL' ? 'TRIP CANCELLED' : 'VEHICLE NOT ASSIGNED'}</Text>
                        </View>
                    </View>
                    <View style={ styles.rowAlign}>
                        <Text style={styles.cardText}>
                            Drop :   
                        </Text>
                        <View style={styles.pickContainer}>

                            <Text>Logout Time : {employee.logout.logoutTime}</Text>
                            <Text>Vehicle Number : {employee.logout.status == 'BOOKED' ? employee.logout.vehicleNo : employee.logout.status == 'CANCEL' ? 'TRIP CANCELLED' : 'VEHICLE NOT ASSIGNED'}</Text>
                            
                        </View>
                    </View>
                </View>
            </CardView>
		)): 
		<CardView
		cardElevation={4}
		cardMaxElevation={4}
		cornerRadius={5}
		style={styles.cardViewHead}
		>
			<View style={styles.leftCardViewEmpty}>
				<Text style={styles.cardText}>
					No Employees!
				</Text>
			</View>
        </CardView>;
        
        return(
            <Wallpapers>
                <CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={styles.cardViewHead}>
                        <View style={styles.headerFormat}>
                            <DateTime 
                                date = {selectDate} 
                                changeDate = {(selectDate) => {this.setState({selectDate: selectDate, goDisabled: false})}} 
                                placeholder = {datePlaceHolder}
                                format = {format}
                                mode={datePickerMode} 
                                style = {{width: wp('60%')}}
                                futureDate = {1}
                                />    
                            <RaisedTextButton
                                title={STRCONSTANT.SEARCH_EMP}
                                color={COLOR.BUTTON_COLOR}
                                titleColor={COLOR.BUTTON_FONT_COLOR}
                                onPress={this.searchEmp}
                                style={styles.searchStyle}
                                disabled={goDisabled}
                            />
                        </View>
                     
                </CardView>
                <ScrollView>
                    {empList}
                </ScrollView>
                
            </Wallpapers>
        )
    }
}

const styles = StyleSheet.create({
	cardView: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('28%'),
		alignSelf: 'center',
		marginTop: 10,
        paddingTop: 10,
        // flexShrink: 1,
        
	},
	
	cardText: {
		fontSize: 15,
        marginBottom: 5,
        // width: wp('15%'),
        color: '#5b5a5a',
        fontWeight: 'bold',
        marginRight: 10,
        // alignSelf: 'center'
	},
	
	headText: {
		fontWeight: 'bold',
		fontSize: 18
	},
	
	cardContent: {
		alignSelf: 'center',
		// padding: 10,
    },
    headerFormat:{
        flexDirection: 'row',
        flex: 1,
        
    },
    cardViewHead: {
        backgroundColor: 'white',
		width: wp('90%'),
		height: hp('7.5%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
    },
    searchStyle:{
        width: wp('5%'),
        height: hp('5%'),
        marginLeft: 10,
        borderRadius: 20,
    },
    cardHead:{
		paddingLeft:10,
		paddingBottom: 10,
    },
    
    rowAlign:{
        marginBottom: 15,
    },
    pickContainer:{
        width: wp('85%'),
		borderColor: '#6a6a6a',
		borderWidth: .5,
		alignSelf: 'center',
		backgroundColor:'#e9e9e9',
        padding: 10,
        borderRadius: 5
    },
    leftCardViewEmpty: {
        // alignSelf: 'center'
        paddingLeft:10
	}
})

export default inject("rootStore")(observer(AdminEmpList));