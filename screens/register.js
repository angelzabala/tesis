import React from 'react';
import {Dimensions, StyleSheet, TextInput, View, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Picker } from '@react-native-community/picker';

const screenWidth = Math.round(Dimensions.get('window').width);

export default class RegisterComponent extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			selectedPhoneCode : "",
			phoneNumber : "",
			email : "",
			password : "",
			passwordConfirmation : "",
			selectedDate : "",
			name : "",
			navigation : this.props.navigation
		}
	}

	pressForwardHandler = () => {
		var userData = {
			userData: {
				phone: this.state.selectedPhoneCode + this.state.phoneNumber,
				email: this.state.email,
				password: this.state.password,
				birthdate: this.state.selectedDate,
				name: this.state.name
			}
		};
		this.state.navigation.navigate('OptionalRegister', userData);
	}
	render(){
		return (
			<ScrollView style={{ backgroundColor: '#04a5ff', paddingBottom: 30 }}>
				<View style={styles.container}>
					<Text style={styles.bigText}>Registro</Text>
	
					<Text style={styles.inputLabel}>NÚMERO DE TELÉFONO</Text>
					<View style={styles.phoneContainer}>
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={this.state.selectedPhoneCode}
								style={styles.picker}
								onValueChange={(itemValue, itemIndex) => {this.setState({selectedPhoneCode:itemValue});}}>
								<Picker.Item label="" value=""/>
								<Picker.Item label="0412" value="0412" />
								<Picker.Item label="0414" value="0414" />
								<Picker.Item label="0416" value="0416" />
								<Picker.Item label="0424" value="0424" />
								<Picker.Item label="0426" value="0426" />
							</Picker>
						</View>
						<View>
							<TextInput placeholder='1234567' onChangeText={(value) => {this.setState({phoneNumber:value});}}
								placeholderTextColor='#ccffffff' style={styles.phoneInput} />
						</View>
					</View>
					<View>
						<Text style={styles.inputLabel}>NOMBRE</Text>
						<TextInput autoCompleteType="email" onChangeText={(value) => {this.setState({name:value});}}
							style={styles.regularInputText} />
					</View>
					<View>
						<Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
						<TextInput autoCompleteType="email" onChangeText={(value) => {this.setState({email:value});}}
							style={styles.regularInputText} />
					</View>
					<View>
						<Text style={styles.inputLabel}>CONTRASEÑA</Text>
						<TextInput secureTextEntry={true} onChangeText={(value) => {this.setState({password:value});}}
							style={styles.regularInputText} />
					</View>
					<View>
						<Text style={styles.inputLabel}>CONFIRMACIÓN DE CONTRASEÑA</Text>
						<TextInput secureTextEntry={true} onChangeText={(value) => {this.setState({passwordConfirmation:value});}}
							style={styles.regularInputText} />
					</View>
	
					<View>
						<Text style={styles.inputLabel}>FECHA DE NACIMIENTO</Text>
						<DatePicker
							style={styles.regularInputText}
							date={this.state.selectedDate}
							mode="date"
							placeholder="Fecha de nacimiento"
							format="YYYY-MM-DD"
							minDate="1900-01-01"
							maxDate="2020-01-01"
							confirmBtnText="Ok"
							cancelBtnText="Cancelar"
							customStyles={{
								dateIcon: {
									position: 'absolute',
									right: 0,
									top: 4,
									marginLeft: 0,
								}, 
								dateInput: {
									marginRight: 36,
									borderColor: 'transparent',
									textColor: "#ffffff"
								}
							}}
							onDateChange={(date) => {this.setState({selectedDate:date});}}
						/>
					</View>
					<TouchableWithoutFeedback style={styles.buttonContainer} onPress={this.pressForwardHandler}>
						<Text style={{ width: screenWidth*0.6,color: "#fff", "backgroundColor": "#012133", textAlign: "center", "borderRadius": 25, padding: 10 }}>Avanzar</Text>
					</TouchableWithoutFeedback>
	
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#04a5ff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	pickerContainer: {
		borderBottomColor: '#fff',
		borderBottomWidth: 1,
		height: 29,
		marginRight: 10
	},
	picker: {
		height: 30,
		width: screenWidth*0.3,
		color: "#FFF",
	},
	bigText: {
		color: "#fff",
		fontSize: 35,
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 20,
	},
	phoneContainer: {
		flex: 1,
		flexDirection: 'row',
		height: 40,
	},
	inputText: {
		borderBottomColor: '#fff',
		borderBottomWidth: 1,
		marginBottom: 20,
		color: '#fff',
	},
	regularInputText: {
		borderBottomColor: '#fff',
		borderBottomWidth: 1,
		marginBottom: 20,
		color: '#fff',
		width: screenWidth*0.8
	},
	phoneInput: {
		borderBottomColor: '#fff',
		borderBottomWidth: 1,
		marginBottom: 0,
		color: '#fff',
		paddingHorizontal: 30,
	},
	inputLabel: {
		color: "#fff"
	},
	buttonContainer: {
		width: screenWidth*0.6,
		marginBottom: 30,
		marginTop: 25
	},
});