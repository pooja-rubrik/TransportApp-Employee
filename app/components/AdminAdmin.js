import React from "react";
import {
    Text, StyleSheet, TouchableOpacity,
    View, Image, Platform, Alert
} from "react-native";
import CardView from 'react-native-cardview'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import deleteDriverIcon from '../assets/icons/removeuser.png';
import Color from '../services/AppColor'

const platform = Platform.OS;
class AdminAdmin extends React.PureComponent {

    constructor(props) {
        super(props);
        this.adminStore = this.props.rootStore.adminStore;
        this.state = {
            currOpenId: '',
            isExpand: false,
            showDelete: false
        }
        console.log(this.props, toJS(this.adminStore))
    }

    
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps')
        this.setState({showDelete: false})
    }
   

    expandCard = (isExpand, currId) => {
        console.log('>>>>>>', isExpand, currId, this.state.currOpenId)
        this.setState(this.state.showDelete? { showDelete: false }: {showDelete: true})
        if (this.state.currOpenId == currId) {
            this.setState({
                currOpenId: ''
            });
        } else {
            this.setState(isExpand ? { isExpand: false, currOpenId: currId } : { isExpand: true, currOpenId: currId })
            console.log(this.state, currId);
        }
    }

    removeAdmin = (admId) => {
        console.log(admId)
        this.props.removeAdmin(admId);
    }
   
    render() {
        let { isExpand, currOpenId, showDelete} = this.state;
        let { admin, } = this.props;
        // employee = employee.empDetail
        
        return (
            <CardView
                cardElevation={4}
                cardMaxElevation={4}
                cornerRadius={5}
                style={(currOpenId == admin.empID) ? styles.cardViewChange : styles.cardView}
                // style={styles.cardViewChange}
            >
                <TouchableOpacity onPress={() => this.expandCard(isExpand, admin.empID)}>
                    <View style={styles.cardHead}>
                        <Text style={platform == "ios" ? styles.headTextIOS : styles.headText}>
                            {admin.empName}
                        </Text>
                        <View style={platform == "ios" ? styles.iconViewIOS : styles.iconView}>
                            {(showDelete == true)?
                                <TouchableOpacity onPress={() => this.removeAdmin( admin.empID)}>
                                    <Image style={styles.statusIcon} source={deleteDriverIcon} />
                                </TouchableOpacity>
                                
                                : null
                                // :<Image style={styles.statusIcon} source={statusIconBook} />
                            }
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    (currOpenId == admin.empID) ?
                        <View style={styles.cardContent}>
                            <View style={styles.leftSec}>
                                    {/* <Text style={[styles.cardText, styles.textPadTop]}>
                                        {employee.empPhoneNumber}
                                    </Text> */}
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        {admin.empID}
                                            
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        {admin.empEmail}
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        {admin.empPhoneNumber}
                                    </Text>
                                    
                                </View>
                                
                        </View>
                        :
                        <View></View>
                }
            </CardView>
        )
    }
}
const styles = StyleSheet.create({
    cardView: {
        backgroundColor: Color.CARD_BG_COLOR,
        width: wp('97%'),
        height: hp('5%'),
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 10
    },
    cardViewChange: {
        backgroundColor: Color.CARD_BG_COLOR,
        width: wp('97%'),
        // height: hp('15%'),
        alignSelf: 'center',
        marginTop: 5,
        paddingBottom: 10,
        
    },
    cardHead: {
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statusIcon: {
        height: 20,
        width: 20,
        right: 0,
    },
    iconView: {
        right: 10,
        paddingTop: 7,

    },
    iconViewIOS: {
        right: 10,
        paddingTop: 7,

    },
    headTextIOS: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Color.HEADER_TXT_COLOR,
        paddingTop: 10,
    },
    headText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Color.HEADER_TXT_COLOR,
        paddingTop: 6,
        paddingBottom: 6
    },
    cardContent: {
        // paddingLeft: 10,
        borderTopWidth: .5,
        borderTopColor: '#9A9C9B',
        width: wp('93%'),
        alignSelf: 'center',
        marginTop: 5,
        // paddingRight:wp('8%')
    },
    cardTextAddr: {
        borderBottomWidth: .5,
        borderBottomColor: '#9A9C9B',

    },
    cardText: {
        color: Color.CARD_TXT_COLOR,
    },
    leftSec: {
        flexDirection: 'column',
        paddingTop: 2,
        // width: wp('48%'),
    },
    rightSec:{
        width: wp('48%'),
        alignItems: 'center'
    },
    textPadTop: {
        paddingTop: 2
    },
    
    titleStyle: {
        fontSize: 12
    },
    buttonTrip: {
        borderRadius: 20,
        // marginBottom: 20,
        height: 19,
        marginTop: 5,
        width: wp('43%'),
        // marginLeft: 60
    },

    fontAddr: {
        fontSize: 14
    },
    
    
})


export default inject("rootStore")(observer(AdminAdmin));