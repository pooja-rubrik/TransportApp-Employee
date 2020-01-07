import React from "react";
// import Modal from "react-native-modal";
import {TextInput, View, Alert, TouchableOpacity, StyleSheet} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { TextField } from 'react-native-material-textfield';
// import { Dropdown } from 'react-native-material-dropdown';
import Overlay from 'react-native-modal-overlay';

import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';

export default class ProfileModal extends React.PureComponent {

    constructor(props) {
        super(props);
        // console.log(this.props.profileData);
    }
    state = {
        phoneNumber: '',
        emergencyContact: '',
        homeAddress: '',
    }
    componentWillReceiveProps() {
        console.log(this.props.profileData);  
        this.setState({
            phoneNumber: this.props.profileData.empPhoneNumber ? this.props.profileData.empPhoneNumber : '',
            emergencyContact: this.props.profileData.empEmergencyContact ? this.props.profileData.empEmergencyContact : '',
            homeAddress: this.props.profileData.empHomeAddress ? this.props.profileData.empHomeAddress : ''
        })
    }
    
    
    
    closeModalFunc = (visible) => {
		this.props.closeModalFunc(visible);
	}

    submitRequest = () => {
        console.log(this.props.profileData);
        // this.props.submitProfile();
        profileParam = {};
        callParent = false;
        if(this.props.profileField == 'phone_number') {
            if(this.state.phoneNumber.trim() != '') {
                callParent = true;
                profileParam.empPhoneNumber = this.state.phoneNumber;
            } else {
                callParent = false;
                Alert.alert('Please enter phone number.');
            }
        } else if(this.props.profileField == 'emergency_contact') {
            if(this.state.emergencyContact.trim() != '') {
                callParent = true;
                profileParam.empEmergencyContact = this.state.emergencyContact;
            } else {
                callParent = false;
                Alert.alert('Please enter emergency contact.');
            }
        } else if(this.props.profileField == 'address') {
            if(this.state.homeAddress.trim() != '') {
                callParent = true;
                profileParam.empHomeAddress = this.state.homeAddress;
            } else {
                callParent = false;
                Alert.alert('Please enter emergency contact.');
            }
        } 
        if(callParent == true) {
            this.props.submitProfile(profileParam);
        }

    }

    cancelRequest = () =>{
        // this.props.cancelChangeRequest();
    }

    handleDescChange = (description) => {
        // this.props.handleDescription();
    }


	render() {
        let { phoneNumber, emergencyContact, homeAddress } = this.state;
        let { profileField } = this.props;
        
	    return (
            <Overlay visible={this.props.profileModalVisible} onClose={this.closeModalFunc} 
                animationType="zoomIn" containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.4)'}}
                childrenWrapperStyle={{backgroundColor: '#eee'}}
                animationDuration={500} closeOnTouchOutside>
               {/* <View> */}
                    <View style={styles.modalView} >
                        {/* <TouchableOpacity
                            onPress={this.closeModalFunc}
                        >
                            <Text style={styles.closeText}>X</Text>
                        </TouchableOpacity> */}
                        <View>
                            <View style={styles.TextInputView}>
                                <View>
                                   { 
                                    (profileField == 'phone_number')?
                                    <TextInput
                                        label=''
                                        value={`${phoneNumber}`}
                                        onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                        style={styles.textInputStyles}
                                        labelFontSize={14}
                                        placeholder={STRCONSTANT.PHONE_NUM}
                                    />
                                    : 
                                    (profileField == 'emergency_contact') ?
                                    <TextInput
                                        label=''
                                        value={`${emergencyContact}`}
                                        onChangeText={(emergencyContact) => this.setState({ emergencyContact })}
                                        style={styles.textInputStyles}
                                        labelFontSize={14}
                                        placeholder={STRCONSTANT.EMERGENCY_CONTACT}
                                    />:
                                    <TextInput
                                        label=''
                                        value={`${homeAddress}`}
                                        onChangeText={(homeAddress) => this.setState({ homeAddress })}
                                        style={styles.textAreaStyles}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        multiline={true}
                                        numberOfLines={4}
                                        placeholder={STRCONSTANT.HOME_ADDR}
                                    />
                                   }
                                    
                                </View>
                                <View style={styles.ButtonSubmit}>
                                    <RaisedTextButton
                                        title={STRCONSTANT.SUBMIT_REQUEST}
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
                {/* </View> */}
            </Overlay>
        );
	}
}

const styles = StyleSheet.create({
    modalView: {
		backgroundColor: COLOR.MODAL_BG,
		// padding: 20,
		borderRadius: 5,
        // height: hp('40%'),
        // marginTop: -20,
        // marginBottom: -20
        alignSelf: 'center'
	},
	closeText: {
		backgroundColor: COLOR.APP_BG_COLOR,
		color: 'grey',
		borderRadius: 13,
		width: 22,
		padding: 3,
		alignSelf: 'flex-end',
		textAlign: 'center',
		borderWidth: 1,
		borderColor: 'grey',
		marginRight: 0,
        marginTop: 0,
        fontSize: 10
	},
	ButtonSubmit: {
		// marginTop: 20,
		// flex: 1,
        // flexDirection: 'row',
        alignSelf: 'center'
	},
	buttonEmail: {
		borderRadius: 15,
		width: wp('85%'),
        height: hp('4%'),
        marginTop: 5
    },
	textInputStyles: {
		borderRadius: 15,
		backgroundColor: 'white',
		fontSize: 16,
		paddingLeft: 10,
		height: hp('4%'),
		width: wp('85%'),
        // marginTop: 15
	},
	textAreaStyles: {
		borderRadius: 15,
		backgroundColor: 'white',
		// marginTop: 20,
		fontSize: 18,
		paddingLeft: 10,
		paddingTop: 10,
		width: wp('85%'),
		height: 100,
	},
	titleStyle:{
        textTransform: 'capitalize'
	}
})