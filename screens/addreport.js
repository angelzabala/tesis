import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RefinedPicker from "../shared/RefinedPicker";

import { postReports } from "../actions/actions";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";

import {
  genderOptions,
  meridiemOptions,
  monthsOptions,
  yearOptions,
} from "../shared/variables/constants";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class AddReportComponent extends React.Component {
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
      <ScrollView style={styles.mb30}>
        <Text style={styles.loadReportTitle}>Cargar reporte</Text>
        <View style={[styles.pb80, styles.regularText]}>
          <Text style={styles.reportCategoryTitle}>Momento</Text>
          <View style={styles.datePickerContainer}>
          <RefinedPicker
              selectedValue={this.state.selectedDay}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ selectedDay: itemValue });
              }}
              defaultOption={{label:"Día", value: ""}}
              numberOfItems={31}
              numericOptions
            />
            
            <RefinedPicker
              selectedValue={this.state.selectedMonth}
              onValueChange={(itemValue) => {
                this.setState({ selectedMonth: itemValue });
              }}
              options={monthsOptions}
            />

            <RefinedPicker
              selectedValue={this.state.selectedYear}
              onValueChange={(itemValue) => {
                this.setState({ selectedYear: itemValue });
              }}
              options={yearOptions}
            />
          </View>
          <View style={styles.datePickerContainer}>
            <RefinedPicker
              selectedValue={this.state.selectedHour}
              style={styles.picker}
              onValueChange={(itemValue) => {
                this.setState({ selectedHour: itemValue });
              }}
              defaultOption={{label:"Hora", value: ""}}
              numberOfItems={12}
              numericOptions
            />

            <RefinedPicker
              selectedValue={this.state.selectedMinute}
              onValueChange={(itemValue) => {
                this.setState({ selectedMinute: itemValue });
              }}
              defaultOption={{label:"Minuto", value: ""}}
              numberOfItems={60}
              numericOptions
            />

            <RefinedPicker
              selectedValue={this.state.selectedMeridiem}
              onValueChange={(itemValue) => {
                this.setState({ selectedMeridiem: itemValue });
              }}
              options={meridiemOptions}
            />
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
            <RefinedPicker 
            selectedValue={this.state.sexo_victima}
            onValueChange={(itemValue) => {
              this.setState({ sexo_victima: itemValue });
            }}
            options={genderOptions}
            />
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

          <View>
          <RefinedPicker 
             selectedValue={this.state.edad_victima}
             onValueChange={(itemValue) => {
               this.setState({ edad_victima: itemValue });
             }}
            defaultOption={{label:"Edad de la víctima", value:""}}
            numberOfItems={100}
            numericOptions
            />
          </View>
          <Text style={styles.reportCategoryTitle}>Delincuentes</Text>
          <View>
          <RefinedPicker 
             selectedValue={this.state.edad_victima}
             onValueChange={(itemValue) => {
               this.setState({ edad_victima: itemValue });
             }}
            defaultOption={{label="Número de delincuentes", value=""}}
            numberOfItems={5}
            numericOptions
            />
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
          <Text style={styles.advanceButton}>Avanzar</Text>
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
  mb30: {
    marginBottom: 30,
  },
  pb80: {
    paddingBottom: 80,
  },
  loadReportTitle: {
    fontSize: 35,
    marginBottom: 5,
    fontWeight: "bold",
  },
  advanceButton: {
    width: screenWidth * 0.6,
    color: "#fff",
    marginTop: 30,
    backgroundColor: "#012133",
    textAlign: "center",
    borderRadius: 25,
    padding: 10,
    alignSelf: "center",
  },
});
