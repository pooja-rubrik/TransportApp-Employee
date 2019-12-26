import React, { Component } from "react";
import {
    View, StyleSheet, Image,
    Text, TouchableOpacity, TextInput, Alert
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RaisedTextButton } from 'react-native-material-buttons';
import { signOut, EventEmitter } from '@okta/okta-react-native';

import Wallpapers from "../components/Wallpaper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import avtarImg from '../assets/icons/userlogo.png'
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';
import { ScrollView } from "react-native-gesture-handler";

class Profile extends Component {
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
            updateBtnVisible: false,
            contact: this.empDetail.empPhoneNumber ? this.empDetail.empPhoneNumber : '',
            address: this.empDetail.empHomeAddress ? this.empDetail.empHomeAddress : '',
        }

    }

    static navigationOptions = ({ navigation }) => ({
        title: 'My Profile'

    });

    componentDidMount() {
        this.signOutSuccess = EventEmitter.addListener('signOutSuccess', (e: Event) => {
            console.log('sign out>>', e)
            StorageService.removeData('okta_data').then(data => {
                ApiService.removeHeader();
                this.props.navigation.navigate('LoginScreen', { 'pageName': this.userType });
            })

        });
        this.onError = EventEmitter.addListener('onError', (e: Event) => {
            console.log('error in okta login>', e)
            Alert.alert('User has cancelled');
        });
        this.onCancelled = EventEmitter.addListener('onCancelled', (e: Event) => {
            console.log('Failed to log in', e)
            Alert.alert('Failed to log in', e.error_message);
        });
    }

    logoutProfile = () => {
        signOut();
    }

    updateProfile = () => {
        profileParam = {};
        profileParam.empID = this.empDetail.empID;
        profileParam.empPhoneNumber = this.state.contact
        profileParam.empHomeAddress = this.state.address;

        this.empStore.updateProfile(profileParam, this.userType, this.usersStore.users.oktaDetail.accessToken).then(() => {
            console.log('profileUpdate success>>', toJS(this.empStore.empData.profileUpdate))
            if (this.empStore.empData.profileUpdate.code == 200) {
                this.setState({ isContactVisible: true, isAddrVisible: true, updateBtnVisible: false })
                this.usersStore.getEmployee(this.userType).then(() => {
                    Alert.alert(`User profile will be updated tomorrow.`);
                })

            }

        })
    }

    EditProfile = (editType) => {
        this.setState({ updateBtnVisible: true })
        // (editType == 'Phone') ? {this.setState({isContactVisible: false}) }: {this.setState({isAddrVisible: false})}
        this.setState((editType == 'Phone') ? { isContactVisible: false } : { isAddrVisible: false });
    }

    render() {
        let { isContactVisible, contact, isAddrVisible, address, updateBtnVisible } = this.state
        return (
            <Wallpapers>
                <View style={styles.container}>
                    <Image style={styles.avtarStyle} source={avtarImg} />
                    <Text style={styles.fullName}>{this.empDetail.empName}</Text>
                    <View style={styles.contentSec}>

                        <View style={styles.menuContainer}>
                            <Text style={styles.menuTextLeft}>
                                EmployeeId
                                </Text>
                            <Text style={styles.separator}>
                                :
                                </Text>
                            <Text style={styles.menuTextRight}>
                                {this.empDetail.empID}
                            </Text>

                        </View>
                        <View style={styles.menuContainer}>
                            <Text style={styles.menuTextLeft}>
                                Email
                                </Text>
                            <Text style={styles.separator}>
                                :
                                </Text>
                            <Text style={styles.menuTextRight}>
                                {this.empDetail.empEmail}
                            </Text>

                        </View>
                        <View style={styles.menuContainer}>
                            <Text style={styles.menuTextLeft}>
                                Phone
                                </Text>

                            <Text style={styles.separator}>
                                :
                                </Text>
                            {

                                (isContactVisible) ?
                                    <View style={styles.rightView}>
                                        <Text style={styles.menuTextRight}>
                                            {contact}
                                        </Text>
                                        <TouchableOpacity onPress={() => this.EditProfile('Phone')}>
                                            <View style={styles.iconView}>
                                                <MaterialIcons name="edit" size={19} color="#5b5a5a" />
                                            </View>

                                        </TouchableOpacity>
                                    </View>

                                    :
                                    <TextInput
                                        label=''
                                        value={`${contact}`}
                                        onChangeText={(contact) => this.setState({ contact })}
                                        style={styles.textFieldStylesOwn}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        // placeholder={STRCONSTANT.ENTER_OTP}
                                        lineWidth={0}
                                        activeLineWidth={0}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                    />
                            }



                        </View>
                        <View style={[styles.menuContainer, styles.menuHeight]}>
                            <Text style={styles.menuTextLeft}>
                                Address
                                </Text>
                            <Text style={styles.separator}>
                                :
                                </Text>
                            {
                                (isAddrVisible) ?
                                    <View style={styles.rightView}>
                                        {/* <ScrollView style={{flexDirection: 'row'}}> */}
                                            <Text style={[styles.menuTextRight, styles.menuMargin]}>
                                                
                                                {address}
                                            </Text>
                                            <TouchableOpacity onPress={() => this.EditProfile('Address')}>
                                                <View style={styles.iconView}>
                                                    <MaterialIcons name="edit" size={19} color="#5b5a5a" />
                                                </View>

                                            </TouchableOpacity>
                                        {/* </ScrollView> */}
                                        
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
                                        numberOfLines={5}
                                    // placeholder={ STRCONSTANT.DRIVER_ADDRESS }
                                    />
                            }

                        </View>
                        <View style={styles.buttonSec}>
                            {
                                (updateBtnVisible) ?
                                    <RaisedTextButton
                                        title={STRCONSTANT.UPDATE}
                                        color={COLOR.BUTTON_COLOR}
                                        titleColor={COLOR.BUTTON_FONT_COLOR}
                                        onPress={this.updateProfile}
                                        style={styles.updateBtn}
                                    />
                                    :
                                    <View></View>
                            }

                            <RaisedTextButton
                                title={STRCONSTANT.LOGOUT}
                                color={COLOR.BUTTON_COLOR_CANCEL}
                                titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
                                onPress={this.logoutProfile}
                                style={styles.cancelStyle}
                            />

                        </View>

                    </View>

                </View>

            </Wallpapers>
        );


    }
    componentWillUnmount() {
        this.signOutSuccess.remove();
        this.onError.remove();
        this.onCancelled.remove();
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        height: 350,
    },
    avtarStyle: {
        marginTop: 0,
        height: wp('20%'),
        width: wp('20%'),
        marginTop: 20,
        marginBottom: 20,
    },
    contentSec: {
        backgroundColor: '#EFEEEE',
        marginTop: 20,
        flex: 1,
        width: wp('100%'),
        height: hp('60%'),
    },
    fullName: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 22
    },

    menuContainer: {
        height: hp('10%'),
        borderColor: '#ccc',
        borderBottomWidth: 1,
        flexDirection: 'row',
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
        width: wp('55%')
    },
    rightView: {
        width: wp('70%'),
        flexDirection: 'row'
    },
    buttonSec: {
        bottom: 50,
        alignSelf: 'center',
        position: 'absolute'
        // marginBottom: 0
    },
    cancelStyle: {
        borderColor: '#f00',
        borderWidth: 1,
        borderRadius: 20,
        width: wp('65%'),
        height: hp('5.5%')
    },
    updateBtn: {
        borderRadius: 20,
        width: wp('65%'),
        height: hp('5.5%'),
        marginBottom: 10,
    },
    textFieldStylesOwn: {
        backgroundColor: 'white',
        paddingLeft: 10,
        height: hp('5%'),
        borderRadius: 20,
        //marginTop: 15,
        borderWidth: 0,
        width: wp('55%')
    },
    textAreaStyles: {
        borderRadius: 20,
        backgroundColor: 'white',
        // marginTop  :15,	
        // fontSize: 18,
        paddingLeft: 10,
        paddingTop: 10,
        height: 80,
        width: wp('55%')
    },
    separator: {
        marginRight: 15,
        width: wp('2%')
    },
    iconView: {
        width: wp('5%')
    },
    menuHeight: {
        height: hp('15%')
    },
    menuMargin:{ 
        marginTop:10,
        marginBottom: 10
    }
})

export default inject("rootStore")(observer(Profile));
