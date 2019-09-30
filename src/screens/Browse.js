import React, { Component } from 'react'
import { Picker, Animated, Dimensions, Image, ActivityIndicator, StyleSheet, ScrollView, View, TouchableOpacity, AsyncStorage } from 'react-native'
import * as Icon from '@expo/vector-icons';

import { NavigationEvents } from 'react-navigation'
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Input, Badge, Button, Block, Text, Divider } from '../components';
import { theme, mocks } from '../constants';
import {connect} from 'react-redux'
import {getProducts} from '../publics/actions/products'
import {getProfile} from '../publics/actions/users'
import { debounce } from 'lodash'


const { width, height } = Dimensions.get('window');

class Browse extends Component {
  static navigationOptions = {
    title: 'Products',
    headerLeft: null,
  };

   constructor(props){
    super(props)
    this.state = {
      searchFocus: new Animated.Value(0.6),
      searchString: '',
      active: 'Products',
      categories: [],
      data: [],
      sort: 'Sort'
    }
  }

  handleOnNavigateBack = (foo) => {
  this.setState({
    foo
  })
  }

  page = (page) => {
    this.getDataProducts(this.state.page + page)
  }

  getData = async (page) => {
    await this.setState({ categories: this.props.categories });

    this.props.dispatch(getProducts(page, this.props.sortby, this.props.searchString))
    .then(res =>{
    this.setState({
      data: this.props.products.productList,
      page: page
    })
    })
  }

  getDataSort = async (sort) => {
    await this.setState({ categories: this.props.categories });
    this.props.dispatch(getProducts(page=1, sort))
    .then(res =>{
    this.setState({
      data: this.props.products.productList,
      page: page
    })
    })
  }

  getDataSearch = debounce((search) => {
    this.setState({ categories: this.props.categories });
    this.props.dispatch(getProducts(page=1, sortby=null, search))
    .then(res =>{
    this.setState({
      data: this.props.products.productList,
      page: page
    })
    })
  }, 1000);

  componentDidMount = () => {
    this.getData(1);
  }

   handleSearchFocus(status) {
    Animated.timing(
      this.state.searchFocus,
      {
        toValue: status ? 0.9 : 0.6, // status === true, increase flex size
        duration: 150, // ms
      }
    ).start();
  }


  renderSearch() {
    const { searchString, searchFocus } = this.state;
    const isEditing = searchFocus && searchString;

    return (

         // onValueChange={value => {
         //      this.setState({...this.state, sort: value});
         //        this.getDataSort(value);
         //      }
      <Block animated middle flex={searchFocus} style={styles.search}>
        <Input
          placeholder="Search..."
          placeholderTextColor={theme.colors.gray2}
          style={styles.searchInput}
          onFocus={() => this.handleSearchFocus(true)}
          onBlur={() => this.handleSearchFocus(false)}
          value={searchString}
          onRightPress={() => isEditing ? this.setState({ searchString: null }) : null}
          onChangeText={value => {
            this.setState({...this.state, searchString: value });
            this.getDataSearch(value);
          }}
          rightStyle={styles.searchRight}
          rightLabel={
            <Icon.FontAwesome
              name={isEditing ? "close" : "search"}
              size={theme.sizes.base / 1.2}
              color={theme.colors.gray2}
              style={styles.searchIcon}
            />
          }
        />
      </Block>
    )
  }

  renderFooter() {
    const { navigation } = this.props;
    return (
      <Block style={styles.footer} >
        <Button onPress={() => navigation.navigate('Category')} gradient style={{ width: width / 2.678 }}>
          <Text bold white center>Categories</Text>
        </Button>
      </Block >
    )
  }


  render() {
    const { profile, navigation } = this.props;
    const { categories } = this.state;
    const tabs = ['Products'];

    return (

      <Block>

        <Block flex={false} row style={styles.tabs}>

           <Picker
            style={{marginTop: 8, height: 50, width: 50, flex:1}}
            selectedValue={this.state.sort}
            onValueChange={value => {
              this.setState({...this.state, sort: value});
                this.getDataSort(value);
              }
            }>   
            <Picker.Item label="Sort" />
            <Picker.Item label="Name asc" value="name asc" key="nameasc" />
            <Picker.Item label="Name desc" value="name desc" key="namedesc" />
            <Picker.Item label="Stocks asc" value="quantity asc" key="stocksasc" />
            <Picker.Item label="Stocks desc" value="quantity desc" key="stocksdesc" />
            </Picker>
          <Button onPress={() => navigation.navigate('CreateProduct')} style={{justifyContent:'center', alignSelf: 'center', width: width / 2.678,backgroundColor: theme.colors.secondary}}>
          <Text white center style={{fontSize:16}}>Add Product</Text>
        </Button>

        </Block>
        <Block flex={false} row center space="between" style={styles.header}>
          {this.renderSearch()}
           
          <Button onPress={() => navigation.navigate('Settings')}>
            <Image
              source={profile.avatar}
              style={styles.avatar}
            />
          </Button>
        </Block>


         {this.props.products.isRejected ?  
           <View><Image source={{uri: 'https://cdn.dribbble.com/users/734476/screenshots/4020070/artboard_15.png'}} style={{width: '50%', height: '50%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}/><Text h2 bold center>Not Found</Text></View>
          : this.props.products.isLoading ?
          <ActivityIndicator size="large" color="light-green" />
          :
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{ 
          backgroundColor: 'rgba(100, 255, 187, 0.06)', paddingVertical: theme.sizes.base * 2}}
           >
            <NavigationEvents onDidFocus={() => this.getData()} />  
          <Block flex={false} row space="between" style={styles.categories}>
          <React.Fragment>
            
            {this.props.products.productList.map((products, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => navigation.navigate('Product', { id: products.id, onNavigateBack: this.handleOnNavigateBack })}>
                <Card center middle shadow style={styles.category} >
                  <Badge margin={[0, 0, 15]} size={50}>
                       {/*source={require('../assets/icon.png')}*/}
                  <Image 
                  source={require('../assets/icon.png')}
                  style={{position: 'relative', top: 0, left: 0, width: 50, height: 50}}
                  />                      
                  <Image 
                  source={{uri: products.image}}
                  style={{position: 'absolute', top: 0, left: 0, width: 50, height: 50}}
                  />

                  </Badge>
                  <Text medium height={20} center>{products.name.length > 25 ? products.name.substr(0,25)+'...' : products.name}</Text>
                  <Text gray caption>Stocks: {products.quantity} pcs</Text>
                </Card>
              </TouchableOpacity>
            ))}
            </React.Fragment>
          </Block>
           <Divider margin={[theme.sizes.padding * 0.5, 0.5]} />
        </ScrollView>
         }
         {this.renderFooter()}
      </Block>
    )
  }
  
}

Browse.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
}

const mapStateToProps = state => {
  console.log('here')
  return{
    products: state.products,
    users: state.users
  }
}

export default connect(mapStateToProps)(Browse)

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.05,
    width,
    paddingBottom: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  tabs: {
    marginTop: 0,
    borderColor: theme.colors.gray2,
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  searchInput: {
    fontSize: theme.sizes.base,
    height: theme.sizes.base * 3,
    backgroundColor: 'rgba(242, 242, 247, 0.06)',
    borderColor: theme.colors.black,
    paddingLeft: theme.sizes.base / 1.333,
    paddingRight: theme.sizes.base * 1.5,
  },
  searchRight: {
    top: 0,
    marginVertical: 0,
    backgroundColor: 'transparent'
  },
  searchIcon: {
    position: 'absolute',
    right: theme.sizes.base / 1.333,
    top: theme.sizes.base,
  },
  search: {
    height: theme.sizes.base * 2,
    width: width - theme.sizes.base * 2,
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  }
})
