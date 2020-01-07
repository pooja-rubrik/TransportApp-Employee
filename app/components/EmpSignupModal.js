import React from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity, StyleSheet, TextInput} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { TextField } from 'react-native-material-textfield';

import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';

export default class EmpSignupModal extends React.PureComponent {
    
    state = {
        contact: '',
        homeAddress: '',
        checkIn: '',
        checkOut: '',
    }
    
    closeModalFunc = (visible) => {
        console.log(visible)
		this.props.closeModalFunc(visible);
	}

    submitRequest = () => {
        this.props.submitSignup(this.state);
    }

    


	render() {
        let { contact, homeAddress, checkOut, checkIn} = this.state;
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
                    <View>
                        <View style={styles.TextInputView}>
                            <View>
                                <Text style={styles.headText}>
                                   Welcome {this.props.userName}!
                                </Text>
                                <TextInput
                                    label=''
                                    value={`${checkIn}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(checkIn) => this.setState({ checkIn })}
                                    placeholder='DEFAULT CHECK-IN'
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
                                    placeholder='DEFAULT CHECK-OUT'
                                    lineWidth={0}
                                    activeLineWidth={0}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholderTextColor={COLOR.PLACEHOLDER}
                                />
                                <TextInput
                                    label=''
                                    value={`${contact}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(contact) => this.setState({ contact })}
                                    placeholder='PHONE NUMBER'
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
                                    placeholder='HOME ADDRESS'
                                    lineWidth={0}
                                    activeLineWidth={0}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholderTextColor={COLOR.PLACEHOLDER}
                                />
                                
                            </View>
                            <View style={styles.ButtonSubmit}>
                                <RaisedTextButton
                                    title={STRCONSTANT.SIGNUP_BTN}
                                    color={COLOR.BUTTON_COLOR_EMP}
                                    titleColor={COLOR.BUTTON_FONT_COLOR}
                                    onPress={this.submitRequest}
                                    style={styles.buttonEmail}
                                    titleStyle = {styles.titleStyle}
                                />
{/*                                 
                                <RaisedTextButton
                                    title={STRCONSTANT.CANCEL_REQUEST}
                                    color={COLOR.BUTTON_COLOR}
                                    titleColor={COLOR.BUTTON_FONT_COLOR}
                                    onPress={() => this.closeModalFunc(this.props.signupModalVisible)}
                                    style={styles.buttonEmail}
                                />
                                 */}
                               

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
		backgroundColor: COLOR.HEADER_BG_COLOR,
		padding: 20,
		borderRadius: 5,
        height: hp('45%'),
        borderColor: COLOR.HEADER_BG_COLOR,
        borderWidth: .2,
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
		// width: wp('95%'),
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
		fontSize: 18
	}
})