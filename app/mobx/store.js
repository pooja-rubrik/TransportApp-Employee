
import MapStore from './mapStore'
import observableUsersStore from './usersStore';
import EmpStore from './empStore';
import DriverStore from './driverStore';
import AdminStore from './adminStore';
export { Provider } from 'mobx-react';


class RootStore {
  constructor () {
    this.mapStore = new MapStore();
    this.usersStore = new observableUsersStore(this);
    this.empStore = new EmpStore();
    this.driverStore = new DriverStore();
    this.adminStore = new AdminStore();
  }
}
export default RootStore;