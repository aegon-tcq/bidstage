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
  Linking,
  TextInput,
  Alert
} from 'react-native';
import database from '@react-native-firebase/database';
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Entypo';
import {  Rating } from 'react-native-ratings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RippleLoader, BubblesLoader } from 'react-native-indicator';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';


// const Biddingref = firestore().collection('UserData').doc(this.state.useremail + '').collection('Biddings')
let onEndReachedCalledDuringMomentum = false;

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
      marginBottom:20
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
      <Image
        source={require('../assets/contact-book.png')}
        style={{ height: 45, width: 45 }}
      />
      <View>
        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Contact Information</Text>
        <Text style={{ color: '#FFF', fontSize: 12 }}>Now you can contact the owner..</Text>
      </View>
    </View>
    <TouchableOpacity
      style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}
      onPress={() => Linking.openURL(`tel:${props.phone}`)}

    >
      <Image
        source={require('../assets/phone-call.png')}
        style={{ height: 30, width: 30 }}
      />
      <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>+91{props.phone}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}
      onPress={() => Linking.openURL(`mailto:${props.gmail}`)}
    >
      <Image
        source={require('../assets/message.png')}
        style={{ height: 30, width: 30 }}
      />
      <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>{props.gmail}</Text>
    </TouchableOpacity>
  </LinearGradient>
}


export default class Myprojects extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      moreLoading: null,
      biddings: [],
      lastDoc: [],
      useremail: '',
      loading: null,


      //state vraible for owner detail
      loadingownerdetail: null,
      ownerdetailmodalvisible: false,
      Oname: '',
      Ophoneno: '',
      Odescription: '',
      Oemailid: '',
      Orating: 0.0,
      Oratingcount: 0.0,
      Oreviews: [],

      //state variable for bidderdetail
      bidderdetailmodal: false,
      loadingbidderinfo: false,
      bdescription: '',
      btimelimit: '',
      bbudget: '',
      bprojectid: '',
      pbudget: '',
      pdescription: '',
      ptitle: '',
      piconurl: '',
      plocation: '',
      pprefrences: '',

      //state variable for reviewing 
      reviewmodalvisible: false,
      updatingratereview: false,
      postingtick: false,
      rating: 1,
      review: '',
      date: '',
      uid: '',
      delid: '',
      cname: ''

    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          useremail: user.email
        })
        this.getBiddings();
      }
    });


  }

  getBiddings = async () => {
    this.setState({ isLoading: true });

    const snapshot = await firestore().collection('UserData').doc(this.state.useremail + '').collection('Biddings').orderBy('Uid').limit(4).get();

    if (!snapshot.empty) {
      let newBiddings = [];

      this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

      for (let i = 0; i < snapshot.docs.length; i++) {
        if (snapshot.docs[i].data().Selected) {
          newBiddings.push(snapshot.docs[i].data());
        }
      }

      this.setState({ biddings: newBiddings })
    } else {
      this.setState({ lastDoc: null })
    }
    this.setState({ isLoading: false });
    setTimeout(() => this.setState({ loading: false }), 1200)
  }

  getMore = async () => {
    if (this.state.lastDoc) {
      this.setState({ moreLoading: true });

      setTimeout(async () => {
        let snapshot = await firestore().collection('UserData').doc(this.state.useremail + '').collection('Biddings').orderBy('Uid').startAfter(this.state.lastDoc.data().Uid).limit(4).get();

        if (!snapshot.empty) {
          let newBiddings = this.state.biddings;

          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

          for (let i = 0; i < snapshot.docs.length; i++) {

            if (snapshot.docs[i].data().Selected) {
              newBiddings.push(snapshot.docs[i].data());
            }
          }

          this.setState({ biddings: newBiddings })
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
      this.getBiddings();
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

  getOwnerDetails = (uid, category) => {
    this.setState({ delid: uid, cname: category, loadingownerdetail: true, ownerdetailmodalvisible: true })
    let ownerId = ''

    firestore().collection('ProjectDetails').doc('Categories').collection(category + '').where("Uid", "==", uid).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          ownerId = doc.data()['Pid']
        });
      })
      .then(() => this.setOwnerDetail(ownerId));

  }

  setOwnerDetail = (ownerid) => {
    database()
      .ref('/users/' + ownerid.slice(0, -4))
      .on('value', snapshot => {
        this.setState({
          Oname: snapshot.val()['name'],
          Ophoneno: snapshot.val()['phoneno'],
          Odescription: snapshot.val()['about'],
          Oemailid: ownerid,
          uid: ownerid,
          Orating: snapshot.val()['rating'],
          Oratingcount: snapshot.val()['ratingcount'],
          Oreviews: snapshot.val()['review']
        })
        console.log('phone', this.state.Ophoneno,
          'rating', this.state.Orating,
          'reviews', this.state.Oreviews,
          'ratingcount', this.state.Oratingcount)
      });
    this.setState({ loadingownerdetail: false })
  }

  togggleownerdetailmodal = () => {
    this.setState({ ownerdetailmodalvisible: !this.state.ownerdetailmodalvisible })
  }
  togglereviewmodal = () => {
    this.setState({ reviewmodalvisible: !this.state.reviewmodalvisible })
  }
  setBidderDetail = (description, rate, timelimit, uid, category) => {
    this.setState({
      loadingbidderinfo: true,
      bdescription: description,
      bbudget: rate,
      bprojectid: uid,
      btimelimit: timelimit,
      bidderdetailmodal: true
    })
    let data = {}
    firestore().collection('ProjectDetails').doc('Categories').collection(category + '').where("Uid", "==", uid).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          data = doc.data()
        });
      }).then(() => this.setState({
        pbudget: data['Budget'],
        pdescription: data['Description'],
        ptitle: data['Title'],
        piconurl: data['IconUrl'],
        plocation: data['Location'],
        pprefrences: data['prefrences'],
        loadingbidderinfo: false
      }));

  }

  toggglebidderdetailmodal = () => {
    this.setState({
      bidderdetailmodal: !this.state.bidderdetailmodal
    })
  }

  editreview = () => {

    Alert.alert(
      "Confirmation.!",
      "You should review only when the work has completed.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Rate", onPress: this.togglereviewmodal }
      ],
      { cancelable: false }
    );
    return
  }

  reviewcheck = (val) => {
    this.setState({ review: val })
  }

  submitreview = () => {

    this.setState({ updatingratereview: true })

    console.log('id', this.state.uid)

    let ratingcount = 0
    let rating = 0

    database()
      .ref('/users/' + this.state.uid.slice(0, -4))
      .once('value')
      .then(function (snapshot) {
        rating = snapshot.val()['rating']
        ratingcount = snapshot.val()['ratingcount']
      })
      .then(() => {
        if (this.state.review.length > 0) {
          database().ref('/users/' + this.state.uid.slice(0, -4) + '/review').push().set({
            Uname: auth().currentUser.email.slice(0, -11),
            review: this.state.review,
            date: ''
          })
        }
      })
      .then(() => {
        console.log('rating', ((rating + this.state.rating) / (ratingcount + 1)).toFixed(1))
        database().ref('/users/' + this.state.uid.slice(0, -4)).update({
          rating: parseInt(((rating + this.state.rating) / (ratingcount + 1)).toFixed(1)),
          ratingcount: ratingcount + 1
        })
        this.deletingremainig()
      }).catch((e) => console.log(e))

  }

  deletingremainig = () => {


    let projectref = firestore().collection('ProjectDetails').doc('Categories').collection(this.state.cname + '').where("Uid", "==", this.state.delid)
    projectref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    }).then(() => {
      firestore().collection('UserData').doc(this.state.useremail + '').collection('Biddings').where("Uid", "==", this.state.delid)
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        }).then(() => {
          setTimeout(() => this.setState({ updatingratereview: false }), 1000)
          this.setState({
            reviewmodalvisible: false,
            bidderdetailmodal: false,
            postingtick: true
          })
        }).then(() => setTimeout(() => this.setState({ postingtick: false }), 700))
    })
  }
  render() {
    switch (this.state.loading) {
      case false:
        return (
          <View>
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
                <Text style={styles.header}>My Bids</Text>
                <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/legal.png')} />
              </View>
            </LinearGradient>


            <Modal
              isVisible={this.state.ownerdetailmodalvisible}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              {this.state.loadingownerdetail ? <View style={{
                flex:1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:'#FFF'
              }} >
                <ActivityIndicator color='#7d86f8' size='large' />
              </View>
                : <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                  <View style={styles.topview}>
                    <TouchableOpacity
                      onPress={() => this.togggleownerdetailmodal()}
                    >
                      <MaterialCommunityIcons
                        name='arrow-left'
                        size={25}
                        color='#15223D'
                      />
                    </TouchableOpacity>
                    <Text style={styles.header}>Owner Details</Text>
                    <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/profile.png')} />
                  </View>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                  >
                    <Profilesection1
                      name={this.state.Oname}
                      rating={this.state.Orating}
                      gmail={this.state.Oemailid}
                      ratingcount={this.state.Oratingcount}
                      description={this.state.Odescription}
                    />
                    <Profilesection3
                      phone={this.state.Ophoneno}
                      gmail={this.state.Oemailid}

                    />
                  </ScrollView>
                  <TouchableOpacity
                    style={[styles.button, {  width: '40%', borderColor:'#7d86f8',borderWidth:1, marginLeft: '30%',borderRadius:50 ,marginBottom:10}]}
                    onPress={() => this.editreview()}
                  >
                    <Text style={{ color: '#7d86f8', fontWeight: 'bold', fontSize: 15 }}>Review</Text>
                  </TouchableOpacity>
                </View>}
            </Modal>

            <Modal
              isVisible={this.state.bidderdetailmodal}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ margin:0 }}
            >
              {this.state.loadingbidderinfo ? <View style={{
                flex:1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:'#FFF'
              }} >
                <ActivityIndicator color='#7d86f8' size='large' />
              </View>
                :
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1, backgroundColor: '#FFF' }}>
                  <View style={styles.topview}>
                    <TouchableOpacity
                      onPress={() => this.toggglebidderdetailmodal()}
                    >
                      <MaterialCommunityIcons
                        name='arrow-left'
                        size={25}
                        color='#15223D'
                      />
                    </TouchableOpacity>
                    <Text style={styles.header}>Work Details</Text>
                    <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/legal.png')} />
                  </View>


                  <View style={{ alignItems: 'center', padding: 10, borderColor: '#ff7aa2', borderBottomWidth: 0.5, borderRadius: 30, marginTop: 20 }}>
                    <Image source={{ uri: this.state.piconurl }} style={styles.icon} />
                  </View>
                  <View style={styles.section}>
                      <Image
                        source={require('../assets/002-title.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Title   :  </Text>
                      <Text style={{ color: '#a0caeb', marginLeft: 10 }}>{this.state.ptitle}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/003-money-bag.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Budget   :  </Text>
                      <Text style={{ color: '#fc9454', marginLeft: 10, fontWeight: 'bold' }}>{this.state.pbudget}Rs</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/001-google-maps.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Location   :  </Text>
                      <Text style={{ color: '#ffda2d', marginLeft: 10, fontWeight: 'bold' }}>{this.state.plocation}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/001-experience.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Prefrences   :  </Text>
                      <Text style={{ color: '#a09eef', marginLeft: 10, fontWeight: 'bold' }}>{this.state.pprefrences}</Text>
                    </View>
                    <View style={[styles.section, { flexDirection: 'column' }]}>
                      <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <Image
                          source={require('../assets/004-floppy-disk.png')}
                          style={{ height: 20, width: 20 }}
                        />
                        <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Description  : </Text>
                      </View>    
                        <Text style={{ color: '#7f95b8',marginTop:10 ,marginLeft: 10}}>{this.state.pdescription}</Text>
                    </View>

                    <View style={styles.section}>
                      <Image
                        source={require('../assets/legal.png')}
                        style={{ height: 40, width: 40 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10, fontSize: 20 }} >My Bid Details</Text>

                    </View>

                  <View style={styles.section}>
                      <Image
                        source={require('../assets/004-id-1.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >ProjectId   :  </Text>
                      <Text style={{ color: '#a0caeb', marginLeft: 10 }}>{this.state.bprojectid}</Text>
                    </View>
                  <View style={styles.section}>
                      <Image
                        source={require('../assets/icons8-rupee-100.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Rate   :  </Text>
                      <Text style={{ color: '#fc9454', marginLeft: 10, fontWeight: 'bold' }}>{this.state.bbudget}Rs</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/002-clock.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Time   :  </Text>
                      <Text style={{ color: '#373796', marginLeft: 10 }}>{this.state.btimelimit}</Text>
                    </View>
                    <View style={[styles.section, { flexDirection: 'column' }]}>
                      <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <Image
                          source={require('../assets/003-id.png')}
                          style={{ height: 20, width: 20 }}
                        />
                        <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Description  : </Text>
                      </View>    
                        <Text style={{ color: '#7f95b8',marginTop:10 ,marginLeft: 10}}>{this.state.bdescription}</Text>
                    </View>
                </ScrollView>}

            </Modal>


            <Modal
              isVisible={this.state.reviewmodalvisible}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ margin: 0 }}
            >
              {this.state.updatingratereview ?
                <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                  <LottieView source={require('../assets/writing.json')} autoPlay />
                </View> :
                <View style={{ flex: 1, backgroundColor: '#FFF', padding: 10 }} >

                  <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}
                    onPress={this.togglereviewmodal}
                  >
                    <Icon
                      name='circle-with-cross'
                      size={35}
                    />
                  </TouchableOpacity>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 30
                    }}>
                      <AntDesign
                        name='like2'
                        size={35}
                        color='#CCC'
                      />
                      <Text style={{
                        color: "rgba(126,146,166,1)",
                        textAlign: "center",
                        fontSize: 18,
                        opacity: 0.81,
                        marginTop: 10
                      }} >How likely you would recommend this worker to a friend or colleague?</Text>
                    </View>
                    <View style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 20,
                    }} >
                      <Rating
                        type='custom'
                        count={5}
                        minValue={1}
                        size={30}
                        ratingTextColor='#7d86f8'
                        showRating
                        fractions={1}
                        startingValue={1}
                        onFinishRating={(val) => this.setState({ rating: val })}
                      />
                      <Text style={styles.text_footer}>Description</Text>
                      <View style={styles.action}>
                        <Icon
                          name="text-document"
                          color="#15223D"
                          size={20}
                        />
                        <TextInput
                          placeholder="Describe your experience.."
                          multiline={true}
                          numberOfLines={2}
                          style={styles.textInput}
                          autoCapitalize="none"
                          onChangeText={this.reviewcheck}
                          value={this.state.review}
                        />

                      </View>
                    </View>

                  </ScrollView>
                  <Text style={{
                    color: "#CCC",
                    textAlign: "center",
                    fontSize: 10,
                    opacity: 0.81,
                    marginBottom: 10
                  }} >Your feedback is very important to improve this profile.</Text>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#7d86f8' }]}
                    onPress={() => this.submitreview()}
                  >

                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>Submit Rview</Text>
                  </TouchableOpacity>

                </View>}

            </Modal>

            <Modal
              isVisible={this.state.postingtick}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >

              <LottieView source={require('../assets/tick-green.json')} autoPlay />
              <Text style={{ fontWeight: 'bold', color: '#FFF', marginTop: 150 }}>Thankyou for your feeback.</Text>
            </Modal>



            {this.state.biddings.length == 0 ?
              <View style={{ height: '90%', alignItems: 'center' }}>
                <LottieView source={require('../assets/empty-box.json')} loop={false} autoPlay />
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#CCC', marginTop: '10%' }}>Accepted Bid's will be shown here..</Text>
              </View> :
              <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                data={this.state.biddings}
                keyExtractor={item => item.Uid.toString()}
                renderItem={({ item }) => (
                  <Animatable.View
                    animation='bounceInUp'
                    duration={600}
                    style={styles.projectView}
                  >
                    <ImageBackground
                      source={require('../assets/ProposalBKND.png')}
                      resizeMode='stretch'
                      style={{ padding: 10 }}
                      imageStyle={{ height: '70%', borderRadius: 20 }}
                    >
                      <View style={{
                        flexDirection: 'row',
                        padding: 5,
                        alignItems: 'center',
                      }} >
                        <View style={{ marginLeft: 10}}>
                          <Text style={{ color: '#1d3557', fontWeight: 'bold' }}>{item.Description.slice(0, 25)}...</Text>
                          <View style={{ padding: 5, backgroundColor: '#7d86f8', borderRadius: 10,flexDirection:'row',marginTop:5,justifyContent:'center' }}>
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>{item.Rate}Rs</Text>
                        </View>
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
                          onPress={() => this.getOwnerDetails(item.Uid, item.Category)}
                        >
                          <Text style={{ color: '#522e38', fontWeight: 'bold', fontSize: 15 }}>Owners Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: '#7d86f8' }]}
                          onPress={() => this.setBidderDetail(item.Description, item.Rate, item.TimeLimit, item.Uid, item.Category)}
                        >
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>MyBid</Text>
                        </TouchableOpacity>

                      </View>

                    </ImageBackground>
                  </Animatable.View>
                )}
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
  icon: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  projectView: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: '5%',
    width: '90%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "rgb(125, 134, 248)",
    shadowOffset: {
      height: 20,
      width: 20,

    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    backgroundColor: '#fFf',
  },
  button: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    width: '95%',
    borderRadius: 20,
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