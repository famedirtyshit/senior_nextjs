import React from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import utilStyles from '@styles/Util.module.css';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '25%',
        height: '30%',
        borderRadius: '0.75rem'
    },
}));

const buttonStyles = makeStyles((theme) => ({
    style: {
        borderRadius: '50px',
        paddingLeft: '65px',
        paddingRight: '65px',
        paddingTop: '15px',
        paddingBottom: '15px',
        boxShadow: '0px 4px 4px rgba(0,0,0,0.25)'
    }
}));

const theme = createTheme({
    palette: {
        primary: {
            light: '#F0930D',
            main: '#F0930D',
            dark: '#F0930D',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#db4132',
            dark: '#ba000d',
            contrastText: '#fff',
        },
    },
});

export default function BaseAuthenResModal(prop) {
    const classes = useStyles();
    const buttonClasses = buttonStyles();
    return (
        <div>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className={classes.modal}
                open={prop.modalStatus}
                onClose={prop.handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={prop.modalStatus}>
                    <ThemeProvider theme={theme}>
                        <div className={classes.paper +  ' relative'}>
                            {prop.loadingStatus === true ?
                                <div className={"absolute " + utilStyles.centerAbsolute} >
                                    <CircularProgress />
                                </div>
                                :
                                <div>
                                    <h2 className="text-center text-2xl font-bold 2xl:mt-2" id="modal-title">{prop.resAlertType === true ? 'Alert' : 'Error'}</h2>
                                    <p className="text-center text-lg font-normal 2xl:mt-6 2xl:mb-8" id="modal-description">{prop.msg}</p>
                                    <div className={"absolute " + utilStyles.bottomCenterAbsolute} >
                                        <Button onClick={prop.handleModalClose} variant="contained" color="primary" className={buttonClasses.otherStyle}>
                                            <span className="text-xl font-semibold">
                                                OKAY
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            }
                        </div>
                    </ThemeProvider>
                </Fade>
            </Modal >
        </div >
    );
}