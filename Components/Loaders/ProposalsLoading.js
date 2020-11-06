import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


const { width, height } = Dimensions.get('window');

const ProposalsLoading = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.conatiner}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10,justifyContent:'space-around' }}>
        <View style={styles.icon} />
        <View style={{ marginLeft: 20 }}>
          <View style={styles.title} />
          <View
            style={styles.rate}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row',justifyContent:'space-around',marginTop:10 }}>
        <View style={styles.button}></View>
        <View style={styles.button}></View>
      </View>
      </View>
      <View style={styles.conatiner}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10,justifyContent:'space-around' }}>
        <View style={styles.icon} />
        <View style={{ marginLeft: 20 }}>
          <View style={styles.title} />
          <View
            style={styles.rate}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row',justifyContent:'space-around',marginTop:10 }}>
        <View style={styles.button}></View>
        <View style={styles.button}></View>
      </View>
      </View>
      <View style={styles.conatiner}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10,justifyContent:'space-around' }}>
        <View style={styles.icon} />
        <View style={{ marginLeft: 20 }}>
          <View style={styles.title} />
          <View
            style={styles.rate}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row',justifyContent:'space-around',marginTop:10 }}>
        <View style={styles.button}></View>
        <View style={styles.button}></View>
      </View>
      </View>
      <View style={styles.conatiner}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10,justifyContent:'space-around' }}>
        <View style={styles.icon} />
        <View style={{ marginLeft: 20 }}>
          <View style={styles.title} />
          <View
            style={styles.rate}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row',justifyContent:'space-around',marginTop:10 }}>
        <View style={styles.button}></View>
        <View style={styles.button}></View>
      </View>
      </View>
      
    </SkeletonPlaceholder>
  );
};

export default ProposalsLoading;

const styles = StyleSheet.create({
  conatiner: {
    marginTop:10,
    padding:10,
    borderBottomColor:'#CCC',
    borderRadius:20,
    borderBottomWidth:0.5
  },
  item: {

    flexDirection: 'row'
  },
  icon: {
    backgroundColor:'#000',
    width: 100,
    height: 100,
    borderRadius: 50
  },
  title: {
    width: 120,
    height: 15,
    borderRadius: 20
  },
  rate: {
    marginTop: 6,
    width: 80,
    height: 10,
    borderRadius: 20
  },
  button : {
    height:height*0.05,
    width:width*0.35,
    borderRadius:20
  }
})