import React from "react";

import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class reportDetailComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reporte: this.props.navigation.state.params.reporte,
      navigation: this.props.navigation,
    };
  }

  wholeComponent = () => {
    if (this.state.reporte) {
      return (
        <ScrollView style={styles.mb30}>
          <Text style={styles.seeReport}>Ver reporte</Text>
          <View styles={styles.creatorContainer}>
            <Text style={styles.reportCreatorLabel}>
              Agregado por el usuario: {this.state.reporte.usuario}
            </Text>
          </View>
          <View style={styles.pb80} style={styles.regularText}>
            <Text style={styles.reportCategoryTitle}>Momento</Text>
            <Text style={styles.regularText}>
              Evento ocurrido en la fecha: {this.state.reporte.fecha}
            </Text>
            <Text style={styles.regularText}>
              A las: {this.state.reporte.hora}:{this.state.reporte.minuto}
              {this.state.reporte.meridiem}
            </Text>
            <Text style={styles.reportCategoryTitle}>Lugar</Text>
            <Text style={styles.regularText}>
              Avenida: {this.state.reporte.avenida}
            </Text>
            <Text style={styles.regularText}>
              Calle: {this.state.reporte.calle}
            </Text>
            <Text style={styles.regularText}>
              Edificio: {this.state.reporte.edificio}
            </Text>
            <Text style={styles.regularText}>
              Local: {this.state.reporte.local_suceso}
            </Text>
            <Text style={styles.reportCategoryTitle}>Suceso</Text>
            <Text style={styles.regularText}>
              Descripción del suceso: {this.state.reporte.descripcion}
            </Text>
            <Text style={styles.reportCategoryTitle}>Víctima</Text>
            <Text style={styles.regularText}>
              Descripción de la víctima:{" "}
              {this.state.reporte.descripcion_victima}
            </Text>
            <Text style={styles.regularText}>
              Edad de la víctima: {this.state.reporte.edad_victima}
            </Text>
            <Text style={styles.regularText}>
              Sexo de la víctima: {this.state.reporte.sexo_victima}
            </Text>
            <Text style={styles.reportCategoryTitle}>Delincuente</Text>
            <Text style={styles.regularText}>
              Número de delincuentes: {this.state.reporte.numero_delincuentes}
            </Text>
            <Text style={styles.regularText}>
              Descripción de los delincuentes:{" "}
              {this.state.reporte.descripcion_delincuentes}
            </Text>
            <Text style={styles.reportCategoryTitle}>Transporte</Text>
            <Text style={styles.regularText}>
              Los delincuentes utilizaban el/los medios de transporte:{" "}
              {this.state.reporte.transpore_delincuentes}
            </Text>
            <Text style={styles.reportCategoryTitle}>Escape</Text>
            <Text style={styles.regularText}>
              Ruta de escape: {this.state.reporte.ruta_escape_delincuentes}
            </Text>
          </View>
        </ScrollView>
      );
    }
  };

  render() {
    return <View style={styles.container}>{this.wholeComponent()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: screenWidth * 0.05,
    paddingRight: screenWidth * 0.05,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  mb30: {
    marginBottom: 30,
  },
  pb80: {
    paddingBottom: 80,
  },
  seeReport: {
    fontSize: 35,
    marginBottom: 5,
    fontWeight: "bold",
  },
  reportCreatorLabel: {
    fontWeight: "bold",
    paddingBottom: 30,
  },
  regularText: {
    fontSize: 15,
  },
  reportCategoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
});
