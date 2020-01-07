import React from "react";
import {
	View, Alert, StyleSheet
} from "react-native";
import {toJS} from 'mobx';
import { observer, inject } from "mobx-react";
import AdminDriverList from './AdminDriverList';


class DriverList extends React.PureComponent {

    constructor(props){
        super(props);
        this.adminStore = this.props.rootStore.adminStore;
        this.state = {
            drivers: [],
        }
    }
    
    componentDidMount() {
        console.log('componentDidMount');
        this.getDrivers();
    }

    componentWillReceiveProps() {
        console.log('componentWillReceiveProps');
        this.getDrivers();
    }

    getDrivers = () => {
        this.adminStore.getAllDrivers().then(()=> {
			console.log(toJS(this.adminStore.adminData.allDrivers))
			this.setState({drivers: toJS(this.adminStore.adminData.allDrivers)})
		});
    }

    removeDriver = (vehicleNo) => {
        this.props.showAlert('confirmDeleteDriver', vehicleNo);
        // this.adminStore.removeDriver(vehicleNo).then(()=> {
		// 	console.log(toJS(this.adminStore.adminData.removeDriver))
		// 	if(this.adminStore.adminData.removeDriver.status == 'Deleted') {
        //         Alert.alert('Driver has deleted successfully.');
        //         this.getDrivers();
        //     } else {
        //         Alert.alert(this.adminStore.adminData.removeDriver.message ? this.adminStore.adminData.removeDriver.message : 'Something went wrong')
        //     }
		// });
    }

    addDriver = () => {
        this.props.addDriver();
        // this.props.navigation.navigate('DriverRegisterScreen');
    }

    render() {
        let { drivers } = this.state;
        return (
            <View>
                <AdminDriverList 
                    driverData = {drivers} 
                    removeDriver = {this.removeDriver}
                />
                
            </View>
        )
    }
}
const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      
    },
  })
export default inject("rootStore")(observer(DriverList));