import React, { Fragment, Component } from "react";
import Dialog from '@material-ui/core/Dialog';
import SignUp from '../Auth/SignUp'

import "./dashboard.css"

class RegisterButton extends Component {
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
                    Zarejestruj się
                </button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <SignUp />
                </Dialog>
            </Fragment>
        )
    }
}

export default RegisterButton;