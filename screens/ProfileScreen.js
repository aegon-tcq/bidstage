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
import { AirbnbRating } from 'react-native-ratings';
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

const { width, height } = Dimensions.get('window');

export default class ProfileScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: null,
      isModalVisibleskill: false,
      isModalVisiblereview: false,
      ismyprojectmodalvisible: false,
      projectdetailmodal: false,
      rating: 0.0,
      ratingcount: 0.0,
      reviews: [],
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <AirbnbRating
                      count={5}
                      reviews={["Bad", "OK", "Good", "Very Good", "Amazing"]}
                      defaultRating={this.state.rating}
                      size={20}
                      isDisabled={true}
                      reviewSize={0}
                    />
                    <Text style={{ color: '#F4B400' }}>{this.state.rating}/5</Text>
                  </View>
                  {this.state.ratingcount == 0 ? <Text style={{ marginTop: 10, color: '#CCC' }}>No reviews</Text> :
                    <Text style={{ marginTop: 10, color: '#0F9D58' }}>({this.state.ratingcount}) reviews</Text>}
                </View>
              </Animatable.View>
            </ImageBackground>

            {/***************************************Skill Modal***********************************************/}


            <Modal
              isVisible={this.state.isModalVisibleskill}
              animationIn={"zoomIn"}
              animationOut={"zoomOut"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              <View style={{ flex: 1, backgroundColor: '#5a94fc' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                  <Text style={styles.header} >My Skills</Text>
                  <TouchableOpacity onPress={this.toggleModalskill}>
                    <FontAwesome
                      name='arrow-circle-right'
                      color='#FFF'
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
                <Animatable.View
                  animation='bounceInUp'
                  duration={1500}
                  useNativeDriver={true}
                  style={[styles.list, { padding: 15 }]}
                >
                  <ScrollView>
                    {/* 
                    {this.state.selectedItems.map((item, key) => (
                      <View style={{
                        width: '100%',
                        borderBottomColor: '#ff7aa2',
                        borderBottomWidth: 0.5,
                        borderRadius: 20,
                        padding: 10,

                      }}>
                        <Text key={key} style={{ marginLeft: 10, fontWeight: 'bold' }}> {item} </Text>
                      </View>

                    )
                    )} */}

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
                        borderColor:'#5a94fc',
                        borderWidth:1,
                        borderRadius:20,
                        width:'40%',
                        marginLeft:'30%',
                        alignItems:'center'
                      }}
                      onPress={() => this.onsaveskills()}
                    >
                    {this.state.updatingskill ? <ActivityIndicator size='small' color='#5a94fc' /> :
                      <Text style={{color:'#5a94fc',fontWeight:'bold'}} >Save</Text>  }
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
              <View style={{ flex: 1, backgroundColor: '#ff7aa2' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                  <Text style={styles.header} >My Reviews</Text>
                  <TouchableOpacity onPress={this.toggleModalreview}>
                    <FontAwesome
                      name='arrow-circle-right'
                      color='#FFF'
                      size={30}
                    />
                  </TouchableOpacity>
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
                flex: 1, backgroundColor: '#7133D1'
              }}>

                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                  <Text style={styles.header} >Myproject</Text>
                  <TouchableOpacity onPress={this.togglemodalmyproject}>
                    <FontAwesome
                      name='arrow-circle-right'
                      color='#FFF'
                      size={30}
                    />
                  </TouchableOpacity>
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
                          duration={700}
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
                            }} >
                              <Image style={styles.icon} source={{ uri: item.IconUrl }} />
                              <View style={{ marginLeft: 10, width: '65%' }}>
                                <Text style={{ color: '#1d3557', fontWeight: 'bold' }}>{item.Title}</Text>
                                <Text style={{ color: '#3cba54', marginTop: 10 }}>{item.Budget}</Text>
                              </View>
                            </View>
                            <View style={{
                              flexDirection: 'row',
                              padding: 5,
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                              marginTop: 10
                            }}>
                              <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#ff7aa2' }]}
                                onPress={() => this.getmyprojectsdetail(item)}
                              >
                                <Text style={{ color: '#522e38', fontWeight: 'bold', fontSize: 15 }}>Details</Text>
                              </TouchableOpacity>



                              <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#74c69d' }]}
                                onPress={() => this.editmyproject(item)}
                              >
                                <Text style={{ color: '#081c15', fontWeight: 'bold', fontSize: 15 }}>Edit</Text>
                              </TouchableOpacity>
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
              <View style={styles.modal}>
                <ImageBackground
                  source={require('../assets/WorkDetails.png')}
                  resizeMode='stretch'
                  style={{}}
                  imageStyle={{
                    width: '95%',
                    height: 35,
                  }}
                >

                  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={this.togglemodalmyprojectdetailmodal}>
                    <FontAwesome
                      name='arrow-circle-right'
                      size={30}
                    />
                  </TouchableOpacity>
                </ImageBackground>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                  <View style={{ alignItems: 'center', padding: 10, borderColor: '#ff7aa2', borderBottomWidth: 0.5, borderRadius: 30, marginTop: 20 }}>
                    <Image source={{ uri: this.state.projectdetail['IconUrl'] }} style={styles.icon} />
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Title  :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.projectdetail['Title']}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row' }]} >
                    <Text style={styles.title}>Budget  :  </Text>
                    <Text style={{ color: '#3cba54' }}>{this.state.projectdetail['Budget']}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row' }]} >
                    <Text style={styles.title}>Location  :  </Text>
                    <Text style={{ color: '#15223D' }}>{this.state.projectdetail['Location']}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row' }]} >
                    <Text style={styles.title}>Prefrences  :  </Text>
                    <Text style={{ color: '#15223D' }}>{this.state.projectdetail['Prefrences']}</Text>
                  </View>
                  <View style={[styles.section]}>
                    <Text style={styles.title}>Description  :</Text>
                    <Text style={{ marginTop: 5, color: '#15223D' }}>{this.state.projectdetail['Description']}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Uid  :</Text>
                    <Text style={{ marginTop: 5, marginLeft: 10, color: '#CCC' }}>{this.state.projectdetail['Uid']}</Text>
                  </View>

                </ScrollView>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#74c69d', marginLeft: '30%', marginTop: 15 }]}
                  onPress={() => this.editmyproject(this.state.projectdetail)}
                >
                  <Text style={{ color: '#081c15', fontWeight: 'bold', fontSize: 15 }}>Edit</Text>
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
                <View style={styles.modal}>
                  <ImageBackground
                    source={require('../assets/PostNewWork.png')}
                    resizeMode='stretch'
                    style={{}}
                    imageStyle={{ width: '95%', height: '100%' }}
                  >

                    <TouchableOpacity
                      style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}
                      onPress={this.toggleupdateprojectmodal}
                    >
                      <FontAwesome
                        name='arrow-circle-right'
                        size={30}
                        color='#15223D'
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                  <ScrollView showsVerticalScrollIndicator={false}>
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
                      style={{
                        padding: 10,
                        borderRadius: 20,
                        backgroundColor: '#f84382',
                        width: '40%',
                        alignItems: 'center',
                        marginLeft: '30%',
                        marginTop: 10
                      }}
                      onPress={this.postupdateprojectdetail}
                    >
                      <Text style={{ color: "#FFF", fontWeight: "bold" }}>Update</Text>
                    </TouchableOpacity>
                  </ScrollView>

                </View>}
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
                    color='#ff7aa2'
                    size={25}
                  />
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
                  <MaterialIcons
                    name="collections"
                    color='#7133D1'
                    size={25}
                  />
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
    borderTopRightRadius: 20
  },
  header: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',

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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
    marginLeft: '5%',
    width: '90%',
    shadowColor: "rgb(125, 134, 248)",
    shadowOffset: {
      height: 20,
      width: 20,

    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    backgroundColor: '#fFf',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35
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
    borderBottomColor: '#ff7aa2',
    borderBottomWidth: 0.5,
  },
  icon: {
    height: 100,
    width: 100,
    borderRadius: 50,
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