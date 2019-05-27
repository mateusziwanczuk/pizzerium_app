import React, { Fragment, Component } from "react";
import SignIn from '../Auth/SignIn'
import Dialog from '@material-ui/core/Dialog';

import "./styles.css"

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
                    id="btn-login"
                    type="button" 
                    className="btn btn-outline-danger btn-lg btn-lg shadow p-3 mb-5 rounded"
                    style={{ "width": "15rem", "margin": "1rem" }}
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