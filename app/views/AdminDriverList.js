import React, { Component } from "react";
import CardView from 'react-native-cardview'
import {
	Text, StyleSheet,
	View, Alert
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RaisedTextButton } from 'react-native-material-buttons';
import { observer, inject } from "mobx-react";
import {toJS} from 'mobx';
import { ScrollView } from "react-native-gesture-handler";
// import { Chip } from 'react-native-paper';

import Wallpapers from "../components/Wallpaper";
import { HeaderDriver, Item } from '../components/HeaderDropdownAndroid';
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';


class AdminDriverList extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerRight: (
                <HeaderDriver>
                    <Item title="Add Driver" show="never" onPress={() => params.handleMenu('DriverRegisterScreen')} />
                </HeaderDriver>
            ),
            title: 'Driver List'
        };
		
    };

    constructor(props) {
        super(props)
        this.adminStore = this.props.rootStore.adminStore;
    }

    state = {
        drivers : []
    }

    componentDidMount() {
		this.props.navigation.setParams({
			handleMenu: this.navigateMenu,
        });
        this.getDrivers();

    }

    getDrivers = () => {
        this.adminStore.getAllDrivers().then(()=> {
			console.log(toJS(this.adminStore.adminData.allDrivers))
			this.setState({drivers: toJS(this.adminStore.adminData.allDrivers)})
		});
    }

    navigateMenu = (pageName) => {
		this.props.navigation.navigate(pageName, {'fromPage': 'adminDriverList'});
    }
    
    removeDriver = (vehicleNo) => {
        this.adminStore.removeDriver(vehicleNo).then(()=> {
			console.log(toJS(this.adminStore.adminData.removeDriver))
			if(this.adminStore.adminData.removeDriver.status == 'Deleted') {
                Alert.alert('Driver has deleted successfully.');
                this.getDrivers();
            } else {
                Alert.alert(this.adminStore.adminData.removeDriver.message ? this.adminStore.adminData.removeDriver.message : 'Something went wrong')
            }
		});
    }

    render() {
        let {drivers} = this.state;
        var driverList = drivers.length != 0 ? drivers.map((driver, index) => (
            <CardView
                cardElevation={4}
                cardMaxElevation={4}
                cornerRadius={5}
                style={styles.cardView}
                key = {index}>
                    <View style={styles.cardData}>
                        <View style={styles.leftCardView}>
                            <Text style={styles.cardText}>
                                {driver.driverName} ({driver.vehicleNumber})
                            </Text>
                            <Text style={styles.cardText}>
                                Contact : {driver.driverPhone}
                            </Text>
                        </View>
                        <View style={styles.rightCardView}>
                            {/* <Chip>2 Seats left</Chip> */}
                        </View>
                    </View>
                    <View style={styles.buttonSec}>
                        <RaisedTextButton
                            title={STRCONSTANT.REMOVE_DRIVER}
                            color={COLOR.BUTTON_COLOR_CANCEL}
                            titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
                            onPress={() => this.removeDriver(driver.vehicleNumber)}
                            style={styles.cancelStyle}
                        />
                    </View>
            </CardView>
        )):
        <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={5}
            style={styles.cardView}
		>
			<View style={styles.leftCardView}>
				<Text style={styles.cardText}>
					No Drivers!
				</Text>
			</View>
		</CardView>;
        return(
            <Wallpapers>
                <ScrollView>
                    {driverList}
                </ScrollView>
                
                {/* <CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={styles.cardView}>
					    <View style={styles.cardData}>
                            <View style={styles.leftCardView}>
                                <Text style={styles.cardText}>
                                    Driver3 (Vehicle1)
                                </Text>
                                <Text style={styles.cardText}>
                                    Contact : xxxxxxxxx
                                </Text>
                            </View>
                            <View style={styles.rightCardView}>
                                <Chip>2 Seats left</Chip>
                            </View>
                        </View>
					
					<View style={styles.buttonSec}>
						<RaisedTextButton
							title={STRCONSTANT.REMOVE_DRIVER}
							color={COLOR.BUTTON_COLOR_CANCEL}
							titleColor={COLOR.BUTTON_FONT_COLOR_CANCEL}
							onPress={this.authorize}
							style={styles.cancelStyle}
						/>
					</View>
				</CardView> */}
            </Wallpapers>
        )
    }
}
const styles = StyleSheet.create({
	cardView: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('15%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
	},
	cardText: {
		fontSize: 15,
		marginLeft: 10,
		marginBottom: 5,
        marginRight: 15,
        fontWeight: 'bold',
        color: '#5b5a5a', 
    },	
    cancelStyle: {
		borderColor: '#f00',
		borderWidth: 1,
		borderRadius: 20,
		marginRight: 10
    },
    buttonSec: {
		paddingTop: 13,
		flex: 1,
		flexDirection: 'row',
		alignSelf: 'center',
		shadowOffset: { width: 0, height: .5 },
		shadowColor: '#f00',
		shadowOpacity: .2,
    },
    leftCardView: {
		width: wp('60%')
	},
	rightCardView: {
		width: wp('27%'),
		alignSelf: 'center',
    },
    cardData: {
        flex: 1,
        flexDirection: 'row'
    }
})

export default inject("rootStore")(observer(AdminDriverList));