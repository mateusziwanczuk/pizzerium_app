import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import "bootstrap/dist/css/bootstrap.css";
import "../SharedComponents/ListScrollbar.css";
import "./containers.css";
import "./create-pizza-button.css";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { ListWrapper } from "../SharedComponents/containers";

const styles = theme => ({
	wrapper: {
		height: "359.5px",
		[theme.breakpoints.down("sm")]: {
			height: 150,
			padding: 0,
			borderRadius: 0
		}
	},
	listContainer: {
		naxWidth: "440px",
		width: "100%",
		maxHeight: "500px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("sm")]: {
			justifyContent: "space-between",
			height: "100%",
			alignItems: "baseline"
		}
	},
	header: {
		width: "100%",
		padding: "1rem 2rem",
		[theme.breakpoints.down("sm")]: {
			height: "auto",
			padding: "1.5rem 2rem 0 4rem"
		}
	},
	btnContainer: {
		display: "flex",
		justifyContent: "space-around",
		width: "100%",
		marginTop: "2rem",
		[theme.breakpoints.down("sm")]: {
			marginTop: "1rem"
		}
	},
	btn: {
		lineHeight: 1,
		[theme.breakpoints.down("sm")]: {
			fontSize: 16,
			width: 140,
			height: "auto",
			margin: 0
		}
	}
});

const getFromLocalStorage = item => {
	return JSON.parse(window.localStorage.getItem(item));
};

const YourIngredients = ({
	classes,
	ingredients,
	removeIngredient,
	clearIngredients,
	submitIngredients,
	isPizzaSubmitted
}) => {
	const chosenIngredients =
		getFromLocalStorage("ingredients") !== null &&
		getFromLocalStorage("ingredients").length > 0
			? getFromLocalStorage("ingredients")
			: ingredients;

	return (
		<div className={classes.listContainer}>
			<h3 className={classes.header}>Twoje wybrane składniki: </h3>
			<ListWrapper className={classes.wrapper}>
				<ListGroup>
					{chosenIngredients.map((element, id) => (
						<ListGroup.Item action key={id}>
							<h5
								className="mb-1"
								style={{ color: "#495057", textTransform: "capitalize" }}
							>
								{element.name}
								<span
									className="close"
									onClick={
										isPizzaSubmitted ? null : () => removeIngredient(element.id)
									}
								>
									&times;
								</span>
							</h5>
						</ListGroup.Item>
					))}
				</ListGroup>
			</ListWrapper>
			<div className={classes.btnContainer}>
				<OverlayTrigger
					placement="top"
					overlay={
						<Tooltip
							style={ingredients.length > 0 ? { display: "none" } : null}
							id={`tooltip-submitIngredients`}
						>
							Wybierz przynajmniej jeden składnik!
						</Tooltip>
					}
				>
					<Button
						className={classNames(
							classes.btn,
							"d-inline custom-button create-pizza-button"
						)}
						variant="link"
						onClick={
							!isPizzaSubmitted && ingredients.length !== 0
								? () => submitIngredients()
								: null
						}
						disabled={isPizzaSubmitted ? true : false}
					>
						Złóż zamówienie
					</Button>
				</OverlayTrigger>
				<Button
					className={classNames(
						classes.btn,
						"d-inline custom-button btn-secondary"
					)}
					onClick={clearIngredients}
				>
					Wyczyść
				</Button>
			</div>
		</div>
	);
};

export default withStyles(styles)(YourIngredients);
