import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from '../Screens/Welcome';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import JuegoScreen from '../Screens/JuegoScreen';
import PuntuacionScreen from '../Screens/PuntuacionScreen';
import PerfilScreen from '../Screens/PerfilScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function MyTabNavigator({ route }: { route: any }) {
    const { email } = route.params; // Recibe el correo del usuario desde los parámetros de navegación

    return (
        <Tab.Navigator>
            <Tab.Screen name="Juego" component={JuegoScreen} initialParams={{ email }} />
            <Tab.Screen name="Puntuacion" component={PuntuacionScreen} initialParams={{ email }} />
            <Tab.Screen name="Perfil" component={PerfilScreen} initialParams={{ email }} />

        </Tab.Navigator>



    );
}


function MyStack() {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />


            <Stack.Screen
                name="MainTabs"
                component={MyTabNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
