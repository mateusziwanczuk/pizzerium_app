import React from "react";
import "./UserOrders.css";
import firebase from "firebase";

class UserOrders extends React.Component {
	state = {
		user: this.props.user,
		orders: []
	};

	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		this.fetchOrders();
	}

	componentDidUpdate(prevProps) {
		if (this.state.user !== prevProps.user) {
			if (this._isMounted) {
				this.setState({ ...this.state, user: this.props.user });
			}
			this.fetchOrders();
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	fetchOrders = () => {
		const { user } = this.props;
		if (user) {
			firebase
				.database()
				.ref(`users/${user.uid}/orders`)
				.once("value")
				.then(snapshot => {
					const ordersObject = snapshot.val();
					if (ordersObject) {
						const ordersArray = Object.keys(ordersObject).map(key => ({
							id: key,
							...ordersObject[key]
						}));
						if (this._isMounted) {
							this.setState({
								...this.state,
								orders: ordersArray
							});
						}
					}
				});
		}
	};

	render() {
		return (
			<div className="user__orders__container">
				<h2>
					<span role="img" aria-label="orders">
						📋{" "}
					</span>
					Historia zamówień:
				</h2>
				{this.state.orders.length === 0 ? (
					<span>Nie złożyłeś jeszcze żadnego zamówienia.</span>
				) : (
					this.state.orders.map(order => {
						return (
							<li key={Math.random()}>
								{order.pizzeria.name} ({order.price} zł)
								<br />
								Kontakt: {order.pizzeria.contactInfo.phone}
							</li>
						);
					})
				)}
			</div>
		);
	}
}

export default UserOrders;
