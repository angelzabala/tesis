import React from "react";

import MapView, { Marker } from "react-native-maps";
import { getAlert } from "../actions/actions";
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

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export default class alertScreenComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alerta: "",

      navigation: this.props.navigation,
    };
  }

  circleLevelComponent = (date) => {
    var formattedHour;
    if (date) {
      let moment = new Date(date);
      formattedHour = subHours(moment, 4); //recordar siempre quitarle 4 horas a la hora del servidor
      formattedHour = format(moment, "H:mma");
    }
    if (this.state.alerta.falsa == "true") {
      return (
        <View style={styles.fakeAlermContainer}>
          <Text style={styles.bigRedText}>HA SIDO UNA FALSA ALARMA!!</Text>
          <Text style={styles.smallRedText}>
            Hora de reporte: {formattedHour}
          </Text>
        </View>
      );
    } else {
      if (this.state.alerta.nivel == 1) {
        return (
          <View style={styles.alertCircleView}>
            <Text style={styles.alertCircleText}>{formattedHour}</Text>
            <View style={styles.greenAlert}>
              <Image
                style={styles.alertImg}
                source={require("../assets/iconosFigma/megaphone.png")}
              />
            </View>
          </View>
        );
      } else if (this.state.alerta.nivel == 2) {
        return (
          <View style={styles.alertCircleView}>
            <Text style={styles.alertCircleText}>{formattedHour}</Text>
            <View style={styles.yellowAlert}>
              <Image
                style={styles.alertImg}
                source={require("../assets/iconosFigma/danger.png")}
              />
            </View>
          </View>
        );
      } else if (this.state.alerta.nivel == 3) {
        return (
          <View style={styles.alertCircleView}>
            <Text style={styles.alertCircleText}>{formattedHour}</Text>
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
                this.state.alerta.latitud +
                "," +
                this.state.alerta.longitud
            );
          }}
        >
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: this.state.alerta.latitud,
              longitude: this.alerta.longitud,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: this.state.alerta.latitud,
                longitude: this.state.alerta.longitud,
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

  getAlertData = () => {
    const alertResponse = getAlert(
      this.state.navigation.state.params.pk_alerta
    );
    if (alertResponse.fulfilled) {
      this.setState({ alerta: alertResponse.alerta });
    }
  };

  sendReport = () => {
    this.state.navigation.navigate("addReportScreen", {
      alerta: this.state.alerta,
    });
  };

  componentDidMount() {
    this.getAlertData();
    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        this.setState({ isFocused: true });
        this.getAlertData();
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
    return (
      <ScrollView style={styles.contentContainerStyle}>
        <View style={styles.container}>
          <Text style={styles.groupTitle}>
            Del grupo: {this.state.alerta.nombre}
          </Text>
          <Text style={styles.mb20}>
            reportado por el usuario: {this.state.alerta.fk_usuario}
          </Text>
          {this.circleLevelComponent(this.state.alerta.hora)}
          <View>
            <Text style={styles.inputLabel}>LUGAR</Text>
            <TextInput
              editable={false}
              value={this.state.alerta.lugar}
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
              value={this.state.alerta.descripcion}
              autoCompleteType="email"
              onChangeText={(value) => {}}
              style={styles.fakeTextArea}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.sendReport(this.state.navigation.state.params.pk_alerta);
              }}
            >
              <Text style={styles.addReportButton}>
                Agregar reporte a esta alerta
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
  mb20: {
    marginBottom: 20,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
  },
  addReportButton: {
    color: "#fff",
    backgroundColor: "#012133",
    textAlign: "center",
    borderRadius: 25,
    padding: 10,
  },
  alertCircleView: {
    display: "flex",
    flexDirection: "row",
  },
  alertCircleText: {
    alignSelf: "center",
    marginRight: screenWidth * 0.15,
    fontWeight: "bold",
    fontSize: 30,
  },
  mapView: {
    flex: 1,
    width: screenWidth * 0.8,
    height: screenWidth * 0.6,
    marginBottom: 20,
    marginTop: 20,
  },
  groupTitle: {
    fontWeight: "bold",
    fontSize: 30,
    alignSelf: "flex-start",
    marginTop: 30,
    marginLeft: screenWidth * 0.1,
    marginBottom: 20,
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
