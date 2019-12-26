import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

// import pages
import Login from './views/Login';
import Home from './views/Home';
import Profile from './views/Profile';
import AdminHome from './views/AdminHome';
import AdminHomeNew from './views/AdminHomeNew';
import UpdateRoster from './views/UpdateRoster';
import AdminLoginLogout from './views/AdminLoginLogout';
import AdminEmpList from './views/AdminEmpList';
import AdminDriverList from './views/AdminDriverList';
import AdminAssignDriver from './views/AdminAssignDriver';
import AuthLoadingScreen from './views/AuthLoading';
import DriverRegister from './views/DriverRegister';

//import constants
import COLOR from './services/AppColor';
import EmpHome from './views/EmpHome';


const EmpAppStack = createStackNavigator(
  {
    EmpHomeScreen: {screen: EmpHome},
    HomeScreen: { screen: Home },
    ProfileScreen: { screen: Profile },
    UpdateRosterScreen: { screen: UpdateRoster },
    
  },
  {
    defaultNavigationOptions: {
      title: 'RUBRIK CAB',
      headerStyle: {
        backgroundColor: COLOR.HEADER_BG_COLOR,
      },
      headerTintColor: COLOR.HEADER_FONT_COLOR,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null,
    },
  }
)

const AdminAppStack = createStackNavigator(
  {
    AdminHomeNewScreen: { screen: AdminHomeNew },
    AdminHomeScreen: { screen: AdminHome },
    AdminLoginLogoutScreen: { screen: AdminLoginLogout },
    AdminEmpListScreen: { screen: AdminEmpList },
    AdminDriverListScreen: { screen: AdminDriverList },
    AdminAssignDriverScreen: { screen: AdminAssignDriver },
    DriverRegisterScreen: { screen: DriverRegister },   
  },
  {
    defaultNavigationOptions: {
      title: 'RUBRIK CAB',
      headerStyle: {
        backgroundColor: COLOR.HEADER_BG_COLOR,
      },
      headerTintColor: COLOR.HEADER_FONT_COLOR,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18
      },
      headerBackTitle: null,
    },
  }
)

const AuthStack = createStackNavigator(
  {
    LoginScreen: { screen: Login },
    
  },{
    defaultNavigationOptions: {
      title: 'RUBRIK CAB',
      headerStyle: {
        backgroundColor: COLOR.HEADER_BG_COLOR,
      },
      headerTintColor: COLOR.HEADER_FONT_COLOR,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18
      },
      headerBackTitle: null,
    },
  }
)
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    EmpApp: EmpAppStack,
    // DriverApp: DriverAppStack,
    AdminApp: AdminAppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: "AuthLoading",
  }
));

// export default RootNavigator;