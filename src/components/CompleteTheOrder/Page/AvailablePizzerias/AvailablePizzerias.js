import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { ListWrapper } from "../../../SharedComponents/containers";
import PizzeriaList from "./PizzeriaList/PizzeriaList";

const styles = theme => ({
	wrapper: {
		width: "100%"
	},
	list: {
		padding: 0,
		paddingRight: 10,
		borderRadius: 0,
		[theme.breakpoints.down("sm")]: {
			height: "62vh"
		}
	}
});

const AvailablePizzerias = props => {
	const {
		classes,
		isPizzeriaSelected,
		selectedPizzeria,
		unselectPizzeria,
		pizzerias,
		ingredients,
		submitSelectedPizzeria,
		choosePizzeria
	} = props;

	const list = pizzerias.filter(pizzeria => {
		return ingredients.every(ingredient => {
			return pizzeria.availableIngredients.some(
				element => element.name === ingredient.name
			);
		});
	});

	return (
		<div className={classes.wrapper}>
			<h3>Dostępne pizzerie:</h3>
			<ListWrapper className={classes.list}>
				<PizzeriaList
					pizzerias={list}
					selectPizzeria={choosePizzeria}
					ingredients={ingredients}
					isPizzeriaSelected={isPizzeriaSelected}
					selectedPizzeria={selectedPizzeria}
					unselectPizzeria={unselectPizzeria}
					submitSelectedPizzeria={submitSelectedPizzeria}
				/>
			</ListWrapper>
		</div>
	);
};

export default withStyles(styles)(AvailablePizzerias);
