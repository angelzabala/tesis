import React from 'react';
import Navigator from './routes/homeStack';
import { AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';


export default class App extends React.Component {
	
	render(){
		return (
			<NavigationContainer>
				<Navigator />
			</NavigationContainer>
		)
	}
}

