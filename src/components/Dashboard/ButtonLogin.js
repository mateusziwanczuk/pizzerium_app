import React, { Fragment, Component } from "react";
import SignIn from '../Auth/SignIn'
import Dialog from '@material-ui/core/Dialog';

import "./dashboard.css"

class LogInButton extends Component {
    state = {
        open: false,
        redirect: false
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <Fragment>
                <button 
                    className="dashboard__button"
                    onClick={ this.handleClickOpen }
                >
                    Zaloguj się
                </button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <SignIn />
                </Dialog>
            </Fragment>
        )
    }
}

export default LogInButton;