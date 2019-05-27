import React, { Fragment, Component } from "react";
import Dialog from '@material-ui/core/Dialog';
import SignUp from '../Auth/SignUp'

import "./styles.css"

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
                    id="btn-register"
                    type="button" 
                    className="btn btn-outline-danger btn-lg btn-lg shadow p-3 mb-5 rounded" 
                    style={{"width": "15rem", "margin": "1rem"}}
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