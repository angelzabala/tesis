import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import React from "react";

import selectGroupForAlertComponent from "../screens/selectGroupForAlert";
import OptionalInfoComponent from "../screens/optionalRegister";
import alertReceptionComponent from "../screens/alertReception";
import statisticsScreenComponent from "../screens/statistics";
import groupReportsComponent from "../screens/groupReports";
import reportDetailComponent from "../screens/reportDetail";
import groupDetailComponent from "../screens/groupDetail";
import createGroupComponent from "../screens/createGroup";
import alertScreenComponent from "../screens/alertScreen";
import alertDetailComponent from "../screens/alertDetail";
import addReportComponent from "../screens/addReport";
import RegisterComponent from "../screens/register";
import addUserComponent from "../screens/addUser";
import LoginComponent from "../screens/login";
import HomeComponent from "../screens/home";

import Header from "../shared/header";

const screens = {
  Login: {
    screen: LoginComponent,
    navigationOptions: {
      headerShown: false,
      onGoBack: () => this.refresh(),
    },
  },
  Register: {
    screen: RegisterComponent,
    navigationOptions: {
      title: "",
      onGoBack: () => this.refresh(),
    },
  },
  OptionalRegister: {
    screen: OptionalInfoComponent,
    navigationOptions: {
      title: "",
      onGoBack: () => this.refresh(),
    },
  },
  Home: {
    screen: HomeComponent,
    navigationOptions: ({ navigation }) => {
      return {
        headerLeft: () => {},
        headerTitle: () => <Header routeName="Home" navigation={navigation} />,
        onGoBack: () => {
          navigation.state.params.refresh;
        },
      };
    },
  },
  createGroup: {
    screen: createGroupComponent,
    navigationOptions: {
      headerTitle: "",
      onGoBack: () => this.refresh(),
    },
  },
  groupDetail: {
    screen: groupDetailComponent,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: (props) => (
          <Header
            routeName="groupDetail"
            properties={props}
            navigation={navigation}
          />
        ),
        onGoBack: () => this.refresh(),
      };
    },
  },
  addUser: {
    screen: addUserComponent,
    navigationOptions: () => {
      return {
        headerTitle: () => {},
        onGoBack: () => this.refresh(),
      };
    },
  },
  selectGroupForAlert: {
    screen: selectGroupForAlertComponent,
    navigationOptions: () => {
      return {
        headerTitle: "",
        onGoBack: () => this.refresh(),
      };
    },
  },
  AlertScreen: {
    screen: alertScreenComponent,
    navigationOptions: {
      headerTitle: "",
      headerLeft: () => {},
      onGoBack: () => this.refresh(),
    },
  },
  alertReceptionScreen: {
    screen: alertReceptionComponent,
    navigationOptions: {
      headerTitle: "",
      headerLeft: () => {},
    },
  },
  alertDetail: {
    screen: alertDetailComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
  groupReports: {
    screen: groupReportsComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
  reportDetailScreen: {
    screen: reportDetailComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
  statisticsScreen: {
    screen: statisticsScreenComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
  addReportScreen: {
    screen: addReportComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
};

const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: "#fff",
    headerStyle: { backgroundColor: "#04a5ff" },
  },
});

export default createAppContainer(HomeStack);
