import React from "react";

import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client/dist/socket.io";
import Modal from "react-native-modal";

import { format, subHours } from "date-fns";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";



const ipv4 = require("../serverip.json").serverIp;
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
const socket = io(ipv4, { jsonp: false });
var updateCalled = false;

export default class alertScreenComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      estado: true,
      falsa: false,
      lugar: "",
      descripcion: "",
      nivel: this.props.navigation.state.params.nivel,
      pk_alerta: this.props.navigation.state.params.pk_alerta,
      modalShow: false,
      editable: true,
      hora: "",
      navigation: this.props.navigation,
    };
  }

  circleLevelComponent = () => {
    let moment = new Date(this.props.navigation.state.params.hora);

    var formattedHour = subHours(moment, 4); //recordar siempre quitarle 4 horas a la hora del servidor
    formattedHour = format(moment, "H:mma");
    if (this.state.falsa == "true") {
      return (
        <View style={styles.fakeAlermContainer}>
          <Text style={styles.bigRedText}>HA SIDO UNA FALSA ALARMA!!</Text>
          <Text style={styles.smallRedText}>
            Hora de reporte: {formattedHour}
          </Text>
          <Text style={styles.smallRedText}>
            Reportada falsa a las: {format(new Date(), "H:mma")}
          </Text>
        </View>
      );
    } else {
      if (this.state.nivel == 1) {
        return (
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text
              style={{
                alignSelf: "center",
                marginRight: screenWidth * 0.15,
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              {formattedHour}
            </Text>
            <View style={styles.greenAlert}>
              <Image
                style={styles.alertImg}
                source={require("../assets/iconosFigma/megaphone.png")}
              />
            </View>
          </View>
        );
      } else if (this.state.nivel == 2) {
        return (
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text
              style={{
                alignSelf: "center",
                marginRight: screenWidth * 0.15,
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              {formattedHour}
            </Text>
            <View style={styles.yellowAlert}>
              <Image
                style={styles.alertImg}
                source={require("../assets/iconosFigma/danger.png")}
              />
            </View>
          </View>
        );
      } else if (this.state.nivel == 3) {
        return (
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text
              style={{
                alignSelf: "center",
                marginRight: screenWidth * 0.15,
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              {formattedHour}
            </Text>
            <View style={styles.redAlert}>
              <Image
                style={styles.alertImg}
                source={require("../assets/iconosFigma/skull.png")}
              />
            </View>
          </View>
        );
      }
    }
  };

  mapComponent = () => {
    if (this.state.nivel == 3) {
      return (
        <TouchableWithoutFeedback
          onLongPress={() => {
            Linking.openURL(
              "https://google.com/maps/?q=" +
                this.state.navigation.state.params.latitud +
                "," +
                this.state.navigation.state.params.longitud
            );
          }}
        >
          <MapView
            style={{
              flex: 1,
              width: screenWidth * 0.8,
              height: screenWidth * 0.6,
              marginBottom: 20,
              marginTop: 20,
            }}
            initialRegion={{
              latitude: this.state.navigation.state.params.latitud,
              longitude: this.state.navigation.state.params.longitud,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: this.state.navigation.state.params.latitud,
                longitude: this.state.navigation.state.params.longitud,
              }}
            />
          </MapView>
        </TouchableWithoutFeedback>
      );
    }
  };

  eventExitHandler = () => {
    this.state.navigation.navigate("Home");
  };

  handleSocketReception = (data) => {
    this.setState({ estado: data.estado });
    this.setState({ falsa: data.falsa });
    this.setState({ lugar: data.lugar });
    this.setState({ descripcion: data.descripcion });
  };

  updateAlertManually = () => {
    if (updateCalled == false) {
      updateCalled = true;
      const data = {
        pk_alerta: this.state.pk_alerta,
        lugar: this.state.lugar,
        description: this.state.descripcion,
      };
      const options = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch(ipv4 + "/alertas/" + this.state.pk_alerta, options)
        .then((response) => {
          if (response.status == 200) {
            response.json().then(() => {
              socket.disconnect();
              alert("Actualización manual de la base de datos realizada");
            });
          } else {
            alert("error interno, por favor intente más tarde");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  componentDidMount() {
    socket.on("updateEmit", (data) => {
      this.handleSocketReception(data);
    });
    socket.on("updateDatabase", (data) => {
      this.updateAlertManually();
    });
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.container}>
          <Modal isVisible={this.state.estado == "false"} style={styles.modal}>
            <Text style={styles.modalTitle}>
              Evento finalizado, presione el boton para salir
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.eventExitHandler();
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    backgroundColor: "#012133",
                    textAlign: "center",
                    borderRadius: 25,
                    padding: 10,
                  }}
                >
                  Salir de la alerta
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </Modal>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 30,
              alignSelf: "flex-start",
              marginTop: 30,
              marginLeft: screenWidth * 0.1,
              marginBottom: 20,
            }}
          >
            Del grupo: {this.state.navigation.state.params.nombreGrupo}
          </Text>
          {this.circleLevelComponent()}
          <View>
            <Text style={styles.inputLabel}>LUGAR</Text>
            <TextInput
              editable={false}
              value={this.state.lugar}
              autoCompleteType="email"
              onChangeText={(value) => {}}
              style={styles.regularInputText}
            />
          </View>
          {this.mapComponent()}
          <View>
            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              editable={false}
              value={this.state.descripcion}
              autoCompleteType="email"
              onChangeText={(value) => {}}
              style={styles.fakeTextArea}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <View style={styles.buttonContainerExit}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.eventExitHandler();
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  backgroundColor: "#012133",
                  textAlign: "center",
                  borderRadius: 25,
                  padding: 10,
                }}
              >
                Salir de la alerta
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: screenWidth,
  },
  inputLabel: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
  },
  regularInputText: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 20,
    color: "#000",
    width: screenWidth * 0.8,
  },
  fakeTextArea: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    width: screenWidth * 0.8,
    height: 100,
    marginTop: 10,
    borderColor: "#000",
    textAlignVertical: "top",
  },
  fakeAlarmButton: {
    backgroundColor: "#0E394B",
    width: screenWidth * 0.8,
    height: screenHeight * 0.18,
    borderRadius: screenWidth * 0.01,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 20,
  },
  fakeAlarmText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    width: screenWidth * 0.6,
    marginLeft: screenWidth * 0.2,
    marginBottom: 10,
    marginTop: 25,
  },
  greenAlert: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: screenWidth * 0.25,
    backgroundColor: "#5CAE1B",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    position: "relative",
  },
  yellowAlert: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: screenWidth * 0.25,
    paddingBottom: screenWidth * 0.02,
    backgroundColor: "#FAC81A",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  redAlert: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: screenWidth * 0.25,
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
  modal: {
    display: "flex",
    alignSelf: "center",
    width: screenWidth,
    backgroundColor: "#FFF",
    position: "absolute",
    height: screenHeight + 30,
    top: -30,
  },
  modalConfirmationBox: {
    width: screenWidth * 0.8,
    marginLeft: screenWidth * 0.1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalImage: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    alignSelf: "center",
  },
  confirmationContainer: {
    backgroundColor: "#25AE88",
    display: "flex",
    justifyContent: "center",
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: screenWidth * 0.15,
  },
  rejectContainer: {
    backgroundColor: "#D75A4A",
    display: "flex",
    justifyContent: "center",
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: screenWidth * 0.15,
  },
  modalTitle: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  alarmLabel: {
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
  },
  modal: {
    display: "flex",
    alignSelf: "center",
    width: screenWidth,
    backgroundColor: "#FFF",
    position: "absolute",
    height: screenHeight + 30,
    top: -30,
  },
  modalTitle: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  fakeAlermContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  bigRedText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#D82C2C",
  },
  smallRedText: {
    color: "#D82C2C",
    fontSize: 18,
    textAlign: "left",
    marginLeft: screenWidth * 0.1,
    marginBottom: 10,
  },
  buttonContainerExit: {
    marginBottom: 10,
    marginTop: 25,
    width: screenWidth * 0.6,
  },
});
