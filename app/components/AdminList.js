import React from "react";
import {
	Text, StyleSheet,
    View,  
} from "react-native";
import { observer, inject } from "mobx-react";
class AdminList extends React.PureComponent {

    constructor(props){
        super(props);
    }
    render() {
        return (
            <View></View>
        )
    }
}
export default inject("rootStore")(observer(AdminList));