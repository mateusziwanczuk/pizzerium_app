import React, { Component, Fragment } from "react";
import firebase from "firebase";
import classNames from "classnames";
import styled from "styled-components";
import ReactSVG from "react-svg";
import { Link } from "react-router-dom";
import { Icon as BaseIcon } from "react-icons-kit";
import { dashboard } from "react-icons-kit/fa/dashboard";
import { user } from "react-icons-kit/fa/user";
import { chart_7_8 as pizza } from "react-icons-kit/ikons/chart_7_8";
import { shoppingCart } from "react-icons-kit/fa/shoppingCart";
import { creditCardAlt } from "react-icons-kit/fa/creditCardAlt";
import { userTimes } from "react-icons-kit/fa/userTimes";
import { cutlery } from "react-icons-kit/fa/cutlery";
import { withStyles } from "@material-ui/core/styles";
import { MdMenu } from "react-icons/md";
import { Redirect } from "react-router-dom";

const Navigation = styled.div`
	background: #303641;
	color: #8d97ad;
	font-size: 1em;
	letter-spacing: 2px;
	width: 160px;
	height: 100vh;
	line-height: 16px;
	border: none;
`;

const IconCnt = styled.div`
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Text = styled.div`
	font-size: 0.72em;
	text-transform: uppercase;
	text-align: center;
	width: 100%;
	margin-top: 3px;
`;

const NavLink = styled(Link)`
	box-sizing: border-box;
	flex-direction: column;
	display: flex;
	padding: 0;
	color: inherit;
	text-decoration: none;
	width: 100%;
	padding: 8px 12px;
	transition: all 0.3s ease;
	&:hover {
		color: #fff;
		background-color: #a5182e;
		text-decoration: none;
	}
`;

const styles = theme => ({
	menuBtn: {
		display: "none",
		[theme.breakpoints.down("sm")]: {
			display: "block",
			position: "fixed",
			top: 10,
			left: 10,
			fontSize: 50,
			zIndex: 1500,
			color: "black"
		}
	},
	navigation: {
		transition: "all .5s ease",
		[theme.breakpoints.down("sm")]: {
			position: "fixed",
			zIndex: 1100,
			top: 0
		}
	},
	openedNav: {
		[theme.breakpoints.down("sm")]: {
			transform: "translateX(0%)"
		}
	},
	closedNav: {
		[theme.breakpoints.down("sm")]: {
			transform: "translateX(-100%)"
		}
	},
	navItemSelected: {
		backgroundColor: "#cc3333",
		color: "#FFF"
	},
	navDisabled: {
		backgroundColor: "#343743",
		"&:hover": {
			backgroundColor: "#343743"
		}
	},
	iconDisable: {
		color: "#a0a0a0"
	},
	textDisabled: {
		color: "#c4c4c4"
	},
	logo: {
		marginLeft: 10,
		[theme.breakpoints.down("sm")]: {
			marginLeft: 35
		}
	}
});

const Icon = props => <BaseIcon size={32} icon={props.icon} />;

class MainNav extends Component {
	state = {
		user: null,
		isChecked: false,
		selectedPath: "",
		isNavOpen: null
	};

	onNavItemSelect = () => {
		this.setState({
			selectedPath: window.location.pathname,
			isNavOpen: !this.state.isNavOpen
		});
	};

	handleOpenNav = () => {
		this.setState({ isNavOpen: !this.state.isNavOpen });
	};

	componentDidMount() {
		this.setState({ selectedPath: window.location.pathname });
		firebase.auth().onAuthStateChanged(user =>
			this.setState({
				user,
				isChecked: true
			})
		);
	}

	shouldComponentUpdate() {
		if (this.state.selectedPath !== window.location.pathname) {
			this.setState({ selectedPath: window.location.pathname });
		}
		return true;
	}

	signOut = () => {
		firebase.auth().signOut();
		window.localStorage.clear();
		this.setState({
			...this.state,
			selectedPath: "/",
			user: null
		});
		return <Redirect to="/dashboard" />;
	};

	render() {
		const isPizzaSubmitted = JSON.parse(
			localStorage.getItem("isPizzaSubmitted")
		);
		const isPizzeriaSubmitted = JSON.parse(
			localStorage.getItem("isPizzeriaSubmitted")
		);
		const { classes } = this.props;
		const { isNavOpen } = this.state;
		const path = this.state.selectedPath;
		return (
			<Fragment>
				<MdMenu
					className={classes.menuBtn}
					style={isNavOpen ? { color: "white" } : { color: "black" }}
					onClick={this.handleOpenNav}
				/>
				<Navigation
					className={classNames(
						classes.navigation,
						isNavOpen ? classes.openedNav : classes.closedNav
					)}
				>
					<NavLink
						to="/"
						style={{ background: "#303641" }}
						onClick={this.onNavItemSelect}
					>
						<ReactSVG
							src="logo.svg"
							svgStyle={{ width: 90, height: 50 }}
							className={classes.logo}
						/>
					</NavLink>
					<NavLink
						to=""
						onClick={this.onNavItemSelect}
						className={path === "/" ? classes.navItemSelected : null}
					>
						<IconCnt>
							<Icon icon={dashboard} />
						</IconCnt>
						<Text>Strona główna</Text>
					</NavLink>
					<NavLink
						to={this.state.user ? "/user-panel" : "/"}
						className={classNames(
							path === "/user-panel" ? classes.navItemSelected : null,
							!this.state.user ? classes.navDisabled : null
						)}
						onClick={this.onNavItemSelect}
					>
						<IconCnt className={!this.state.user ? classes.iconDisable : null}>
							<Icon icon={user} />
						</IconCnt>
						<Text className={!this.state.user ? classes.textDisabled : null}>
							Twój profil
						</Text>
					</NavLink>
					<NavLink
						to={this.state.user ? "/pizzerias#1" : "/"}
						className={classNames(
							path === "/pizzerias" ? classes.navItemSelected : null,
							!this.state.user ? classes.navDisabled : null
						)}
						onClick={this.onNavItemSelect}
					>
						<IconCnt className={!this.state.user ? classes.iconDisable : null}>
							<Icon icon={cutlery} />
						</IconCnt>
						<Text className={!this.state.user ? classes.textDisabled : null}>
							Pizzerie
						</Text>
					</NavLink>
					<NavLink
						to={this.state.user ? "/create-pizza" : "/"}
						className={classNames(
							path === "/create-pizza" ? classes.navItemSelected : null,
							!this.state.user ? classes.navDisabled : null
						)}
						onClick={this.onNavItemSelect}
					>
						<IconCnt className={!this.state.user ? classes.iconDisable : null}>
							<Icon icon={pizza} />
						</IconCnt>
						<Text className={!this.state.user ? classes.textDisabled : null}>
							Skomponuj pizzę
						</Text>
					</NavLink>
					<NavLink
						to={
							!this.state.user
								? "/"
								: isPizzaSubmitted
								? "/make-order"
								: window.location.pathname
						}
						className={classNames(
							path === "/make-order" ? classes.navItemSelected : null,
							!this.state.user
								? classes.navDisabled
								: !isPizzaSubmitted
								? classes.navDisabled
								: null
						)}
						onClick={this.onNavItemSelect}
					>
						<IconCnt
							className={
								!this.state.user
									? classes.textDisabled
									: !isPizzaSubmitted
									? classes.iconDisable
									: null
							}
						>
							<Icon icon={shoppingCart} />
						</IconCnt>
						<Text
							className={
								!this.state.user
									? classes.textDisabled
									: !isPizzaSubmitted
									? classes.textDisabled
									: null
							}
						>
							Złóż zamówienie
						</Text>
					</NavLink>
					<NavLink
						to={
							!this.state.user
								? "/"
								: isPizzaSubmitted && isPizzeriaSubmitted
								? "/summary-order"
								: window.location.pathname
						}
						className={classNames(
							path === "/summary-order" ? classes.navItemSelected : null,
							!this.state.user
								? classes.navDisabled
								: !isPizzeriaSubmitted
								? classes.navDisabled
								: null
						)}
						onClick={this.onNavItemSelect}
					>
						<IconCnt
							className={
								!this.state.user
									? classes.textDisabled
									: !isPizzeriaSubmitted
									? classes.iconDisable
									: null
							}
						>
							<Icon icon={creditCardAlt} />
						</IconCnt>
						<Text
							className={
								!this.state.user
									? classes.textDisabled
									: !isPizzeriaSubmitted
									? classes.textDisabled
									: null
							}
						>
							Podsumowanie zamówienia
						</Text>
					</NavLink>
					{this.state.user ? (
						<NavLink
							to="/"
							onClick={this.signOut}
							className={path === "dashboard" ? classes.navItemSelected : null}
						>
							<IconCnt>
								<Icon icon={userTimes} />
							</IconCnt>
							<Text>Wyloguj się</Text>
						</NavLink>
					) : null}
				</Navigation>
			</Fragment>
		);
	}
}

export default withStyles(styles)(MainNav);
