import React from "react";
// import Modal from "react-native-modal";
import {TextInput, View, Text, TouchableOpacity, StyleSheet} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import Overlay from 'react-native-modal-overlay';

import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';

export default class EmailModel extends React.PureComponent {
    
    state = {
        fromEmail: 'xyz@abc.com',
        toEmail: 'abc@xyz.com',
        subject: '',
        description: '',
        label: 'Choose Subject'
    }
    
    closeModalFunc = (visible) => {
		this.props.closeModalFunc(visible);
	}

    submitRequest = () => {
        // this.props.submitChangeRequest();
    }

    cancelRequest = () =>{
        // this.props.cancelChangeRequest();
    }

    handleDescChange = (description) => {
        // this.props.handleDescription();
    }


	render() {
        let { subject, description } = this.state;
        let subjectOption = [{
            value: 'Change Pick',
          }, {
            value: 'Change Drop',
          }, {
            value: 'Others',
          }];
	    return (
            <Overlay visible={this.props.emailModalVisible} onClose={this.closeModalFunc} 
                animationType="zoomIn" containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.4)'}}
                childrenWrapperStyle={{backgroundColor: '#eee'}}
                animationDuration={500}>
               {/* <View> */}
                    <View style={styles.modalView} >
                        <TouchableOpacity
                            onPress={this.closeModalFunc}
                        >
                            <Text style={styles.closeText}>X</Text>
                        </TouchableOpacity>
                        <View>
                            <View style={styles.TextInputView}>
                                <View>
                                    {/* <Text style={styles.helpText}>
                                        Change Time?
                                    </Text> */}

                                    {/* <TextField
                                        label='From:'
                                        value={`${fromEmail}`}
                                        style={styles.textInputStyles}
                                        labelFontSize={14}
                                        editable={false}
                                    />
                                    <TextField
                                        label='to'
                                        value={`${toEmail}`}
                                        style={styles.textInputStyles}
                                        labelFontSize={14}
                                        editable={false}
                                    /> */}
                                    <Dropdown
                                        // label='Choose Subject'
                                        data={subjectOption}
                                        baseColor = '#000'
                                        value={ this.state.label }
                                        dropdownOffset={{ 'top': 0, 'left': 0 }}
                                        containerStyle={{ backgroundColor:'#fff', borderRadius:50, width:wp('80%'), paddingLeft:12, marginTop:25,paddingTop: 6, paddingRight:10, height: hp('5%'), }}
                                        rippleCentered={true}
                                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                        onChangeText={(value)=> 
                                            {
                                                this.setState({
                                                    label: value
                                                });
                                            }
                                        }
                                        
                                    />
                                    { 
                                        (this.state.label == 'Others')?
                                        <TextField
                                            label='Others'
                                            value={`${subject}`}
                                            style={styles.textInputStyles}
                                            labelFontSize={14}
                                            placeholder={STRCONSTANT.SUB_LINE}
                                        /> :
                                        <View></View>
                                    }
                                    
                                    <TextInput
                                        label='description'
                                        value={`${description}`}
                                        onChangeText={this.handleDescChange}
                                        style={styles.textAreaStyles}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        multiline={true}
                                        numberOfLines={4}
                                        placeholder={STRCONSTANT.DESC_TITLE}
                                    />
                                </View>
                                <View style={styles.ButtonSubmit}>
                                    <RaisedTextButton
                                        title={STRCONSTANT.SUBMIT_REQUEST}
                                        color={COLOR.BUTTON_COLOR}
                                        titleColor={COLOR.BUTTON_FONT_COLOR}
                                        onPress={this.submitRequest}
                                        style={styles.buttonEmail}
                                    />
                                    <RaisedTextButton
                                        title={STRCONSTANT.CANCEL_REQUEST}
                                        color={COLOR.BUTTON_COLOR}
                                        titleColor={COLOR.BUTTON_FONT_COLOR}
                                        onPress={this.closeModalFunc}
                                        style={styles.buttonEmail}
                                    />

                                </View>
                            </View>
                        </View>
                    </View>                   
                {/* </View> */}
            </Overlay>
                // <Modal
                //         animationType='slide'
                //         visible={this.props.emailModalVisible}
                //     >
                //     </Modal>
           
		
	  );
	}
}

const styles = StyleSheet.create({
    modalView: {
		backgroundColor: COLOR.HEADER_BG_COLOR,
		padding: 20,
		borderRadius: 5,
        height: hp('65%'),
        marginTop: -20,
        marginBottom: -20
	},
	closeText: {
		backgroundColor: COLOR.APP_BG_COLOR,
		color: 'white',
		borderRadius: 17,
		width: 32,
		padding: 6,
		alignSelf: 'flex-end',
		textAlign: 'center',
		borderWidth: 1,
		borderColor: 'white',
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
		width: wp('60%'),
        height: hp('5%'),
        marginTop: 20
    },
	textInputStyles: {
		borderRadius: 20,
		backgroundColor: 'white',
		fontSize: 16,
		paddingLeft: 10,
		height: hp('5%'),
		width: wp('80%'),
        // marginTop: 15
	},
	textAreaStyles: {
		borderRadius: 20,
		backgroundColor: 'white',
		marginTop: 20,
		fontSize: 18,
		paddingLeft: 10,
		paddingTop: 10,
		width: wp('80%'),
		height: 150,
	},
	subjectPicker: {
        backgroundColor: 'white',
        borderRadius: 20,
	},
})