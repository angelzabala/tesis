import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { BarChart } from "react-native-charts";
import { ScrollView } from "react-native-gesture-handler";
import { format } from "date-fns";
import { getGroupAlerts, getGroupReports } from "../actions/actions";

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
    const groupAlertsResponse = getGroupAlerts(
      this.state.navigation.state.params.fk_grupo
    );
    if (groupAlertsResponse.fulfilled) {
      this.setState({ alertas: groupAlertsResponse }, () => {
        this.getReportList();
      });
    }
  };

  getReportList = () => {
    const getReportsResponse = getGroupReports(
      this.state.navigation.state.params.fk_grupo
    );
    if (getReportsResponse.fulfilled) {
      this.setState({ reportes: getReportsResponse.reportes }, () => {
        this.updateAlertGraph();
        this.reportListComponent();
      });
    }
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
                  <Text style={styles.reportCard}>
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
        <View style={styles.noReportsContainer}>
          <Text style={styles.noReportsTitle}>
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
              let formattedDate = format(moment, "dd/MMM/yyyy");
              let formattedHour = format(moment, "H:mma");

              return (
                <TouchableWithoutFeedback
                  onPress={() => this.alertPressHandler(item)}
                >
                  <Text style={styles.dateAndHour}>
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
        <View style={styles.noReportsContainer}>
          <Text style={styles.noReportsTitle}>
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.statisticTitle}>Estadísticas</Text>
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
            style={styles.barChart}
          />
          {this.labelComponent()}
          <Text style={styles.sectionTitle}>Reportes del grupo</Text>
          <View>{this.reportListComponent()}</View>
          <Text style={styles.sectionTitle}>Alertas del grupo</Text>
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
  reportCard: {
    fontSize: 20,
    paddingBottom: 2,
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "bold",
  },
  statisticTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 15,
  },
  scrollView: {
    display: "flex",
    flex: 1,
  },
  noReportsContainer: {
    display: "flex",
    width: screenWidth,
  },
  noReportsTitle: {
    fontSize: 25,
    color: "#D82C2C",
    display: "flex",
  },
  dateAndHour: {
    fontSize: 20,
    paddingBottom: 2,
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  barChart: {
    height: 300,
    margin: 0,
    width: screenWidth * 0.9,
  },
});
