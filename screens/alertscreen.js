import React from "react";

import io from "socket.io-client/dist/socket.io";
import Modal from "react-native-modal";

import { postAlerts, putAlert } from "../actions/actions";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);
const ipv4 = require("../serverip.json").serverIp;
const socket = io(ipv4, { jsonp: false });

export default class AlertScreenComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      estado: true,
      falsa: false,
      lugar: "",
      descripcion: "",
      nivel: this.props.navigation.state.params.nivel,
      pk_alerta: "",
      modalShow: false,
      editable: true,
      hora: "",
      navigation: this.props.navigation,
    };
  }

  circleLevelComponent = () => {
    if (this.state.nivel == 1) {
      return (
        <View style={styles.greenAlert}>
          <Image
            style={styles.alertImg}
            source={require("../assets/iconosFigma/megaphone.png")}
          />
        </View>
      );
    } else if (this.state.nivel == 2) {
      return (
        <View style={styles.yellowAlert}>
          <Image
            style={styles.alertImg}
            source={require("../assets/iconosFigma/danger.png")}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.redAlert}>
          <Image
            style={styles.alertImg}
            source={require("../assets/iconosFigma/skull.png")}
          />
        </View>
      );
    }
  };

  fakeAlarmPress = () => {
    const data = {
      pk_alerta: this.state.pk_alerta,
      falsa: true,
    };

    putAlert(data, this.state.pk_alerta, () => {
      this.setState({ falsa: true });
      this.setState({ modalShow: false });
      alert(
        "se ha reportado esta alerta como falsa, se comunicara a los otros usuarios del grupo"
      );
    });
  };

  eventExitHandler = () => {
    const data = {
      pk_alerta: this.state.pk_alerta,
      lugar: this.state.lugar,
      description: this.state.descripcion,
    };

    putAlert(data, this.state.pk_alerta, () => {
      this.setState({ editable: false });
      alert("se ha finalizado la alerta");
      this.state.navigation.navigate("Home");
    });
  };

  insertAlert = () => {
    if (this.state.pk_alerta == "") {
      const data = {
        usuario: this.state.navigation.state.params.fk_usuario,
        fk_grupo: this.state.navigation.state.params.fk_grupo,
        nivel: this.state.nivel,
        latitud: this.state.navigation.state.params.latitud,
        longitud: this.state.navigation.state.params.longitud,
      };

      const alertCreationResponse = postAlerts(data);
      if (alertCreationResponse.fulfilled) {
        this.setState({ pk_alerta: alertCreationResponse.alerta.pk_alerta });
        this.setState({ hora: alertCreationResponse.alerta.hora });
        socket.emit("update", {
          pk_alerta: this.state.pk_alerta,
          usuario: this.state.navigation.state.params.fk_usuario,
          fk_grupo: this.state.navigation.state.params.fk_grupo,
          nivel: this.state.nivel,
          latitud: this.state.navigation.state.params.latitud,
          longitud: this.state.navigation.state.params.longitud,
          estado: this.state.estado,
          falsa: this.state.falsa,
          lugar: this.state.lugar,
          descripcion: this.state.descripcion,
          nombreGrupo: this.state.navigation.state.params.nombreGrupo,
          hora: this.state.hora,
        });

        socket.on("updateEmit", (data) => {
          this.state.navigation.navigate("alertReceptionScreen", data);
        });
      } else {
        alert("error interno, por favor intente más tarde");
      }
    }
  };

  componentDidMount() {
    this.insertAlert();
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Modal isVisible={this.state.modalShow} style={styles.modal}>
          <Text style={styles.modalTitle}>¿HA SIDO UNA FALSA ALARMA?</Text>
          <View style={styles.modalConfirmationBox}>
            <View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.fakeAlarmPress();
                }}
              >
                <View>
                  <View style={styles.confirmationContainer}>
                    <Image
                      style={styles.modalImage}
                      source={require("../assets/iconosFigma/tick.png")}
                    ></Image>
                  </View>
                  <Text style={styles.alarmLabel}>Falsa alarma</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({ modalShow: false });
                }}
              >
                <View>
                  <View style={styles.rejectContainer}>
                    <Image
                      style={styles.modalImage}
                      source={require("../assets/iconosFigma/close.png")}
                    ></Image>
                  </View>
                  <Text style={styles.alarmLabel}>Alarma Real</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ modalShow: true });
            }}
          >
            <View style={styles.fakeAlarmButton}>
              <Text style={styles.fakeAlarmText}>
                Me he equivocado, deseo reportarlo como falsa alarma
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {this.circleLevelComponent()}
          <View>
            <Text style={styles.inputLabel}>LUGAR</Text>
            <TextInput
              editable={this.state.editable}
              autoCompleteType="email"
              onChangeText={(value) => {
                this.setState({ lugar: value }, () => {
                  socket.emit("update", {
                    usuario: this.state.navigation.state.params.fk_usuario,
                    fk_grupo: this.state.navigation.state.params.fk_grupo,
                    nivel: this.state.nivel,
                    latitud: this.state.navigation.state.params.latitud,
                    longitud: this.state.navigation.state.params.longitud,
                    estado: this.state.estado,
                    falsa: this.state.falsa,
                    lugar: this.state.lugar,
                    descripcion: this.state.descripcion,
                    nombreGrupo: this.state.navigation.state.params.nombreGrupo,
                  });
                });
              }}
              style={styles.regularInputText}
            />
          </View>
          <View>
            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              editable={this.state.editable}
              autoCompleteType="email"
              onChangeText={(value) => {
                this.setState({ descripcion: value }, () => {
                  socket.emit("update", {
                    usuario: this.state.navigation.state.params.fk_usuario,
                    fk_grupo: this.state.navigation.state.params.fk_grupo,
                    nivel: this.state.nivel,
                    latitud: this.state.navigation.state.params.latitud,
                    longitud: this.state.navigation.state.params.longitud,
                    estado: this.state.estado,
                    falsa: this.state.falsa,
                    lugar: this.state.lugar,
                    descripcion: this.state.descripcion,
                    nombreGrupo: this.state.navigation.state.params.nombreGrupo,
                  });
                });
              }}
              style={styles.fakeTextArea}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.eventExitHandler();
              }}
            >
              <Text style={styles.finishEventButton}>Finalizar evento</Text>
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
  finishEventButton: {
    color: "#fff",
    backgroundColor: "#012133",
    textAlign: "center",
    borderRadius: 25,
    padding: 10,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inputLabel: {
    color: "#000",
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
});
