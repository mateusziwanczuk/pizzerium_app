import React, { Component } from "react";
import PizzeriasList from "./PizzeriasList";
import "./pizzerias.css";

class Pizzerias extends Component {
	state = {
		pizzerias: [],
		pizzasFromMenu: []
	};

	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;

		fetch("pizzerias.json")
			.then(resp => resp.json())
			.then(pizzerias => {
				if (this._isMounted) {
					this.setState({ pizzerias });
				}
			});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	selectPizzaFromMenu = pizzaObj => {
		const { pizzasFromMenu } = this.state;

		if (pizzasFromMenu) {
			if (
				!pizzasFromMenu.some(
					pizza => pizza.ingredients === pizzaObj.ingredients
				)
			) {
				this.setState({
					...this.state,
					pizzasFromMenu: [...this.state.pizzasFromMenu, pizzaObj]
				});
			} else {
				const filteredPizzasFromMenu = pizzasFromMenu.filter(
					pizza => pizza.ingredients !== pizzaObj.ingredients
				);
				this.setState({
					...this.state,
					pizzasFromMenu: filteredPizzasFromMenu
				});
			}
		}
	};

	orderPizzas = pizzeria => {
		const { pizzasFromMenu } = this.state;
		const price = pizzasFromMenu.reduce((acc, next) => acc + next.price, 0);
		window.localStorage.setItem(
			"pizzasFromMenu",
			JSON.stringify(pizzasFromMenu)
		);
		window.localStorage.setItem("isPizzaSubmitted", "true");
		window.localStorage.setItem("isCustomOrder", "false");
		window.localStorage.setItem("isPizzeriaSubmitted", "true");
		window.localStorage.setItem("orderTotalPrice", JSON.stringify(price));
		window.localStorage.setItem("orderFromMenu", "true");
		window.localStorage.setItem("selectedPizzeria", JSON.stringify(pizzeria));
		this.props.orderPizzasFromMenu();
		this.props.history.push("/summary-order");
	};

	isPizzaChecked = pizzaObj => {
		const { pizzasFromMenu } = this.state;
		return pizzasFromMenu.some(
			pizza => pizza.ingredients === pizzaObj.ingredients
		);
	};

	render() {
		const { user } = this.props;
		return (
			<div className="pizzerias__container">
				<PizzeriasList
					setItemToLS={this.selectPizzaFromMenu}
					user={user}
					isPizzaChecked={this.isPizzaChecked}
					orderPizzas={this.orderPizzas}
					{...this.props}
				/>
			</div>
		);
	}
}

export default Pizzerias;
