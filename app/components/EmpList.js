import React from "react";
import {
	View,  
} from "react-native";
import moment from 'moment';
import { observer, inject } from "mobx-react";
import {toJS} from 'mobx';
import EmpListTab from "./EmpListTab";
import AdminEmpList from "./AdminEmpList";
import Color from '../services/AppColor'

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
        changeDate = (tab == 'today') ? this.currentDate: this.tomorrowDate;
        console.log('change>>>>>>', changeDate, tab);
        this.getEmployeeData( changeDate);
    }

    componentDidMount () {
        this.getEmployeeData();
    }

    getEmployeeData = (changeDate = '', changeTime = '') => {
        console.log('changeDate>>>', changeDate, this.state.selectedDate)
        changeDate = (changeDate == '')?this.currentDate: changeDate;
        this.adminStore.getDailyLoginData( 'Assign Login', changeDate, changeTime ).then(()=> {
			console.log(toJS(this.adminStore.adminData.empDetails))
			this.usersStore.filterEmployeeForLogin(this.adminStore.adminData.empDetails).then(()=>{
                console.log(toJS(this.usersStore.users.filterEmployees))
                this.adminStore.getDailyLoginData( 'Assign Logout', changeDate, changeTime ).then(()=> {
                    this.usersStore.filterEmployeeForLogout(this.adminStore.adminData.empDetails).then(()=>{
                        console.log(toJS(this.usersStore.users.filterEmployees))
                        employees = toJS(this.usersStore.users.filterEmployees).filter(user=> (user.empDetail.empType == 'ADMIN' || user.empDetail.empType == 'EMPLOYEE'))
				        this.setState({empDetails: employees})
                    })
                })
			})
			
		});
    }

    render() {
        let {empTabVisible, empDetails} = this.state;
        return (
            <View style = {{backgroundColor: Color.HEADER_BG_COLOR}}>
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