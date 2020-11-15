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
import { CirclesLoader, BubblesLoader } from 'react-native-indicator';
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
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width, height } = Dimensions.get('window');



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
      postingtick: false,
      activeIndex: 0,
      carouselItems: [
        {
          icon: require('../assets/lightbulb.png'),
          title: "Pro Tip",
          text: "Complete your profile first so that employer can know more about you.",
          color: ['#a78ee5', '#617df0',]

        },
        {
          icon: require('../assets/001-experience.png'),
          title: "Expertise",
          text: "Browsing work accroding to your expertise will get you more earning.",
          color: ['#ffb198', '#ff8892', '#ff498a']
        },
        {
          icon: require('../assets/profile.png'),
          title: "Profile",
          text: "Maintaining a profile with good rating increases the chance  for your bid wining. ",
          color: ['#a78ee5', '#ea9fdb',]
        }
      ]

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

      });
    database()
      .ref('/Uid')
      .on('value', snapshot => {
        this.setState({ Uid: snapshot.val(), loading: false })


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
      Alert.alert('Wrong description!', 'Atleast 50 characters of decsription.', [
        { text: 'Edit' }
      ]);
      return;
    }




    this.setState({ postingprojectloading: true })

    firestore().collection('ProjectDetails').doc('Categories').collection(this.state.selectedcategory[0] + '')
      .add({
        Date: (new Date()).getTime(),
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
      .then(() => {
        setTimeout(() => this.setState({ postingtick: false }), 2500)
        this.resetvar()
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });

  }

  resetvar = () => {
    this.setState({
      title: '',
      description: '',
      budget: '',
      location: '',
      prefrences: '',
      catname: [],
      selectedcategory: [],
    })
  }
  _renderItem({ item, index }) {
    return (
      <LinearGradient
        colors={item.color}
        style={{
          borderRadius: 20,
          height: '80%',
          padding: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,

          elevation: 12,
          marginTop: 20,
          justifyContent: 'space-between'
        }}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={item.icon}
            style={{ height: 30, width: 30 }}
          />
          <Text style={{ fontSize: 18, color: '#FFF', fontWeight: 'bold', marginLeft: 10 }}>{item.title}</Text>

        </View>

        <Text style={{ fontSize: 13, color: '#FFF' }}>{item.text}</Text>
      </LinearGradient>




    )
  }


  render() {
    switch (this.state.loading) {
      case false:
        return (
          <View style={{ height: '91%' }}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#dadae7" translucent={false} />
            <Animatable.View
              animation='fadeInDown'
              duration={1000}
            >


              {/*                Post Project modal                   */}


              <Modal
                isVisible={this.state.postingtick}
                animationIn={"zoomInDown"}
                animationOut={"zoomOutUp"}
                useNativeDriver={true}
                style={{ alignItems: 'center' }}
              >

                <LottieView source={require('../assets/tick-green.json')} autoPlay loop={false} />
                <Text style={{ fontWeight: 'bold', color: '#FFF', marginTop: 150 }}>Sucessfully Posted</Text>
              </Modal>

              <Modal
                isVisible={this.state.postprojectmodal}
                animationIn={"zoomInUp"}
                animationOut={"zoomOutUp"}
                useNativeDriver={true}
                style={{ margin: 0 }}
                avoidKeyboard={true}
              >
                <View
                  style={styles.postprojectmodal}
                >

                  <LinearGradient
                    colors={['#ea9fdb', '#7d86f8']}
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      padding: 15,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20
                    }}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>
                      Post New Work
                      </Text>

                  </LinearGradient>
                  {this.state.postingprojectloading ? <View style={{
                    flex: 1,
                    backgroundColor: '#FFF',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,

                    alignItems: 'center',
                    justifyContent: 'center'
                  }} >
                    <CirclesLoader color='#7d86f8' />
                  </View>
                    :
                    <ScrollView

                      style={{
                        flex: 1,
                        backgroundColor: '#FFF',
                        padding: 15,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20

                      }}
                      showsVerticalScrollIndicator={false}>
                      <Animatable.View
                        animation='fadeInUpBig'
                        duration={1000}
                        useNativeDriver={true}
                      >
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
                      </Animatable.View>
                      <Animatable.View
                        animation='fadeInUpBig'
                        duration={1100}
                        useNativeDriver={true}
                      >
                        <MultiSelect
                          hideTags={false}
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
                      </Animatable.View>
                      <Animatable.View
                        animation='fadeInUpBig'
                        duration={1200}
                        useNativeDriver={true}
                      >
                        <Text style={styles.text_footer}>Budget</Text>
                        <View style={styles.action}>
                          <FontAwesome
                            name="rupee"
                            color="#0F9D58"
                            size={20}
                          />
                          <TextInput
                            placeholder="Enter the price in (RS)"
                            keyboardType='numeric'
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
                      </Animatable.View>

                      <Animatable.View
                        animation='fadeInUpBig'
                        duration={1300}
                        useNativeDriver={true}
                      >
                        <Text style={styles.text_footer}>Location</Text>

                        <View style={styles.action}>
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
                      </Animatable.View>
                      <Animatable.View
                        animation='fadeInUpBig'
                        duration={1400}
                        useNativeDriver={true}
                      >
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
                      </Animatable.View>
                      <Animatable.View
                        animation='fadeInUpBig'
                        duration={1500}
                        useNativeDriver={true}
                      >
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
                      </Animatable.View>



                    </ScrollView>}
                  <LinearGradient
                    colors={['#ea9fdb', '#7d86f8']}
                    style={{
                      marginTop: 10,
                      borderRadius: 50,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '80%',
                      marginLeft: '10%',
                      marginBottom: 10
                    }}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                  >
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#FFF' }]}
                      onPress={this.togglepostprojectdetailmodal}
                    >
                      <Text style={{ color: '#7d86f8', fontSize: 15 }}>Close</Text>
                    </TouchableOpacity>



                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={this.postproject}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>Post</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </Modal>


            </Animatable.View>
            <LinearGradient
              colors={['#dadae7', '#dadae7']}
              style={{ height: '40%', width: '100%', justifyContent: 'flex-end' }}
              start={{ x: 0.7, y: 0 }}
            ><Carousel
                llayout={'default'}
                ref={ref => this.carousel = ref}
                data={this.state.carouselItems}
                sliderWidth={width}
                itemWidth={width * 0.87}
                renderItem={this._renderItem}
                dotColor='#FFF'
                onSnapToItem={index => this.setState({ activeIndex: index })} />

              <View style={styles.topview}>
                <Text style={styles.header}>Categories</Text>
              </View>
            </LinearGradient>

            <FlatList
              style={{ backgroundColor: '#FFF' }}
              showsVerticalScrollIndicator={false}
              numColumns={3}
              data={this.state.catgories}
              keyExtractor={item => item.title}
              renderItem={({ item }) => (
                <Animatable.View
                  animation='bounceInUp'
                  duration={1500}
                  useNativeDriver={true}
                // style={{ height: '100%', backgroundColor: '#FFF', marginTop: 5 }}
                >
                  <TouchableOpacity

                    onPress={() => this.props.navigation.navigate('ProjectListingScreen', { CategoryName: String(item.title), url: item.url, def: item.defination })}
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
        return <LottieView source={require('../assets/HomeLoading.json')} autoPlay />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginLeft: width * 0.025,
    marginTop: 20,
    width: width * 0.3,
    height: height * 0.18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    borderRadius: 20,
    marginBottom: 10
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#15223D',
    borderColor: '#ff7aa2',
    borderTopWidth: 0.5,
    paddingTop: 10,
    paddingHorizontal: 15

  },
  topview: {
    backgroundColor: '#FFF',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,

  },
  header: {
    fontSize: 18,
    color: '#15223D',
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
    marginTop: '15%',
    flex: 1

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
  },
  button: {
    width: '50%',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  }
});