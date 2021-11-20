import React from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import utilStyles from "@styles/Util.module.css";
import Button from '@material-ui/core/Button';

const modalStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        "@media (min-width: 1024px)": {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            width: '20%',
            height: '20%',
        },
        "@media (min-width: 768px)": {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            width: '45%',
            height: '30%',
        },
        "@media (min-width: 1px) and (max-width: 767px)": {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            width: '80%',
            height: '23%',
        }
    },
}));

const theme = createTheme({
    palette: {
        primary: {
            light: '#356053',
            main: '#356053',
            dark: '#356053',
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

export default function BasePostResModal(prop) {
    const modalClasses = modalStyles();

    return (
        <div>
            <Modal
                aria-labelledby="post-res-modal-title"
                aria-describedby="post-res-modal-description"
                className={modalClasses.modal}
                open={prop.postResStatus}
                onClose={prop.closePostResModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={prop.postResStatus}>
                    <ThemeProvider theme={theme}>
                        <div className={modalClasses.paper}>
                            <div className="relative h-full">
                                {prop.postRes == null
                                    ?
                                    <div className={"absolute " + utilStyles.centerAbsolute} >
                                        <CircularProgress />
                                    </div>
                                    :
                                    prop.postRes.data.result == true
                                        ?
                                        <div className="relative h-full">
                                            <p className="text-center text-2xl font-bold">success</p>
                                            <div className={"absolute " + utilStyles.bottomCenterAbsolute} >
                                                <Button onClick={prop.closePostResModal} variant="contained" color="primary" className={"2xl:max-h-9"}>Okay</Button>
                                            </div>
                                        </div>
                                        :
                                        <div className="relative h-full">
                                            <p className="text-center text-2xl font-bold">fail please retry later</p>
                                            <div className={"absolute " + utilStyles.bottomCenterAbsolute} >
                                                <Button onClick={prop.closePostResModal} variant="contained" color="primary" className={"2xl:max-h-9"}>Okay</Button>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </ThemeProvider>
                </Fade>
            </Modal>
        </div>
    );
}