import React from "react";
import {
	View,  
} from "react-native";
import { observer, inject } from "mobx-react";
import {toJS} from 'mobx';
import AdminAdminList from './AdminAdminList'
import { AppAlert } from '../components/Alert';

class AdminList extends React.PureComponent {

    constructor(props){
        super(props);
        this.usersStore = this.props.rootStore.usersStore;
        this.state = {
            admins: [],
            
        }
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.getAdmins();
    }

    componentWillReceiveProps() {
        this.getAdmins();
    }
    
    getAdmins = () => {
        this.usersStore.getAllEmployee().then(()=> {
            console.log(toJS(this.usersStore.users.allemps))
            allemps = toJS(this.usersStore.users.allemps)
            // allemps = [{
            //     "empID": 102006,
            //     "empName": "Pooja",
            //     "empEmail": "poojapanwar.evon@gmail.com",
            //     "empPhoneNumber": "7310946377",
            //     "empHomeAddress": "Aone tech de",
            //     "empEmergencyContact": "7310946377",
            //     "empType": "admin",
            //     "code": 200
            //   },{
            //     "empID": 102002,
            //     "empName": "Pooja",
            //     "empEmail": "poojapanwar.evon@gmail.com",
            //     "empPhoneNumber": "7310946377",
            //     "empHomeAddress": "Aone tech de",
            //     "empEmergencyContact": "7310946377",
            //     "empType": "admin",
            //     "code": 200
            //   } ]
            admins = allemps.filter(user=> user.empType == 'admin' )
            console.log(admins)
			this.setState({admins: admins})
		});
    }

    removeAdmin = (admId) => {
        console.log(admId)
        this.props.showAlert('confirmDelete', admId);
    }

    render() {
        let {admins,  } = this.state;
        return (
            <View >
                <AdminAdminList 
                    adminData = {admins} 
                    removeAdmin = {this.removeAdmin}
                />
                
            </View>
        )
    }
}
export default inject("rootStore")(observer(AdminList));