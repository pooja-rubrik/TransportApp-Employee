import {observable, action, runInAction, toJS} from 'mobx';
import EmpService from '../services/EmpService';
import UsersService from '../services/UsersService'

class EmpStore {
	@observable isLoading = false
	@observable isFailure = false
    @observable empData = {}
    
	constructor(){
    }  

    @action async submitEmpTime(changeTime, empID, submitType, changeType) { 
        try {
            this.isLoading = true;
            // console.log('submitType>>',submitType);
            let timeParam = {changeTime, empID, status: submitType}
            console.log('pickParam>>',timeParam);
            data = await EmpService.empTimeSubmit( timeParam, changeType )
            runInAction( () => {
                this.isLoading = false;
                console.log('is pick>>', data)
                this.empData.submitTime = data;
            } )
            
        } catch (e) {
            console.log('error pick', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async dailyLogin(empID) {
        try {
            this.isLoading = true;
            console.log('empID>>',empID);
            data = await EmpService.getDailyLogin( empID )
            runInAction( () => {
                this.isLoading = false;
                console.log('is daily login>>', data)
                this.empData.dailyLogin = data;
            } )
            
        } catch (e) {
            console.log('error daily', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async dailyLogout(empID) {
        try {
            this.isLoading = true;
            console.log('empID>>',empID);
            data = await EmpService.getDailyLogout( empID )
            runInAction( () => {
                this.isLoading = false;
                console.log('is daily logut>>', data)
                this.empData.dailyLogout = data;
            } )
            
        } catch (e) {
            console.log('error daily', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async updateRoster(empID, timeParam, updateType) {
        try {
            this.isLoading = true;
            console.log('empID>>',empID, timeParam);
            // updateParams = {empID, status, ...timeParam};
            data = await EmpService.updateRoster( empID, updateType, timeParam )
            runInAction( () => {
                this.isLoading = false;
                console.log('is daily update roster>>', data)
                this.empData.updateRoster = data;
            } )
            
        } catch (e) {
            console.log('error daily', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async cancelRoster(empID, timeParam, cancelType) {
        try {
            this.isLoading = true;
            console.log('empID>>',empID);
            data = await EmpService.cancelRoster( empID, cancelType, timeParam )
            runInAction( () => {
                this.isLoading = false;
                console.log('cancel roster>>', data)
                this.empData.cancelRoster = data;
            } )
            
        } catch (e) {
            console.log('error daily', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async defaultLogin(empID) {
        try {
            this.isLoading = true;
            console.log('empID>>',empID);
            data = await EmpService.getDefaultLogin( empID )
            runInAction( () => {
                this.isLoading = false;
                console.log('is default login>>', data)
                this.empData.defaultLogin = data;
            } )
            
        } catch (e) {
            console.log('error default', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async defaultLogout(empID) {
        try {
            this.isLoading = true;
            console.log('empID>>',empID);
            data = await EmpService.getDefaultLogout( empID )
            runInAction( () => {
                this.isLoading = false;
                console.log('is default logut>>', data)
                this.empData.defaultLogout = data;
            } )
            
        } catch (e) {
            console.log('error default', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async setDefaultTime(empID, loginTime, isCheckIn) {
        try {
            this.isLoading = true;
            // console.log('empID>>', empID);
            loginParam = isCheckIn? { empID, loginTime } : { empID, logoutTime: loginTime}
            data = await EmpService.setDefaultTime( loginParam, isCheckIn )
            runInAction( () => {
                this.isLoading = false;
                console.log('is default time>>', data)
                this.empData.defaultTime = data;
            } )
            
        } catch (e) {
            console.log('error default', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async updateProfile(profileParam, accessToken) { 
        try {
            this.isLoading = true;
            console.log('profileParam>>', profileParam, accessToken);
            data = await UsersService.registerUser( profileParam, accessToken )
            runInAction( () => {
                this.isLoading = false;
                console.log('is profileUpdate>', data)
                this.empData.profileUpdate = data;
            } )
            
        } catch (e) {
            console.log('error profileUpdate', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

}

export default EmpStore
                        