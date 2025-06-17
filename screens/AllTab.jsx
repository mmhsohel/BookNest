
import { useSelector } from "react-redux";
import CustomHeader from "./CustomHeader";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

import ScreenD from "./ScreenD";
import ScreenE from "./ScreenE";
import AllStack from "./AllStack";

const Tab = createBottomTabNavigator();


const AllTab = ({navigation}) => {
  const user = useSelector(state => state.auth.user);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        header: () => (
          <CustomHeader
            navigation={navigation}
            title="Book App"
            username={user?.username}
          />
        ),
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#00b377', //'#1abc9c',
          height: 60,

          elevation: 10,
          shadowColor: '#000',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ecf0f1',
        tabBarIcon: ({focused, color}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ScreenD':
              iconName = focused ? 'apps' : 'apps-outline';
              break;
            case 'ScreenE':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={AllStack} />
      <Tab.Screen name="ScreenD" component={ScreenD} />
      <Tab.Screen name="ScreenE" component={ScreenE} />
    </Tab.Navigator>
  );
};


export default AllTab