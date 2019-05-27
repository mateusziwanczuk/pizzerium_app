import React from 'react';
import  { Redirect } from 'react-router-dom'
import firebase from 'firebase'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './UserData.css'

class DeleteUser extends React.Component {
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

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    signOut = () => {
		firebase.auth().signOut()
		    .then(this.setRedirect)
    };

    deleteAccount = () => {
        var user = firebase.auth().currentUser;
        user.delete()
            .then(this.signOut)
            .then(this.handleClose)
            .catch(error => alert(error))
    }
    
    render() { 
        return (
            <>
                <div className='user__userdata__container__button' onClick={this.handleClickOpen}>
                    <span>Usuń konto</span>
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Dobrze się zastanów!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Ta akcja będzie nieodwracalna. Czy na pewno chcesz usunąć konto?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            Nie
                        </Button>
                        {this.renderRedirect()}
                        <Button onClick={this.deleteAccount} color="secondary">
                            Tak
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}
 
export default DeleteUser;

