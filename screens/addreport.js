import React from 'react';
import {
    StyleSheet, View, Text, TouchableWithoutFeedback, AsyncStorage, Dimensions, ScrollView, TextInput
} from 'react-native';
import { Picker } from '@react-native-community/picker';

const ipv4 = require('../serverip.json').serverIp;

const screenWidth = Math.round(Dimensions.get('window').width);
export default class addReportComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedDay: '',
            selectedMonth: '',
            selectedYear: '',
            selectedHour: '',
            selectedMinute: '',
            selectedMeridiem: '',
            avenida: '',
            calle: '',
            edificio: '',
            local: '',
            descripcion: '',
            sexo_victima: '',
            descripcion_victima: '',
            edad_victima: '',
            numero_delincuentes: '',
            descripcion_delincuentes: '',
            transporte_delincuentes: '',
            ruta_escape_delincuentes: '',
            userPhoneNumber: '',
            fk_grupo: this.props.navigation.state.params.alerta.fk_grupo,
            fk_alerta: this.props.navigation.state.params.alerta.pk_alerta,
            navigation: this.props.navigation,
        }

    }
    storageData = async () => {
        let phonenumber = '';
        try {
            phonenumber = await AsyncStorage.getItem('phone');
            this.setState({ userPhoneNumber: phonenumber });
        } catch (error) {
            console.log(error);
        }
        return phonenumber;
    }

    addReportHandler = () => {
        let report = {
            fecha: this.state.selectedDay + '/' + this.state.selectedMonth + '/' + this.state.selectedYear,
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
            fk_alerta: this.state.fk_alerta
        };
        const data = report;
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(ipv4 + '/reportes', options).then((response) => {
            if (response.status == 200) {
                alert('el reporte se ha agregado correctamente');
                this.state.navigation.navigate('statisticsScreen', { fk_grupo: this.state.fk_grupo });
            } else {
                alert('error interno, por favor intente más tarde');
            }
        }).catch(err => console.log(err));
    }

    wholeComponent = () => {

        return (
            <ScrollView style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 35, marginBottom: 5, fontWeight: 'bold' }}>Cargar reporte</Text>
                <View style={{ paddingBottom: 80 }} style={styles.regularText}>
                    <Text style={styles.reportCategoryTitle}>Momento</Text>
                    <View style={styles.datePickerContainer}>
                        <Picker
                            selectedValue={this.state.selectedDay}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ selectedDay: itemValue }); }}>
                            <Picker.Item label="Día" value="" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                            <Picker.Item label="7" value="7" />
                            <Picker.Item label="8" value="8" />
                            <Picker.Item label="9" value="9" />
                            <Picker.Item label="10" value="10" />
                            <Picker.Item label="11" value="11" />
                            <Picker.Item label="12" value="12" />
                            <Picker.Item label="13" value="13" />
                            <Picker.Item label="14" value="14" />
                            <Picker.Item label="15" value="15" />
                            <Picker.Item label="16" value="16" />
                            <Picker.Item label="17" value="17" />
                            <Picker.Item label="18" value="18" />
                            <Picker.Item label="19" value="19" />
                            <Picker.Item label="20" value="20" />
                            <Picker.Item label="21" value="21" />
                            <Picker.Item label="22" value="22" />
                            <Picker.Item label="23" value="23" />
                            <Picker.Item label="24" value="24" />
                            <Picker.Item label="25" value="25" />
                            <Picker.Item label="26" value="26" />
                            <Picker.Item label="27" value="27" />
                            <Picker.Item label="28" value="28" />
                            <Picker.Item label="29" value="29" />
                            <Picker.Item label="30" value="30" />
                            <Picker.Item label="31" value="31" />
                        </Picker>
                        <Picker
                            selectedValue={this.state.selectedMonth}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ selectedMonth: itemValue }); }}>
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
                            onValueChange={(itemValue, itemIndex) => { this.setState({ selectedYear: itemValue }); }}>
                            <Picker.Item label="Año" value="" />
                            <Picker.Item label="2015" value="2015" />
                            <Picker.Item label="2016" value="2016" />
                            <Picker.Item label="2017" value="2017" />
                            <Picker.Item label="2018" value="2018" />
                            <Picker.Item label="2019" value="2019" />
                            <Picker.Item label="2020" value="2020" />
                        </Picker>
                    </View>
                    <View style={styles.datePickerContainer}>
                        <Picker
                            selectedValue={this.state.selectedHour}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ selectedHour: itemValue }); }}>
                            <Picker.Item label="Hora" value="" />
                            <Picker.Item label="0" value="0" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                            <Picker.Item label="7" value="7" />
                            <Picker.Item label="8" value="8" />
                            <Picker.Item label="9" value="9" />
                            <Picker.Item label="10" value="10" />
                            <Picker.Item label="11" value="11" />
                            <Picker.Item label="12" value="12" />
                        </Picker>
                        <Picker
                            selectedValue={this.state.selectedMinute}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ selectedMinute: itemValue }); }}>
                            <Picker.Item label="Minuto" value="" />
                            <Picker.Item label="0" value="0" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                            <Picker.Item label="7" value="7" />
                            <Picker.Item label="8" value="8" />
                            <Picker.Item label="9" value="9" />
                            <Picker.Item label="10" value="10" />
                            <Picker.Item label="11" value="11" />
                            <Picker.Item label="12" value="12" />
                            <Picker.Item label="13" value="13" />
                            <Picker.Item label="14" value="14" />
                            <Picker.Item label="15" value="15" />
                            <Picker.Item label="16" value="16" />
                            <Picker.Item label="17" value="17" />
                            <Picker.Item label="18" value="18" />
                            <Picker.Item label="19" value="19" />
                            <Picker.Item label="20" value="20" />
                            <Picker.Item label="21" value="21" />
                            <Picker.Item label="22" value="22" />
                            <Picker.Item label="23" value="23" />
                            <Picker.Item label="24" value="24" />
                            <Picker.Item label="25" value="25" />
                            <Picker.Item label="26" value="26" />
                            <Picker.Item label="27" value="27" />
                            <Picker.Item label="28" value="28" />
                            <Picker.Item label="29" value="29" />
                            <Picker.Item label="30" value="30" />
                            <Picker.Item label="31" value="31" />
                            <Picker.Item label="32" value="32" />
                            <Picker.Item label="33" value="33" />
                            <Picker.Item label="34" value="34" />
                            <Picker.Item label="35" value="35" />
                            <Picker.Item label="36" value="36" />
                            <Picker.Item label="37" value="37" />
                            <Picker.Item label="38" value="38" />
                            <Picker.Item label="39" value="39" />
                            <Picker.Item label="40" value="40" />
                            <Picker.Item label="41" value="41" />
                            <Picker.Item label="42" value="42" />
                            <Picker.Item label="43" value="43" />
                            <Picker.Item label="44" value="44" />
                            <Picker.Item label="45" value="45" />
                            <Picker.Item label="46" value="46" />
                            <Picker.Item label="47" value="47" />
                            <Picker.Item label="48" value="48" />
                            <Picker.Item label="49" value="49" />
                            <Picker.Item label="50" value="50" />
                            <Picker.Item label="51" value="51" />
                            <Picker.Item label="52" value="52" />
                            <Picker.Item label="53" value="53" />
                            <Picker.Item label="54" value="54" />
                            <Picker.Item label="55" value="55" />
                            <Picker.Item label="56" value="56" />
                            <Picker.Item label="57" value="57" />
                            <Picker.Item label="58" value="58" />
                            <Picker.Item label="59" value="59" />
                            <Picker.Item label="60" value="60" />
                        </Picker>
                        <Picker
                            selectedValue={this.state.selectedMeridiem}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ selectedMeridiem: itemValue }); }}>
                            <Picker.Item label="Meridiem" value="" />
                            <Picker.Item label="AM" value="AM" />
                            <Picker.Item label="PM" value="PM" />
                        </Picker>
                    </View>
                    <Text style={styles.reportCategoryTitle}>Lugar</Text>
                    <View style={styles.textAreaContainer}>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Avenida</Text>
                            <TextInput onChangeText={(value) => { this.setState({ avenida: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Calle</Text>
                            <TextInput onChangeText={(value) => { this.setState({ calle: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Edificio</Text>
                            <TextInput onChangeText={(value) => { this.setState({ edificio: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Local</Text>
                            <TextInput onChangeText={(value) => { this.setState({ local: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                    </View>
                    <Text style={styles.reportCategoryTitle}>Suceso</Text>
                    <View style={styles.textAreaContainer}>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Descripción</Text>
                            <TextInput onChangeText={(value) => { this.setState({ descripcion: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                    </View>
                    <Text style={styles.reportCategoryTitle}>Víctima</Text>
                    <View style={styles.sexPickerContainer}>
                        <Picker
                            selectedValue={this.state.sexo_victima}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ sexo_victima: itemValue }); }}>
                            <Picker.Item label="Género de la Víctima" value="" />
                            <Picker.Item label="M" value="M" />
                            <Picker.Item label="F" value="F" />
                        </Picker>
                    </View>
                    <View style={styles.textAreaContainer}>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Descripción de la víctima</Text>
                            <TextInput onChangeText={(value) => { this.setState({ descripcion_victima: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                    </View>

                    <View style={styles.delincuentesPickerContainer}>
                        <Picker
                            selectedValue={this.state.edad_victima}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ edad_victima: itemValue }); }}>
                            <Picker.Item label="Edad de la víctima" value="" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                            <Picker.Item label="7" value="7" />
                            <Picker.Item label="8" value="8" />
                            <Picker.Item label="9" value="9" />
                            <Picker.Item label="10" value="10" />
                            <Picker.Item label="11" value="11" />
                            <Picker.Item label="12" value="12" />
                            <Picker.Item label="13" value="13" />
                            <Picker.Item label="14" value="14" />
                            <Picker.Item label="15" value="15" />
                            <Picker.Item label="16" value="16" />
                            <Picker.Item label="17" value="17" />
                            <Picker.Item label="18" value="18" />
                            <Picker.Item label="19" value="19" />
                            <Picker.Item label="20" value="20" />
                            <Picker.Item label="21" value="21" />
                            <Picker.Item label="22" value="22" />
                            <Picker.Item label="23" value="23" />
                            <Picker.Item label="24" value="24" />
                            <Picker.Item label="25" value="25" />
                            <Picker.Item label="26" value="26" />
                            <Picker.Item label="27" value="27" />
                            <Picker.Item label="28" value="28" />
                            <Picker.Item label="29" value="29" />
                            <Picker.Item label="30" value="30" />
                            <Picker.Item label="31" value="31" />
                            <Picker.Item label="32" value="32" />
                            <Picker.Item label="33" value="33" />
                            <Picker.Item label="34" value="34" />
                            <Picker.Item label="35" value="35" />
                            <Picker.Item label="36" value="36" />
                            <Picker.Item label="37" value="37" />
                            <Picker.Item label="38" value="38" />
                            <Picker.Item label="39" value="39" />
                            <Picker.Item label="40" value="40" />
                            <Picker.Item label="41" value="41" />
                            <Picker.Item label="42" value="42" />
                            <Picker.Item label="43" value="43" />
                            <Picker.Item label="44" value="44" />
                            <Picker.Item label="45" value="45" />
                            <Picker.Item label="46" value="46" />
                            <Picker.Item label="47" value="47" />
                            <Picker.Item label="48" value="48" />
                            <Picker.Item label="49" value="49" />
                            <Picker.Item label="50" value="50" />
                            <Picker.Item label="51" value="51" />
                            <Picker.Item label="52" value="52" />
                            <Picker.Item label="53" value="53" />
                            <Picker.Item label="54" value="54" />
                            <Picker.Item label="55" value="55" />
                            <Picker.Item label="56" value="56" />
                            <Picker.Item label="57" value="57" />
                            <Picker.Item label="58" value="58" />
                            <Picker.Item label="59" value="59" />
                            <Picker.Item label="60" value="60" />
                            <Picker.Item label="61" value="61" />
                            <Picker.Item label="62" value="62" />
                            <Picker.Item label="63" value="63" />
                            <Picker.Item label="64" value="64" />
                            <Picker.Item label="65" value="65" />
                            <Picker.Item label="66" value="66" />
                            <Picker.Item label="67" value="67" />
                            <Picker.Item label="68" value="68" />
                            <Picker.Item label="69" value="69" />
                            <Picker.Item label="70" value="70" />
                            <Picker.Item label="71" value="71" />
                            <Picker.Item label="72" value="72" />
                            <Picker.Item label="73" value="73" />
                            <Picker.Item label="74" value="74" />
                            <Picker.Item label="75" value="75" />
                            <Picker.Item label="76" value="76" />
                            <Picker.Item label="77" value="77" />
                            <Picker.Item label="78" value="78" />
                            <Picker.Item label="79" value="79" />
                            <Picker.Item label="80" value="80" />
                            <Picker.Item label="81" value="81" />
                            <Picker.Item label="82" value="82" />
                            <Picker.Item label="83" value="83" />
                            <Picker.Item label="84" value="84" />
                            <Picker.Item label="85" value="85" />
                            <Picker.Item label="86" value="86" />
                            <Picker.Item label="87" value="87" />
                            <Picker.Item label="88" value="88" />
                            <Picker.Item label="89" value="89" />
                            <Picker.Item label="90" value="90" />
                            <Picker.Item label="91" value="91" />
                            <Picker.Item label="92" value="92" />
                            <Picker.Item label="93" value="93" />
                            <Picker.Item label="94" value="94" />
                            <Picker.Item label="95" value="95" />
                            <Picker.Item label="96" value="96" />
                            <Picker.Item label="97" value="97" />
                            <Picker.Item label="98" value="98" />
                            <Picker.Item label="99" value="99" />

                        </Picker>
                    </View>
                    <Text style={styles.reportCategoryTitle}>Delincuentes</Text>
                    <View style={styles.delincuentesPickerContainer}>
                        <Picker
                            selectedValue={this.state.numero_delincuentes}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ numero_delincuentes: itemValue }); }}>
                            <Picker.Item label="Número de delincuentes" value="" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5+" value="5" />
                        </Picker>
                    </View>
                    <View style={styles.textAreaContainer}>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Descripción delincuentes</Text>
                            <TextInput onChangeText={(value) => { this.setState({ descripcion_delincuentes: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                    </View>
                    <Text style={styles.reportCategoryTitle}>Transporte</Text>
                    <View style={styles.textAreaContainer}>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Descripción</Text>
                            <TextInput onChangeText={(value) => { this.setState({ transporte_delincuentes: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                    </View>
                    <Text style={styles.reportCategoryTitle}>Escape</Text>
                    <View style={styles.textAreaContainer}>
                        <View style={styles.textAreaHelper}>
                            <Text style={styles.inputLabel}>Ruta de escape de los delincuentes</Text>
                            <TextInput onChangeText={(value) => { this.setState({ ruta_escape_delincuentes: value }) }}
                                style={styles.fakeTextArea} multiline={true} numberOfLines={4} />
                        </View>
                    </View>
                </View>
                <TouchableWithoutFeedback style={styles.buttonContainer} onPress={() => { this.addReportHandler() }}>
                    <Text style={{ width: screenWidth * 0.6, color: "#fff", marginTop: 30, backgroundColor: "#012133", textAlign: "center", borderRadius: 25, padding: 10, alignSelf: 'center' }}>Avanzar</Text>
                </TouchableWithoutFeedback>
            </ScrollView>
        )
 
    }
    componentDidMount() {
        this.storageData();
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.setState({ isFocused: true }); this.storageData();
            }),
            this.props.navigation.addListener("willBlur", () => { this.setState({ isFocused: false }) })
        ];
    }


    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }


    render() {
        return (
            <View style={styles.container}>
                {this.wholeComponent()}

            </View>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: screenWidth * 0.05,
        paddingRight: screenWidth * 0.05,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 30,
    },
    reportCreatorLabel: {
        fontWeight: 'bold',
        paddingBottom: 30
    },
    regularText: {
        fontSize: 15
    },
    reportCategoryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10
    },
    buttonContainer: {
        width: screenWidth * 0.6,
        marginBottom: 30,
        marginTop: 25
    },
    fakeTextArea: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        width: screenWidth * 0.8,
        height: 100,
        marginTop: 10,
        borderColor: '#000',
        textAlignVertical: 'top'
    },


})
