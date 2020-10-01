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
  Dimensions
} from 'react-native';
import firestore from "@react-native-firebase/firestore";
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo';
import * as Animatable from 'react-native-animatable';

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

      //State variables for project detail modal
      iconUrl: '',
      title: '',
      budget: '',
      description: '',
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

  setProjectDetailModal(Url, title, budget, description) {
    this.setState({
      iconUrl: Url,
      title: title,
      budget: budget,
      description: description,
      modalVisible: true
    })

  }
  render() {
    return (
      <View>
        <View style={styles.topview}>
          <Text style={styles.header}>{this.props.route.params.CategoryName}</Text>
        </View>
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
            <TouchableOpacity style={[styles.button, { backgroundColor: '#74c69d', marginLeft: '30%', marginTop: 15 }]}>
              <Text style={{}}>Bid</Text>
            </TouchableOpacity>
          </View>
        </Modal>

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
                    onPress={() => this.setProjectDetailModal(item.IconUrl, item.Title, item.Budget, item.Description)}
                  >
                    <Text style={{ color: '#522e38', fontWeight: 'bold', fontSize: 15 }}>Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { backgroundColor: '#74c69d' }]}>
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
  }
})