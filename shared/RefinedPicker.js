import React from "react";

import { Picker } from "@react-native-community/picker";
import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class RefinedPicker extends React.Component {
  render() {
    return (
      <Picker
        selectedValue={this.props.selectedValue}
        style={styles.picker}
        onValueChange={this.props.onValueChange}
      >
        {this.props.defaultOption && (
          <Picker.Item
            label={this.props.defaultOption.label}
            value={this.props.defaultOption.value}
          />
        )}
        {this.props.numericOptions
          ? Array.from(Array(this.props.numberOfItems).keys()).map((value) => (
              <Picker.Item label={value + 1} value={value + 1} />
            ))
          : this.props.options.map((option) => (
              <Picker.Item label={option.label} value={option.value} />
            ))}
      </Picker>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    height: 30,
    width: screenWidth * 0.3,
    color: "#FFF",
  },
});
