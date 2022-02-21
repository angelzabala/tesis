import React from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Picker } from "@react-native-community/picker";
import { postUserGroups } from "../actions/actions";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class addUserComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPhoneCode: "",
      phoneNumber: "",
      funcionario: false,
      nombreGrupo: this.props.navigation.state.params.nombreGrupo,
      navigation: this.props.navigation,
    };
  }

  funcionarioComponent = (funcionario = this.state.funcionario) => {
    if (funcionario) {
      return (
        <View style={styles.fatherAnswareContainer}>
          <Text>FUNCIONARIO: </Text>
          <View style={styles.answareContainer}>
            <Text>SÍ</Text>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ funcionario: true })}
            >
              <View style={styles.blueButton}></View>
            </TouchableWithoutFeedback>
            <Text>NO</Text>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ funcionario: false })}
            >
              <View style={styles.blackButton}></View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.fatherAnswareContainer}>
          <Text>FUNCIONARIO: </Text>
          <View style={styles.answareContainer}>
            <Text>SÍ</Text>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ funcionario: true })}
            >
              <View style={styles.blackButton}></View>
            </TouchableWithoutFeedback>
            <Text>NO</Text>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ funcionario: false })}
            >
              <View style={styles.blueButton}></View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
  };

  addUserHandler = () => {
    const user = {
      phoneNumber: this.state.selectedPhoneCode + this.state.phoneNumber,
      funcionario: this.state.funcionario,
      groupNumber: this.props.navigation.state.params.groupId,
      isAdmin: this.props.navigation.state.params.isAdmin,
      groupName: this.props.navigation.state.params.groupName,
      notEmpty: true,
    };

    postUserGroups(user, AsyncStorage.getItem("phone"), () => {
      this.state.navigation.goBack();
    });
  };

  render() {
    return (
      <ScrollView
        style={{ display: "flex", paddingTop: 50, backgroundColor: "#fff" }}
      >
        <View style={styles.container}>
          <Text style={styles.inputLabel}>NÚMERO DE TELÉFONO(requerido)</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.selectedPhoneCode}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ selectedPhoneCode: itemValue })
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
                onChangeText={(value) => this.setState({ phoneNumber: value })}
                placeholderTextColor="#000000"
                style={styles.phoneInput}
              />
            </View>
          </View>
          {this.funcionarioComponent()}
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback
              style={styles.buttonContainer}
              onPress={() => {
                this.addUserHandler();
              }}
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
                Agregar Usuario
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
  },
  pickerContainer: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    height: 29,
    marginLeft: 30,
    marginRight: 30,
  },
  picker: {
    height: 30,
    width: 100,
  },
  phoneContainer: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    paddingRight: 30,
    marginBottom: 10,
  },
  phoneInput: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 0,
    color: "#000",
    paddingHorizontal: 30,
    fontSize: 15,
  },
  regularInputText: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 20,
    color: "#fff",
    width: screenWidth * 0.8,
  },
  blueButton: {
    borderRadius: 15,
    backgroundColor: "#04A5FF",
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  blackButton: {
    borderRadius: 15,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  fatherAnswareContainer: {
    display: "flex",
    flexDirection: "row",
  },
  answareContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: screenWidth * 0.1,
  },
  buttonContainer: {
    width: screenWidth * 0.6,
    marginBottom: 10,
    marginTop: 30,
  },
});
