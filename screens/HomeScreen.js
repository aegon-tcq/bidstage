import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ImageBackground,
  ScrollView,
  TextInput,
  Alert,
  StatusBar

} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database';
import { DotsLoader, BubblesLoader } from 'react-native-indicator';
import * as Animatable from 'react-native-animatable';
import { FAB } from 'react-native-paper';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MultiSelect from 'react-native-multiple-select';
import LottieView from 'lottie-react-native';
import storage from '@react-native-firebase/storage';

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
      catgories: [],
      Uid: '',

      //state variable for posting project
      postprojectmodal: false,
      useremail: '',
      title: '',
      description: '',
      budget: '',
      location: '',
      prefrences: '',
      catname: [],
      selectedcategory: [],
      postingprojectloading: false,
      postingtick: false

    }
  }

  componentDidMount() {

    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          useremail: user.email
        })
      }
    });

    database()
      .ref('/Categories')
      .on('value', snapshot => {
        var data = []
        let cname = []
        for (let key in snapshot.val()) {
          data.push(snapshot.val()[key])
        }
        this.setState({ catgories: data.slice(1) })

        for (let i = 0; i < this.state.catgories.length; i++) {
          cname.push({ name: this.state.catgories[i].title })
        }
        this.setState({ catname: cname })
        setTimeout(()=>this.setState({ loading: false }),600)
        console.log(this.state.catname)
      });
    database()
      .ref('/Uid')
      .on('value', snapshot => {
        this.setState({ Uid: snapshot.val() })
        setTimeout(()=>this.setState({ loading: false }),600)
  
        console.log(snapshot.val())
      });

    const ref = storage().ref('categoriesicon/001-electrician.png');
    ref.getDownloadURL()
      .then(url => { console.log(url) })
      .catch(e => { console.log(e); })
   
    
  }

  print = () => {
    console.log('OK')
  }

  togglepostprojectdetailmodal = () => {
    this.setState({ postprojectmodal: !this.state.postprojectmodal })
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



  postproject = () => {
    if (this.state.title.length < 5 || this.state.title.length > 30) {
      Alert.alert('Wrong Title!', 'Title should be in 5-30 characters.', [
        { text: 'Edit' }
      ]);
      return;
    }
    if (this.state.selectedcategory.length != 1) {
      Alert.alert('Wrong Category!', 'Select category..', [
        { text: 'Edit' }
      ]);
      return;
    }
    if (this.state.budget.length < 2) {
      Alert.alert('Wrong Budget!', 'Budget should be greater than 99Rs', [
        { text: 'Edit' }
      ]);
      return;
    }
    if (this.state.location.length < 10) {
      Alert.alert('Wrong Location!', 'Describe location in atleast 10 characters.', [
        { text: 'Edit' }
      ]);
      return;
    }
    if (this.state.description.length < 50) {

    }



    this.setState({ postingprojectloading: true })

    firestore().collection('ProjectDetails').doc('Categories').collection(this.state.selectedcategory[0] + '')
      .add({
        Title: this.state.title,
        Budget: this.state.budget,
        Description: this.state.description,
        Pid: this.state.useremail,
        Location: this.state.location,
        Prefrences: this.state.prefrences,
        IconUrl: 'https://firebasestorage.googleapis.com/v0/b/bidstage-ade14.appspot.com/o/categoriesicon%2F001-electrician.png?alt=media&token=84e161a4-3e35-4150-8125-c7a4dbad4e59',
        Uid: this.state.Uid
      })
      .then(() => database().ref('/users/' + this.state.useremail.slice(0, -4) + '/myprojects').push().set({
        CategoryName: this.state.selectedcategory[0],
        Uid: this.state.Uid
      }))
      .then(() => database().ref().update({
        Uid: parseInt(this.state.Uid) + 1
      }))
      .then(() => this.setState({ postingprojectloading: false, postprojectmodal: false, postingtick: true }))
      .then(() => setTimeout(() => this.setState({ postingtick: false }), 1000))
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });

  }
  render() {
    switch (this.state.loading) {
      case false:
        return (
          <View style={{ height: '91%', backgroundColor: '#FFF' }}>
          <StatusBar barStyle='dark-content' hidden={false} backgroundColor='#FFF' translucent={false} />
            <Animatable.View
              animation='fadeInDown'
              duration={1000}
            >
              <View style={styles.topview}>
                <Text style={styles.header}>Explore Projects</Text>
              </View>

              {/*                Post Project modal                   */}


              <Modal
                isVisible={this.state.postingtick}
                animationIn={"zoomInDown"}
                animationOut={"zoomOutUp"}
                useNativeDriver={true}
                style={{ alignItems: 'center' }}
              >

                <LottieView source={require('../assets/tick-green.json')} autoPlay />
                <Text style={{ fontWeight: 'bold', color: '#FFF', marginTop: 150 }}>Sucessful</Text>
              </Modal>

              <Modal
                isVisible={this.state.postprojectmodal}
                animationIn={"fadeInUpBig"}
                animationOut={"fadeOutRightBig"}
                useNativeDriver={true}
                style={{ margin: 0 }}
              >{this.state.postingprojectloading ? <View style={{
                alignItems: 'center',
                justifyContent: 'center'
              }} >
                <DotsLoader color='#7d86f8' />
              </View>
                :
                <View style={styles.postprojectmodal}>
                  <ImageBackground
                    source={require('../assets/PostNewWork.png')}
                    resizeMode='stretch'
                    style={styles.image2}
                    imageStyle={styles.image2_imageStyle}
                  >

                    <TouchableOpacity
                      style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}
                      onPress={this.togglepostprojectdetailmodal}
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

                    <MultiSelect
                      single={true}
                      items={this.state.catname}
                      uniqueKey="name"
                      ref={(component) => { this.multiSelect = component }}
                      onSelectedItemsChange={this.onselectedcategory}
                      selectedItems={this.state.selectedcategory}
                      selectText="Select Category"
                      searchInputPlaceholderText="Search Category..."
                      onChangeInput={(text) => console.log(text)}
                      altFontFamily="ProximaNova-Light"
                      tagRemoveIconColor="#CCC"
                      tagBorderColor="#CCC"
                      tagTextColor="#CCC"
                      selectedItemTextColor="#0F9D58"
                      selectedItemIconColor="#0F9D58"
                      itemTextColor="#CCC"
                      displayKey="name"
                      searchInputStyle={{ color: '#CCC' }}
                      submitButtonColor="#0F9D58"
                      submitButtonText="Submit"
                    />
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

                      />
                      {this.state.title.length >= 5 ?
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
                      onPress={this.postproject}
                    >
                      <Text style={{ color: "#FFF", fontWeight: "bold" }}>Post</Text>
                    </TouchableOpacity>
                  </ScrollView>

                </View>}
              </Modal>


            </Animatable.View>

            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={this.state.catgories}
              keyExtractor={item => item.title}
              renderItem={({ item }) => (
                <Animatable.View
                  animation='bounceInUp'
                  useNativeDriver={true}
                // style={{ height: '100%', backgroundColor: '#FFF', marginTop: 5 }}
                >
                  <TouchableOpacity

                    onPress={() => this.props.navigation.navigate('ProjectListingScreen', { CategoryName: String(item.title) })}
                  >
                    <View style={styles.container}>
                      <Image style={styles.photo} source={{ uri: item.url }} />
                      <Text style={styles.title}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              )}
            />


            <FAB
              style={styles.fab}
              icon="plus"
              onPress={() => this.setState({ postprojectmodal: true })}
            />
          </View>
        )
      default:
        return  <LottieView source={require('../assets/HomeLoading.json')} autoPlay />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginLeft: ITEM_MARGIN,
    marginTop: 20,
    width: (SCREEN_WIDTH - (Colums + 1) * ITEM_MARGIN) / Colums,
    height: ITEM_HEIGHT + 75,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 20,
      width: 20
    },
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 0,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    marginBottom: 10
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

  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#f84382'
  },
  postprojectmodal: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    padding: 15
  },
  image2: {
    marginBottom: 10
  },
  image2_imageStyle: {
    width: '95%',
    height: '100%',
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
});