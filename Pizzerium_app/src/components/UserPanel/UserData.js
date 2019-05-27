import React from "react";
import firebase from "firebase";
import DeleteUser from "./DeleteUser";

class Nickname extends React.Component {
	state = {
		authUser: null,
		authUserRegistered: "",
		authUserEmail: "",
		authIsChecked: false,
		showInput: false
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
					authUserRegistered: user.metadata.creationTime,
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

	editUserData = () => {
		const doInputsShow = this.state.showInput;
		this.setState({
			showInput: !doInputsShow
		});
		let inputs = document.querySelectorAll(
			".user__userdata__container__datainput"
		);
		if (this.state.showInput) {
			inputs.forEach(input => input.classList.add("unvisible"));
		} else {
			inputs.forEach(input => input.classList.remove("unvisible"));
		}
	};

	editAddress = e => {
		if (this.state.user) {
			this.setState(
				{
					user: {
						...this.state.user,
						street: e.target.value
					}
				},
				() => {
					firebase
						.database()
						.ref(`users/${this.state.authUserId}`)
						.update({ street: this.state.user.street });
				}
			);
		}
	};

	editCity = e => {
		if (this.state.user) {
			this.setState(
				{
					user: {
						...this.state.user,
						city: e.target.value
					}
				},
				() => {
					firebase
						.database()
						.ref(`users/${this.state.authUserId}`)
						.update({ city: this.state.user.city });
				}
			);
		}
	};

	editPhoneNum = e => {
		if (this.state.user) {
			this.setState(
				{
					user: {
						...this.state.user,
						phone: e.target.value
					}
				},
				() => {
					firebase
						.database()
						.ref(`users/${this.state.authUserId}`)
						.update({ phone: this.state.user.phone });
				}
			);
		}
	};

	render() {
		return (
			<div className="user__userdata__container">
				<h2>
					<span role="img" aria-label="user">
						👤{" "}
					</span>
					Twoje dane:
				</h2>
				<div className="user__userdata__container__data">
					<h5>• e-mail: {this.state.authUserEmail}</h5>
					<h5>• ulica: {this.state.user ? this.state.user.street : null}</h5>
					<div className="user__userdata__container__datainput unvisible">
						<input
							type="text"
							value={this.state.user ? this.state.user.street : ""}
							onChange={this.editAddress}
						/>
						<button onClick={this.editUserData}>
							<span role="img" aria-label="phone">
								💾
							</span>
						</button>
					</div>
					<h5>• miasto: {this.state.user ? this.state.user.city : null}</h5>
					<div className="user__userdata__container__datainput unvisible">
						<input
							type="text"
							value={this.state.user ? this.state.user.city : ""}
							onChange={this.editCity}
						/>
						<button onClick={this.editUserData}>
							<span role="img" aria-label="phone">
								💾
							</span>
						</button>
					</div>
					<h5>• telefon: {this.state.user ? this.state.user.phone : null}</h5>
					<div className="user__userdata__container__datainput unvisible">
						<input
							type="text"
							value={this.state.user ? this.state.user.phone : ""}
							onChange={this.editPhoneNum}
						/>
						<button onClick={this.editUserData}>
							<span role="img" aria-label="phone">
								💾
							</span>
						</button>
					</div>
				</div>
				<div className="user__userdata__container__buttons">
					<div
						className="user__userdata__container__button"
						onClick={this.editUserData}
					>
						<span>Edytuj Profil</span>
					</div>
					<DeleteUser />
				</div>
			</div>
		);
	}
}

export default Nickname;
