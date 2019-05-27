import React from 'react';
import firebase from "firebase";

class Auth extends React.Component {
    state = {
        user: null,
        isChecked: false
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user =>
            this.setState({
                user,
                isChecked: true
            }))
    }

    render() {
        return this.state.user
            ? this.props.children 
            : this.state.isChecked
    } 

}

export default Auth