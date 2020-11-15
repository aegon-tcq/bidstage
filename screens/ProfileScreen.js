import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MultiSelect from 'react-native-multiple-select';
import Icon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const Profilesection1 = (props) => {
  return <LinearGradient
    colors={['#F8CDDA', '#1D2B64']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      marginTop: 15,
      marginLeft: '2.5%',
      width: '95%',
      borderRadius: 20,
      padding: 15,
      justifyContent: 'space-evenly',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.41,
      shadowRadius: 9.11,

      elevation: 14,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
      <Image
        source={require('../assets/profile.png')}
        style={{
          height: 100,
          width: 100,
          borderRadius: 50
        }}
      />
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#FFF' }}>{props.name}</Text>
        <Text style={{ fontSize: 12, color: '#FFF' }}>{props.gmail}</Text>
      </View>
    </View>
    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
      <View style={{
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',

      }}>
        <Image
          source={require('../assets/star.png')}
          style={{ height: 50, width: 50 }}
        />
        <View style={{ marginLeft: 5, alignItems: 'center' }}>
          <Text style={{ color: '#07b99d', fontSize: 12 }}>{props.rating}</Text>
          <Text style={{ color: '#07b99d', fontSize: 12 }}>Rating</Text>
        </View>
      </View>
      <View style={{
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
      }}>
        <Image
          source={require('../assets/review.png')}
          style={{ height: 45, width: 45 }}
        />
        <View style={{ marginLeft: 5, alignItems: 'center' }}>
          <Text style={{ color: '#ffdc00', fontSize: 12 }}>{props.ratingcount}</Text>
          <Text style={{ color: '#fd6000', fontSize: 12 }}>reviews</Text>
        </View>
      </View>

    </View>
    <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
      <Text style={{ color: '#F0F2F0', fontSize: 12 }}>
        {props.description}
      </Text>
    </View>
  </LinearGradient>
}

const Profilesection3 = (props) => {
  return <LinearGradient
    colors={['#fbc7d4', '#9796f0']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      marginLeft: '2.5%',
      width: '95%',
      borderRadius: 20,
      padding: 15,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.41,
      shadowRadius: 9.11,

      elevation: 14,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
      <Image
        source={require('../assets/contact-book.png')}
        style={{ height: 45, width: 45 }}
      />
      <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Contact Information</Text>
    </View>
    <View style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
      <Image
        source={require('../assets/phone-call.png')}
        style={{ height: 30, width: 30 }}
      />
      <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>+91{props.phone}</Text>
    </View>
    <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
      <Image
        source={require('../assets/message.png')}
        style={{ height: 30, width: 30 }}
      />
      <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>{props.gmail}</Text>
    </View>
  </LinearGradient>
}

const HeaderComponent = (props) => {
  return (
    <LinearGradient
      colors={props.color}
      style={{
        height: 100,
        width: '100%',
        justifyContent: 'center',
        padding: 20,
        borderBottomLeftRadius: 30

      }}
      start={{ x: 0.7, y: 0 }}
    >
      <Text style={{
        color: '#FFF'
      }}>{props.data}</Text>
    </LinearGradient>

  );
}


export default class ProfileScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: null,
      isModalVisibleskill: false,
      isModalVisiblereview: false,
      ismyprojectmodalvisible: false,
      projectdetailmodal: false,
      name: '',
      rating: 0.0,
      ratingcount: 0.0,
      reviews: [],
      phone: '',
      cnameuid: [],
      myprojects: [],
      projectdetail: {},

      //state variable for update project
      updateprojectmodal: false,
      useremail: '',
      title: '',
      description: '',
      budget: '',
      location: '',
      prefrences: '',
      catname: '',
      uid: '',
      updatingprojectloading: false,
      postingtick: false,

      //state variable for skills
      updatingskill: false,
      selectedItems: [],
      skills: [],
      myskills: []

    }
  }

  componentDidMount() {
    let s = []
    database()
      .ref('/Skills')
      .once('value')
      .then(function (snapshot) {
        for (let k in snapshot.val()) {
          s.push(snapshot.val()[k])
        }

      }).then(() => {
        this.setState({ skills: s })
        console.log('skill', s)
      })
      .then(
        () => {
          database()
            .ref('/users/' + auth().currentUser.email.slice(0, -4))
            .on('value', snapshot => {
              this.setState({
                phone: snapshot.val()['phoneno'],
                name: snapshot.val()['name'],
                rating: snapshot.val()['rating'],
                cnameuid: snapshot.val()['myprojects'],
                ratingcount: snapshot.val()['ratingcount']
              })
              if (!(typeof snapshot.val()['skills'] === 'undefined')) {
                this.setState({ selectedItems: snapshot.val()['skills'] })
              }
              let newreviews = []
              for (let key in snapshot.val()['review']) {
                newreviews.push(snapshot.val()['review'][key]);
              }
              console.log(this.state.cnameuid)
              this.setState({ reviews: newreviews });
              console.log(this.state.reviews)
              if (typeof snapshot.val()['myprojects'] === 'undefined') {
                this.setState({ loading: false })
              }
              else {
                this.getmyprojects()

              }

            });

        }
      )


  }

  toggleModalskill = () => {
    this.setState({ isModalVisibleskill: !this.state.isModalVisibleskill });
  };

  toggleModalreview = () => {
    this.setState({ isModalVisiblereview: !this.state.isModalVisiblereview });
  };

  togglemodalmyproject = () => {
    this.setState({ ismyprojectmodalvisible: !this.state.ismyprojectmodalvisible });
  };

  togglemodalmyprojectdetailmodal = () => {
    this.setState({ projectdetailmodal: !this.state.projectdetailmodal });
  };

  toggleupdateprojectmodal = () => {
    this.setState({ updateprojectmodal: !this.state.updateprojectmodal })
  }
  showskills = () => {
    return this.state.skills.join(', ')
  }

  getmyprojects = () => {

    let pr = []
    for (let key in this.state.cnameuid) {
      firestore().collection('ProjectDetails').doc('Categories').collection(this.state.cnameuid[key]['CategoryName'] + '').where("Uid", "==", this.state.cnameuid[key]['Uid']).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            pr.push(doc.data())
          });
        }).then(() => this.setState({ myprojects: pr, loading: false }))
        .catch((e) => console.log('error project', e))
    }


  }

  getmyprojectsdetail = (item) => {
    this.setState({ projectdetail: item, projectdetailmodal: true })
  }

  signout = () => {
    this.setState({ loading: true })
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    setTimeout(() => { this.setState({ loading: false }) }, 1500);
  }

  inputtitle = (val) => {
    if (val.length >= 5 && val.length <= 30) {
      this.setState({ title: val })
    } else {
      this.setState({ title: '' })
    }
  }
  inputdescription = (val) => {
    if (val.length >= 50) {
      this.setState({ description: val })
    } else {
      this.setState({ description: '' })
    }
  }
  inputbudget = (val) => {
    if (val.length > 2) {
      this.setState({ budget: val })
    } else {
      this.setState({ budget: '' })
    }
  }
  inputlocation = (val) => {
    if (val.length >= 5) {
      this.setState({ location: val })
    } else {
      this.setState({ location: '' })
    }
  }
  inputprefrences = (val) => {
    this.setState({ prefrences: val })
  }
  onselectedcategory = selectedcategory => {
    console.log(selectedcategory)
    this.setState({ selectedcategory });
  };

  editmyproject = (item) => {
    this.setState({
      title: item.Title,
      budget: item.Budget,
      prefrences: item.Prefrences,
      description: item.Description,
      location: item.Location,
      uid: item.Uid,
      updateprojectmodal: true
    })


  }

  postupdateprojectdetail = () => {
    this.setState({ updatingprojectloading: true })
    let cname = ''
    let docid = ''
    for (let key in this.state.cnameuid) {
      if (this.state.cnameuid[key]['Uid'] === this.state.uid) {
        cname = this.state.cnameuid[key]['CategoryName']
        console.log(cname)
      }
    }



    firestore().collection('ProjectDetails').doc('Categories').collection(cname + '').where("Uid", "==", this.state.uid).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          docid = doc.id
          console.log(docid)
        })
      })
      .then(() => {
        console.log(docid, 'updating')
        firestore().collection('ProjectDetails').doc('Categories').collection(cname + '').doc(docid + '').update({
          Title: this.state.title,
          Budget: this.state.budget,
          Location: this.state.location,
          Prefrences: this.state.prefrences,
          Description: this.state.description
        })
      }
      )
      .then(() => {

        this.setState({
          updatingprojectloading: false,
          updateprojectmodal: false,
          projectdetailmodal: false,
          ismyprojectmodalvisible: false,
          postingtick: true
        })
        this.getmyprojects()
      })
      .then(() => this.tick())
  }

  tick = () => {
    setTimeout(() => this.setState({ postingtick: false }), 400)
  }

  onSelectedItemsChange = selectedItems => {

    this.setState({ selectedItems });
  };

  onsaveskills = () => {

    this.setState({ updatingskill: true })
    let res = database().ref('/users/' + auth().currentUser.email.slice(0, -4)).update({
      skills: this.state.selectedItems
    })
    setTimeout(() => this.setState({ updatingskill: false, postingtick: true }), 1000)
    setTimeout(() => this.setState({ postingtick: false }), 4000)

  }
  
  datetimecalc = (itemdate) => {
    let today = (new Date()).getTime();
    return Math.round((today - itemdate)/(1000*3600*24) );
  }
  render() {
    const user = auth().currentUser
    const { selectedItems } = this.state;
    switch (this.state.loading) {
      case false:
        return (
          <Animatable.View
            animation='zoomIn'
            duration={600}
            useNativeDriver={true}
            style={styles.container}
          >
            <View style={styles.topview}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
              >
                <MaterialCommunityIcons
                  name='arrow-left'
                  size={25}
                  color='#15223D'
                />
              </TouchableOpacity>
              <Text style={{
                fontSize: 18,
                color: '#7d86f8',
                fontWeight: 'bold',
              }}>Profile Detail</Text>
              <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/profile.png')} />
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >

              <Profilesection1
                name={this.state.name}
                rating={this.state.rating}
                reviews={this.state.ratingcount}
                gmail={auth().currentUser.email}
                description={'The definition of a description is a statement that gives details about someone or something. An example of description is a story about the places visited on a family trip. noun.'}
              />
              <Profilesection3
                phone={this.state.phone}
                gmail={auth().currentUser.email}
              />

              <LinearGradient
                colors={['#FFF', '#FFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  marginTop: 15,
                  marginLeft: '2.5%',
                  width: '95%',
                  borderRadius: 20,
                  padding: 15,
                  justifyContent: 'space-evenly',
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,

                  elevation: 14,
                  marginBottom: '25%'
                }}
              >
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:10}}>
                  <Image
                    source={require('../assets/icons8-consultation-100.png')}
                    style={{ height: 40, width: 40 }}
                  />
                  <Text style={{ color: '#01579b', marginLeft: 10, fontSize: 20 }} >Other settings</Text>

                </View>
                <Animatable.View
                  animation='fadeInRight'
                  duration={1000}
                  useNativeDriver={true}
                >
                  <TouchableOpacity
                    onPress={this.toggleModalskill}
                    style={styles.about}
                  >
                    <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/001-experience.png')} />
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
                    <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/review.png')} />

                    <Text style={styles.abouttxt}>
                      Reviews
                  </Text>
                  </TouchableOpacity>
                </Animatable.View>
                <Animatable.View
                  animation='fadeInRight'
                  duration={1100}
                  useNativeDriver={true}
                >
                  <TouchableOpacity
                    onPress={this.togglemodalmyproject}
                    style={styles.about}
                  >
                    <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/resume.png')} />
                    <Text style={styles.abouttxt}>
                      MyProjects
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
                    style={[styles.about, { borderColor: '#FFF' }]}
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
              </LinearGradient>

            </ScrollView>



            {/***************************************Skill Modal***********************************************/}


            <Modal
              isVisible={this.state.isModalVisibleskill}
              animationIn={"zoomIn"}
              animationOut={"zoomOut"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <View style={styles.topview}>
                  <TouchableOpacity
                    onPress={() => this.toggleModalskill()}
                  >
                    <MaterialCommunityIcons
                      name='arrow-left'
                      size={25}
                      color='#15223D'
                    />
                  </TouchableOpacity>
                  <Text style={{
                    fontSize: 18,
                    color: '#7d86f8',
                    fontWeight: 'bold',
                  }}>My Skills</Text>
                  <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/001-experience.png')} />
                </View>

                <Animatable.View
                  animation='bounceInUp'
                  duration={1500}
                  useNativeDriver={true}
                  style={[styles.list, { padding: 15, marginTop: 20 }]}
                >
                  <ScrollView>
                    <View style={{ flex: 1, marginTop: 10 }}>
                      <Text style={[styles.text_footer, {
                        marginTop: 10,
                        marginBottom: 10
                      }]}>Edit Skills</Text>
                      <MultiSelect
                        hideTags={false}
                        items={this.state.skills}
                        uniqueKey="name"
                        ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={selectedItems}
                        selectText="Select skills"
                        searchInputPlaceholderText="Search skills..."
                        onChangeInput={(text) => console.log('below', text)}
                        altFontFamily="ProximaNova-Light"
                        tagRemoveIconColor="#15223D"
                        tagBorderColor="#15223D"
                        tagTextColor="#ff7aa2"
                        selectedItemTextColor="#0F9D58"
                        selectedItemIconColor="#0F9D58"
                        itemTextColor="#CCC"
                        displayKey="name"
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonColor="#0F9D58"
                        submitButtonText="Submit"
                      />
                    </View>
                  </ScrollView>


                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderColor: '#5a94fc',
                      borderWidth: 1,
                      borderRadius: 20,
                      width: '40%',
                      marginLeft: '30%',
                      alignItems: 'center'
                    }}
                    onPress={() => this.onsaveskills()}
                  >
                    {this.state.updatingskill ? <ActivityIndicator size='small' color='#5a94fc' /> :
                      <Text style={{ color: '#5a94fc', fontWeight: 'bold' }} >Save</Text>}
                  </TouchableOpacity>

                </Animatable.View>


              </View>
            </Modal>

            {/***************************************Review Modal***********************************************/}

            <Modal
              isVisible={this.state.isModalVisiblereview}
              animationIn={"zoomIn"}
              animationOut={"zoomOut"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <View style={styles.topview}>
                  <TouchableOpacity
                    onPress={() => this.toggleModalreview()}
                  >
                    <MaterialCommunityIcons
                      name='arrow-left'
                      size={25}
                      color='#15223D'
                    />
                  </TouchableOpacity>
                  <Text style={{
                    fontSize: 18,
                    color: '#7d86f8',
                    fontWeight: 'bold',
                  }}>My Reviews</Text>
                  <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/review.png')} />
                </View>

                {this.state.reviews.length === 0 ?
                  <Animatable.View
                    animation='bounceInUp'
                    duration={1500}
                    useNativeDriver={true}
                    style={styles.list}
                  >
                    <View style={{ height: '80%', backgroundColor: '#FFF', marginTop: 20 }}>
                      <LottieView source={require('../assets/no-review.json')} autoPlay />
                    </View>
                    <Text style={{ fontWeight: 'bold', marginLeft: '20%', color: '#CCC' }}>No reviews yet.</Text>
                  </Animatable.View> :
                  <Animatable.View
                    animation='bounceInUp'
                    duration={1500}
                    useNativeDriver={true}
                    style={styles.list}
                  >
                    <FlatList
                      data={this.state.reviews}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <View style={{
                          borderColor: '#ff7aa2',
                          borderBottomWidth: 0.5,
                          padding: 15,
                          borderRadius: 20

                        }}>
                          <Text style={{ fontWeight: 'bold', color: '#15223D' }}>@{item.Uname}</Text>
                          <Text style={{ marginTop: 5 }}>{item.review}</Text>
                        </View>
                      )}

                    />
                  </Animatable.View>}
              </View>
            </Modal>

            {/***************************************Myproject Modal***********************************************/}


            <Modal
              isVisible={this.state.ismyprojectmodalvisible}
              animationIn={"fadeInUpBig"}
              animationOut={"fadeOutRightBig"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >

              <View style={{
                flex: 1, backgroundColor: '#FFF'
              }}>

                <View style={styles.topview}>
                  <TouchableOpacity
                    onPress={() => this.togglemodalmyproject()}
                  >
                    <MaterialCommunityIcons
                      name='arrow-left'
                      size={25}
                      color='#15223D'
                    />
                  </TouchableOpacity>
                  <Text style={{
                    fontSize: 18,
                    color: '#7d86f8',
                    fontWeight: 'bold',
                  }}>My Projects</Text>
                  <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/resume.png')} />
                </View>
                {this.state.myprojects.length === 0 ?
                  <Animatable.View
                    animation='bounceInUp'
                    duration={1500}
                    useNativeDriver={true}
                    style={styles.list}
                  >
                    <View style={{ height: '80%', backgroundColor: '#FFF', marginTop: 20 }}>
                      <LottieView source={require('../assets/no-review.json')} autoPlay />
                    </View>
                    <Text style={{ fontWeight: 'bold', marginLeft: '20%', color: '#CCC' }}>No Projects has been posted</Text>
                  </Animatable.View>
                  :
                  <Animatable.View
                    animation='bounceInUp'
                    duration={1500}
                    useNativeDriver={true}
                    style={styles.list}
                  >
                    <FlatList
                      vertical
                      showsVerticalScrollIndicator={false}
                      data={this.state.myprojects}
                      keyExtractor={item => item.Uid.toString()}
                      renderItem={({ item }) => (
                        <Animatable.View
                    animation='bounceInUp'
                    duration={600}
                    style={styles.projectView}
                  >
                    <ImageBackground
                      source={require('../assets/prbkcg.png')}
                      resizeMode='stretch'
                      style={{ flex: 1, padding: 10 }}
                      imageStyle={{ borderRadius: 20, height: '80%' }}
                    >
                      <View style={{
                        flexDirection: 'row',
                        padding: 5,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }} >
                        <Image style={styles.icon} source={{ uri: item.IconUrl }} />
                        <View>
                          <Text style={{ color: '#1d3557', fontWeight: 'bold' }}>{item.Title.slice(0, 15)}...</Text>
                          <View style={{
                            flexDirection: 'row', alignItems: 'center', marginTop: 5
                          }}>
                            <Icon
                              name='location'
                              size={15}
                              color='#ff498a'
                            />
                            <Text style={{ color: '#cddbf9', marginLeft: 5 }} >{item.Location.slice(0, 10)}...</Text>
                          </View>
                        </View>
                        <View style={{ padding: 5, backgroundColor: '#7d86f8', borderRadius: 10 }}>
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>{item.Budget}Rs</Text>
                        </View>
                      </View>
                      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                        {this.datetimecalc(item.Date) == 0 ?
                          <Text style={{ marginLeft: 15, color: '#35307d', fontWeight: 'bold', fontSize: 12 }}>Today</Text> :
                          <Text style={{ marginLeft: 10, color: '#35307d', fontWeight: 'bold', fontSize: 12 }}>{this.datetimecalc(item.Date)} Day-ago</Text>}
                        <LinearGradient
                          colors={['#ffb198', '#ff8892', '#ff498a']}
                          style={{
                            borderRadius: 15,
                            width: '30%',

                          }}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                        >
                          <TouchableOpacity
                            style={{ width: '100%', padding: 10, borderRadius: 15, alignItems: 'center' }}
                            onPress={() => this.getmyprojectsdetail(item)}
                          >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Details</Text>
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>

                    </ImageBackground>
                  </Animatable.View>
                      )}
                    />
                  </Animatable.View>}
              </View>
            </Modal>

            {/***************************************Myprojectdetail Modal***********************************************/}


            <Modal
              isVisible={this.state.projectdetailmodal}
              animationIn={"fadeInRightBig"}
              animationOut={"fadeOutRightBig"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              <View style={{flex:1,backgroundColor:'#FFF'}}>
              <View style={styles.topview}>
                <TouchableOpacity
                  onPress={this.togglemodalmyprojectdetailmodal}
                >
                  <MaterialCommunityIcons
                    name='arrow-left'
                    size={25}
                    color='#15223D'
                  />
                </TouchableOpacity>
                <Text style={styles.header}>Work Details</Text>
                <Image style={{ height: 30, width: 30, borderRadius: 15 }}  source={require('../assets/legal.png')} />
              </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                <View style={{ alignItems: 'center', padding: 10, borderColor: '#ff7aa2', borderBottomWidth: 0.5, borderRadius: 30, marginTop: 20 }}>
                    <Image  source={{ uri: this.state.projectdetail['IconUrl'] }} style={styles.icon} />
                  </View>
                  <View style={styles.section}>
                      <Image
                        source={require('../assets/002-title.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Title   :  </Text>
                      <Text style={{ color: '#a0caeb', marginLeft: 10 }}>{this.state.projectdetail['Title']}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/003-money-bag.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Budget   :  </Text>
                      <Text style={{ color: '#fc9454', marginLeft: 10, fontWeight: 'bold' }}>{this.state.projectdetail['Budget']}Rs</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/001-google-maps.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Location   :  </Text>
                      <Text style={{ color: '#ffda2d', marginLeft: 10, fontWeight: 'bold' }}>{this.state.projectdetail['Location']}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/001-experience.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Prefrences   :  </Text>
                      <Text style={{ color: '#a09eef', marginLeft: 10, fontWeight: 'bold' }}>{this.state.projectdetail['Prefrences']}</Text>
                    </View>
                    <View style={[styles.section, { flexDirection: 'column' }]}>
                      <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <Image
                          source={require('../assets/004-floppy-disk.png')}
                          style={{ height: 20, width: 20 }}
                        />
                        <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Description  : </Text>
                      </View>    
                        <Text style={{ color: '#7f95b8',marginTop:10 ,marginLeft: 10}}>{this.state.projectdetail['Description']}</Text>
                    </View>
                  <View style={styles.section}>
                      <Image
                        source={require('../assets/004-id-1.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >ProjectId   :  </Text>
                      <Text style={{ color: '#a0caeb', marginLeft: 10 }}>{this.state.projectdetail['Uid']}</Text>
                    </View>
                </ScrollView>
                <TouchableOpacity
                  style={[styles.button, { borderColor:'#74c69d',borderWidth:1, marginLeft: '30%', marginBottom: 10 }]}
                  onPress={() => this.editmyproject(this.state.projectdetail)}
                >
                  <Text style={{ color: '#74c69d', fontWeight: 'bold', fontSize: 15 }}>Edit</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            {/*******************************************************************************************/}


            <Modal
              isVisible={this.state.postingtick}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >

              <LottieView source={require('../assets/tick-green.json')} autoPlay loop={false} />
              <Text style={{ fontWeight: 'bold', color: '#FFF', marginTop: 150 }}>Sucessfully Updated</Text>
            </Modal>

            <Modal
              isVisible={this.state.updateprojectmodal}
              animationIn={"fadeInUpBig"}
              animationOut={"fadeOutRightBig"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              {this.state.updatingprojectloading ?
                <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                  <LottieView source={require('../assets/writing.json')} autoPlay />
                </View> :
                <View style={{flex:1,backgroundColor:'#FFF'}}>
                <View style={styles.topview}>
                <TouchableOpacity
                  onPress={this.toggleupdateprojectmodal}
                >
                  <MaterialCommunityIcons
                    name='arrow-left'
                    size={25}
                    color='#15223D'
                  />
                </TouchableOpacity>
                <Text style={styles.header}>Work Details</Text>
                <Image style={{ height: 30, width: 30, borderRadius: 15 }}  source={require('../assets/legal.png')} />
              </View>
                  <ScrollView showsVerticalScrollIndicator={false}
                  style={{padding:15}}>
                    <Text style={styles.text_footer}>Title</Text>
                    <View style={styles.action}>
                      <MaterialCommunityIcons
                        name="subtitles-outline"
                        color="#4285F4"
                        size={20}
                      />
                      <TextInput
                        placeholder="Enter the title"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={this.inputtitle}
                        value={this.state.title}
                      />
                      {this.state.title.length >= 5 && this.state.title.length <= 30 ?
                        <Animatable.View
                          animation="bounceIn"
                        >
                          <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                          />
                        </Animatable.View>
                        : null}
                    </View>
                    <Text style={styles.text_footer}>Budget</Text>
                    <View style={styles.action}>
                      <FontAwesome
                        name="rupee"
                        color="#0F9D58"
                        size={20}
                      />
                      <TextInput
                        placeholder="Enter the price in (RS)"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={this.inputbudget}
                        value={this.state.budget}
                      />
                      {this.state.budget.length > 2 ?
                        <Animatable.View
                          animation="bounceIn"
                        >
                          <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                          />
                        </Animatable.View>
                        : null}
                    </View>
                    <Text style={styles.text_footer}>Location</Text>
                    <View style={styles.action}>
                      <Icon
                        name="location"
                        color="#C71610"
                        size={20}
                      />
                      <TextInput
                        placeholder="Enter the Work location"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={this.inputlocation}
                        value={this.state.location}
                      />
                      {this.state.location.length >= 10 ?
                        <Animatable.View
                          animation="bounceIn"
                        >
                          <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                          />
                        </Animatable.View>
                        : null}
                    </View>
                    <Text style={styles.text_footer}>Prefrence</Text>
                    <View style={styles.action}>
                      <Icon
                        name="pin"
                        color="#4285F4"
                        size={20}
                      />
                      <TextInput
                        placeholder="Enter the skill/knowledge worker should have(Optional)"
                        style={styles.textInput}
                        multiline={true}
                        numberOfLines={2}
                        autoCapitalize="none"
                        onChangeText={this.inputprefrences}
                        value={this.state.prefrences}
                      />

                    </View>
                    <Text style={styles.text_footer}>Description</Text>
                    <View style={styles.action}>
                      <Icon
                        name="text-document"
                        color="#15223D"
                        size={20}
                      />
                      <TextInput
                        placeholder="Describe your work.."
                        multiline={true}
                        numberOfLines={2}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={this.inputdescription}
                        value={this.state.description}
                      />
                      {this.state.description.length >= 50 ?
                        <Animatable.View
                          animation="bounceIn"
                        >
                          <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                          />
                        </Animatable.View>
                        : null}
                    </View>
                    <TouchableOpacity
                      style={[styles.button,{borderColor:'#f84382',borderWidth:1, marginLeft: '30%', marginBottom: 10}]}
                      onPress={this.postupdateprojectdetail}
                    >
                      <Text style={{ color: "#f84382", fontWeight: "bold" }}>Update</Text>
                    </TouchableOpacity>
                  </ScrollView>

                </View>}
            </Modal>



          </Animatable.View>
        )
      default:
        return <LottieView source={require('../assets/Profile.json')} autoPlay loop />
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  list: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20
  },
  topview: {
    backgroundColor: '#FFF',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 50,
    padding: 15,
    flexDirection: 'row',
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
    fontSize: 18,
    color: '#7d86f8',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7d86f8'
  },
  image2: {
    height: '40%',
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
    borderTopLeftRadius: 50,
    borderWidth: 1,
    padding: 10,
  },
  bottom: {
    width: '50%',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  about: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  abouttxt: {
    marginLeft: 15,
    color: '#15223D',
    fontSize: 15,
    fontWeight: 'bold'
  },
  modal: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
  },
  projectView: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: '2.5%',
    width: '95%',
    shadowColor: "rgb(125, 134, 248)",
    shadowOffset: {
      height: 20,
      width: 20,

    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    backgroundColor: '#fFf',
    borderRadius: 20
  },
  button: {
    width: '40%',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    padding: 15,
    borderBottomColor: '#dbecf7',
    borderBottomWidth: 0.5,
    flexDirection: 'row'
  },
  icon: {
    height: 70,
    width: 70,
    borderRadius: 20,
  },
  action: {
    flexDirection: 'row',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    alignItems: 'center'
  },
  text_footer: {
    marginTop: 5,
    color: '#15223D'
  }
})