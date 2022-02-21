import React from "react";

import MapView, { Marker } from "react-native-maps";

import {
  TouchableWithoutFeedback,
  Linking,
  StyleSheet,
  Dimensions,
} from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class MapToLocation extends React.Component {
  render() {
    if (this.props.state.nivel == 3) {
      return (
        <TouchableWithoutFeedback
          onLongPress={() => {
            Linking.openURL(
              "https://google.com/maps/?q=" +
                this.props.state.navigation.state.params.latitud +
                "," +
                this.props.state.navigation.state.params.longitud
            );
          }}
        >
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: this.props.state.navigation.state.params.latitud,
              longitude: this.props.state.navigation.state.params.longitud,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: this.props.state.navigation.state.params.latitud,
                longitude: this.props.state.navigation.state.params.longitud,
              }}
            />
          </MapView>
        </TouchableWithoutFeedback>
      );
    }
  }
}

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
    width: screenWidth * 0.8,
    height: screenWidth * 0.6,
    marginBottom: 20,
    marginTop: 20,
  },
});
