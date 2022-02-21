import React, { Component } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { BarChart } from "react-native-charts";
import { format } from "date-fns";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";


const ipv4 = require("../serverip.json").serverIp;
const screenWidth = Math.round(Dimensions.get("window").width);

export default class statisticsScreenComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fk_grupo: this.props.navigation.state.params.fk_grupo,
      alertas: "",
      reales: 0,
      falsas: 0,
      totales: 0,
      reportes: "",
      navigation: this.props.navigation,
    };
  }

  getAlertList = () => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    fetch(
      ipv4 + "/alertas/grupo/" + this.state.navigation.state.params.fk_grupo,
      options
    )
      .then((response) => {
        if (response.status == 200) {
          response.json().then((jsonObj) => {
            this.setState({ alertas: jsonObj }, () => {
              this.getReportList();
            });
          });
        } else if (response.status == 204) {
          console.log("error interno");
        }
      })
      .catch((err) => console.log(err));
  };

  getReportList = () => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    fetch(
      ipv4 + "/reportes/grupo/" + this.state.navigation.state.params.fk_grupo,
      options
    )
      .then((response) => {
        if (response.status == 200) {
          response.json().then((jsonObj) => {
            this.setState({ reportes: jsonObj }, () => {
              this.updateAlertGraph();
              this.reportListComponent();
            });
          });
        } else if (response.status == 204) {
          console.log("error interno");
        }
      })
      .catch((err) => console.log(err));
  };

  updateAlertGraph = () => {
    this.setState({ reales: this.state.alertas[0].alertas_reales });
    this.setState({ falsas: this.state.alertas[0].alertas_falsas });
    this.setState({ totales: this.state.alertas[0].alertas_totales });
  };
  reportPressHandler = (reporte) => {
    this.state.navigation.navigate("reportDetailScreen", { reporte: reporte });
  };
  alertPressHandler = (alerta) => {
    this.state.navigation.navigate("alertDetail", {
      pk_alerta: alerta.pk_alerta,
    });
  };
  reportListComponent = () => {
    if (this.state.reportes != "" && this.state.reportes.length != 0) {
      return (
        <SafeAreaView>
          <FlatList
            data={this.state.reportes}
            keyExtractor={(item) => item.pk_reporte.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => this.reportPressHandler(item)}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      paddingBottom: 2,
                      textDecorationLine: "underline",
                      marginBottom: 20,
                    }}
                  >
                    {item.fecha} - {item.hora}:{item.minuto}
                    {item.meridiem}
                  </Text>
                </TouchableWithoutFeedback>
              );
            }}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ display: "flex", width: screenWidth }}>
          <Text style={{ fontSize: 25, color: "#D82C2C", display: "flex" }}>
            El grupo no tiene reportes cargados por el momento
          </Text>
        </View>
      );
    }
  };

  alertListComponent = () => {
    if (this.state.alertas != "" && this.state.alertas.length != 0) {
      return (
        <SafeAreaView>
          <FlatList
            data={this.state.alertas}
            keyExtractor={(item) => item.pk_alerta.toString()}
            renderItem={({ item }) => {
              let moment = new Date(item.hora);
              var formattedDate = format(moment, "dd/MMM/yyyy");
              var formattedHour = format(moment, "H:mma");
              return (
                <TouchableWithoutFeedback
                  onPress={() => this.alertPressHandler(item)}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      paddingBottom: 2,
                      textDecorationLine: "underline",
                      marginBottom: 20,
                    }}
                  >
                    {formattedDate} - {formattedHour}
                  </Text>
                </TouchableWithoutFeedback>
              );
            }}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ display: "flex", width: screenWidth }}>
          <Text style={{ fontSize: 25, color: "#D82C2C", display: "flex" }}>
            El grupo no tiene reportes cargados por el momento
          </Text>
        </View>
      );
    }
  };

  labelComponent = () => {
    if (this.state.reales != 0 && this.state.reales) {
      return (
        <View style={styles.labelContainer}>
          <Text style={styles.statisticLabel}>
            Alertas reales: {this.state.reales} - (
            {Math.round(this.state.reales / this.state.totales) * 100})%
          </Text>
          <Text style={styles.statisticLabel}>
            Alertas falsas: {this.state.falsas} - (
            {Math.round(this.state.falsas / this.state.totales) * 100}%)
          </Text>
          <Text style={styles.statisticLabel}>
            Alertas totales: {this.state.totales}
          </Text>
        </View>
      );
    }
  };

  componentDidMount() {
    this.getAlertList();

    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        this.setState({ isFocused: true });
        this.getAlertList();
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
      <ScrollView style={{ display: "flex", flex: 1 }}>
        <View style={styles.container}>
          <Text style={{ fontSize: 40, fontWeight: "bold", marginBottom: 15 }}>
            Estadísticas
          </Text>
          <BarChart
            dataSets={[
              {
                fillColor: "#fc766aff",
                data: [{ value: this.state.reales }],
              },
              {
                fillColor: "#5b8481ff",
                data: [{ value: this.state.falsas }],
              },
            ]}
            graduation={1}
            horizontal={false}
            showGrid={true}
            barSpacing={30}
            style={{
              height: 300,
              margin: 0,
              width: screenWidth * 0.9,
            }}
          />
          {this.labelComponent()}
          <Text style={{ fontSize: 30, marginBottom: 20, fontWeight: "bold" }}>
            Reportes del grupo
          </Text>
          <View>{this.reportListComponent()}</View>
          <Text style={{ fontSize: 30, marginBottom: 20, fontWeight: "bold" }}>
            Alertas del grupo
          </Text>
          <View>{this.alertListComponent()}</View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    width: screenWidth * 0.9,
    marginLeft: screenWidth * 0.05,
  },
});
