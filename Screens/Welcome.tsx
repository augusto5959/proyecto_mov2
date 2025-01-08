import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function Welcome({navigation}: any) { 
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Button 
                title="Login" 
				onPress={() => navigation.navigate('Login')}
            />
            <Button 
                title="Register"
				onPress={() => navigation.navigate('Register')} 
                
            />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});
