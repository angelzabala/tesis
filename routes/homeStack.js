import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import React from "react";

import SelectGroupForAlertComponent from "../screens/SelectGroupForAlert";
import OptionalInfoComponent from "../screens/OptionalRegister";
import AlertReceptionComponent from "../screens/AlertReception";
import StatisticsScreenComponent from "../screens/Statistics";
import GroupReportsComponent from "../screens/GroupReports";
import ReportDetailComponent from "../screens/ReportDetail";
import GroupDetailComponent from "../screens/GroupDetail";
import CreateGroupComponent from "../screens/CreateGroup";
import AlertScreenComponent from "../screens/AlertScreen";
import AlertDetailComponent from "../screens/AlertDetail";
import AddReportComponent from "../screens/AddReport";
import RegisterComponent from "../screens/Register";
import AddUserComponent from "../screens/AddUser";
import LoginComponent from "../screens/Login";
import HomeComponent from "../screens/Home";

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
    screen: CreateGroupComponent,
    navigationOptions: {
      headerTitle: "",
      onGoBack: () => this.refresh(),
    },
  },
  groupDetail: {
    screen: GroupDetailComponent,
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
    screen: AddUserComponent,
    navigationOptions: () => {
      return {
        headerTitle: () => {},
        onGoBack: () => this.refresh(),
      };
    },
  },
  selectGroupForAlert: {
    screen: SelectGroupForAlertComponent,
    navigationOptions: () => {
      return {
        headerTitle: "",
        onGoBack: () => this.refresh(),
      };
    },
  },
  AlertScreen: {
    screen: AlertScreenComponent,
    navigationOptions: {
      headerTitle: "",
      headerLeft: () => {},
      onGoBack: () => this.refresh(),
    },
  },
  alertReceptionScreen: {
    screen: AlertReceptionComponent,
    navigationOptions: {
      headerTitle: "",
      headerLeft: () => {},
    },
  },
  alertDetail: {
    screen: AlertDetailComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
  groupReports: {
    screen: GroupReportsComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
  reportDetailScreen: {
    screen: ReportDetailComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
  statisticsScreen: {
    screen: StatisticsScreenComponent,
    navigationOptions: {
      headerTitle: "",
    },
  },
  addReportScreen: {
    screen: AddReportComponent,
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
