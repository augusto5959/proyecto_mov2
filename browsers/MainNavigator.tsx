import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '../Screens/Welcome';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import JuegoScreen from '../Screens/JuegoScreen';
import PuntuacionScreen from '../Screens/PuntuacionScreen';





const Stack = createStackNavigator();

function MyStack(){
    return(
        <Stack.Navigator initialRouteName='Welcome'>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Juego" component={JuegoScreen} />
            <Stack.Screen name="Puntuacion" component={PuntuacionScreen} />
           
           
        </Stack.Navigator>
    )
}

export default function MainNavigator(){
    return(
        <NavigationContainer>
            <MyStack/>
        </NavigationContainer>
    )
}
