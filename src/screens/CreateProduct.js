import React, {useState, useEffect} from 'react'
import { TouchableOpacity, View, Alert, ImageBackground, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Picker } from 'react-native';
import axios from 'axios'
import {URL} from '../config'

import { Button, Block, Input, Text, Divider } from '../components';
import { theme } from '../constants';

const CreateProduct = props => {

   const [categoryList, setcategoryList] = useState([])
   const [formData, setFormData] = useState({
        name: '',
        description:'',
        image:'',
        id_category:'',
        quantity:''
   })

  const handleChange = (name, value) => {
  let newFormData = {...formData}
  newFormData[name] = value
  setFormData(newFormData)
    }

 const handleSubmit = () => {
    const { navigation } = props;
    Keyboard.dismiss();

        // const token = localStorage.getItem('token')
        axios.post(`${URL}/products`, formData)
         .then(res => {
        Alert.alert(
        'Success!',
        'Your product has been created',
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
    }

 useEffect(() => {
        axios.get(`${URL}/category`)
        .then(response => setcategoryList(response.data.data))
    }, []);

    const { navigation } = props;
    const isEnabled = formData.name.length > 0 && formData.description.length > 0 && formData.image.length > 0 && formData.quantity.length > 0 ;
    return (
     
      <KeyboardAvoidingView style={styles.create} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>          
          <Block middle>
            <Input
              label="Name"
              style={styles.input}
              onChangeText={text => handleChange( 'name', text )}
            />
            <Input
              label="Description"
              style={styles.input}
              onChangeText={text => handleChange( 'description', text )}
            />
            <Input
              label="Image"
              style={styles.input}
              onChangeText={text => handleChange( 'image', text )}
            />
            <Text gray>Category </Text>
           <Picker
            style={{marginLeft:-10, height: 50, width: 300}}
            selectedValue={formData.id_category}
            onValueChange={value => setFormData({...formData, id_category: value})
            }
            >
            <Picker.Item label="Select Category"></Picker.Item>
            {categoryList.length !== 0 ? categoryList.map((category, i) => {
            return <Picker.Item itemStyle={{ backgroundColor: "gray"}} label={category.name}value={category.id} key={i}></Picker.Item>
            })
            : <Picker.Item label="Loading..."></Picker.Item>
            }
            </Picker>
            <View
              style={{
                borderBottomColor: theme.colors.gray2,
                borderBottomWidth: 1,
              }}
            />
            <Input
              number
              label="Quantity"
              style={styles.input}
              onChangeText={number => handleChange( 'quantity', number )}
            />
            <Button disabled={!isEnabled} gradient onPress={() => handleSubmit()}>
                <Text bold white center>Submit</Text>
              
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>

    )
  }
  CreateProduct.navigationOptions = {
    headerTitleStyle: {
      marginLeft: -25,
      textAlign: 'center', 
      alignSelf:'center', 
      flex: 1, 
      color: theme.colors.secondary
    },
    title: 'Create Product',
  }

export default CreateProduct;

const styles = StyleSheet.create({
  create: {
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
