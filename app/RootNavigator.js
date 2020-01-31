import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

// import pages
import Login from './views/Login';
import AdminHomeNew from './views/AdminHomeNew';
import AuthLoadingScreen from './views/AuthLoading';
import DriverRegister from './views/DriverRegister';
import Profile from './views/Profile';
import AdminProfile from './views/AdminProfile';

//import constants
import COLOR from './services/AppColor';
import EmpHome from './views/EmpHome';


const EmpAppStack = createStackNavigator(
  {
    EmpHomeScreen: {screen: EmpHome},    
    ProfileScreen: {screen: Profile}
  },
  {
    defaultNavigationOptions: {
      title: 'Rubrik Cab',
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
    DriverRegisterScreen: { screen: DriverRegister },   
    AdminProfileScreen: {screen: AdminProfile}
  },
  {
    defaultNavigationOptions: {
      title: 'Rubrik Cab',
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
      title: 'Rubrik Cab',
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
    AdminApp: AdminAppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: "AuthLoading",
  }
));