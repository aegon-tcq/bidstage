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
import firestore from "@react-native-firebase/firestore";
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BubblesLoader } from 'react-native-indicator';
import auth from '@react-native-firebase/auth';

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

      //State variables for Bidding modal
      deadline: '',
      biddescription: '',
      bidbudget: '',
      validinfo: null,
      placebidloading:false,
      
      // state variable for placing bid
      BUid:'',
      Bcategory:'',
      Ownerid:''
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
    this.setState({ isLoading: false });
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
      getProjects();
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
    this.setState({bidmodalVisible:!this.state.bidmodalVisible});
  }
  setBidDetailModal = (buid,bcategory,pid) => {
    this.setState({
      modalVisible: false,
      BUid:buid,
      Bcategory:bcategory,
      Ownerid:pid,
      bidmodalVisible: true
    });
  }
  setProjectDetailModal = (Url, title, budget, description,buid,bcategory,pid) =>{
    this.setState({
      iconUrl: Url,
      title: title,
      budget: budget,
      description: description,
      BUid:buid,
      Bcategory:bcategory,
      Ownerid:pid,
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

    this.setState({placebidloading:true})
    let user = auth().currentUser

    firestore().collection('UserData').doc(this.state.Ownerid+'').collection('Proposals').doc(this.state.BUid+'').set({
      Rate:this.state.bidbudget,
      TimeLimit:this.state.deadline,
      Description:this.state.biddescription,
      Category:this.state.Bcategory,
      Uid:this.state.BUid,
      Selected:false
    }).then(()=>firestore().collection('UserData').doc(user.email+'').collection('Biddings').doc(this.state.BUid+'').set({
      Rate:this.state.bidbudget,
      TimeLimit:this.state.deadline,
      Description:this.state.biddescription,
      Category:this.state.Bcategory,
      Uid:this.state.BUid,
      Selected:false
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
      bidmodalVisible:false
    })
    if (this.state.placebidloading == false) {
        Alert.alert('Bid Placed', 'You will get notified when your bid is selected..', [
            { text: 'Okay' }
        ]);
        return;
    }

}
  render() {
    return (
      <View>


        {/*******************************************Header*******************************************************/}

        <View style={styles.topview}>
          <Text style={styles.header}>{this.props.route.params.CategoryName}</Text>
        </View>

        {/*************************Project Details Modal***********************************************************/}

        <Modal
          isVisible={this.state.modalVisible}
          animationIn={"zoomInDown"}
          animationOut={"zoomOutUp"}
          useNativeDriver={true}
          style={{ alignItems: 'center' }}
        >
          <View style={styles.modal}>
            <ImageBackground
              source={require('../assets/Details.png')}
              resizeMode='stretch'
              style={styles.image2}
              imageStyle={styles.image2_imageStyle}
            >

              <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }} onPress={this.toggleModal}>
                <Icon
                  name='circle-with-cross'
                  size={22}
                />
              </TouchableOpacity>
            </ImageBackground>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View style={{ alignItems: 'center', padding: 10, borderColor: '#ff7aa2', borderBottomWidth: 0.5, borderRadius: 30, marginTop: 20 }}>
                <Image source={{ uri: this.state.iconUrl }} style={styles.icon} />
              </View>
              <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={styles.title}>Title  :   </Text>
                <Text style={{ width: '60%', color: '#15223D' }}>{this.state.title}</Text>
              </View>
              <View style={[styles.section]}>
                <Text style={styles.title}>Description  :</Text>
                <Text style={{ marginTop: 5, color: '#15223D' }}>{this.state.description}</Text>
              </View>
              <View style={[styles.section, { flexDirection: 'row' }]} >
                <Text style={styles.title}>Budget  :  </Text>
                <Text style={{ color: '#3cba54' }}>{this.state.budget}</Text>
              </View>

            </ScrollView>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#74c69d', marginLeft: '30%', marginTop: 15 }]}
              onPress={() => this.setBidDetailModal(this.state.BUid,this.state.Bcategory,this.state.Ownerid)}
            >
              <Text style={{ color: '#081c15', fontWeight: 'bold', fontSize: 15 }}>Bid</Text>
            </TouchableOpacity>
          </View>
        </Modal>


        {/*************************Project Bid Modal***********************************************************/}


        <Modal
          isVisible={this.state.bidmodalVisible}
          animationIn={"zoomInDown"}
          animationOut={"zoomOutUp"}
          useNativeDriver={true}
          style={{ alignItems: 'center' }}
        >
          {this.state.placebidloading ?
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }} >
              <BubblesLoader color='#7d86f8' />
            </View>
            : <View style={[styles.modal, { height: '70%' }]}>
              <ImageBackground
                source={require('../assets/SubmitBidForm.png')}
                resizeMode='stretch'
                style={styles.image2}
                imageStyle={styles.image2_imageStyle}
              >

                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }} onPress={this.togglebidmodal}>
                  <Icon
                    name='circle-with-cross'
                    size={22}
                  />
                </TouchableOpacity>
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
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: '#FF3E89',
                    borderRadius: 20,
                    width: '40%',
                    alignItems: 'center',
                    marginTop: 20,
                    marginLeft: '30%',
                    marginBottom: 20
                  }}
                  onPress={this.submitbiddetail}>
                  <Text style={{ fontWeight: 'bold', color: '#FFF' }}>PlaceBid</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>}
        </Modal>


        {/*************************Project Listings***********************************************************/}


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
                imageStyle={{ borderRadius: 20 }}
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
                    onPress={() => this.setProjectDetailModal(item.IconUrl, item.Title, item.Budget, item.Description,item.Uid,this.props.route.params.CategoryName,item.Pid)}
                  >
                    <Text style={{ color: '#522e38', fontWeight: 'bold', fontSize: 15 }}>Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#74c69d' }]}
                    onPress={() => this.setBidDetailModal(item.Uid,this.props.route.params.CategoryName,item.Pid)}
                  >
                    <Text style={{ color: '#081c15', fontWeight: 'bold', fontSize: 15 }}>Bid</Text>
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
        />
      </View>
    )
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
    width: '40%',
    padding: 10,
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
  }
})