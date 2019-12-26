import ApiService from './ApiService';
import api from './API';
class DriverService {

    constructor(){ }

    getDriverDataByVehicleNo = async (vehicleNo) => { //get all emp constants
        apiURL = `${api.get_driver}/${vehicleNo}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    getDriverEmpListByDate = async (empData) => { //get all emp list assigned to driver
        apiURL = `${api.driver_emp_list}/${empData.vehicleNo}/${empData.tripDate}/${empData.tripTime}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }
}

export default new DriverService();