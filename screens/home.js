import React from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import io from "socket.io-client/dist/socket.io";
import * as Permissions from "expo-permissions";

import { getAlerts, getUserGroups } from "../actions/actions";
import { format, subHours } from "date-fns";
import {
  StyleSheet,
  Image,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  SafeAreaView,
} from "react-native";

const ipv4 = require("../serverip.json").serverIp;
const screenWidth = Math.round(Dimensions.get("window").width);
const socket = io(ipv4, { jsonp: false });

export default class HomeComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userPhoneNumber: "",
      groupsNumber: 0,
      groups: "",
      alerts: "",
      latitude: "",
      longitude: "",
      navigation: this.props.navigation,
    };
  }

  storageData = async () => {
    let phonenumber = "";
    try {
      phonenumber = await AsyncStorage.getItem("phone");
      this.setState({ userPhoneNumber: phonenumber }, () => {
        this.userGroups();
        this.userRecentAlerts();
      });
    } catch (error) {
      console.log(error);
    }
    return phonenumber;
  };

  userRecentAlerts = () => {
    const alertsResponse = getAlerts(this.state.userPhoneNumber);
    if (alertsResponse.fulfilled) {
      this.setState({ alerts: alertsResponse.alertas });
    }
  };

  userGroups = () => {
    const subscribedGroups = getUserGroups(this.state.userPhoneNumber);
    if (subscribedGroups.fulfilled) {
      this.setState({ groupsNumber: subscribedGroups.groups.length });
      this.setState({ groups: subscribedGroups.groups });
    }
  };

  groupPressHandler = (groupId, isAdmin, groupName) => {
    let groupInfo = { groupId, isAdmin, groupName };
    this.state.navigation.navigate("groupDetail", groupInfo);
  };

  circleLevelComponent = (nivel) => {
    if (nivel == 1) {
      return <View style={styles.greenCircle}></View>;
    } else if (nivel == 2) {
      return <View style={styles.yellowCircle}></View>;
    } else {
      return <View style={styles.redCircle}></View>;
    }
  };

  fakeAlertLabelComponent = (isFalse, date) => {
    let moment = new Date(date);

    var formattedDate = format(moment, "dd/MMM/yyyy");
    var formattedHour = subHours(moment, 4); //recordar siempre quitarle 4 horas a la hora del servidor
    formattedHour = format(moment, "H:mma");

    if (isFalse) {
      return (
        <Text style={styles.fakeLabel}>
          {formattedDate} - {formattedHour} (falsa)
        </Text>
      );
    } else {
      return (
        <Text style={styles.fakeLabel}>
          {formattedDate} - {formattedHour}
        </Text>
      );
    }
  };

  alertPressHandler = (user, level, groups) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        this.setState({ latitude, longitude });
        let alertInformation = {
          user,
          level,
          groups,
          latitud: this.state.latitude,
          longitud: this.state.longitude,
        };
        this.state.navigation.navigate("selectGroupForAlert", alertInformation);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  checkPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      let response = await Permissions.askAsync(Permissions.LOCATION);
      response = response;
    }
  };

  alertSectionComponent() {
    if (this.state.alerts.length == 0) {
      return (
        <View style={styles.groupSectionContainer}>
          <Text style={styles.groupsLabel}>Alertas Recientes</Text>
          <Text style={styles.noAlertsText}>
            no existen alertas previas por el momento
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.groupSectionContainer}>
          <Text style={styles.groupsLabel}>Alertas Recientes</Text>
          <FlatList
            data={this.state.alerts.slice(0, 3)}
            keyExtractor={(item) => item.pk_alerta.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.state.navigation.navigate("alertDetail", {
                    pk_alerta: item.pk_alerta,
                  });
                }}
              >
                <View style={styles.recentAlertContainer}>
                  <View style={styles.recentAlertInfo}>
                    {this.circleLevelComponent(item.nivel)}
                    <Text style={styles.recentAlertText}>
                      {item.nombre} - {item.fk_usuario}
                    </Text>
                  </View>
                  {this.fakeAlertLabelComponent(item.falsa, item.hora)}
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      );
    }
  }

  componentDidMount() {
    this.storageData();
    this.checkPermissions();
    socket.on("update", (data) => {
      if (data.usuario != this.state.phonenumber) {
        this.state.groups.filter((grupo) => {
          if (data.fk_grupo == grupo.fk_grupo) {
            this.state.navigation.navigate("alertReceptionScreen", data);
          }
        });
      }
    });

    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        this.setState({ isFocused: true });
        this.storageData();
        this.checkPermissions();
      }),
      this.props.navigation.addListener("willBlur", () => {
        this.setState({ isFocused: false });
      }),
    ];
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
    socket.disconnect();
  }

  render() {
    if (this.state.groupsNumber == 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.noGroupText}>
            Usted no posee grupos creados, cree grupos tocando el ícono que esta
            arriba a la derecha
          </Text>
        </View>
      );
    } else if (this.state.groupsNumber != 0) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.alertContainer}>
            <TouchableWithoutFeedback
              style={styles.alertBox}
              onPress={() => {
                this.alertPressHandler(
                  this.state.userPhoneNumber,
                  1,
                  this.state.groups
                );
              }}
            >
              <View style={styles.greenAlert}>
                <Image
                  style={styles.alertImg}
                  source={require("../assets/iconosFigma/megaphone.png")}
                />
                <Text style={styles.alertLabel}>Notificar</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.alertBox}
              onPress={() => {
                this.alertPressHandler(
                  this.state.userPhoneNumber,
                  2,
                  this.state.groups
                );
              }}
            >
              <View style={styles.yellowAlert}>
                <Image
                  style={styles.alertImg}
                  source={require("../assets/iconosFigma/danger.png")}
                />
                <Text style={styles.alertLabel}>Alertar</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.alertBox}
              onPress={() => {
                this.alertPressHandler(
                  this.state.userPhoneNumber,
                  3,
                  this.state.groups
                );
              }}
            >
              <View style={styles.redAlert}>
                <Image
                  style={styles.alertImg}
                  source={require("../assets/iconosFigma/skull.png")}
                />
                <Text style={styles.alertLabel}>Peligro</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {this.alertSectionComponent()}
          <View style={styles.groupSectionContainer}>
            <Text style={styles.groupsLabel}>Mis Grupos</Text>
            <FlatList
              data={this.state.groups}
              keyExtractor={(item) => item.fk_grupo.toString()}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.groupPressHandler(
                      item.fk_grupo,
                      item.isadmin,
                      item.nombre
                    );
                  }}
                >
                  <View style={styles.groupContainer}>
                    <Image
                      style={styles.groupIcon}
                      width={screenWidth * 0.05}
                      height={screenWidth * 0.05}
                      source={require("../assets/iconosFigma/play-button.png")}
                    />
                    <Text style={styles.groupName}>{item.nombre}</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  noGroupText: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "100",
  },
  noAlertsText: {
    fontSize: 20, 
    textAlign: "left",
    fontWeight: "100",
    marginBottom: 30,
  },
  groupsLabel: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  alertContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: screenWidth,
    marginBottom: 60,
  },
  alertBox: {
    width: screenWidth * 0.3,
  },
  greenAlert: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.15,
    backgroundColor: "#5CAE1B",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    position: "relative",
  },
  yellowAlert: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.15,
    paddingBottom: screenWidth * 0.02,
    backgroundColor: "#FAC81A",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  redAlert: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.15,
    backgroundColor: "#FB3434",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  alertImg: {
    alignSelf: "center",
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
  },
  alertLabel: {
    position: "absolute",
    bottom: -25,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  groupSectionContainer: {
    width: screenWidth * 0.9,
  },
  groupContainer: {
    display: "flex",
    flexDirection: "row",
  },
  groupIcon: {
    marginLeft: 20,
    marginRight: 10,
    alignSelf: "center",
  },
  groupName: {
    fontSize: 20,
    color: "#000",
  },
  recentAlertContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 15,
  },
  recentAlertInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  recentAlertText: {
    fontSize: 20,
    width: screenWidth * 0.75,
  },
  fakeLabel: {
    fontSize: 15,
    alignSelf: "center",
  },
  greenCircle: {
    borderRadius: 10,
    backgroundColor: "#5CAE1B",
    width: 15,
    height: 15,
    alignSelf: "center",
    marginRight: 5,
  },
  yellowCircle: {
    borderRadius: 10,
    backgroundColor: "#FAC81A",
    width: 15,
    height: 15,
    marginRight: 5,
    alignSelf: "center",
  },
  redCircle: {
    borderRadius: 10,
    backgroundColor: "#FB3434",
    width: 15,
    height: 15,
    marginRight: 5,
    alignSelf: "center",
  },
});
