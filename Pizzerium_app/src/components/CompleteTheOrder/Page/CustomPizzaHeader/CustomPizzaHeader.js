import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";

const styles = theme => ({
	leftPane: {
		width: "50%"
	},
	rightPane: {
		width: "50%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	}
});

class CustomPizzaHeader extends Component {
	state = {};
	render() {
		const {
			classes,
			ingredients,
			cancelIngredients,
			isPizzeriaSelected
		} = this.props;
		let allIngredients = "";

		return (
			<Fragment>
				<h3 style={{ width: "100%" }}>Wybrana pizza:</h3>
				<div
					className="list-group-item list-group-item-action flex-column align-items-start"
					style={{
						overflowWrap: "break-word",
						wordWrap: "break-word"
					}}
				>
					<div className="d-flex w-100 justify-content-between">
						<div className={classes.leftPane}>
							<h5 className="mb-1">
								<span
									style={{ display: "block", marginBottom: 5, width: "100%" }}
								>
									Składniki:{" "}
								</span>
								{ingredients.forEach(ingredient => {
									if (allIngredients.length > 0) {
										allIngredients += ", ";
									}
									allIngredients += ingredient.name;
								})}
								{allIngredients}
							</h5>
						</div>
						<div className={classes.rightPane}>
							{!isPizzeriaSelected && (
								<Button
									className="d-inline custom-button btn-secondary"
									style={{
										width: 140,
										height: 35,
										fontSize: 14,
										padding: "5px 7px",
										margin: 0
									}}
									variant="link"
									onClick={cancelIngredients}
								>
									{"Anuluj pizzę"}
								</Button>
							)}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default withStyles(styles)(CustomPizzaHeader);
