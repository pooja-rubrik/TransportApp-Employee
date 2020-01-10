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
        // empName: '',
        empID: '',
        // empEmail: '',
        empType: 'ADMIN'
    }

    componentWillReceiveProps () {
        this.setState({ empID: ''})
    }
    
    closeModalFunc = (visible) => {
        this.props.closeModalFunc(visible);
	}

    submitRequest = () => {
        this.props.submitSignup(this.state);
    }



	render() {
        let { empID, } = this.state;
	    return (
		<Modal
            animationType='slide'
            visible={this.props.adminModalVisible}
            // visible = {true}
        >
            <View>
                <View style={styles.modalView} >
                   
                    <TouchableOpacity
                        onPress={this.closeModalFunc}
                    >
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                    
                   
                    <View style={styles.TextInputView}>
                        {/* <View> */}
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
                            {/* <TextInput
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
                            /> */}
                        {/* </View> */}
                        <View style={styles.ButtonSubmit}>
                            <RaisedTextButton
                                title={STRCONSTANT.SIGNUP_ADMIN}
                                color={COLOR.BUTTON_COLOR_EMP}
                                titleColor={COLOR.BUTTON_FONT_COLOR}
                                onPress={this.submitRequest}
                                style={styles.buttonEmail}
                                titleStyle={styles.titleStyle}
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
        height: hp('19%'),
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
	ButtonSubmit: {
        alignSelf: 'center'
	},
	buttonEmail: {
		borderRadius: 20,
		width: wp('85%'),
        height: hp('4%'),
        marginTop: 10
    },
	textInputStyles: {
		borderRadius: 20,
		backgroundColor: 'white',
		fontSize: 18,
		paddingLeft: 10,
		height: hp('4%'),
		width: wp('85%'),
        marginTop: 5
	},
	TextInputView: {
        // flex: 1,
        alignSelf: 'center',
        marginTop: 6
    },
    headText:{
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        alignSelf: 'center',
        width: wp('80%'),
    },
    titleStyle:{
        fontSize: 18,
        textTransform: 'capitalize'
	}
})