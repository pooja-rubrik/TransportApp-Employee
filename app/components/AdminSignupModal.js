import React from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity, StyleSheet, TextInput} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { TextField } from 'react-native-material-textfield';

import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';

export default class AdminSignupModal extends React.PureComponent {
    
    state = {
        empName: '',
        empID: '',
        empEmail: '',
        empType: 'admin'
    }

    componentWillReceiveProps () {
        this.setState({empName: '', empID: '', empEmail: ''})
    }
    
    closeModalFunc = (visible) => {
        this.props.closeModalFunc(visible);
	}

    submitRequest = () => {
        this.props.submitSignup(this.state);
    }



	render() {
        let {  empName, empID, empEmail } = this.state;
	    return (
		<Modal
            animationType='slide'
            visible={this.props.adminModalVisible}
        >
            <View>
                <View style={styles.modalView} >
                    <TouchableOpacity
                        onPress={this.closeModalFunc}
                    >
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                    <View>
                        <View style={styles.TextInputView}>
                            <View>
                                {/* <Text style={styles.headText}>
                                   Admin Signup
                                </Text> */}

                                <TextInput
                                    label=''
                                    value={`${empID}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(empID) => this.setState({ empID })}
                                    placeholder='Employee Id'
                                    autoCapitalize = {'none'}
                                    autoCorrect = {false}
                                />
                                <TextInput
                                    label=''
                                    value={`${empEmail}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(empEmail) => this.setState({ empEmail })}
                                    placeholder='Email'
                                    autoCapitalize = {'none'}
                                    autoCorrect = {false}
                                />
                                
                                <TextInput
                                    label=''
                                    value={`${empName}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(empName) => this.setState({ empName })}
                                    placeholder='Employee Name'
                                    autoCapitalize = {'none'}
                                    autoCorrect = {false}
                                />
                            </View>
                            <View style={styles.ButtonSubmit}>
                                <RaisedTextButton
                                    title={STRCONSTANT.SIGNUP_ADMIN}
                                    color={COLOR.BUTTON_COLOR}
                                    titleColor={COLOR.BUTTON_FONT_COLOR}
                                    onPress={this.submitRequest}
                                    style={styles.buttonEmail}
                                    titleStyle={styles.titleStyle}
                                />
                                {/* <RaisedTextButton
                                    title={STRCONSTANT.CANCEL_REQUEST}
                                    color={COLOR.BUTTON_COLOR}
                                    titleColor={COLOR.BUTTON_FONT_COLOR}
                                    onPress={this.closeModalFunc}
                                    style={styles.buttonEmail}
                                /> */}

                            </View>
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
		backgroundColor: COLOR.APP_BG_COLOR,
		padding: 20,
		borderRadius: 5,
        height: hp('32%'),
        borderColor: COLOR.HEADER_BG_COLOR,
        borderWidth: .2,
	},
	closeText: {
		backgroundColor: COLOR.APP_BG_COLOR,
		color: COLOR.HEADER_BG_COLOR,
		borderRadius: 17,
		width: 32,
		padding: 6,
		alignSelf: 'flex-end',
		textAlign: 'center',
		borderWidth: 1,
		borderColor: COLOR.HEADER_BG_COLOR,
		marginRight: 0,
		marginTop: 0
	},
	ButtonSubmit: {
		// marginTop: 20,
		// flex: 1,
        // flexDirection: 'row',
        alignSelf: 'center'
	},
	buttonEmail: {
		borderRadius: 20,
		width: wp('80%'),
        height: hp('5%'),
        marginTop: 10
    },
	textInputStyles: {
		borderRadius: 20,
		backgroundColor: 'white',
		fontSize: 18,
		paddingLeft: 10,
		height: hp('4%'),
		width: wp('80%'),
        marginTop: 5
	},
	textAreaStyles: {
        borderRadius : 20,
        backgroundColor: 'white',
        marginTop  :5,	
        paddingLeft: 10,
        paddingTop: 10,
        height: 100,
        fontSize: 18
    },
	TextInputView: {
		// flex: 1,
    },
    headText:{
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#575C58'
    },
    titleStyle:{
        fontSize: 18,
        textTransform: 'capitalize'
	}
})