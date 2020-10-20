import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import { BubblesLoader } from 'react-native-indicator';
import * as Animatable from 'react-native-animatable';

export default class ProfileScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: null,
      isModalVisibleskill: false,
      isModalVisiblereview: false,
      rating: 0.0,
      ratingcount:0.0,
      skills: [],
      reviews: []
    }
  }

  componentDidMount() {

    database()
      .ref('/users/' + auth().currentUser.email.slice(0, -4))
      .on('value', snapshot => {
        
        this.setState({
          skills: snapshot.val()['skills'],
          rating: snapshot.val()['rating'],
          ratingcount:snapshot.val()['ratingcount']
        })
        let newreviews = []
        for(let key in snapshot.val()['review']){
          newreviews.push(snapshot.val()['review'][key]); 
        }
        this.setState({reviews:newreviews});
        console.log('rating  ',this.state.rating)
        console.log('rating count ',this.state.ratingcount)
      });

    this.setloading()
  }


  setloading = () => {
    setTimeout(() => { this.setState({ loading: false }) }, 1000);
  }
  toggleModalskill = () => {
    this.setState({ isModalVisibleskill: !this.state.isModalVisibleskill });
  };

  toggleModalreview = () => {
    this.setState({ isModalVisiblereview: !this.state.isModalVisiblereview });
  };


  showskills = () => {
    return this.state.skills.join(', ')
  }

  showreview = () => {
    for (let key in this.state.reviews) {

    }
  }

  signout = () => {
    this.setState({ loading: true })
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    setTimeout(() => { this.setState({ loading: false }) }, 1500);
  }


  render() {
    // this.readdata()
    const user = auth().currentUser
    switch (this.state.loading) {
      case false:
        return (
          <Animatable.View
            animation='zoomIn'
            duration={600}
            useNativeDriver={true}
            style={styles.container}
          >
            <ImageBackground
              source={require('../assets/HomeBKND.png')}
              resizeMode='stretch'
              style={styles.image2}
              imageStyle={styles.image2_imageStyle}
            >
              <Animatable.View
                animation='flipInX'
                duration={1000}
                useNativeDriver={true}
                style={styles.linearGradient}
              >
                <FontAwesome
                  name="user-circle-o"
                  color='#15223D'
                  size={75}
                />
                <View style={styles.profiledetails}>
                  <Text style={{
                    fontWeight: 'bold',
                    color: '#15223D'
                  }}>{user.email}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  <AirbnbRating
                    count={5}
                    reviews={["Bad", "OK", "Good", "Very Good", "Amazing"]}
                    defaultRating={this.state.rating}
                    size={20}
                    isDisabled={true}
                    reviewSize={0}
                  />
                  <Text style={{color:'#F4B400'}}>{this.state.rating}/5</Text>
                  </View>
                 {this.state.ratingcount == 0? <Text style={{marginTop:10,color:'#CCC'}}>No reviews</Text>:
                 <Text style={{marginTop:10,color:'#0F9D58'}}>({this.state.ratingcount}) reviews</Text>}
                </View>
              </Animatable.View>
            </ImageBackground>
            <Modal
              isVisible={this.state.isModalVisibleskill}
              animationIn={"zoomIn"}
              animationOut={"zoomOut"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >
              <View style={styles.modal}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={this.toggleModalskill}>
                  <Entypo
                    name='circle-with-cross'
                    size={20}
                  />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold' }}>Skills</Text></View>
                <Text style={{ marginTop: 5, fontSize: 15, color: '#15223D' }}>{this.showskills()}</Text>

              </View>
            </Modal>
            <Modal
              isVisible={this.state.isModalVisiblereview}
              animationIn={"zoomIn"}
              animationOut={"zoomOut"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >
              <View style={styles.modal}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={this.toggleModalreview}>
                  <Entypo
                    name='circle-with-cross'
                    size={20}
                  />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold' }}>Review</Text></View>
                <FlatList
                  data={this.state.reviews}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={{
                      borderColor:'#ff7aa2',
                      borderBottomWidth:0.5,
                      padding:15,
                      borderRadius:20

                    }}>
                      <Text style={{fontWeight:'bold',color:'#15223D'}}>@{item.Uname}</Text>
                      <Text style={{marginTop:5}}>{item.review}</Text>
                    </View>
                  )}

                />

              </View>
            </Modal>
            <View style={styles.bottom}>
              <Animatable.View
                animation='fadeInRight'
                duration={1000}
                useNativeDriver={true}
              >
                <TouchableOpacity
                  onPress={this.toggleModalskill}
                  style={styles.about}
                >
                 <FontAwesome5
                  name="users-cog"
                  color='#5a94fc'
                  size={25}
                />
                  <Text style={styles.abouttxt}>
                    Skills
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
              <Animatable.View
                animation='fadeInRight'
                duration={1100}
                useNativeDriver={true}
              >
                <TouchableOpacity
                  onPress={this.toggleModalreview}
                  style={styles.about}
                >
                 <MaterialIcons
                  name="rate-review"
                  color='#FF6666'
                  size={25}
                />
                  <Text style={styles.abouttxt}>
                    Reviews
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
              <Animatable.View
                animation='fadeInRight'
                duration={1200}
                useNativeDriver={true}
              >
                <TouchableOpacity
                  onPress={this.signout}
                  style={styles.about}
                >
                <AntDesign
                  name="logout"
                  color='#DB4437'
                  size={25}
                />
                  <Text style={styles.abouttxt}>
                    LogOut
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            </View>
          </Animatable.View>
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
    flex: 1,
    backgroundColor: '#FFF'
  },
  image2: {
    height:'40%',
    alignItems: 'center'
  },
  image2_imageStyle: {
    height: '30%',
    resizeMode: 'stretch',
  },
  profiledetails: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '95%',
    height: '50%',
    marginTop: '25%',
    borderRadius: 20,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 20,
      width: 20
    },
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 0,
    padding: 10,
  },
  bottom: {
    flex: 1,
    padding: 5,
    backgroundColor: '#FFF',
  },
  about: {
    flexDirection:'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical:15,
    paddingHorizontal:25,
    borderRadius: 20,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',

  },
  abouttxt: {
    marginLeft:15,
    color: '#15223D',
    fontSize: 15,
    fontWeight: 'bold'
  },
  modal: {
    width: '95%',
    borderRadius: 20,
    backgroundColor: '#FFF',
    padding: 15,
  }

})