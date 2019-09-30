import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Browse from '../screens/Browse';
import Product from '../screens/Product';
import Settings from '../screens/Settings';
import CreateProduct from '../screens/CreateProduct';
import EditProduct from '../screens/EditProduct';
import Category from '../screens/Category';
import LoadingScreen from '../screens/LoadingScreen'

import { theme } from '../constants';

const screens = createStackNavigator({
  Browse,
  Product,
  Settings,
  CreateProduct,
  EditProduct,
  Category,
}, {
  defaultNavigationOptions: {
    headerStyle: {
      marginLeft: -20,
      height: theme.sizes.base * 3,
      backgroundColor: theme.colors.white, // or 'white
      elevation: 3, // for android
    },
    headerTitleStyle: {textAlign: 'center', alignSelf:'center', flex: 1, color: theme.colors.primary},
    headerTintColor: theme.colors.gray,
    headerBackTitle: null,
    headerLeftContainerStyle: {
      alignItems: 'center',
      marginLeft: theme.sizes.base * 2,
      paddingRight: theme.sizes.base,
    },
    headerRightContainerStyle: {
      alignItems: 'center',
      paddingRight: theme.sizes.base,
    },
  }
});

const auth = createStackNavigator({
  Welcome,
  Login,
  SignUp,
}, {
  defaultNavigationOptions: {
    headerStyle: {
      marginLeft: -20,
      height: theme.sizes.base * 3,
      backgroundColor: theme.colors.white, // or 'white
      elevation: 3, // for android
    },
    headerTitleStyle: {textAlign: 'center', alignSelf:'center', flex: 1, color: theme.colors.primary},
    headerTintColor: theme.colors.gray,
    headerBackTitle: null,
    headerLeftContainerStyle: {
      alignItems: 'center',
      marginLeft: theme.sizes.base * 2,
      paddingRight: theme.sizes.base,
    },
    headerRightContainerStyle: {
      alignItems: 'center',
      paddingRight: theme.sizes.base,
    },
  }
});

const AuthNavigator = createSwitchNavigator(
  {
    LoadingScreen,
    auth,
    screens,
  },
  {
    initialRouteName: 'LoadingScreen',
  }
)

export default createAppContainer(AuthNavigator);