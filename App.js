import React from 'react';
import Navigator from './routes/homeStack';

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

