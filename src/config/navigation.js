import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';

import Home from '../screen/home';
// import About from '../screen/about';

const Stack = createStackNavigator();

function AppNavigation() {
    return (
      <NavigationContainer>
   <Stack.Navigator
 screenOptions={{
  headerShown: false
}}
   >

          <Stack.Screen name="Todo" component={Home} />
          {/* <Stack.Screen name="about" component={About} /> */}

   </Stack.Navigator>
        
      </NavigationContainer>
    );
  }
  





  export default AppNavigation;