import {observable, action, runInAction, toJS} from 'mobx';
import AdminService from '../services/AdminService';

class AdminStore {
	@observable isLoading = false
	@observable isFailure = false
    @observable adminData = []
    
    
	constructor(){
        // this.adminData.empDetails = {}
    }  

    @action async getDailyLoginData(assignType, changeDate, changeTime) { 
        try {
            console.log('changeDate>>>>', changeDate)
            this.isLoading = true;
            data = await AdminService.getDailyLoginAll(assignType, changeDate, changeTime)
            runInAction( () => {
                this.isLoading = false;
                this.adminData.empDetails = data;
                console.log(toJS(this.adminData.empDetails))
            } )
            
        } catch (e) {
            console.log('error pick', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async getDriverListByTime(tripDate, tripTime) { 
        try {
            this.isLoading = true;
            data = await AdminService.getDriverListByTime(tripDate, tripTime)
            runInAction( () => {
                this.isLoading = false;
                this.adminData.availableDriverList = data;
                this.adminData.formattedDriverList = [];
                let driverList = [];
                console.log(toJS(this.adminData.availableDriverList))
                Object.keys(data).forEach(function(key){
                    console.log(key + '=' + data[key]);
                    if( key != 'code' && data[key] != 0 ) {
                        driverList.push({vehicle: key, status: `${data[key]} seats left`})
                    }
                    
                });
                this.adminData.formattedDriverList = driverList;
                // console.log(driverList, this.adminData.formattedDriverList)
            } )
            
        } catch (e) {
            console.log('error pick', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async assignDriver( assignParam) { 
        try {
            this.isLoading = true;
            console.log('params>>', assignParam)
            data = await AdminService.assignDriver(assignParam)
            runInAction( () => {
                this.isLoading = false;
                this.adminData.assignDriver = data;
                console.log(toJS(this.adminData.assignDriver))
            } )
            
        } catch (e) {
            console.log('error pick', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async getAllDrivers() { 
        try {
            this.isLoading = true;
            data = await AdminService.getAllDrivers()
            runInAction( () => {
                this.isLoading = false;
                this.adminData.allDrivers = data;
                console.log(toJS(this.adminData.allDrivers))
            } )
            
        } catch (e) {
            console.log('error pick', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async getAllAdmins() { 
        try {
            this.isLoading = true;
            data = await AdminService.getAllAdmins()
            runInAction( () => {
                this.isLoading = false;
                this.adminData.admins = data;
                console.log(toJS(this.adminData.admins))
            } )
            
        } catch (e) {
            console.log('error pick', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async removeDriver(vehicleNo) { 
        try {
            this.isLoading = true;
            data = await AdminService.removeDriver(vehicleNo)
            runInAction( () => {
                this.isLoading = false;
                this.adminData.removeDriver = data;
                console.log(toJS(this.adminData.removeDriver))
            } )
            
        } catch (e) {
            console.log('error pick', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async addPickTime(pickTime, empid) {
        try {
            this.isLoading = true;
            data = await AdminService.addPickTime(pickTime, empid)
            runInAction( () => {
                this.isLoading = false;
                this.adminData.pickData = data;
                console.log(toJS(this.adminData.pickData))
            } )
            
        } catch (e) {
            console.log('error pick', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    
    }

}

export default AdminStore
                        