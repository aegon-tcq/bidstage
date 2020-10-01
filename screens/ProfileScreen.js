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
import Icon from 'react-native-vector-icons/Entypo';
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
      rating: null,
      skills: [],
      reviews: null
    }
  }

  componentDidMount() {

    database()
      .ref('/users/' + auth().currentUser.email.slice(0, -4))
      .on('value', snapshot => {
        console.log('User data: ', snapshot.val());
        this.setState({
          reviews: snapshot.val()['review'],
          skills: snapshot.val()['skills'],
          rating: snapshot.val()['rating']
        })
        console.log('skills', this.state.skills)
        console.log('review ', this.state.reviews)
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
            style={styles.container}
          >            
            <ImageBackground
              source={require('../assets/ProfileBackground.png')}
              resizeMode='stretch'
              style={styles.image2}
              imageStyle={styles.image2_imageStyle}
            >
              <Animatable.View
              animation='flipInX'
                duration={1000}
                style={styles.linearGradient}
              >
                  <FontAwesome
                    name="user-circle-o"
                    color='#FF3E89'
                    size={100}
                  />
                  <View style={styles.profiledetails}>
                    <Text style={{
                      fontWeight: 'bold',
                      color: '#15223D'
                    }}>{user.email}</Text>
                    <AirbnbRating
                      count={5}
                      reviews={["Bad", "OK", "Good", "Very Good", "Amazing"]}
                      defaultRating={this.state.rating}
                      size={20}
                      isDisabled={true}
                      reviewSize={0}
                    />
                  </View>
              </Animatable.View>
            </ImageBackground>
            <Modal
              isVisible={this.state.isModalVisibleskill}
              animationIn={"zoomIn"}
              animationOut={"zoomOut"}
              style={{ alignItems: 'center' }}
            >
              <View style={styles.modal}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={this.toggleModalskill}>
                  <Icon
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
              style={{ alignItems: 'center' }}
            >
              <View style={styles.modal}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={this.toggleModalreview}>
                  <Icon
                    name='circle-with-cross'
                    size={20}
                  />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold' }}>Review</Text></View>
                <FlatList 
                  data={this.state.reviews}
                  renderItem={({ item }) => (
                      <View style={styles.container}>
                        <Text style={styles.title}>{item.title}</Text>
                      </View>
                  )}
                
                />

              </View>
            </Modal>
            <View style={styles.bottom}>
              <Animatable.View
                animation='fadeInRight'
                duration={1000}
              >
                <TouchableOpacity
                  onPress={this.toggleModalskill}
                  style={styles.about}
                >
                  <Text style={styles.abouttxt}>
                    Skills
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
              <Animatable.View
                animation='fadeInRight'
                duration={1100}
              >
                <TouchableOpacity
                  onPress={this.toggleModalreview}
                  style={styles.about}
                >
                  <Text style={styles.abouttxt}>
                    Reviews
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
              <Animatable.View
                animation='fadeInRight'
                duration={1200}
              >
                <TouchableOpacity
                  onPress={this.signout}
                  style={styles.about}
                >
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
    flex: 1,
    alignItems: 'center',
  },
  image2_imageStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.5,
    resizeMode: 'stretch',
  },
  profiledetails: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#152238',
  },
  linearGradient: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '90%',
    height: '50%',
    marginTop: '40%',
    borderRadius: 20,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 20,
      width: 20
    },
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 0,
    padding: 10
  },
  bottom: {
    flex: 1,
    padding: 5,
    backgroundColor: '#FFF',
  },
  about: {
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
    borderRadius: 20,
    borderBottomWidth: 0.5,
    borderColor: '#e0e7e9'

  },
  abouttxt: {
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