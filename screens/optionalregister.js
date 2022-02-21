import React from "react";

import { Picker } from "@react-native-community/picker";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  AsyncStorage,
  Dimensions,
} from "react-native";
import { postUsers } from "../actions/actions";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class OptionalInfoComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: "",
      selectedPhone1: "",
      phoneNumber1: "",
      selectedPhone2: "",
      phoneNumber2: "",
      allergies: "",
      cronic: "",
      discapacity: "",
      navigation: this.props.navigation,
    };
  }

  registrationHandler = () => {
    var userData = {
      userReqData: this.state.navigation.state.params.userData,
      userOptionalData: {
        bloodType: this.state.selectedValue,
        emgc1: this.state.selectedPhone1 + this.state.phoneNumber1,
        emgc2: this.state.selectedPhone2 + this.state.phoneNumber2,
        allergies: this.state.allergies,
        cronic: this.state.cronic,
        discapacity: this.state.discapacity,
      },
    };

    const data = {
      userReqData: userData.userReqData,
      userOptionalData: userData.userOptionalData,
    };
    postUsers(data, () => {
      AsyncStorage.setItem(
        "phone",
        this.state.navigation.state.params.userData.phone
      ).then(this.state.navigation.navigate("Home"));
    })
    
  };
  render() {
    return (
      <ScrollView style={{ backgroundColor: "#04a5ff" }}>
        <View style={styles.container}>
          <Text style={styles.bigText}>Información adicional (opcional)</Text>

          <View style={styles.bloodTypeContainer}>
            <View>
              <Text style={styles.inputLabel}>TIPO DE SANGRE: </Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.selectedValue}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ selectedValue: itemValue })
                }
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="A+" value="A+" />
                <Picker.Item label="A-" value="A-" />
                <Picker.Item label="B+" value="B+" />
                <Picker.Item label="B-" value="B-" />
                <Picker.Item label="AB+" value="AB+" />
                <Picker.Item label="AB-" value="AB-" />
                <Picker.Item label="O+" value="O+" />
                <Picker.Item label="O-" value="O-" />
              </Picker>
            </View>
          </View>

          <Text style={styles.inputLabel}>CONTACTO DE EMERGENCIA 1</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.selectedPhone1}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ selectedPhone1: itemValue })
                }
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="0412" value="0412" />
                <Picker.Item label="0414" value="0414" />
                <Picker.Item label="0416" value="0416" />
                <Picker.Item label="0424" value="0424" />
                <Picker.Item label="0426" value="0426" />
              </Picker>
            </View>
            <View>
              <TextInput
                placeholder="1234567"
                onChangeText={(value) => this.setState({ phoneNumber1: value })}
                placeholderTextColor="#ccffffff"
                style={styles.phoneInput}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>CONTACTO DE EMERGENCIA 2</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.selectedPhone2}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ selectedPhone2: itemValue })
                }
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="0412" value="0412" />
                <Picker.Item label="0414" value="0414" />
                <Picker.Item label="0416" value="0416" />
                <Picker.Item label="0424" value="0424" />
                <Picker.Item label="0426" value="0426" />
              </Picker>
            </View>
            <View>
              <TextInput
                placeholder="1234567"
                onChangeText={(value) => this.setState({ phoneNumber2: value })}
                placeholderTextColor="#ccffffff"
                style={styles.phoneInput}
              />
            </View>
          </View>

          <View>
            <Text style={styles.inputLabel}>ALERGIAS</Text>
            <TextInput
              onChangeText={(value) => this.setState({ allergies: value })}
              style={styles.regularInputText}
            />
          </View>

          <View>
            <Text style={styles.inputLabel}>ENFERMEDADES CRÓNICAS</Text>
            <TextInput
              onChangeText={(value) => this.setState({ cronic: value })}
              style={styles.regularInputText}
            />
          </View>

          <View>
            <Text style={styles.inputLabel}>DISCAPACIDAD</Text>
            <TextInput
              onChangeText={(value) => this.setState({ discapacity: value })}
              style={styles.regularInputText}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback
              style={styles.buttonContainer}
              onPress={this.registrationHandler}
            >
              <Text
                style={{
                  width: screenWidth * 0.6,
                  color: "#fff",
                  backgroundColor: "#012133",
                  textAlign: "center",
                  borderRadius: 25,
                  padding: 10,
                }}
              >
                Registrarse
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
    backgroundColor: "#04a5ff",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerContainer: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    height: 29,
    marginLeft: 30,
    marginRight: 30,
  },
  picker: {
    height: 30,
    width: 100,
    color: "#FFF",
  },
  phoneContainer: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    paddingRight: 30,
  },
  bigText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  bloodTypeContainer: {
    flex: 1,
    flexDirection: "row",
    height: 40,
  },
  inputText: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 20,
    color: "#fff",
  },
  regularInputText: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 20,
    color: "#fff",
    width: screenWidth * 0.8,
  },
  phoneInput: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 0,
    color: "#fff",
    paddingHorizontal: 30,
  },
  inputLabel: {
    color: "#fff",
  },
  buttonContainer: {
    width: screenWidth * 0.6,
    marginBottom: 10,
    marginTop: 0,
  },
});
