import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import React from 'react';

import selectGroupForAlertComponent from '../screens/selectgroupforalert';
import OptionalInfoComponent from '../screens/optionalregister';
import alertReceptionComponent from '../screens/alertreception';
import statisticsScreenComponent from '../screens/statistics';
import groupReportsComponent from '../screens/groupreports';
import reportDetailComponent from '../screens/reportdetail';
import groupDetailComponent from '../screens/groupdetail';
import createGroupComponent from '../screens/creategroup';
import alertScreenComponent from '../screens/alertscreen';
import alertDetailComponent from '../screens/alertdetail';
import addReportComponent from '../screens/addreport';
import RegisterComponent from '../screens/register';
import addUserComponent from '../screens/adduser';
import LoginComponent from '../screens/login';
import HomeComponent from '../screens/home';

import Header from '../shared/header';


const screens = {
    Login: {
        screen: LoginComponent,
        navigationOptions: {
            headerShown: false,
            onGoBack: () => this.refresh()
        },
    },
    Register: {
        screen: RegisterComponent,
        navigationOptions: {
            title: '',
            onGoBack: () => this.refresh()
        }
    },
    OptionalRegister: {
        screen: OptionalInfoComponent,
        navigationOptions: {
            title: '',
            onGoBack: () => this.refresh()
        }
    },
    Home: {
        screen: HomeComponent,
        navigationOptions: ({ navigation }) => {
            return {
                headerLeft: () => { },
                headerTitle: () => <Header routeName='Home' navigation={navigation} />,
                onGoBack: () => {navigation.state.params.refresh}
            }
        },
    },
    createGroup: {
        screen: createGroupComponent,
        navigationOptions: {
            headerTitle: '',
            onGoBack: () => this.refresh()
        }
    },
    groupDetail: {
        screen: groupDetailComponent,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: (props) => <Header routeName='groupDetail' properties={props} navigation={navigation} />,
                onGoBack: () => this.refresh()
            }
        },
    },
    addUser: {
        screen: addUserComponent,
        navigationOptions: () => {
            return {
                headerTitle: () => { },
                onGoBack: () => this.refresh()
            }
        }
    },
    selectGroupForAlert: {
        screen: selectGroupForAlertComponent,
        navigationOptions: ({navigation}) =>{
            return{
                headerTitle: '',
                onGoBack: () => this.refresh()
            }
        }
    },
    AlertScreen: {
        screen: alertScreenComponent,
        navigationOptions: {
            headerTitle: '',
            headerLeft: () =>{},
            onGoBack: () => this.refresh()
        }
    },
    alertReceptionScreen: {
        screen: alertReceptionComponent,
        navigationOptions : {
            headerTitle: '',
            headerLeft: () =>{}
        }
    },
    alertDetail: {
        screen: alertDetailComponent,
        navigationOptions:{
            headerTitle: ''
        }
    },
    groupReports: {
        screen: groupReportsComponent,
        navigationOptions: {
            headerTitle: ''
        }
    },
    reportDetailScreen: {
        screen: reportDetailComponent,
        navigationOptions: {
            headerTitle: ''
        }
    },
    statisticsScreen: {
        screen: statisticsScreenComponent,
        navigationOptions:{
            headerTitle: ''
        }
    }, 
    addReportScreen: {
        screen: addReportComponent,
        navigationOptions:{
            headerTitle: ''
        }
    }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: "#04a5ff" }
    }
});

export default createAppContainer(HomeStack);