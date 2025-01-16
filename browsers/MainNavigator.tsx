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
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function MyTabNavigator({ route }: { route: any }) {
    const { email } = route.params; 

    return (
        <Tab.Navigator initialRouteName='Juego' screenOptions={({route})=>({
            tabBarIcon:()=>{
                let iconName = '';
                switch(route.name){
                    case 'Juego':{
                        iconName = 'game-controller';
                        break;
                    }
                    case 'Puntuacion':{
                        iconName = 'trophy';
                        break;
                    }
                    case 'Perfil':{
                        iconName = 'person';
                        break;
                    }
                }
                return <Icon name={iconName} size={24} color="black"/>
            }
        })}>
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
