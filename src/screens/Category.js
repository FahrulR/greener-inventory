import React, { Component } from 'react'
import { Alert, Picker, Animated, Dimensions, Image, ActivityIndicator, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native'
import Dialog from 'react-native-dialog'
import * as Icon from '@expo/vector-icons';

import { NavigationEvents } from 'react-navigation'
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Input, Badge, Button, Block, Text, Divider } from '../components';
import { theme, mocks } from '../constants';
import {connect} from 'react-redux'
import {getCategory, addCategory, deleteCategory, editCategory} from '../publics/actions/category'


const { width, height } = Dimensions.get('window');

class Category extends Component {
  static navigationOptions = {
    title: 'Category',
    headerLeft: null,
  };
   constructor(props){
    super(props)
    this.state = {
      active: 'Add Category',
      categories: [],
      data: [],
      formData:{
        name: '',
      },
      id: '',
      dialogVisible: false,
      dialogVisibleEdit: false,
    }
  }

  handleChange = (name, value) => {
  let newFormData = {...this.formData}
  newFormData[name] = value
  this.setState({
    formData: newFormData
  })
    }

  showDialog = () => {
    this.setState({ dialogVisible: true, dialogVisibleEdit: true });
  };
 
  handleAct = (id,name) => {
    const { navigation } = this.props;
    this.setState({
      id,
      formData: {name: name}
    })
    Alert.alert(
  'Action',
  'What are you gonna do ?',
  [
    {text: 'Cancel', onPress: () => console.log('cancelled')},
    {
      text: 'Edit',
      onPress: () => this.handleEdit(id),
    },
    {text: 'Delete', onPress:() => this.handleDelete(id)},
  ],
  {cancelable: false},
 );
  }

  handleDelete = (id) => {
    const { navigation } = this.props;
    Alert.alert(
    'Delete Confirmation',
    'Are you sure want to delete this Category?',
    [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'Yes', onPress: () => this.props.dispatch(deleteCategory(id))
      .then(() => {
        Alert.alert(
        'Success!',
        'Success delete Category',
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
        'Cannot delete a foreign key',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Category', )
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

  handleCancel = () => {
    this.setState({ dialogVisible: false, dialogVisibleEdit: false });
  };
 
  handleAdd = () => {
    this.setState({ dialogVisible: true})
  }

  handleEdit = () => {
    this.setState({ dialogVisibleEdit: true})
  }

  // handleDelete = () => {
  //   // The user has pressed the "Delete" button, so here you can do your own logic.
  //   // ...Your logic
  //   this.setState({ dialogVisible: false });
  // };

  handleAdded = async () => {
      const {navigation} = this.props
        await this.props.dispatch(addCategory(this.state.formData))
        .then(() => {
        Alert.alert(
        'Success!',
        'Your Category has been created',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Browse')
            }
          }
        ],
        { cancelable: false }
      )

        this.setState({
          dialogVisible: false
        })
      })

    }

  handleEdited = async () => {
      const {navigation} = this.props
        await this.props.dispatch(editCategory(this.state.id, this.state.formData))
        .then(() => {
        Alert.alert(
        'Success!',
        'Your Category has been Edited',
        [
          {
            text: 'Continue', onPress: () => {
              navigation.navigate('Browse')
            }
          }
        ],
        { cancelable: false }
      )

        this.setState({
          dialogVisibleEdit: false
        })
      })

    }

  getData = () => {
    this.setState({ categories: this.props.categories });
    this.props.dispatch(getCategory())
    .then(res =>{
    this.setState({
      data: this.props.category.categoryList
    })
    })
  }

  componentDidMount = () => {
    this.getData();
    
  }

  handleTab = tab => {
    const { categories } = this.props;
    const filtered = categories.filter(
      category => category.tags.includes(tab.toLowerCase())
    );

    this.setState({ active: tab, categories: filtered });
  }

 renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;
    const { navigation } = this.props;

    return (
      <Block key={this.state.active} style={{marginTop: 10}}>
      <TouchableOpacity onPress={this.handleAdd}
        key={this.state.active}
        style={[
          styles.tab,
          isActive ? styles.active : null
        ]}
      >
        <Text center size={16} medium secondary={!isActive} secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
        </Block>
    )
  }

  renderFooter() {
    const { navigation } = this.props;
    return (
      <LinearGradient
        locations={[0.5, 2]}
        style={styles.footer}
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)']}
      >
        <Button onPress={() => navigation.navigate('Browse')} gradient style={{ width: width / 2.678 }}>
          <Text bold white center>Products</Text>
        </Button>
      </LinearGradient>
    )
  }


  render() {
    const { profile, navigation } = this.props;
    const { categories } = this.state;
    const tabs = ['Add Category'];
    return (

      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Button onPress={() => navigation.navigate('Settings')}>
            <Image
              source={profile.avatar}
              style={styles.avatar}
            />
          </Button>
        </Block>

        <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block>
        {
        this.props.category.isLoading ?
       <ActivityIndicator size="large" color="light-green" />
          :
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{ 
          backgroundColor: 'rgba(100, 255, 187, 0.06)', paddingVertical: theme.sizes.base * 2}}
           >
          <Block flex={false} row space="between" style={styles.categories}>

            { this.props.category.categoryList.length !== 0 ? this.props.category.categoryList.map((category, i) => (
              <TouchableOpacity
                key={category.id}
                onPress={this.handleAct.bind(this,category.id,category.name)}>
                <Card center middle shadow style={styles.category} >
                  <Badge margin={[0, 0, 15]} size={50}>
                       {/*source={require('../assets/icon.png')}*/}
                  <Image 
                  source={require('../assets/icons/plants2x.png')}
                  style={{width: 20, height: 20}}
                  />                      
                  </Badge>
                  <Text medium height={20} center>{category.name.length > 20 ? category.name.substr(0,20)+'...' : category.name}</Text>
                </Card>
              </TouchableOpacity>
            ))
            :<View><Text>Loading...</Text></View>
            }
          </Block>
           <Divider margin={[theme.sizes.padding * 0.5, 0.5]} />
        </ScrollView>
         }
         {this.renderFooter()}
         <View>
      <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Add Category</Dialog.Title>
          <Dialog.Input style={{borderBottomColor: theme.colors.gray2, borderBottomWidth: 1}} onChangeText={text => this.handleChange( 'name', text )} placeholder="Category name......">
          </Dialog.Input>
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          <Dialog.Button label="Add Category" onPress={this.handleAdded} />
        </Dialog.Container>
        </View>
        <View>
      <Dialog.Container visible={this.state.dialogVisibleEdit}>
          <Dialog.Title>Edit Category</Dialog.Title>
          <Dialog.Input style={{borderBottomColor: theme.colors.gray2, borderBottomWidth: 1}} value ={this.state.formData.name} onChangeText={text => this.handleChange( 'name', text )}>
          </Dialog.Input>
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          <Dialog.Button label="Edit Category" onPress={this.handleEdited} />
        </Dialog.Container>
        </View>
      </Block>

    )
  }
  
}

Category.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
}

const mapStateToProps = state => {
  console.log('here')
  return{
    category: state.category
  }
}

export default connect(mapStateToProps)(Category)

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignSelf: 'center',
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
    marginTop: -30,
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  searchInput: {
    fontSize: theme.sizes.caption,
    height: theme.sizes.base * 2,
    backgroundColor: 'rgba(142, 142, 147, 0.56)',
    borderColor: 'rgba(142, 142, 147, 0.06)',
    paddingLeft: theme.sizes.base / 1.333,
    paddingRight: theme.sizes.base * 1.5,
  },
  searchRight: {
    top: 0,
    marginVertical: 0,
    backgroundColor: 'transparent'
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2
  },
  searchIcon: {
    position: 'absolute',
    right: theme.sizes.base / 1.333,
    top: theme.sizes.base / 1.6,
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
