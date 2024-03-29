import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { postUser } from "../actions/actions";
import {
  StyleSheet,
  Image,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";

export default class LoginComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: "",
      password: "",
      navigation: this.props.navigation,
    };
  }

  storageData = async () => {
    let phonenumberStorage = "";
    try {
      phonenumberStorage = await AsyncStorage.getItem("phone");
      if (phonenumberStorage != "" && phonenumberStorage != undefined) {
        this.subs.forEach((sub) => sub.remove());
        this.state.navigation.navigate("Home");
      }
    } catch (error) {
      console.log(error);
    }
    return phonenumberStorage;
  };

  pressLoginHandler = () => {
    const data = {
      phone: this.state.phoneNumber,
      password: this.state.password,
    };
    postUser(data, () => {
      AsyncStorage.setItem("phone", data.phone).then(() => {
        this.subs.forEach((sub) => sub.remove());
        this.state.navigation.navigate("Home");
      });
    });
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

  render() {
    const { state } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Image style={styles.img} source={require("../assets/appIcon.png")} />
        <TextInput
          placeholder="NÚMERO DE TELÉFONO"
          onChangeText={(value) => {
            this.setState({ phoneNumber: value });
          }}
          placeholderTextColor="#fff"
          style={styles.inputText}
        />
        <TextInput
          placeholder="CONTRASEÑA"
          onChangeText={(value) => {
            this.setState({ password: value });
          }}
          placeholderTextColor="#fff"
          secureTextEntry={true}
          style={styles.inputText}
        />
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={this.pressLoginHandler}>
            <Text style={styles.logInButton}>Ingresar</Text>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            this.state.navigation.navigate("Register");
          }}
        >
          <Text style={styles.notRegistered}>
            ¿No tienes cuenta? registrate
          </Text>
        </TouchableWithoutFeedback>
      </View>
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
  notRegistered: { color: "#fff" },
  logInButton: {
    color: "#fff",
    backgroundColor: "#012133",
    textAlign: "center",
    borderRadius: 25,
    padding: 10,
  },
  buttonContainer: {
    width: 210,
    marginBottom: 10,
    marginTop: 25,
  },
  img: {
    height: 180,
    width: 180,
    marginBottom: 50,
    borderRadius: 180,
  },
  inputText: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 20,
    width: 280,
    color: "#fff",
  },
});
