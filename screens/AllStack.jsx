import {createStackNavigator} from '@react-navigation/stack';


import ScreenA from "./ScreenA";
import ScreenB from "./ScreenB";
import ScreenC from "./ScreenC";
import ScreenD from "./ScreenD";
import ScreenClass from "./ScreenClass";
import ScreenClassSingle from "./ScreenClassSingle";
import ScreenE from "./ScreenE";
import BookViewScreen from "./BookViewScreen";
import PdfViewerScreen from "./PDFViewerScreen";
import HomeScreen from "./HomeScreen";


const Stack = createStackNavigator();


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

// Stack Navigator
const AllStack = () => (
  <Stack.Navigator screenOptions={stackHeaderOptions}>
    <Stack.Screen
      name="home"
      component={HomeScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen name="ScreenClass" component={ScreenClass} />
    <Stack.Screen name="ScreenClassSingle" component={ScreenClassSingle} />
    <Stack.Screen name="BookViewScreen" component={BookViewScreen} />
    <Stack.Screen name="PdfViewerScreen" component={PdfViewerScreen} />
  </Stack.Navigator>
);

export default AllStack