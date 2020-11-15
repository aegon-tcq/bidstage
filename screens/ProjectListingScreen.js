import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  StatusBar
} from 'react-native';
import firestore from "@react-native-firebase/firestore";
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import HeaderComponent from '../Components/HeaderComponent.js';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const projectRef = firestore().collection('ProjectDetails').doc('Categories');
let onEndReachedCalledDuringMomentum = false;




export default class ProjectListingScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      moreLoading: null,
      lastDoc: [],
      projects: [],
      modalVisible: false,
      bidmodalVisible: false,
      //State variables for project detail modal
      iconUrl: '',
      title: '',
      budget: '',
      description: '',
      location: '',
      prefrences: '',
      uid: '',
      //State variables for Bidding modal
      deadline: '',
      biddescription: '',
      bidbudget: '',
      validinfo: null,
      placebidloading: false,

      // state variable for placing bid
      BUid: '',
      Bcategory: '',
      Ownerid: ''
    }
  }


  componentDidMount() {
    this.getProjects();
  }

  getProjects = async () => {

    const { CategoryName } = this.props.route.params
    this.setState({ isLoading: true });

    const snapshot = await projectRef.collection('' + CategoryName).orderBy('Uid').limit(4).get();

    if (!snapshot.empty) {
      let newProjects = [];

      this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

      for (let i = 0; i < snapshot.docs.length; i++) {
        newProjects.push(snapshot.docs[i].data());
      }

      this.setState({ projects: newProjects })
    } else {
      this.setState({ lastDoc: null })
    }
    console.log('projects ', this.state.C_Name)
    setTimeout(() => this.setState({ isLoading: false }), 1200)

  }

  getMore = async () => {
    const { CategoryName } = this.props.route.params
    if (this.state.lastDoc) {
      this.setState({ moreLoading: true });

      setTimeout(async () => {
        let snapshot = await projectRef.collection('' + CategoryName).orderBy('Uid').startAfter(this.state.lastDoc.data().Uid).limit(4).get();

        if (!snapshot.empty) {
          let newProjects = this.state.projects;

          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

          for (let i = 0; i < snapshot.docs.length; i++) {

            newProjects.push(snapshot.docs[i].data());
          }

          this.setState({ projects: newProjects })
          if (snapshot.docs.length < 4) this.setState({ lastDoc: null });
        } else {
          this.setState({ lastDoc: null });
        }

        this.setState({ moreLoading: false });
      }, 1000);
    }

    onEndReachedCalledDuringMomentum = true;
  }

  onRefresh = () => {
    setTimeout(() => {
      this.getProjects();
    }, 1000);
  }

  renderFooter = () => {
    if (!this.state.moreLoading) return true;

    return (
      <ActivityIndicator
        size='large'
        color={'#D83E64'}
        style={{ marginBottom: 10 }}
      />
    )
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  togglebidmodal = () => {
    this.setState({ bidmodalVisible: !this.state.bidmodalVisible });
  }
  setBidDetailModal = (buid, bcategory, pid) => {
    this.setState({
      modalVisible: false,
      BUid: buid,
      Bcategory: bcategory,
      Ownerid: pid,
      bidmodalVisible: true
    });
  }
  setProjectDetailModal = (Url, title, budget, description, buid, bcategory, pid, location, prefrences, uid) => {
    this.setState({
      iconUrl: Url,
      title: title,
      budget: budget,
      description: description,
      BUid: buid,
      Bcategory: bcategory,
      Ownerid: pid,
      location: location,
      prefrences: prefrences,
      uid: uid,
      modalVisible: true
    });
  }

  setbidbudget = (val) => {
    if (val.length > 2) {
      this.setState({ bidbudget: val })
    }
    else {
      this.setState({ bidbudget: '' })
    }
  }

  setbiddescription = (val) => {
    if (val.length > 10) {
      this.setState({ biddescription: val })
    } else {
      this.setState({ biddescription: '' })
    }
  }

  setdeadline = (val) => {
    if (val.length > 1) {
      this.setState({ deadline: val })
    } else {
      this.setState({ deadline: '' })
    }
  }

  checkdetails = (val) => {
    if (val.length == 0) {
      this.setState({ validinfo: false })
    } else {
      this.setState({ validinfo: true })
    }
  }

  submitbiddetail = () => {

    if (this.state.bidbudget.length == 0 || this.state.deadline.length == 0) {
      Alert.alert('Wrong Input!', 'Any of the field cannot be empty ', [
        { text: 'Edit' }
      ]);
      return;
    }
    if (this.state.biddescription.length < 10) {
      Alert.alert('Wrong Input!', 'Description atlest be of 10 words', [
        { text: 'Edit' }
      ]);
      return;
    }

    this.setState({ placebidloading: true })
    let user = auth().currentUser

    firestore().collection('UserData').doc(this.state.Ownerid + '').collection('Proposals').doc(this.state.BUid + '').set({
      Rate: this.state.bidbudget,
      TimeLimit: this.state.deadline,
      Description: this.state.biddescription,
      Category: this.state.Bcategory,
      Uid: this.state.BUid,
      Selected: false,
      BidId: user.email
    }).then(() => firestore().collection('UserData').doc(user.email + '').collection('Biddings').doc(this.state.BUid + '').set({
      Rate: this.state.bidbudget,
      TimeLimit: this.state.deadline,
      Description: this.state.biddescription,
      Category: this.state.Bcategory,
      Uid: this.state.BUid,
      Selected: false
    }).then(this.onWriteSuccess)
      .catch(function (error) {
        Alert.alert('Error!', error, [
          { text: 'Retry' }
        ])
      }))


  }

  onWriteSuccess = () => {
    this.setState({
      placebidloading: false,
      bidmodalVisible: false
    })
    if (this.state.placebidloading == false) {
      Alert.alert('Bid Placed', 'You will get notified when your bid is selected..', [
        { text: 'Okay' }
      ]);
      return;
    }

  }

  datetimecalc = (itemdate) => {
    let today = (new Date()).getTime();
    return Math.round((today - itemdate)/(1000*3600*24) );
  }

  render() {
    switch (this.state.isLoading) {
      case false:
        return (

          <View style={{ height: '90%' }}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#FFF" translucent={false} />

            {/*******************************************Header*******************************************************/}
            <LinearGradient
              colors={['#a78ee5', '#ea9fdb']}

              start={{ x: 0.7, y: 0 }}
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
                <Text style={styles.header}>{this.props.route.params.CategoryName}</Text>
                <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={{ uri: this.props.route.params.url }} />
              </View>
            </LinearGradient>
            {/*************************Project Details Modal***********************************************************/}

            <Modal
              isVisible={this.state.modalVisible}
              animationIn={"bounceInUp"}
              animationOut={"bounceOutDown"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              <View style={styles.modal}>
              <View style={styles.section}>
                      <Image
                        source={require('../assets/legal.png')}
                        style={{ height: 40, width: 40 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10, fontSize: 20 }} >Work Details</Text>

                    </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                  <View style={{ alignItems: 'center', padding: 10, borderColor: '#ff7aa2', borderBottomWidth: 0.5, borderRadius: 30, marginTop: 20 }}>
                    <Image source={{ uri: this.state.iconUrl }} style={styles.icon} />
                  </View>
                  <View style={styles.section}>
                      <Image
                        source={require('../assets/002-title.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Title   :  </Text>
                      <Text style={{ color: '#a0caeb', marginLeft: 10 }}>{this.state.title}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/003-money-bag.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Budget   :  </Text>
                      <Text style={{ color: '#fc9454', marginLeft: 10, fontWeight: 'bold' }}>{this.state.budget}Rs</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/001-google-maps.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Location   :  </Text>
                      <Text style={{ color: '#ffda2d', marginLeft: 10, fontWeight: 'bold' }}>{this.state.location}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/001-experience.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Prefrences   :  </Text>
                      <Text style={{ color: '#a09eef', marginLeft: 10, fontWeight: 'bold' }}>{this.state.prefrences}</Text>
                    </View>
                    <View style={[styles.section, { flexDirection: 'column' }]}>
                      <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <Image
                          source={require('../assets/004-floppy-disk.png')}
                          style={{ height: 20, width: 20 }}
                        />
                        <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Description  : </Text>
                      </View>    
                        <Text style={{ color: '#7f95b8',marginTop:10 ,marginLeft: 10}}>{this.state.description}</Text>
                    </View>
                  <View style={styles.section}>
                      <Image
                        source={require('../assets/004-id-1.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >ProjectId   :  </Text>
                      <Text style={{ color: '#a0caeb', marginLeft: 10 }}>{this.state.uid}</Text>
                    </View>

                </ScrollView>
              </View>
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
                  onPress={this.toggleModal}
                >
                  <Text style={{ color: '#7d86f8', fontSize: 15 }}>Close</Text>
                </TouchableOpacity>


                {auth().currentUser.email == this.state.Ownerid ?
                  <TouchableOpacity
                    style={[styles.button, { opacity: 0.4 }]}
                    onPress={() => Alert.alert("Can't Bid!", 'this work is posted by you..', [
                      { text: 'Okay' }
                    ])}
                  >
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>Bid</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => this.setBidDetailModal(this.state.BUid, this.state.Bcategory, this.state.Ownerid)}
                  >
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>Bid</Text>
                  </TouchableOpacity>}
              </LinearGradient>
            </Modal>


            {/*************************Project Bid Modal***********************************************************/}


            <Modal
              isVisible={this.state.bidmodalVisible}
              animationIn={"bounceInUp"}
              animationOut={"bounceOutDown"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              <View style={[styles.modal]}>
                <ImageBackground
                  source={require('../assets/SubmitBidForm.png')}
                  resizeMode='stretch'
                  style={styles.image2}
                  imageStyle={styles.image2_imageStyle}
                >

                </ImageBackground>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ padding: 15 }}
                >
                  <Text style={[styles.inputtitle, { marginTop: 25 }]}>Your Rate</Text>
                  <View style={styles.action}>
                    <FontAwesome
                      name="rupee"
                      color="#05375a"
                      size={20}
                    />
                    <TextInput
                      placeholder="Rate in (INR)"
                      style={styles.textInput}
                      keyboardType='numeric'
                      autoCapitalize="none"
                      onChangeText={this.setbidbudget}
                      onEndEditing={this.checkdetails}
                    />
                  </View>
                  <Text style={{}}>Time Limit</Text>
                  <View style={styles.action}>
                    <MaterialCommunityIcons
                      name="timer-outline"
                      color="#05375a"
                      size={20}
                    />
                    <TextInput
                      placeholder="(month/days) to complete the work."
                      style={styles.textInput}
                      autoCapitalize="none"
                      onChangeText={this.setdeadline}
                      onEndEditing={this.checkdetails}
                    />
                  </View>
                  <Text style={{}}>Describe your proposal</Text>
                  <View style={styles.action}>
                    <MaterialIcons
                      name="description"
                      color="#05375a"
                      size={20}
                    />
                    <TextInput
                      placeholder="What makes you the best candidate for this job."
                      multiline={true}
                      numberOfLines={2}
                      style={styles.textInput}
                      autoCapitalize="none"
                      onChangeText={this.setbiddescription}
                      onEndEditing={this.checkdetails}
                    />
                  </View>
                </ScrollView>
              </View>
              <LinearGradient
                colors={['#ffb198', '#ff8892', '#ff498a']}
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
                  onPress={this.togglebidmodal}
                >
                  <Text style={{ color: '#ff498a', fontSize: 15 }}>Close</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={styles.button}
                  onPress={this.submitbiddetail}>
                  {this.state.placebidloading ?
                    <ActivityIndicator size='large' color='#FFF' />
                    :
                    <Text style={{ fontWeight: 'bold', color: '#FFF' }}>PlaceBid</Text>}
                </TouchableOpacity>
              </LinearGradient>

            </Modal>


            {/*************************Project Listings***********************************************************/}

            {this.state.projects.length == 0 ?
              <View style={{ height: '90%', alignItems: 'center' }}>
                <LottieView source={require('../assets/empty-box.json')} loop={false} autoPlay />
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#CCC', marginTop: '10%' }}>No Work found in {this.props.route.params.CategoryName} </Text>
              </View> :
              <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                data={this.state.projects}
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
                            onPress={() => this.setProjectDetailModal(item.IconUrl, item.Title, item.Budget, item.Description, item.Uid, this.props.route.params.CategoryName, item.Pid, item.Location, item.Prefrences, item.Uid)}
                          >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Details</Text>
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>

                    </ImageBackground>
                  </Animatable.View>
                )}
                ListHeaderComponent={() =>
                  <HeaderComponent
                    data={this.props.route.params.def}
                    color={['#a78ee5', '#ea9fdb']}

                  />
                }
                ListFooterComponent={this.renderFooter}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={this.onRefresh}
                  />
                }
                initialNumToRender={2}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
                onEndReached={() => {
                  if (!onEndReachedCalledDuringMomentum && !this.state.isLoading) {
                    this.getMore();
                  }
                }
                }
              />}
          </View>
        )

      default:
        return <LottieView source={require('../assets/ProposalLoading.json')} autoPlay />
    }

  }
}

const styles = StyleSheet.create({
  topview: {
    backgroundColor: '#FFF',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 50,
    padding: 10,
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
  icon: {
    height: 70,
    width: 70,
    borderRadius: 20,
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
    width: '50%',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    marginTop: '25%',
    flex: 1,
    borderRadius: 30,
    backgroundColor: '#FFF',
    padding: 15,
  },
  image2: {
  },
  image2_imageStyle: {
    width: '95%',
    height: 35,
  },
  section: {
    padding: 15,
    borderBottomColor: '#dbecf7',
    borderBottomWidth: 0.5,
    flexDirection: 'row'
  },
  title: {
    color: '#081c15',
    fontWeight: 'bold',
    fontSize: 15
  },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  textInput: {
    marginLeft: 15
  },
  inputtitle: {
    color: '#15223d',
    fontWeight: '500'
  }
})