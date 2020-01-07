import React, { Component } from "react";
import { StyleSheet} from "react-native";
import COLOR from '../services/AppColor';
import { View } from "react-native-animatable";
// import bgSrc from '../assets/images/rubrik_background.png';

export default class Wallpaper extends Component {
  render() {
    return (
     
        <View style={styles.picture}>
          {this.props.children}
        </View>
        
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    // width: null,
    // height: null,
    // resizeMode: "cover"
    // backgroundColor: COLOR.ROOT_BG_COLOR
    backgroundColor: COLOR.HEADER_BG_COLOR
  }
});
