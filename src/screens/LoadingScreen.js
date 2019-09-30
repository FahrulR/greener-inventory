import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, AsyncStorage } from 'react-native';

const LoadingScreen = props => {

	useEffect(() => {
		AsyncStorage.getItem('token')
			.then(value => {
				if (value.length > 0) {
					props.navigation.navigate('Browse');
				}
			})
			.catch(() => props.navigation.navigate('Welcome'))
	}, [])

	return(
		<View>
			<Text>Loading.....</Text>
		</View>
	)
}

export default LoadingScreen;