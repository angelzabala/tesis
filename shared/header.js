import React from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  AsyncStorage,
} from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default function Header(props) {
  const logOutHandler = async () => {
    try {
      await AsyncStorage.removeItem("phone");
      props.navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };
  const createGroupHandler = () => {
    props.navigation.navigate("createGroup");
  };
  const addUserHandler = () => {
    let groupInfo = {
      groupId: props.navigation.state.params.groupId,
      isAdmin: props.navigation.state.params.isAdmin,
      groupName: props.navigation.state.params.groupName,
    };
    props.navigation.navigate("addUser", groupInfo);
  };
  if (props.routeName == "Home") {
    return (
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={logOutHandler}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.img}
              source={require("../assets/iconosFigma/logout.png")}
            />
            <Text style={styles.iconText}>Cerrar sesión</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={createGroupHandler}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.img}
              source={require("../assets/iconosFigma/plus.png")}
            />
            <Text style={styles.iconText}>Crear grupo</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  } else if (props.routeName == "groupDetail") {
    if (props.navigation.state.params.isAdmin == true) {
      return (
        <View style={styles.oneIconHeader}>
          <TouchableWithoutFeedback onPress={addUserHandler}>
            <View style={styles.iconContainer}>
              <Image
                style={styles.img}
                source={require("../assets/iconosFigma/add.png")}
              />
              <Text style={styles.iconText}>Agregar</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    return <View></View>;
  }
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flex: 1,
    width: screenWidth * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  oneIconHeader: {
    display: "flex",
    flex: 1,
    width: screenWidth * 0.75,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
    letterSpacing: 1,
  },
  img: {
    width: 25,
    height: 25,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
  },
});
