import React from "react";
import firebase from "firebase";
import "./SayHello.css";

class SayHello extends React.Component {
	state = {
		user: null
	};

	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		const ref = firebase.auth().onAuthStateChanged(user => {
			if (user && this._isMounted) {
				this.setState({
					authUser: user,
					authUserId: user.uid,
					authUserEmail: user.email,
					authUserRegistered: user.metadata.creationTime
						.replace(/GMT/gi, "")
						.substring(4, user.metadata.creationTime.length - 13),
					authIsChecked: true
				});
			}
			const databaseRef = firebase.database().ref("users");
			databaseRef.once("value").then(snapshot => {
				const snapshotVal = snapshot.val() || {};
				const findUser = Object.keys(snapshotVal)
					.map(key => ({
						id: key,
						...snapshotVal[key]
					}))
					.filter(user => {
						return user.id === this.state.authUserId;
					});
				const user = findUser[0];
				if (this._isMounted) {
					this.setState({
						user,
						userFirstName: user.name.split(" ")[0]
					});
				}
			});
		});
		this.setState({ ref });
	}

	componentWillUnmount() {
		this.state.ref && this.state.ref();
		this._isMounted = false;
	}

	render() {
		return (
			<div className="user__sayhello__container">
				<h1>
					<span role="img" aria-label="pizza">
						🍕{" "}
					</span>
					Witaj {this.state.user ? this.state.userFirstName : null}!
				</h1>
				<span>Data dołączenia: {this.state.authUserRegistered}</span>
			</div>
		);
	}
}

export default SayHello;
