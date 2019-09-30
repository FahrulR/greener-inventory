import React, { Component } from 'react';
import { View, Dimensions, Image, FlatList, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Icon from '@expo/vector-icons';
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient';
import {connect} from 'react-redux'
import {deleteProduct, getProductById, addProductQTY, reduceProductQTY} from '../publics/actions/products'

import { Button, Divider, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';

const { width, height } = Dimensions.get('window');

class Product extends Component {
  static navigationOptions = {
    headerTitleStyle: {
      marginLeft: -25,
      textAlign: 'center', 
      alignSelf:'center', 
      flex: 1, 
      color: theme.colors.primary
    },
    title: 'Detail Product',
  }

  constructor(props){
    super(props)
    console.log(props)
    this.state = {
      productData: '',
    }
  }

  getProductData = async () => {
    const productid = this.props.navigation.getParam('id', 7)
    console.log("~~~~~~~~~~~~~~~~~~~~~~~HERE IS IT BOYS:",productid)
    this.props.dispatch(getProductById(productid))
      .then(()=>{
        const productData = this.props.products.productList.find((products)=>{return Number(products.id) === Number(productid)})
        if(productData !== undefined){
          this.setState({productData}
          )
        }else{
          Alert.alert(
        'Failed!',
        'something',
        [
          {
            text: 'Continue', onPress: () => {
                
            }
          }
        ],
        { cancelable: false }
      )
        }
      })
      .catch(err => {
        console.error(err)
        this.props.navigation.navigate('Browse')
      })
  }

  componentDidMount = async () => {
      await this.getProductData()
  }


  handleDelete = () => {
    const { navigation } = this.props;
    const productid = navigation.getParam('id', 7)
    Alert.alert(
    'Delete Confirmation',
    'Are you sure want to delete this product?',
    [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'Yes', onPress: () => this.props.dispatch(deleteProduct(productid))
      .then(() => {
        Alert.alert(
        'Success!',
        'Success delete product',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Browse')
            }
          }
        ],
        { cancelable: false }
      )
    }).catch(()=>{
         Alert.alert(
        'Failed!',
        'Failed to Delete',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Product', )
            }
          }
        ],
        { cancelable: false }
      )
      })},
  ],
  {cancelable: false},
);
  }


   addProductQuantity = () => {
    const { navigation } = this.props;
    const productid = navigation.getParam('id', 7)
    this.props.dispatch(addProductQTY(productid))
        .then(res => {
        Alert.alert(
        'Success!',
        'Success add quantity',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Browse')
            }
          }
        ],
        { cancelable: false }
      )
    }).catch(()=>{
         Alert.alert(
        'Failed!',
        'Failed to add',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Product', )
            }
          }
        ],
        { cancelable: false }
      )
      })
    
  }

  reduceProductQuantity = e => {
    const { navigation } = this.props;
    const productid = navigation.getParam('id', 7)
    this.props.dispatch(reduceProductQTY(productid))
        .then(res => {
        Alert.alert(
        'Success!',
        'Success reduce quantity',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Browse')
            }
          }
        ],
        { cancelable: false }
      )
    }).catch(()=>{
         Alert.alert(
        'Failed!',
        'Quantity cant be less than 0',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Product')
            }
          }
        ],
        { cancelable: false }
      )
      })
  }

  renderFooter() {
    const { navigation } = this.props;
    const { productData } = this.state;
    const productid = navigation.getParam('id', 7)
    return (
      <LinearGradient
        locations={[0.5, 2]}
        style={{marginTop: -30, flexDirection: 'row', justifyContent:'center'}}
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)']}
      >
        <Button onPress={() => navigation.navigate('EditProduct', {data: productData})} style={{ width: width / 2.678, marginRight: 20 }}>
          <Text caption bold white style={styles.tagplus}>
                Edit Product
              </Text>
        </Button>
        <Button onPress={()=> this.handleDelete()} style={{ width: width / 2.678 }}>
          <Text caption bold white style={styles.tagminus}>
                Delete Product
              </Text>
        </Button>
      </LinearGradient>
    )
  }


  render() {
    const { productData } = this.state;
    const { product } = this.props;

     if(productData === undefined){
      console.log(this.state)
      return (
        <ActivityIndicator size="large" color="black" />
      )
    } else if (productData === null){
      console.log(this.state)
      return (
        <Text>Product empty</Text>
      )
    } else {

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
       <Image
            source={require('../assets/icon.png')}
            resizeMode="contain"
            style={{ position: 'relative', top: 0, left: 0, width, height: height / 2.8 }}
          />
      <Image
            source={{uri: productData.image}}
            resizeMode="contain"
            style={{ position: 'absolute', top: 0, left: 0, width, height: height / 2.8 }}
          />
        <Block style={styles.product}>
          <Text h2 bold>{productData.name}</Text>
          <Block flex={false} row margin={[theme.sizes.base, 0]}>
              <Text key={productData.category} caption gray style={styles.tag}>
                {productData.category}
              </Text>
          </Block>
          <Divider margin={[theme.sizes.padding * 0.5, 0.5]} />
          <Text gray light height={22}>{productData.description}</Text>
          
          <Divider margin={[theme.sizes.padding * 0.5, 0]} />
            <Block style={{justifyContent: 'center'}} center flex={false} row margin={[theme.sizes.base, 0]}>
            <TouchableOpacity onPress={()=> this.reduceProductQuantity()}>
            <Text caption black style={styles.tag}>
                -
              </Text>
              </TouchableOpacity>
              <Text key={productData.quantity} caption gray style={styles.tag}>
                {productData.quantity} pcs
              </Text>
              <TouchableOpacity onPress={()=> this.addProductQuantity()}>
              <Text caption black style={styles.tag}>
                +
              </Text>
              </TouchableOpacity>
              </Block>
              <Divider margin={[theme.sizes.padding * 0.5, 0]} />
        </Block>
        <View style={{marginBottom: 5}}>
 {this.renderFooter()}
 </View>
      </ScrollView>

    )
  }
}
}

Product.defaultProps = {
  product: mocks.products[0],
}

const mapStateToProps = (state) => {
  return{
    products: state.products
  }
}

export default connect(mapStateToProps)(Product)

const styles = StyleSheet.create({
  product: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingVertical: theme.sizes.padding,
  },
  tag: {
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625,
  },
  tagplus: {
    borderColor: theme.colors.secondary,
    textAlign: 'center',
    backgroundColor: theme.colors.secondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625,
  },
  tagminus: {
    borderColor: theme.colors.accent,
    textAlign: 'center',
    backgroundColor: theme.colors.accent,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625,
  },
  image: {
    width: 150,
    height: width / 3.26,
    marginRight: theme.sizes.base,
  },
  more: {
    width: 55,
    height: 55,
  }
})
