import React from "react";
import Modal from "react-native-modal";
import { 
    View, Text, 
    TouchableOpacity, Platform,
    StyleSheet, TextInput
} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { TextField } from 'react-native-material-textfield';

import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import  deviceInfo  from '../stylesheets/AppDimensions';

const platform = Platform.OS;
const screenHgt = deviceInfo.DEVICE_HEIGHT;
const hightVariation = deviceInfo.HEIGHT_VARIATION

export default class AdminSignupModal extends React.PureComponent {
    
    state = {
        empID: '',
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
        //height: hp('19%'),
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
		// marginRight: -15,
		// marginTop: -15
	},
	ButtonSubmit: {
        alignSelf: 'center'
	},
	buttonEmail: {
		borderRadius: 20,
		width: wp('85%'),
        height: platform == 'ios'? hp('5%'): screenHgt >= hightVariation ? hp('5.5%') : hp('5.9%'),
        marginTop: 10
    },
	textInputStyles: {
		borderRadius: 20,
		backgroundColor: 'white',
		fontSize: platform == 'ios'?18: screenHgt >= hightVariation ? 14: 11,
		paddingLeft: 10,
		height: platform == 'ios'? hp('5%'): screenHgt >= hightVariation ? hp('5.5%') : hp('5.9%'),
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