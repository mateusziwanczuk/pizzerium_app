import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import "../SharedComponents/ListScrollbar.css";
import "./containers.css";
import ListGroup from "react-bootstrap/ListGroup";
import { ListWrapper } from "../SharedComponents/containers";

const styles = theme => ({
	container: {
		maxWidth: "460px",
		width: "100%",
		maxHeight: "500px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("sm")]: {
			height: "100%"
		}
	}
});

async function fetchIngredients() {
	return await fetch("ingredients.json").then(res => res.json());
}
class IngredientsList extends Component {
	state = {
		ingredients: []
	};

	handleClickIngredient = ingredientId => {
		const ingredient = this.state.ingredients.find(
			el => el.id === ingredientId
		);
		this.props.chooseIngredient({ ...ingredient, id: Date.now() });
	};

	componentDidMount() {
		fetchIngredients().then(ingredients => this.setState({ ingredients }));
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<h3 className="list-header" style={{ paddingLeft: 0 }}>
					Wybierz składniki
				</h3>
				<ListWrapper
					className="list-scrollbar"
					style={{
						paddingLeft: 0,
						paddingRight: 15,
						borderRadius: 0,
						height: "100%"
					}}
				>
					<ListGroup>
						{this.state.ingredients.map(element => (
							<ListGroup.Item
								action
								key={element.id}
								onClick={
									!this.props.isPizzaSubmitted
										? () => this.handleClickIngredient(element.id)
										: null
								}
							>
								<h5
									className="mb-1"
									style={{ color: "#495057", textTransform: "capitalize" }}
								>
									{element.name}
								</h5>
							</ListGroup.Item>
						))}
					</ListGroup>
				</ListWrapper>
			</div>
		);
	}
}

export default withStyles(styles)(IngredientsList);
