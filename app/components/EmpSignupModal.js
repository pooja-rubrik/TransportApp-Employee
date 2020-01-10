import React from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity, StyleSheet, TextInput} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { TextField } from 'react-native-material-textfield';
import DateTime from '../components/DateTimePicker';
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';

export default class EmpSignupModal extends React.PureComponent {
    
    state = {
        contact: '',
        homeAddress: '',
        timeCheckIn: '',
        timeCheckOut: '',
        checkInPlaceHolder: 'Check-In',
        checkOutPlaceHolder: 'Check-Out',
        formatTime: 'HH:mm',
        loginMin: 30
    }
    
    closeModalFunc = (visible) => {
        console.log(visible)
		this.props.closeModalFunc(visible);
	}

    submitRequest = () => {
        let signupData = {
            employee: {
                empHomeAddress: this.state.homeAddress, 
                empPhoneNumber: this.state.contact
            }, 
            checkIn: this.state.timeCheckIn, 
            checkOut: this.state.timeCheckOut 
        }
        this.props.submitSignup(signupData);
    }

    
    // componentDidMount() {
    //     console.log(this.props)
    // }

	render() {
        let { contact, homeAddress, timeCheckOut, timeCheckIn, checkInPlaceHolder, checkOutPlaceHolder,
            formatTime, loginMin } = this.state;
        let {loginMinTime, loginMaxTime, logoutMinTime, logoutMaxTime} = this.props;
	    return (
		<Modal
            animationType='slide'
            visible={this.props.signupModalVisible}
        >
            <View>
                <View style={styles.modalView} >
                    <TouchableOpacity
                        onPress={this.closeModalFunc}
                    >
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                    
                        <View style={styles.TextInputView}>
                            
                                <Text style={styles.headText}>
                                   Welcome {this.props.userName}!
                                </Text>
                                <View style = {styles.defaultSec}>
                                    <DateTime 
                                        date = {timeCheckIn} 
                                        changeDate = {(timeCheckIn) => {this.setState({timeCheckIn: timeCheckIn})}} 
                                        placeholder = {checkInPlaceHolder}
                                        format = {formatTime}
                                        inputStyle = {styles.timeinputStyle}
                                        iconStyle = {{left:5, height: 23, width: 23}}
                                        style = {styles.timeStyle}
                                        minDate = {loginMinTime}
                                        maxDate = {loginMaxTime}
                                        minuteInterval={loginMin}
                                    />
                                    <DateTime 
                                        date = {timeCheckOut} 
                                        changeDate = {(timeCheckOut) => {this.setState({timeCheckOut: timeCheckOut})}} 
                                        placeholder = {checkOutPlaceHolder}
                                        format = {formatTime}
                                        inputStyle = {styles.timeinputStyleCheckout}
                                        iconStyle = {{left:5, height: 23, width: 23}}
                                        style = {styles.timeStyle}
                                        minDate = {logoutMinTime}
                                        maxDate = {logoutMaxTime}
                                        minuteInterval={loginMin}
                                    />
                                </View>
                                
                                {/* <TextInput
                                    label=''
                                    value={`${checkIn}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(checkIn) => this.setState({ checkIn })}
                                    placeholder='Default Check-In'
                                    lineWidth={0}
                                    activeLineWidth={0}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholderTextColor={COLOR.PLACEHOLDER}
                                />
                                <TextInput
                                    label=''
                                    value={`${checkOut}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(checkOut) => this.setState({ checkOut })}
                                    placeholder='Default Check-Out'
                                    lineWidth={0}
                                    activeLineWidth={0}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholderTextColor={COLOR.PLACEHOLDER}
                                /> */}
                                <TextInput
                                    label=''
                                    value={`${contact}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(contact) => this.setState({ contact })}
                                    placeholder='Phone Number'
                                    lineWidth={0}
                                    activeLineWidth={0}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholderTextColor={COLOR.PLACEHOLDER}
                                />
                                <TextInput
                                    label=''
                                    value={`${homeAddress}`}
                                    style={styles.textAreaStyles}
                                    labelFontSize={0}
                                    onChangeText={(homeAddress) => this.setState({ homeAddress })}
                                    placeholder='Home Address'
                                    lineWidth={0}
                                    activeLineWidth={0}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholderTextColor={COLOR.PLACEHOLDER}
                                />
                                
                            
                            <View style={styles.ButtonSubmit}>
                                <RaisedTextButton
                                    title={STRCONSTANT.SIGNUP_BTN}
                                    color={COLOR.BUTTON_COLOR_EMP}
                                    titleColor={COLOR.BUTTON_FONT_COLOR}
                                    onPress={this.submitRequest}
                                    style={styles.buttonEmail}
                                    titleStyle = {styles.titleStyle}
                                />
                               

                            </View>
                        </View>
                    
                </View>
            </View>
        </Modal>
	  );
	}
}

const styles = StyleSheet.create({
    modalView: {
		backgroundColor: COLOR.HEADER_BG_COLOR,
		padding: 20,
		borderRadius: 5,
        height: hp('38%'),
        borderColor: '#333',
        borderWidth: 1,
	},
	closeText: {
		backgroundColor: COLOR.APP_BG_COLOR,
		color: COLOR.BUTTON_COLOR_EMP,
		borderRadius: 17,
		width: 32,
		padding: 6,
		alignSelf: 'flex-end',
		textAlign: 'center',
		borderWidth: 1,
		borderColor: COLOR.BUTTON_COLOR_EMP,
		marginRight: -15,
		marginTop: -15
    },
    defaultSec: {
        flexDirection: 'row',
        alignContent: 'space-between',
        marginBottom: 5,
        marginTop: 5,
    },
	ButtonSubmit: {
		alignSelf: 'center'
	},
	buttonEmail: {
		borderRadius: 20,
		width: wp('85%'),
        height: hp('4%'),
        marginTop: 5
    },
	textInputStyles: {
		borderRadius: 20,
		backgroundColor: 'white',
		fontSize: 15,
		paddingLeft: 10,
		height: hp('4%'),
		marginTop: 5
	},
	textAreaStyles: {
        borderRadius : 20,
        backgroundColor: 'white',
        marginTop  :5,	
        paddingLeft: 10,
        paddingTop: 10,
        height: 100,
        fontSize: 15
    },
	TextInputView: {
        // flex: 1,
        width: wp('85%'),
        alignSelf: 'center'
    },
    headText:{
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    titleStyle:{
        fontSize: 18,
        textTransform: 'capitalize'
    },
    timeinputStyle: {
		marginLeft:0, 
        backgroundColor: '#fff', 
        // paddingLeft: 9,
        paddingRight: 30,
		borderWidth: 0, 
        height: 30,
        borderRadius: 15,
        borderWidth: .3,
        borderColor: '#333'
    },
    timeinputStyleCheckout: {
        marginLeft:0, 
        backgroundColor: '#fff', 
        paddingRight: 20,
		borderWidth: 0, 
        height: 30,
        borderRadius: 15,
        borderWidth: .3,
        borderColor: '#333'
       
    },
    timeStyle:{ 
        'width': wp('42.5%'), 
        marginBottom:0,
        height: 30,
    },
})