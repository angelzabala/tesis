import React from "react";

import { Picker } from "@react-native-community/picker";
import { postReports } from "../actions/actions";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  AsyncStorage,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class addReportComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDay: "",
      selectedMonth: "",
      selectedYear: "",
      selectedHour: "",
      selectedMinute: "",
      selectedMeridiem: "",
      avenida: "",
      calle: "",
      edificio: "",
      local: "",
      descripcion: "",
      sexo_victima: "",
      descripcion_victima: "",
      edad_victima: "",
      numero_delincuentes: "",
      descripcion_delincuentes: "",
      transporte_delincuentes: "",
      ruta_escape_delincuentes: "",
      userPhoneNumber: "",
      fk_grupo: this.props.navigation.state.params.alerta.fk_grupo,
      fk_alerta: this.props.navigation.state.params.alerta.pk_alerta,
      navigation: this.props.navigation,
    };
  }
  storageData = async () => {
    let phonenumber = "";
    try {
      phonenumber = await AsyncStorage.getItem("phone");
      this.setState({ userPhoneNumber: phonenumber });
    } catch (error) {
      console.log(error);
    }
    return phonenumber;
  };

  addReportHandler = () => {
    let report = {
      fecha:
        this.state.selectedDay +
        "/" +
        this.state.selectedMonth +
        "/" +
        this.state.selectedYear,
      hora: this.state.selectedHour,
      minuto: this.state.selectedMinute,
      meridiem: this.state.selectedMeridiem,
      avenida: this.state.avenida,
      calle: this.state.calle,
      edificio: this.state.edificio,
      local: this.state.local,
      descripcion: this.state.descripcion,
      sexo_victima: this.state.sexo_victima,
      descripcion_victima: this.state.descripcion_victima,
      edad_victima: this.state.edad_victima,
      numero_delincuentes: this.state.numero_delincuentes,
      descripcion_delincuentes: this.state.descripcion_delincuentes,
      transporte_delincuentes: this.state.transporte_delincuentes,
      ruta_escape_delincuentes: this.state.ruta_escape_delincuentes,
      usuario: this.state.userPhoneNumber,
      fk_grupo: this.state.fk_grupo,
      fk_alerta: this.state.fk_alerta,
    };

    postReports(report, () => {
      this.state.navigation.navigate("statisticsScreen", {
        fk_grupo: this.state.fk_grupo,
      });
    });
  };

  wholeComponent = () => {
    return (
      <ScrollView style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 35, marginBottom: 5, fontWeight: "bold" }}>
          Cargar reporte
        </Text>
        <View style={{ paddingBottom: 80 }} style={styles.regularText}>
          <Text style={styles.reportCategoryTitle}>Momento</Text>
          <View style={styles.datePickerContainer}>
            <Picker
              selectedValue={this.state.selectedDay}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ selectedDay: itemValue });
              }}
            >
              <Picker.Item label="Día" value="" />
              {Array.from(Array(31).keys()).map((value) => (
                <Picker.Item label={value + 1} value={value + 1} />
              ))}
            </Picker>
            <Picker
              selectedValue={this.state.selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ selectedMonth: itemValue });
              }}
            >
              <Picker.Item label="Mes" value="" />
              <Picker.Item label="Enero" value="1" />
              <Picker.Item label="Febrero" value="2" />
              <Picker.Item label="Marzo" value="3" />
              <Picker.Item label="Abril" value="4" />
              <Picker.Item label="Mayo" value="5" />
              <Picker.Item label="Junio" value="6" />
              <Picker.Item label="Julio" value="7" />
              <Picker.Item label="Agosto" value="8" />
              <Picker.Item label="Septiembre" value="9" />
              <Picker.Item label="Octubre" value="10" />
              <Picker.Item label="Noviembre" value="11" />
              <Picker.Item label="Diciembre" value="12" />
            </Picker>
            <Picker
              selectedValue={this.state.selectedYear}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ selectedYear: itemValue });
              }}
            >
              <Picker.Item label="Año" value="" />
              <Picker.Item label="2015" value="2015" />
              <Picker.Item label="2016" value="2016" />
              <Picker.Item label="2017" value="2017" />
              <Picker.Item label="2018" value="2018" />
              <Picker.Item label="2019" value="2019" />
              <Picker.Item label="2020" value="2020" />
              <Picker.Item label="2021" value="2021" />
              <Picker.Item label="2022" value="2022" />
            </Picker>
          </View>
          <View style={styles.datePickerContainer}>
            <Picker
              selectedValue={this.state.selectedHour}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ selectedHour: itemValue });
              }}
            >
              <Picker.Item label="Hora" value="" />
              {Array.from(Array(12).keys()).map((value) => (
                <Picker.Item label={value + 1} value={value + 1} />
              ))}
            </Picker>
            <Picker
              selectedValue={this.state.selectedMinute}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ selectedMinute: itemValue });
              }}
            >
              <Picker.Item label="Minuto" value="" />
              {Array.from(Array(60).keys()).map((value) => (
                <Picker.Item label={value + 1} value={value + 1} />
              ))}
            </Picker>
            <Picker
              selectedValue={this.state.selectedMeridiem}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ selectedMeridiem: itemValue });
              }}
            >
              <Picker.Item label="Meridiem" value="" />
              <Picker.Item label="AM" value="AM" />
              <Picker.Item label="PM" value="PM" />
            </Picker>
          </View>
          <Text style={styles.reportCategoryTitle}>Lugar</Text>
          <View style={styles.textAreaContainer}>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>Avenida</Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ avenida: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>Calle</Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ calle: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>Edificio</Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ edificio: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>Local</Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ local: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
          <Text style={styles.reportCategoryTitle}>Suceso</Text>
          <View style={styles.textAreaContainer}>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ descripcion: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
          <Text style={styles.reportCategoryTitle}>Víctima</Text>
          <View style={styles.sexPickerContainer}>
            <Picker
              selectedValue={this.state.sexo_victima}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ sexo_victima: itemValue });
              }}
            >
              <Picker.Item label="Género de la Víctima" value="" />
              <Picker.Item label="M" value="M" />
              <Picker.Item label="F" value="F" />
            </Picker>
          </View>
          <View style={styles.textAreaContainer}>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>Descripción de la víctima</Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ descripcion_victima: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.delincuentesPickerContainer}>
            <Picker
              selectedValue={this.state.edad_victima}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ edad_victima: itemValue });
              }}
            >
              <Picker.Item label="Edad de la víctima" value="" />
              {Array.from(Array(100).keys()).map((value) => (
                <Picker.Item label={value} value={value} />
              ))}
            </Picker>
          </View>
          <Text style={styles.reportCategoryTitle}>Delincuentes</Text>
          <View style={styles.delincuentesPickerContainer}>
            <Picker
              selectedValue={this.state.numero_delincuentes}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ numero_delincuentes: itemValue });
              }}
            >
              <Picker.Item label="Número de delincuentes" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>
          <View style={styles.textAreaContainer}>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>Descripción delincuentes</Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ descripcion_delincuentes: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
          <Text style={styles.reportCategoryTitle}>Transporte</Text>
          <View style={styles.textAreaContainer}>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ transporte_delincuentes: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
          <Text style={styles.reportCategoryTitle}>Escape</Text>
          <View style={styles.textAreaContainer}>
            <View style={styles.textAreaHelper}>
              <Text style={styles.inputLabel}>
                Ruta de escape de los delincuentes
              </Text>
              <TextInput
                onChangeText={(value) => {
                  this.setState({ ruta_escape_delincuentes: value });
                }}
                style={styles.fakeTextArea}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
        </View>
        <TouchableWithoutFeedback
          style={styles.buttonContainer}
          onPress={() => {
            this.addReportHandler();
          }}
        >
          <Text
            style={{
              width: screenWidth * 0.6,
              color: "#fff",
              marginTop: 30,
              backgroundColor: "#012133",
              textAlign: "center",
              borderRadius: 25,
              padding: 10,
              alignSelf: "center",
            }}
          >
            Avanzar
          </Text>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  };

  componentDidMount() {
    this.storageData();
    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        this.setState({ isFocused: true });
        this.storageData();
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
  buttonContainer: {
    width: screenWidth * 0.6,
    marginBottom: 30,
    marginTop: 25,
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
});
