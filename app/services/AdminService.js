import ApiService from './ApiService';
import api from './API';
import moment from 'moment';

class AdminService {

    constructor(){
        this.currentDate = moment().format('YYYY-MM-DD');
    }

    getDailyLoginAll = async (assignType, changeDate, changeTime) => { //get all employees for assign driver
        console.log(changeDate, this.currentDate, 'time>>>', changeTime);
        apiURL = (changeTime == '') ? ((changeDate != '' && changeDate != this.currentDate) ? 
                (assignType == 'Assign Login' ? `${api.next_day_login}`: `${api.next_day_logout}`)
                : (assignType == 'Assign Login' ? `${api.daily_login}`: `${api.daily_logout}`))
                :((changeDate != '' && changeDate != this.currentDate) ? 
                (assignType == 'Assign Login' ? `${api.next_day_login_by_time}/${changeTime}`: `${api.next_day_logout_by_time}/${changeTime}`)
                : (assignType == 'Assign Login' ? `${api.daily_login_by_time}/${changeTime}`: `${api.daily_logout_by_time}/${changeTime}`))
                console.log('apiurl>>>', apiURL)
        // apiURL = assignType == 'Assign Login' ? `${api.daily_login}`: `${api.daily_logout}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    getDriverListByTime = async (tripDate, tripTime) => { //get all available driver for employee
        apiURL = `${api.driver_trip_list}/${tripDate}/${tripTime}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    assignDriver = async (assignParam) => { 
        apiURL = `${api.driver_trip}`;
        const res = await ApiService.apiCall(apiURL, 'POST', assignParam);
        ApiService.handleCommonError(res);
        return res.body;
    }

    getAllDrivers = async () => {
        apiURL = api.get_driver;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    getAllAdmins = async () => {
        apiURL = api.register_admin;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    removeDriver = async (vehicleNo) => {
        apiURL = `${api.get_driver}/${vehicleNo}`;
        const res = await ApiService.apiCall(apiURL, 'DELETE');
        ApiService.handleCommonError(res);
        return res.body;
    }

    addPickTime = async (pickTime, empid, pickDate) => { //get all available driver for employee
        console.log(pickDate, this.currentDate);
        if(pickDate!=this.currentDate){
            //next day api
            apiURL = `${api.next_day_login}/${empid}/${pickTime}`;
        } else {
            apiURL = `${api.daily_login}/${empid}/${pickTime}`;
        }
        
        const res = await ApiService.apiCall(apiURL, 'POST');
        ApiService.handleCommonError(res);
        return res.body;
    }

}

export default new AdminService();