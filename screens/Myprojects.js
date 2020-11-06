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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AirbnbRating, Rating } from 'react-native-ratings';
import { RippleLoader, BubblesLoader } from 'react-native-indicator';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';


// const Biddingref = firestore().collection('UserData').doc(this.state.useremail + '').collection('Biddings')
let onEndReachedCalledDuringMomentum = false;

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
      Ophoneno: '',
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
      plocation:'',
      pprefrences:'',

      //state variable for reviewing 
      reviewmodalvisible: false,
      updatingratereview:false,
      postingtick: false,
      rating: 1,
      review: '',
      date: '',
      uid: '',
      delid:'',
      cname:''

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
    setTimeout(()=>this.setState({ loading: false }),1200)
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
    this.setState({ delid:uid,cname:category, loadingownerdetail: true, ownerdetailmodalvisible: true })
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
          Ophoneno: snapshot.val()['phoneno'],
          Oemailid: ownerid,
          uid:ownerid,
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
        plocation:data['Location'],
        pprefrences:data['prefrences'],
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

    this.setState({updatingratereview:true})

    console.log('id',this.state.uid)

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
            Uname: auth().currentUser.email.slice(0,-11),
            review: this.state.review,
            date: ''
          })
        }
      })
      .then(() => {
       console.log('rating',((rating + this.state.rating) / (ratingcount + 1)).toFixed(1))
        database().ref('/users/' + this.state.uid.slice(0, -4)).update({
          rating: parseInt(((rating + this.state.rating) / (ratingcount + 1)).toFixed(1)),
          ratingcount: ratingcount + 1
        })
        this.deletingremainig()
      }).catch((e)=>console.log(e))

  }

  deletingremainig = () => {


    let projectref = firestore().collection('ProjectDetails').doc('Categories').collection(this.state.cname + '').where("Uid", "==", this.state.delid)
   projectref.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.delete();
    });
  }).then(()=>{
    firestore().collection('UserData').doc(this.state.useremail + '').collection('Biddings').where("Uid", "==", this.state.delid)
    .get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    }).then(()=>{
      setTimeout(()=>this.setState({updatingratereview:false}),1000)
      this.setState({
        reviewmodalvisible:false,
        bidderdetailmodal:false,
        postingtick:true
      })
    }).then(()=>setTimeout(()=>this.setState({postingtick:false}),700))
  })
  }
  render() {
    switch (this.state.loading) {
      case false:
        return (
          <View>
            <View style={styles.topview}>
              <Text style={styles.header}>Accepted Bids</Text>
            </View>


            <Modal
              isVisible={this.state.ownerdetailmodalvisible}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >
              {this.state.loadingownerdetail ? <View style={{
                alignItems: 'center',
                justifyContent: 'center'
              }} >
                <RippleLoader color='#7d86f8' />
              </View>
                : <View style={[styles.modal, { height: '50%' }]}>
                  <ImageBackground
                    source={require('../assets/OwnerDetails.png')}
                    resizeMode='stretch'
                    style={styles.image2}
                    imageStyle={styles.image2_imageStyle}
                  >

                    <TouchableOpacity
                      style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}
                      onPress={this.togggleownerdetailmodal}
                    >
                      <Icon
                        name='circle-with-cross'
                        size={22}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      padding: 10,
                      marginTop: 20,
                      borderBottomColor: '#ff7aa2',
                      borderBottomWidth: 0.5,
                    }}>
                      <FontAwesome
                        name='user-circle-o'
                        size={70}
                        color='#15223D'
                      />
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{
                          fontWeight: 'bold',
                          color: '#15223D'
                        }}>@{this.state.Oemailid.slice(0, -10)}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <AirbnbRating
                            count={5}
                            reviews={["Bad", "OK", "Good", "Very Good", "Amazing"]}
                            defaultRating={this.state.Orating}
                            size={20}
                            isDisabled={true}
                            reviewSize={0}
                          />
                          <Text style={{ color: '#F4B400' }}>{this.state.Orating}/5</Text>
                        </View>
                        {this.state.Oratingcount == 0 ? <Text style={{ marginTop: 10, color: '#CCC' }}>No reviews</Text> :
                          <Text style={{ marginTop: 10, color: '#0F9D58' }}>({this.state.Oratingcount}) reviews</Text>}
                      </View>


                    </View>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      padding: 10
                    }}>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${this.state.Ophoneno}`)}
                      >
                        <FontAwesome
                          name='phone-square'
                          size={45}
                          color='#0F9D58'
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`mailto:${this.state.Oemailid}`)}
                      >
                        <MaterialCommunityIcons
                          name='gmail'
                          size={45}
                          color='#D44638'
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={{ paddingHorizontal: 20 }}>Now you can contact the owner..</Text>
                    <TouchableOpacity
                          style={[styles.button, { backgroundColor: '#7d86f8' }]}
                          onPress={() =>  this.editreview()}
                        >
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>Review</Text>
                        </TouchableOpacity>
                  </ScrollView>
                </View>}
            </Modal>

            <Modal
              isVisible={this.state.bidderdetailmodal}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >
              {this.state.loadingbidderinfo ? <View style={{
                alignItems: 'center',
                justifyContent: 'center'
              }} >
                <RippleLoader color='#7d86f8' />
              </View>
                :
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={[styles.modal, { height: '80%' }]}>
                  <ImageBackground
                    source={require('../assets/WorkDetails.png')}
                    resizeMode='stretch'
                    style={styles.image2}
                    imageStyle={styles.image2_imageStyle}
                  >

                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }} onPress={this.toggglebidderdetailmodal}>
                      <Icon
                        name='circle-with-cross'
                        size={22}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                  <View style={{ alignItems: 'center', padding: 10, borderColor: '#ff7aa2', borderBottomWidth: 0.5, borderRadius: 30, marginTop: 20 }}>
                    <Image source={{ uri: this.state.piconurl }} style={styles.icon} />
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Title  :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.ptitle}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row' }]} >
                    <Text style={styles.title}>Budget  :  </Text>
                    <Text style={{ color: '#3cba54' }}>{this.state.pbudget}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row' }]} >
                    <Text style={styles.title}>Location  :  </Text>
                    <Text style={{ color: '#3cba54' }}>{this.state.plocation}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row' }]} >
                    <Text style={styles.title}>Prefrences  :  </Text>
                    <Text style={{ color: '#3cba54' }}>{this.state.pprefrences}</Text>
                  </View>
                  <View style={[styles.section]}>
                    <Text style={styles.title}>Description  :</Text>
                    <Text style={{ marginTop: 5, color: '#15223D' }}>{this.state.pdescription}</Text>
                  </View>
                  
                  <ImageBackground
                    source={require('../assets/MyBid.png')}
                    resizeMode='stretch'
                    style={[styles.image2, { marginTop: 15 }]}
                    imageStyle={styles.image2_imageStyle}
                  >
                  </ImageBackground>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center', marginTop: 25 }]}>
                    <Text style={styles.title}>Project Id  :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.bprojectid}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Description :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.bdescription}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Rate :   </Text>
                    <Text style={{ width: '60%', color: '#74c69d' }}>{this.state.bbudget} Rs</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center', marginBottom: 20 }]}>
                    <Text style={styles.title}>Time :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.btimelimit} </Text>
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
                </View>:
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
              <View style={{height:'90%' ,alignItems: 'center' }}>
              <LottieView source={require('../assets/empty-box.json')} loop={false} autoPlay />
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#CCC',marginTop:'10%' }}>Accepted Bid's will be shown here..</Text>
              </View>:
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
                        <View style={{ marginLeft: 10, width: '65%' }}>
                          <Text style={{ color: '#1d3557', fontWeight: 'bold' }}>{item.Description.slice(0, 25)}...</Text>
                          <Text style={{ color: '#3cba54', marginTop: 10 }}>{item.Rate} Rs</Text>
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
        return  <LottieView source={require('../assets/ProposalLoading.json')} autoPlay />
    }
  }
}

const styles = StyleSheet.create({
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
    borderBottomColor: '#ff7aa2',
    borderBottomWidth: 0.5,
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