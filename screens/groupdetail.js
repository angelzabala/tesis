import React from "react";

import * as Permissions from "expo-permissions";

import {
  Dimensions,
  StyleSheet,
  FlatList,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  AsyncStorage,
} from "react-native";



const ipv4 = require("../serverip.json").serverIp;
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class groupDetailComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      phone: 0,
      users: "",
      latitude: "",
      longitude: "",
      navigation: this.props.navigation,
    };
  }

  groupUsers = async () => {
    const { state } = this.props.navigation;
    try {
      let phonenumber = await AsyncStorage.getItem("phone");
      this.setState({ phone: phonenumber });
    } catch (error) {}
    const data = {
      phone: this.state.phone,
      fk_grupo: state.params.groupId,
      isAdmin: state.params.isAdmin,
    };
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    fetch(
      ipv4 +
        "/u-grupos/" +
        data.phone +
        "/" +
        data.fk_grupo +
        "/" +
        data.isAdmin,
      options
    )
      .then((response) => {
        if (response.status == 200) {
          response.json().then((jsonObj) => {
            this.setState({ users: jsonObj });
          });
        } else if (response.status == 204) {
          alert("error interno");
        }
      })
      .catch((err) => console.log(err));
  };
  adminLabel = (isadmin) => {
    if (isadmin) {
      return <Text> (administrador)</Text>;
    } else {
      return false;
    }
  };
  funcionarioLabel = (isFuncionario) => {
    if (isFuncionario) {
      return <Text> (funcionario)</Text>;
    } else {
      return false;
    }
  };

  sendAlert = (level) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        this.setState({ latitude, longitude });
        let alertInfo = {
          fk_usuario: this.state.phone,
          fk_grupo: this.props.navigation.state.params.groupId,
          nivel: level,
          latitud: this.state.latitude,
          longitud: this.state.longitude,
          nombreGrupo: this.props.navigation.state.params.groupName,
        };
        this.state.navigation.navigate("AlertScreen", alertInfo);
      },
      (error) => {
        console.log(error);
      }
    );

    //console.log('groupDetail', this.state.latitude, this.state.logintude);
  };

  checkPermissions = async () => {
    const { status, permissions } = await Permissions.getAsync(
      Permissions.LOCATION
    );
    if (status !== "granted") {
      let response = await Permissions.askAsync(Permissions.LOCATION);
      response = response;
    }
  };

  reportHandler = () => {
    this.state.navigation.navigate("groupReports", {
      fk_grupo: this.props.navigation.state.params.groupId,
    });
  };
  statisticsHandler = () => {
    this.state.navigation.navigate("statisticsScreen", {
      fk_grupo: this.props.navigation.state.params.groupId,
    });
  };

  userPressHandler(item) {
    console.log(item);
  }

  componentDidMount() {
    this.groupUsers();
    this.checkPermissions();

    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        this.setState({ isFocused: true });
        this.groupUsers();
        this.checkPermissions();
      }),
      this.props.navigation.addListener("willBlur", () => {
        this.setState({ isFocused: false });
      }),
    ];
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
  }

  render() {
    if (this.state.users == "" || this.state.users.length <= 1) {
      return (
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback>
            <View>
              <Text style={styles.groupName}>
                {this.props.navigation.state.params.groupName}
              </Text>
              <Text style={styles.noUsersText}>
                el grupo no tiene miembros agregados, para agregarlos, toque el
                ícono de arriba a la derecha
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.groupName}>
            {this.props.navigation.state.params.groupName}
          </Text>
          <View style={styles.alertContainer}>
            <TouchableWithoutFeedback
              style={styles.alertBox}
              onPress={() => {
                this.sendAlert(1);
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
                this.sendAlert(2);
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
                this.sendAlert(3);
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
          <View style={styles.userSectionContainer}>
            <Text style={styles.groupsLabel}>Usuarios</Text>
            <FlatList
              data={this.state.users}
              keyExtractor={(item) => item.pk_usuariogrupo.toString()}
              renderItem={({ item }) => {
                if (item.fk_usuario != this.state.phone) {
                  return (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.userPressHandler(item);
                      }}
                    >
                      <View style={{ marginBottom: 20 }}>
                        <View style={styles.nameContainer}>
                          <Text style={styles.userName}>
                            {item.nombre} - {item.fk_usuario}
                          </Text>
                        </View>
                        {this.adminLabel(item.isadmin)}
                        {this.funcionarioLabel(item.funcionario)}
                      </View>
                    </TouchableWithoutFeedback>
                  );
                } else {
                  return (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.userPressHandler(item);
                      }}
                    >
                      <View style={{ marginBottom: 20 }}>
                        <View style={styles.nameContainer}>
                          <Text style={styles.userName}>
                            {item.nombre} - {item.fk_usuario}
                          </Text>
                        </View>
                        <Text> Yo {this.adminLabel(item.isadmin)}</Text>
                        {this.funcionarioLabel(item.funcionario)}
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }
              }}
            />
          </View>

          <View style={styles.fakeFixedFooter}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.reportHandler();
              }}
            >
              <View style={styles.footerObjectContainer}>
                <Text style={styles.footerLabel}>Reportes</Text>
                <Image
                  style={styles.footerIcon}
                  source={require("../assets/iconosFigma/summary.png")}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                this.statisticsHandler();
              }}
            >
              <View style={styles.footerObjectContainer}>
                <Text style={styles.footerLabel}>Estadísticas</Text>
                <Image
                  style={styles.footerIcon}
                  source={require("../assets/iconosFigma/statistics.png")}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
      ); //fin del return
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  groupName: {
    fontSize: 30,
    alignSelf: "flex-start",
    marginBottom: 20,
    marginLeft: 15,
    fontWeight: "bold",
  },
  noUsersText: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "100",
  },
  userSectionContainer: {
    width: screenWidth * 0.9,
    marginBottom: screenHeight / 1.8,
  },
  groupsLabel: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
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
  fakeFixedFooter: {
    backgroundColor: "#04A5FF",
    width: screenWidth,
    height: 80,
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
  },
  footerObjectContainer: {
    display: "flex",
    flexDirection: "row",
    width: screenWidth / 2.15,
    justifyContent: "center",
    alignContent: "center",
  },
  footerIcon: {
    width: 40,
    height: 40,
    alignSelf: "center",
  },
  footerLabel: {
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
    alignSelf: "center",
    fontSize: 20,
  },
});
