import {createStackNavigator} from '@react-navigation/stack';
import ScreenA from "./ScreenA";
import ScreenB from "./ScreenB";
import ScreenC from "./ScreenC";
import ScreenD from "./ScreenD";
import ScreenE from './ScreenE';
import BookDetailScreen from './BookDetailScreen';
import GetAllUser from './GetAllUser';
import GetAllCart from './GetAllCart';
import GetAllCarousel from './GetAllCarousel';



import AdminDashboard from './AdminDashboard';
import AdminCustom from './AdminCustom';
import { useSelector } from 'react-redux';
import CardAndCarousel from './CardAndCarousel';


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
const AdminStackScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.user);

  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="admin"
        component={AdminDashboard}
        options={{
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Book App"
              username={user?.username}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ScreenA"
        component={ScreenA}
        options={{ headerShown: true,
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Book App"
              username={user?.username}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ScreenB"
        component={ScreenB}
        options={{
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Screen B"
              username={user?.username}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ScreenC"
        component={ScreenC}
        options={{
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Screen C"
              username={user?.username}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ScreenD"
        component={ScreenD}
        options={{
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Screen D"
              username={user?.username}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ScreenE"
        component={ScreenE}
        options={{
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Screen E"
              username={user?.username}
            />
          ),
        }}
      />
        <Stack.Screen
        name="BookDetailScreen"
        component={BookDetailScreen}
        options={{
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Book Details"
              username={user?.username}
            />
          ),
        }}
      />
      <Stack.Screen
        name="user"
        component={GetAllUser}
        options={{ headerShown: true,
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Book App"
              username={user?.username}
            />
          ),
        }}
      />
      <Stack.Screen
        name="card"
        component={GetAllCart}
        options={{ headerShown: true,
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Book App"
              username={user?.username}
            />
          ),
        }}
      />
      <Stack.Screen
        name="carousel"
        component={GetAllCarousel}
        options={{ headerShown: true,
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Book App"
              username={user?.username}
            />
          ),
        }}
      />

      <Stack.Screen
        name="cardAndCarousel"
        component={CardAndCarousel}
        options={{ headerShown: true,
          header: () => (
            <AdminCustom
              navigation={navigation}
              title="Book App"
              username={user?.username}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminStackScreen