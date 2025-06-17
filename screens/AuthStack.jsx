import LoginScreen from "./Login";
import RegisterScreen from "./Register";
import {createStackNavigator} from '@react-navigation/stack';


const Stack = createStackNavigator();



// Stack Header Options
const stackHeaderOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: '#1abc9c',
    elevation: 4,
    shadowOpacity: 0.2,
    height: 60,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    color: '#fff',
  },
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={stackHeaderOptions}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default AuthStack