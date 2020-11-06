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
  Alert
} from 'react-native';
import database from '@react-native-firebase/database';
import firestore from "@react-native-firebase/firestore";
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AirbnbRating, Rating } from 'react-native-ratings';
import LottieView from 'lottie-react-native';


// const ProposalsRef = firestore().collection('UserData').doc(this.state.useremail+'').collection('Proposals')
let onEndReachedCalledDuringMomentum = false;


const hired = () => {
  return <LottieView source={require('../assets/tick.json')} autoPlay loop />
}

export default class PrposalsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: null,
      isLoading: null,
      moreLoading: null,
      poroposals: [],
      lastDoc: [],
      bidderdetailmodal: false,

      useremail: '',
      //state variable for bidder detail
      loadingbidderinfo: false,
      skills: '',
      rating: 0,
      uname: '',
      description: '',
      timelimit: '',
      budget: '',
      projectid: '',
      selected: false,
      hiring: false,

      //state variable for reviewing 
      reviewmodalvisible: false,
      updatingratereview: false,
      postingtick: false,
      rating: 1,
      review: '',
      date: '',
      uid: '',
      delid: ''

    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          useremail: user.email
        })
        console.log(user.email)
        this.getProposals();
      }
    });


  }

  getProposals = async () => {

    this.setState({ isLoading: true });

    const snapshot = await firestore().collection('UserData').doc(this.state.useremail + '').collection('Proposals').orderBy('Uid').limit(4).get();

    if (!snapshot.empty) {
      let newProposals = [];

      this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

      for (let i = 0; i < snapshot.docs.length; i++) {
        newProposals.push(snapshot.docs[i].data());
      }

      this.setState({ poroposals: newProposals })
      console.log('Proposals', newProposals)
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
        let snapshot = await firestore().collection('UserData').doc(this.state.useremail + '').collection('Proposals').orderBy('Uid').startAfter(this.state.lastDoc.data().Uid).limit(4).get();

        if (!snapshot.empty) {
          let newProposals = this.state.projects;

          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

          for (let i = 0; i < snapshot.docs.length; i++) {

            newProposals.push(snapshot.docs[i].data());
          }

          this.setState({ poroposals: newProposals })
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
      this.getProposals();
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

  toggglebidderdetailmodal = () => {
    this.setState({ bidderdetailmodal: !this.state.bidderdetailmodal });
  }

  togglereviewmodal = () => {
    this.setState({ reviewmodalvisible: !this.state.reviewmodalvisible })
  }
  setbidderdetail = (bidid, Description, id, rate, timelimit, Selected) => {
    this.setState({ loadingbidderinfo: true })
    database()
      .ref('/users/' + bidid.slice(0, -4))
      .on('value', snapshot => {
        console.log('User data: ', snapshot.val());
        this.setState({
          skills: snapshot.val()['skills'].join(', '),
          rating: snapshot.val()['rating'],
          uname: bidid,
          description: Description,
          projectid: id,
          budget: rate,
          timelimit: timelimit,
          bidderdetailmodal: true,
          selected: Selected,
          loadingbidderinfo: false
        })


      });

  }

  checkhirebidder = (BidId, docid) => {
    Alert.alert(
      "Confirmation.",
      "Are you sure..!",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Yes", onPress: () => this.hirebidder(BidId, docid) }
      ],
      { cancelable: false }
    );
  }

  hirebidder = (BidId, docid) => {

    this.setState({ hiring: true })

    firestore().collection('UserData').doc(this.state.useremail + '').collection('Proposals').doc(docid + '').update({
      Selected: true,
    }).then(() => firestore().collection('UserData').doc(BidId + '').collection('Biddings').doc(docid + '').update({
      Selected: true
    }).then(this.onWriteSuccess)
      .catch(function (error) {
        Alert.alert('Error!', error, [
          { text: 'Retry' }
        ])
      }))
  }

  onWriteSuccess = () => {
    this.setState({
      bidmodalVisible: false,
      bidderdetailmodal: false
    })
    setTimeout(() => this.setState({ hiring: false }), 800)
    this.componentDidMount()
  }

  editreview = (val, id) => {
    this.setState({ uid: val, delid: id })
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

    console.log(this.state.uid)

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

        database().ref('/users/' + this.state.uid.slice(0, -4)).update({
          rating: parseInt(((rating + this.state.rating) / (ratingcount + 1)).toFixed(1)),
          ratingcount: ratingcount + 1
        })
        this.deletingremainig()
      }).catch((e) => console.log(e))

  }

  deletingremainig = () => {
    let cname = ''
    console.log(this.state.delid)

    for (let i = 0; i < this.state.poroposals.length; i++) {
      if (this.state.poroposals[i].Uid == this.state.delid) {
        cname = this.state.poroposals[i].Category
        break
      }
    }


    firestore().collection('UserData').doc(this.state.useremail + '').collection('Proposals').where("Uid", "==", this.state.delid)
      .get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      })
      .then(() => {
        firestore().collection('UserData').doc(this.state.uid + '').collection('Biddings').doc(this.state.delid + '').update({
          Reviewed: true
        }).then(() => {
          setTimeout(() => this.setState({ updatingratereview: false }), 1000)
          this.setState({
            reviewmodalvisible: false,
            bidderdetailmodal: false,
            postingtick: true
          })
        })
      }).then(() => setTimeout(() => this.setState({ postingtick: false }), 700))

    console.log('All complete')
  }


  render() {
    switch (this.state.loading) {
      case false:
        return (
          <View>
            <View style={styles.topview}>
              <Text style={styles.header}>Proposals</Text>
            </View>


            <Modal
              isVisible={this.state.hiring}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >

              <LottieView source={require('../assets/tick-green.json')} autoPlay />
              <Text style={{ fontWeight: 'bold', color: '#FFF', marginTop: 150 }}>Bidder Will contact you shortly</Text>
            </Modal>
            <Modal
              isVisible={this.state.loadingbidderinfo}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >

              <View style={styles.modal}>
                <LottieView source={require('../assets/formloading.json')} autoPlay />
              </View>

            </Modal>

            {/**********************************Bidder Detail Modal*************************************************/}
            <Modal
              isVisible={this.state.bidderdetailmodal}
              animationIn={"zoomInDown"}
              animationOut={"zoomOutUp"}
              useNativeDriver={true}
              style={{ alignItems: 'center' }}
            >
              <View style={styles.modal}>
                <ImageBackground
                  source={require('../assets/BidderDetails.png')}
                  resizeMode='stretch'
                  style={styles.image2}
                  imageStyle={styles.image2_imageStyle}
                >

                  <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}
                    onPress={this.toggglebidderdetailmodal}
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
                    marginTop: 20
                  }}>
                    <FontAwesome
                      name='user-circle-o'
                      size={70}
                      color='#15223D'
                    />
                    <View style={{
                      alignItems: 'center',
                    }}>
                      <Text style={styles.title}>@{this.state.uname.slice(0, -10)}</Text>
                      <AirbnbRating
                        count={5}
                        reviews={["Bad", "OK", "Good", "Very Good", "Amazing"]}
                        defaultRating={this.state.rating}
                        size={20}
                        isDisabled={true}
                        reviewSize={0}
                      />
                    </View>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Project Id  :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.projectid}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Description :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.description}</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Rate :   </Text>
                    <Text style={{ width: '60%', color: '#74c69d' }}>{this.state.budget} Rs</Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Time :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.timelimit} </Text>
                  </View>
                  <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.title}>Skills :   </Text>
                    <Text style={{ width: '60%', color: '#15223D' }}>{this.state.skills} </Text>
                  </View>
                </ScrollView>
                {this.state.selected ?
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#74c69d' }]}
                    onPress={() => this.editreview(this.state.uname, this.state.projectid)}
                  >
                    <Text style={{ color: '#081c15', fontWeight: 'bold', fontSize: 15 }}>Review</Text>
                  </TouchableOpacity> :
                  <TouchableOpacity
                    style={[styles.button, { width: '40%', backgroundColor: '#74c69d', marginLeft: '30%', marginTop: 15 }]}
                    onPress={() => this.checkhirebidder(this.state.uname, this.state.projectid)}
                  >
                    <Text style={{ color: '#081c15', fontWeight: 'bold', fontSize: 15 }}>Hire</Text>
                  </TouchableOpacity>}
              </View>
            </Modal>

            {/**********************************Review Modal*************************************************/}
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
                        fractions={1}
                        showRating
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

            {/**********************************Lists of porposals*************************************************/}


            {this.state.poroposals.length == 0?
            <View style={{height:'90%' ,alignItems: 'center',backgroundColor:'#FFF' }}>
                <LottieView source={require('../assets/empty-box.json')} loop={false} autoPlay />
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#CCC',marginTop:'10%' }}>No proposals yet..</Text>
              </View>:
            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              data={this.state.poroposals}
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
                        <Text style={{ color: '#1d3557', fontWeight: 'bold' }}>{item.Description.slice(0, 35)}...</Text>
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
                        onPress={() => this.setbidderdetail(item.BidId, item.Description, item.Uid, item.Rate, item.TimeLimit, item.Selected)}
                      >
                        <Text style={{ color: '#522e38', fontWeight: 'bold', fontSize: 15 }}>Bidders Details</Text>
                      </TouchableOpacity>


                      {item.Selected ?
                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: '#74c69d' }]}
                          onPress={() => this.editreview(item.BidId, item.Uid)}
                        >
                          <Text style={{ color: '#081c15', fontWeight: 'bold', fontSize: 15 }}>Review</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: '#74c69d' }]}
                          onPress={() => this.checkhirebidder(item.BidId, item.Uid)}
                        >

                          <Text style={{ color: '#081c15', fontWeight: 'bold', fontSize: 15 }}>Hire</Text>
                        </TouchableOpacity>}
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
    borderRadius: 20,
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
    height: '80%',
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
  },
  action: {
    flexDirection: 'row',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    alignItems: 'center'
  },
  text_footer: {
    marginTop: 20,
    color: '#15223D'
  }
})