import React, { Component } from "react";
import {
    View, StyleSheet, Image, Platform,
    Text, TouchableOpacity, TextInput, Alert
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RaisedTextButton } from 'react-native-material-buttons';
import Wallpapers from "../components/Wallpaper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import avtarImg from '../assets/icons/userlogo.png'
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';
import  deviceInfo  from '../stylesheets/AppDimensions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import contact from '../assets/icons/contact.png';
import emergency from '../assets/icons/emergency.png';
import location from '../assets/icons/location.png';
import phone from '../assets/icons/phone.png';


const platform = Platform.OS;
const screenHgt = deviceInfo.DEVICE_HEIGHT;
const hightVariation = deviceInfo.HEIGHT_VARIATION

class AdminProfile extends Component {
    constructor(props) {
        super(props);
        this.usersStore = this.props.rootStore.usersStore;
        this.userType = this.usersStore.users.oktaDetail.userType;
        this.empDetail = this.usersStore.users.empDetail;
        this.empStore = this.props.rootStore.empStore;
        console.log('empdetail>>>', toJS(this.empDetail))
        this.state = {
            isContactVisible: true,
            isAddrVisible: true,
            emergencyVisible: true,
            updateBtnVisible: false,
            phoneNumber: this.empDetail.empPhoneNumber ? this.empDetail.empPhoneNumber : '',
            address: this.empDetail.empHomeAddress ? this.empDetail.empHomeAddress : '',
            emergencyContact: this.empDetail.empEmergencyContact ? this.empDetail.empEmergencyContact : ''
        }

    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Profile'

    });

    componentDidMount() {
       
    }

    updateProfile = () => {
        profileParam = {};
        profileParam.empID = this.empDetail.empID;
        profileParam.empPhoneNumber = this.state.phoneNumber
        profileParam.empHomeAddress = this.state.address;
        profileParam.empEmergencyContact = this.state.emergencyContact;

        this.empStore.updateProfile(profileParam, this.userType, this.usersStore.users.oktaDetail.accessToken).then(() => {
            console.log('profileUpdate success>>', toJS(this.empStore.empData.profileUpdate))
            if (this.empStore.empData.profileUpdate.code == 200) {
                this.setState({ isContactVisible: true, isAddrVisible: true, updateBtnVisible: false, emergencyVisible: true })
                this.usersStore.getEmployee(this.userType).then(() => {
                    Alert.alert('User profile has been updated.')
                })

            }

        })
    }

    EditProfile = (editType) => {
        this.setState({ updateBtnVisible: true })
        // (editType == 'Phone') ? {this.setState({isContactVisible: false}) }: {this.setState({isAddrVisible: false})}
        this.setState((editType == 'Phone') ? { isContactVisible: false, isAddrVisible: true, emergencyVisible: true } : 
                                                (editType == 'Emergency') ? { emergencyVisible: false, isContactVisible: true, isAddrVisible: true } : 
                                                                            { emergencyVisible: true, isContactVisible: true, isAddrVisible: false });
    }

    render() {
        let { isContactVisible, phoneNumber, isAddrVisible, emergencyVisible, address, updateBtnVisible, emergencyContact } = this.state
        return (
            <Wallpapers>
                <View style={styles.userContainer}>
                    <Image style={styles.avtarStyle} source={avtarImg} />
                    <Text style={styles.fullName}>{this.empDetail.empName}</Text>
                </View>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={false}
                >
                    <View style={styles.contentSec}>

                        <View style={styles.menuContainer}>
                           
                            <Image style={styles.menuTextLeft} source={phone} />
                            
                           {
                            (isContactVisible) ?
                                <View style={styles.rightView}>
                                    <Text style={styles.menuTextRight}>
                                        {phoneNumber}
                                    </Text>
                                    <TouchableOpacity onPress={() => this.EditProfile('Phone')}>
                                        <View style={styles.iconView}>
                                            <MaterialIcons name="edit" size={19} color="#333" />
                                        </View>

                                    </TouchableOpacity>
                                </View>

                                :
                                <View style={styles.rightView}>
                                    <TextInput
                                        label=''
                                        value={`${phoneNumber}`}
                                        onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                        style={styles.textFieldStylesOwn}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        lineWidth={0}
                                        activeLineWidth={0}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                    />
                                </View>
                                
                            }

                        </View>
                        <View style={styles.menuContainer}>
                           
                            <Image style={styles.menuTextLeft} source={emergency} />
                            
                            {

                            (emergencyVisible) ?
                                <View style={styles.rightView}>
                                    <Text style={styles.menuTextRight}>
                                        {emergencyContact}
                                    </Text>
                                    <TouchableOpacity onPress={() => this.EditProfile('Emergency')}>
                                        <View style={styles.iconView}>
                                            <MaterialIcons name="edit" size={19} color="#333" />
                                        </View>

                                    </TouchableOpacity>
                                </View>

                                :
                                <View style={styles.rightView}>
                                    <TextInput
                                        label=''
                                        value={`${emergencyContact}`}
                                        onChangeText={(emergencyContact) => this.setState({ emergencyContact })}
                                        style={styles.textFieldStylesOwn}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        lineWidth={0}
                                        activeLineWidth={0}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                    />
                                </View>
                                
                            }

                        </View>
                        
                        <View style={styles.menuContainerAddr}>
                            <Image style={styles.menuTextLeft} source={location} />
                            {
                                (isAddrVisible) ?
                                    <View style={styles.rightView}>
                                        <Text style={styles.menuTextRight}>
                                            {address}
                                        </Text>
                                        <TouchableOpacity onPress={() => this.EditProfile('Address')}>
                                            <View style={styles.iconView}>
                                                <MaterialIcons name="edit" size={19} color="#333" />
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TextInput
                                        label=''
                                        value={`${address}`}
                                        onChangeText={(address) => this.setState({ address })}
                                        style={styles.textAreaStyles}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        multiline={true}
                                        numberOfLines={3}
                                    />
                            }

                        </View>
                        <View style={styles.buttonSec}>
                            {
                                (updateBtnVisible) ?
                                    <RaisedTextButton
                                        title={STRCONSTANT.UPDATE}
                                        color={COLOR.BUTTON_COLOR_EMP}
                                        titleColor={COLOR.BUTTON_FONT_COLOR}
                                        onPress={this.updateProfile}
                                        style={styles.updateBtn}
                                        disabled = {false}
                                        titleStyle = {styles.titleStyle}
                                    />
                                    :
                                    <RaisedTextButton
                                        title={STRCONSTANT.UPDATE}
                                        color={COLOR.BUTTON_COLOR_EMP}
                                        titleColor={COLOR.BUTTON_FONT_COLOR}
                                        onPress={this.updateProfile}
                                        style={styles.updateBtn}
                                        disabled = {true}
                                        titleStyle = {styles.titleStyle}
                                    />
                            }
                        </View>
                    </View>
                </KeyboardAwareScrollView>

            </Wallpapers>
        );


    }
    componentWillUnmount() {
        // 
    }
};

const styles = StyleSheet.create({
    userContainer: {
        // flex: 1,
        alignItems: 'center',
        height: hp('28%'),
        backgroundColor: COLOR.CARD_BG_COLOR,
        // marginBottom: screenHgt >= hightVariation ? 0 : 50
    },
    icon: {
        paddingLeft: 10
    },
    avtarStyle: {
        height: wp('35.5%'),
        width: wp('35.8%'),
        marginTop: 10,
        marginBottom: screenHgt >= hightVariation ? 10 : 0,
    },
    contentSec: {
        flex: 1,
        // backgroundColor: 'red'
        // width: wp('100%'),
        // height: hp('64%'),
    },
    fullName: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 22
    },

    menuContainer: {
        height: hp('8%'),
        borderColor: '#333',
        borderBottomWidth: .5,
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('94%'),
        marginLeft:10
    },
    menuContainerAddr:{
        // height: hp('12%'),
        minHeight: hp('12%'),
        borderColor: '#333',
        borderBottomWidth: .5,
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('94%'),
        marginLeft:10
    },
    menuTextLeft: {
        // color: '#5b5a5a',
        // fontWeight: 'bold',
        width: wp('11%'),
        height: wp('11%'),
        marginLeft: 20,
        // marginRight: 20
        // fontSize: 16
    },
    menuTextRight: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        width: wp('70%'),
        paddingLeft: 50
    },
    rightView: {
        // width: wp('80%'),
        flexDirection: 'row'
    },
    buttonSec: {
        // bottom: 0,
        marginTop: screenHgt >= hightVariation ? 100 : 70,
        alignSelf: 'center',
        // position: 'relative',
        // marginBottom: 0,
        // flex:3
    },
    cancelStyle: {
        borderColor: '#f00',
        borderWidth: 1,
        borderRadius: 20,
        width: wp('95%'),
        height: hp('5.5%')
    },
    updateBtn: {
        borderRadius: 20,
        width: wp('95%'),
        height: hp('5.5%'),
        marginBottom: 10,
    },
    textFieldStylesOwn: {
        backgroundColor: 'white',
        paddingLeft: 10,
        height: platform == 'ios'? hp('5%'): screenHgt >= hightVariation ? hp('5.5%') : hp('5.9%'),
        borderRadius: 20,
        //marginTop: 15,
        borderWidth: 0,
        width: wp('60%'),
        marginLeft: wp('10%'),
        fontSize: platform == 'ios'?18: screenHgt >= hightVariation ? 14: 12
    },
    textAreaStyles: {
        borderRadius: 20,
        backgroundColor: 'white',
        // marginTop  :15,	
        // fontSize: 18,
        paddingLeft: 10,
        paddingTop: 10,
        height: 85,
        width: wp('60%'),
        marginLeft: wp('10%'),
        fontSize: platform == 'ios'?18: screenHgt >= hightVariation ? 14: 12
    },
    iconView: {
        width: wp('5%')
    },
    titleStyle:{
		fontSize: 18,
		textTransform: 'capitalize'
	}
})

export default inject("rootStore")(observer(AdminProfile));