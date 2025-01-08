import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '../Screens/Welcome';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import JuegoScreen from '../Screens/JuegoScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PuntuacionScreen from '../Screens/PuntuacionScreen';
import DesarrolladoresScreen from '../Screens/DesarrolladoresScreen';

const Stack = createStackNavigator();
const Button = createBottomTabNavigator();

function MyStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name='Welcome' component={Welcome} />
			<Stack.Screen name='Login' component={LoginScreen} />
			<Stack.Screen name='Register' component={RegisterScreen} />
		</Stack.Navigator>
	);
}

function MyBottom() {
	return (
		<Button.Navigator>
			<Button.Screen name='Juego' component={JuegoScreen} />
			<Button.Screen name='Puntuación' component={PuntuacionScreen} />
            <Button.Screen name='Desarrolladores' component={DesarrolladoresScreen} />
		</Button.Navigator>
	);
}

export default function MainNavigator() {
	return (
		<NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='MyStack' component={MyStack} />
                <Stack.Screen name='MyButton' component={MyBottom} />
            </Stack.Navigator>
		</NavigationContainer>
	);
}