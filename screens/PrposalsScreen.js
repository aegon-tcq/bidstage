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
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AirbnbRating, Rating } from 'react-native-ratings';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const ProposalsRef = firestore().collection('UserData').doc(this.state.useremail+'').collection('Proposals')
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
        <Text style={{ fontSize: 12, color: '#FFF' }}>@{props.gmail.slice(0, -11)}</Text>
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
      name: '',
      skills: '',
      rating: 0,
      ratingcount: 0,
      reviews: [],
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
          name: snapshot.val()['name'],
          rating: snapshot.val()['rating'],
          ratingcount: snapshot.val()['ratingcount'],
          uname: bidid,
          description: Description,
          projectid: id,
          budget: rate,
          timelimit: timelimit,
          bidderdetailmodal: true,
          selected: Selected,
          loadingbidderinfo: false
        })
        if (!(typeof snapshot.val()['skills'] == 'undefined')) {
          this.setState({ skills: snapshot.val()['skills'].join(', ') })
        }
        let newreviews = []
        for (let key in snapshot.val()['review']) {
          newreviews.push(snapshot.val()['review'][key]);
        }
        this.setState({ reviews: newreviews });

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
                <Text style={styles.header}>Proposals</Text>
                <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/proposal.png')} />
              </View>
            </LinearGradient>


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
              style={{ alignItems: 'center', margin: 0 }}
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
              style={{ alignItems: 'center', margin: 0 }}
            >
              <View style={[styles.modal, { padding: 0 }]}>
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
                  <Text style={{
                    fontSize: 18,
                    color: '#7d86f8',
                    fontWeight: 'bold',
                  }}>Bidders Detail</Text>
                  <Image style={{ height: 30, width: 30, borderRadius: 15 }} source={require('../assets/profile.png')} />
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                  <Profilesection1
                    name={this.state.name}
                    rating={this.state.rating}
                    reviews={this.state.ratingcount}
                    gmail={this.state.uname}
                    description={'The definition of a description is a statement that gives details about someone or something. An example of description is a story about the places visited on a family trip. noun.'}

                  />

                  <View style={{
                    width: '95%',
                    marginLeft: '2.5%',
                    justifyContent: 'space-evenly',
                    padding: 15,
                    borderBottomLeftRadius:20,
                    borderTopRightRadius:20,

                  }}><View style={styles.section}>
                      <Image
                        source={require('../assets/proposal.png')}
                        style={{ height: 40, width: 40 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10, fontSize: 20 }} >Proposal</Text>

                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/004-id-1.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >ProjectId   :  </Text>
                      <Text style={{ color: '#a0caeb', marginLeft: 10 }}>{this.state.projectid}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/icons8-rupee-100.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Rate   :  </Text>
                      <Text style={{ color: '#fc9454', marginLeft: 10, fontWeight: 'bold' }}>{this.state.budget}Rs</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/002-clock.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Time   :  </Text>
                      <Text style={{ color: '#373796', marginLeft: 10 }}>{this.state.timelimit}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/001-experience.png')}
                        style={{ height: 20, width: 20 }}
                      />
                      <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Experience   :  </Text>
                      <Text style={{ color: '#e2a876', marginLeft: 10 }}>{this.state.skills}</Text>
                    </View>
                    <View style={[styles.section, { flexDirection: 'column' }]}>
                      <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <Image
                          source={require('../assets/003-id.png')}
                          style={{ height: 20, width: 20 }}
                        />
                        <Text style={{ color: '#1D2B64', marginLeft: 10 }} >Description  : </Text>
                      </View>    
                        <Text style={{ color: '#7f95b8',marginTop:10 ,marginLeft: 10}}>{this.state.description}</Text>
                    </View>
                    <View style={styles.section}>
                      <Image
                        source={require('../assets/review.png')}
                        style={{ height: 40, width: 40 }}
                      />
                      <Text style={{ color: '#fd6000', marginLeft: 10, fontSize: 20 }} >Reviews</Text>
                    </View>
                    <FlatList
                      data={this.state.reviews}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <View style={{
                          borderColor: '#dbecf7',
                          borderBottomWidth: 0.5,
                          padding: 15,
                          borderRadius: 20
                        }}>
                          <Text style={{ fontWeight: 'bold', color: '#15223D' }}>@{item.Uname}</Text>
                          <Text style={{ marginTop: 5,color:'#7f95b8' }}>{item.review}</Text>
                        </View>
                      )}

                    />
                  </View>
                  
                </ScrollView>
                
               
                {this.state.selected ?
                  <TouchableOpacity
                    style={[styles.button, {  width: '40%', borderColor:'#7d86f8',borderWidth:1, marginLeft: '30%',borderRadius:50 ,marginBottom:10}]}
                    onPress={() => this.editreview(this.state.uname, this.state.projectid)}
                  >
                    <Text style={{ color: '#7d86f8', fontWeight: 'bold', fontSize: 15 }}>Rate</Text>
                  </TouchableOpacity> :
                  <TouchableOpacity
                    style={[styles.button, { width: '40%', backgroundColor: '#74c69d', marginLeft: '30%',borderRadius:50 ,marginBottom:10}]}
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


            {this.state.poroposals.length == 0 ?
              <View style={{ height: '90%', alignItems: 'center', backgroundColor: '#FFF' }}>
                <LottieView source={require('../assets/empty-box.json')} loop={false} autoPlay />
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#CCC', marginTop: '10%' }}>No proposals yet..</Text>
              </View> :
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
                            style={[styles.button, {  borderColor:'#7d86f8',borderWidth:1,borderRadius:20}] }
                            onPress={() => this.editreview(item.BidId, item.Uid)}
                          >
                            <Text style={{ color: '#7d86f8', fontWeight: 'bold', fontSize: 15 }}>Rate</Text>
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
    height: '100%',
    width: '100%',
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