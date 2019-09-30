import React, { Component } from 'react'
import { Alert, ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, StyleSheet, AsyncStorage } from 'react-native'

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import { connect } from 'react-redux'
import {getProfile} from '../publics/actions/users'
import { login } from '../publics/actions/users'


class Login extends Component {
   static navigationOptions = {
    headerTitleStyle: {
      marginLeft: -25,
      textAlign: 'center', 
      alignSelf:'center', 
      flex: 1, 
      color: theme.colors.primary
    },
    title: "Login",
  }
  constructor(props) {
  super(props)
  this.state = {
    formData: {
      email: '',
      password: ''
    }
    }
  }


  handleChange = (name, value) => {
    let newFormData = {...this.state.formData}
    newFormData[name] = value
    this.setState({
      formData: newFormData
    },()=>{console.log("here:", this.state.formData)})
  }


  handleSubmit = () => {
    const { navigation } = this.props;
    Keyboard.dismiss();

    this.props.dispatch(login(this.state.formData))
      .then(res => {
    AsyncStorage.setItem('token', this.props.users.token)
    this.props.dispatch(getProfile(this.props.users.token)).then(()=>{
    AsyncStorage.setItem('fullname', this.props.users.usersProfile.fullname)
    AsyncStorage.setItem('email', this.props.users.usersProfile.email)
    })
       Alert.alert(
        'Success!',
        'Login Successfully!',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Browse')
            }
          }
        ],
        { cancelable: false }
      )
      })
      .catch(()=>{
       Alert.alert(
        'Failed!',
        'Failed To login, please check your credientials',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Login')
            }
          }
        ],
        { cancelable: false }
      )
      })
      
  }
  render() {
    const { navigation } = this.props;

   
    return (
      <KeyboardAvoidingView style={styles.login} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}> 
          <Block middle>
          <Image style={{justifyContent: 'center', alignSelf: 'center', width: 150, height: 150}} source={require('../assets/images/illustration_2.png')} />
            <Input
              label="Email"
              value={this.state.formData.email}
              style={styles.input}
              onChangeText={text => this.handleChange( 'email', text )}
            />
            <Input
              secure
              label="Password"
              value={this.state.formData.password}
              style={styles.input}
              onChangeText={text => this.handleChange( 'password', text )}
            />
            <Button gradient onPress={() => this.handleSubmit()}>
               {this.props.users.isLoading ?
                <ActivityIndicator size="small" color="white" /> : 
                <Text bold white center>Login</Text>
              }
            </Button>

            <Button onPress={() => navigation.navigate('SignUp')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Dont have an account? click here to sign up
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}


const mapStateToProps = state => {
  return{
    users: state.users
  }
}

export default connect(mapStateToProps)(Login)


const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
