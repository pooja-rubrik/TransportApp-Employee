import React from "react";
import {
	View,  
} from "react-native";
import moment from 'moment';
import { observer, inject } from "mobx-react";
import {toJS} from 'mobx';
import EmpListTab from "./EmpListTab";
import AdminEmpList from "./AdminEmpList";

class EmpList extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            empTabVisible : true,
            selectedDate: moment().format('YYYY-MM-DD'),
            empDetails: '',
        }
        this.currentDate = moment().format('YYYY-MM-DD');
        this.tomorrowDate = moment().add(1, 'days').format('YYYY-MM-DD') ;
        this.usersStore =  this.props.rootStore.usersStore;
		this.adminStore = this.props.rootStore.adminStore;
    }
    empSwitch = (tab) => {
        this.setState({
            empTabVisible: (tab=='today') ? true : false,
            selectedDate: (tab == 'today') ? this.currentDate: this.tomorrowDate
        })
        this.getEmployeeData();
    }

    componentDidMount () {
        this.getEmployeeData();
    }

    getEmployeeData = (changeDate = '', changeTime = '') => {
        console.log('changeDate>>>', changeDate, this.state.selectedDate)
        changeDate = (changeDate == '')?this.state.selectedDate: this.currentDate;
        this.adminStore.getDailyLoginData( 'Assign Login', changeDate, changeTime ).then(()=> {
			console.log(toJS(this.adminStore.adminData.empDetails))
			this.usersStore.filterEmployeeForLogin(this.adminStore.adminData.empDetails).then(()=>{
                console.log(toJS(this.usersStore.users.filterEmployees))
                this.adminStore.getDailyLoginData( 'Assign Logout', changeDate, changeTime ).then(()=> {
                    this.usersStore.filterEmployeeForLogout(this.adminStore.adminData.empDetails).then(()=>{
                        console.log(toJS(this.usersStore.users.filterEmployees))
                        this.setState({empDetails: toJS(this.usersStore.users.filterEmployees)})
                    })
                })
			})
			
		});
    }

    render() {
        let {empTabVisible, empDetails} = this.state;
        return (
            <View>
                <EmpListTab empTabVisible = {empTabVisible} empSwitch= {this.empSwitch}/>
                <AdminEmpList 
                    empData = {empDetails} 
                    // getEmployeeData = {this.getEmployeeData}
                />
                
            </View>
        )
    }
}
export default inject("rootStore")(observer(EmpList));