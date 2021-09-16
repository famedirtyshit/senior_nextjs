import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useEffect, useState } from 'react';
import initFirebase from '@utils/initFirebase';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import BaseConfirmation from '@components/BaseConfirmation';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '15px',
        boxShadow: '0px 0px 50px rgba(0,0,0,0.5)',
        border: 'solid 0px',
        width: '513px',
        height: '210px'
    },
}));

export default function BaseRecoverPassword(prop) {

    const [email, setEmail] = useState('');
    const [confirmationStatus, setConfirmationStatus] = useState(false);
    const [confirmation, setConfirmation] = useState({ title: '', content: '' });

    const classes = useStyles();

    useEffect(() => {
        console.log('first mount')
        let res = initFirebase();
        if (res != false) {
        } else {
            console.log('init firebase error')
        }
    }, [])

    const closeConfirmation = () => {
        setConfirmationStatus(false);
    }

    const sendResetPasswordEmail = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setConfirmation({ title: 'success', content: 'send reset password to your email' })
                setConfirmationStatus(true);                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setConfirmation({ title: 'fail', content: errorCode.replace('auth/','') })
                setConfirmationStatus(true);
            });
    }

    const setEmailTarget = (e) => {
        setEmail(e.target.value);
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={prop.recoverModalStatus}
                onClose={prop.closeRecoverModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={prop.recoverModalStatus}>
                    <div className={classes.paper}>
                        <h2 className="text-center text-xl font-normal my-4" id="transition-modal-title">กรอกอีเมลของคุณ</h2>
                        <div className="text-center my-6">
                            <TextField onInput={setEmailTarget} className="w-5/6" label="อีเมลของคุณ" variant="outlined" />
                        </div>
                        <div className="justify-end flex flex-wrap">
                            <Button onClick={prop.closeRecoverModal}>Cancel</Button>
                            <div className='mr-10 ml-4'>
                                <Button onClick={sendResetPasswordEmail} className="w-24" variant="contained" color="primary">
                                    SEND
                                </Button>
                            </div>
                            <BaseConfirmation confirmOnly={true} confirmationStatus={confirmationStatus} closeConfirmation={closeConfirmation} title={confirmation.title} content={confirmation.content} confirmAction={()=>{if(confirmation.title=='success'){prop.closeRecoverModal()}}} />
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}