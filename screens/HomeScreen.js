import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,

} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { BubblesLoader } from 'react-native-indicator';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width

const Colums = 2;
// item size
const ITEM_HEIGHT = 120;
const ITEM_MARGIN = 20;

export default class HomeSreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: null,
      catgories: []
    }
  }

  componentDidMount() {
    database()
      .ref('/Categories')
      .on('value', snapshot => {
        var data = []
        for (let key in snapshot.val()) {
          data.push(snapshot.val()[key])
        }
        this.setState({ catgories: data.slice(1) })
      });
    setTimeout(() => { this.setState({ loading: false }) }, 1500);
  }

  sout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  render() {
    switch (this.state.loading) {
      case false:
        return (
          <View style={{ backgroundColor: '#FFF'}}>
            <Animatable.View
              animation='fadeInDown'
              duration={1000}
            >
              <View style={styles.topview}>
                <Text style={styles.header}>Explore Projects</Text>
                <Image />
              </View>
            </Animatable.View>
            <Animatable.View
              animation='bounceInUp'
              duration={1000}
              style={{ height:'92%' ,backgroundColor: '#FFF' }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={this.state.catgories}
                keyExtractor={item => item.title}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('ProjectListingScreen',{CategoryName:String(item.title)})}
                  >
                    <View style={styles.container}>
                      <Image style={styles.photo} source={{ uri: item.url }} />
                      <Text style={styles.title}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <View style={{height:'10%'}}></View>
            </Animatable.View>
            
          </View>
        )
      default:
        return <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }} >
          <BubblesLoader color='#7d86f8' />
        </View>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginLeft: ITEM_MARGIN,
    marginTop: 20,
    width: (SCREEN_WIDTH - (Colums + 1) * ITEM_MARGIN) / Colums,
    height: ITEM_HEIGHT + 75,
    borderRadius: 15,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 20,
      width: 20
    },
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 0,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#15223D',
    borderColor: '#ff7aa2',
    borderTopWidth: 0.5,
    paddingTop: 10,
    paddingHorizontal: 15

  },
  topview: {
    backgroundColor: '#7d86f8',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 10,
    shadowColor: "rgb(125, 134, 248)",
    shadowOffset: {
      height: 20,
      width: 20
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  header: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',

  }
});