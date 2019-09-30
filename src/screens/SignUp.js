import React, { Component } from 'react';
import { Alert, ImageBackground, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import {register} from '../publics/actions/users'

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

class SignUp extends Component {
  static navigationOptions = {
    headerTitleStyle: {
      marginLeft: -25,
      textAlign: 'center', 
      alignSelf:'center', 
      flex: 1, 
      color: theme.colors.primary
    },
    title: "Sign Up",
  }
   constructor(props) {
  super(props)
  this.state = {
    formData: {}
    }
  }


   handleChange = (name, value) => {
    let newFormData = {...this.state.formData}
    newFormData[name] = value
    this.setState({
      formData: newFormData
    },()=>{console.log(this.state.formData)})
  }

  handleSubmit = () => {
    const { navigation } = this.props;
    Keyboard.dismiss();

    this.props.dispatch(register(this.state.formData))
      .then(res => {
       Alert.alert(
        'Success!',
        'Your account has been created',
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
      .catch(()=>{
       Alert.alert(
        'Failed!',
        this.props.users.errMessage,
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('SignUp')
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
     
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
         <Block padding={[0, theme.sizes.base * 2]}>          
          <Block middle>
            <Input
              label="Username"
              style={styles.input}
              onChangeText={text => this.handleChange( 'username', text )}
            />
            <Input
              label="Fullname"
              style={styles.input}
              onChangeText={text => this.handleChange( 'fullname', text )}
            />
            <Input
              email
              label="Email"
              style={styles.input}
              onChangeText={text => this.handleChange( 'email', text )}
            />
            <Input
              secure
              label="Password"
              style={styles.input}
              onChangeText={text => this.handleChange( 'password', text )}
            />
            <Button gradient onPress={() => this.handleSubmit()}>
              {this.props.users.isLoading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Sign Up</Text>
              }
            </Button>

            <Button onPress={() => navigation.navigate('Login')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Back to Login
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

export default connect(mapStateToProps)(SignUp)


const styles = StyleSheet.create({
  signup: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})
