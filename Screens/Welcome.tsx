import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function Welcome() {
	return (
		<View>
			<Text>Welcome</Text>
            <Button title='Login'/>
            <Button title='Register'/>
		</View>
	);
}

const styles = StyleSheet.create({});
