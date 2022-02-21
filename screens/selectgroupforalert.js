import React from "react";

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class selectGroupForAlertComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userPhoneNumber: this.props.navigation.state.params.user,
      level: this.props.navigation.state.params.level,
      latitud: this.props.navigation.state.params.latitud,
      longitud: this.props.navigation.state.params.longitud,
      groups: this.props.navigation.state.params.groups,
      navigation: this.props.navigation,
    };
  }

  sendAlertToGroupHandler = (fk_grupo, nombreGrupo) => {
    let alertInfo = {
      fk_grupo: fk_grupo,
      fk_usuario: this.state.userPhoneNumber,
      nivel: this.state.level,
      latitud: this.state.latitud,
      longitud: this.state.longitud,
      nombreGrupo: nombreGrupo,
    };
    this.state.navigation.navigate("AlertScreen", alertInfo);
  };
  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <Text style={styles.title}>Generar alerta</Text>
          <Text style={styles.redText}>
            Seleccione un grupo para seguir con la emision de su alerta
          </Text>
          <Image
            style={styles.arrowImage}
            source={require("../assets/iconosFigma/redarrow.png")}
          />

          <View style={styles.groupSectionContainer}>
            <Text style={styles.groupsLabel}>Mis Grupos</Text>
            <FlatList
              data={this.state.groups}
              keyExtractor={(item) => item.fk_grupo.toString()}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.sendAlertToGroupHandler(item.fk_grupo, item.nombre);
                  }}
                >
                  <View style={styles.groupContainer}>
                    <Image
                      style={styles.groupIcon}
                      source={require("../assets/iconosFigma/play-button.png")}
                    />
                    <Text style={styles.groupName}>{item.nombre}</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    width: screenWidth * 0.9,
    marginLeft: screenWidth * 0.05,
    marginTop: 30,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
  },
  redText: {
    color: "#FF0000",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  arrowImage: {
    alignSelf: "center",
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    marginBottom: 20,
  },
  groupsLabel: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  groupSectionContainer: {
    width: screenWidth * 0.9,
    display: "flex",
  },
  groupContainer: {
    display: "flex",
    flexDirection: "row",
  },
  groupIcon: {
    width: screenWidth * 0.05,
    height: screenWidth * 0.05,
    marginLeft: 20,
    marginRight: 10,
    alignSelf: "center",
  },
  groupName: {
    fontSize: 20,
    color: "#000",
  },
});
