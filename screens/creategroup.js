import React from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScrollView } from "react-native-gesture-handler";
import { postGroups } from "../actions/actions";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class CreateGroupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      groupDescription: "",
      groupEnviroment: "",
      groupCreator: "",
      isAdmin: true,
      navigation: this.props.navigation,
    };
  }

  storageData = async () => {
    let phonenumber = "";
    try {
      phonenumber = await AsyncStorage.getItem("phone");
      this.setState({ groupCreator: phonenumber });
    } catch (error) {
      console.log(error);
    }
    return phonenumber;
  };

  createGroupHandler = () => {
    const data = {
      groupName: this.state.groupName,
      groupDescription: this.state.groupDescription,
      groupEnviroment: this.state.groupEnviroment,
      groupCreator: this.state.groupCreator,
    };

    postGroups(data,this.state, () => {
      alert(
        "El grupo " +
          this.state.groupName +
          " se ha creado de manera exitosa"
      );
      this.state.navigation.navigate("Home");
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

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.inputLabel}>NOMBRE DEL GRUPO(requerido)</Text>
            <TextInput
              autoCompleteType="email"
              onChangeText={(value) => {
                this.setState({ groupName: value });
              }}
              style={styles.regularInputText}
            />
          </View>
          <View>
            <Text style={styles.inputLabel}>Descripción(requerido)</Text>
            <TextInput
              autoCompleteType="email"
              onChangeText={(value) => {
                this.setState({ groupDescription: value });
              }}
              style={styles.fakeTextArea}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <View>
            <Text style={styles.inputLabel}>Lugar del grupo(requerido)</Text>
            <TextInput
              autoCompleteType="email"
              onChangeText={(value) => {
                this.setState({ groupEnviroment: value });
              }}
              style={styles.fakeTextArea}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.createGroupHandler();
              }}
            >
              <Text
                style={}
              >
                Crear grupo
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
  createGroupButton: {
    color: "#fff",
    backgroundColor: "#012133",
    textAlign: "center",
    borderRadius: 25,
    padding: 10,
  },
  scrollView: {
    flexGrow: 1, justifyContent: "center" 
  },
  inputLabel: {
    color: "#000",
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
  buttonContainer: {
    width: screenWidth * 0.6,
    marginBottom: 10,
    marginTop: 25,
  },
});
