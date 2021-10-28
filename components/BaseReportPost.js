import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import postUtil from '@utils/postUtil';
import BasePostResModal from '@components/BasePostResModal';

const theme = createTheme({
    palette: {
        primary: {
            light: '#356053',
            main: '#356053',
            dark: '#356053',
            contrastText: '#fff',
        },
        secondary: {
            light: '#356053',
            main: '#356053',
            dark: '#356053',
            contrastText: '#fff',
        },
    },
});

const modalStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '650px',
        height: '440px',
        position: 'relative'
    },
}));


export default function BaseReportPost(prop) {

    const [reason, setReason] = useState('เนื้อหาไม่เหมาะสม');
    const [otherError, setOtherError] = useState(false);
    const [res, setRes] = useState(null);
    const [resStatus, setResStatus] = useState(false);

    useEffect(() => {

    }, [])

    const sendReport = async () => {
        if (reason == 'other') {
            let otherReasonEle = document.getElementById('other-reason');
            if (otherReasonEle) {
                let otherReason = otherReasonEle.value;
                if (!otherReason || !otherReason.replace(/\s/g, '').length) {
                    setOtherError(true);
                } else {
                    setOtherError(false);
                    setRes(null);
                    setResStatus(true);
                    let resObj = await postUtil.reportPost(prop.post, otherReason, prop.type);
                    setRes(resObj);
                    // setResStatus(false);
                }
            }
        } else {
            setOtherError(false);
            setRes(null);
            setResStatus(true);
            let resObj = await postUtil.reportPost(prop.post, reason, prop.type);
            setRes(resObj);
            // setResStatus(false);
        }
    }

    const modalClass = modalStyles();

    const changeReason = (e) => {
        if (e.target.value == 'inappropriateContent') {
            setReason('เนื้อหาไม่เหมาะสม');
        } else if (e.target.value == 'inappropriatePicture') {
            setReason('รูปภาพไม่เหมาะสม');
        } else if (e.target.value == 'irrelevant') {
            setReason('ไม่เกี่ยวข้อง');
        } else if (e.target.value == 'other') {
            setReason('other');
        }
    }

    const closeResModal = () => {
        if (res != null) {
            setResStatus(false);
            if (res.data.result == true) {
                prop.closeReportModal();
            }
        }
    }

    return (
        <div>
            <Modal
                aria-labelledby="map-modal-title"
                aria-describedby="map-modal-description"
                className={modalClass.modal}
                open={prop.reportStatus}
                onClose={prop.closeReportModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={prop.modalMap}>
                    <ThemeProvider theme={theme}>
                        <div className={modalClass.paper}>
                            <div className="2xl:absolute 2xl:top-5 2xl:right-8 cursor-pointer" onClick={prop.closeReportModal}>
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.382 13.0002L25.5059 2.8758C26.1647 2.21725 26.1647 1.15246 25.5059 0.493912C24.8473 -0.164637 23.7826 -0.164637 23.124 0.493912L12.9998 10.6183L2.87597 0.493912C2.21712 -0.164637 1.15267 -0.164637 0.494134 0.493912C-0.164711 1.15246 -0.164711 2.21725 0.494134 2.8758L10.618 13.0002L0.494134 23.1246C-0.164711 23.7831 -0.164711 24.8479 0.494134 25.5065C0.822322 25.835 1.25384 26 1.68505 26C2.11626 26 2.54747 25.835 2.87597 25.5065L12.9998 15.3821L23.124 25.5065C23.4525 25.835 23.8837 26 24.3149 26C24.7462 26 25.1774 25.835 25.5059 25.5065C26.1647 24.8479 26.1647 23.7831 25.5059 23.1246L15.382 13.0002Z" fill="black" />
                                </svg>
                            </div>
                            <div className="2xl:absolute 2xl:top-5 2xl:left-8" >
                                <h1 className="text-xl font-bold">Report Post</h1>
                            </div>
                            <div className="2xl:my-10">
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        aria-label="report-reason"
                                        defaultValue="inappropriateContent"
                                        name="radio-buttons-report-reason"
                                        onChange={changeReason}
                                    >
                                        <FormControlLabel value="inappropriateContent" control={<Radio />} label="เนื้อหาไม่เหมาะสม" />
                                        <FormControlLabel value="inappropriatePicture" control={<Radio />} label="รูปภาพไม่เหมาะสม" />
                                        <FormControlLabel value="irrelevant" control={<Radio />} label="ไม่เกี่ยวข้อง" />
                                        <FormControlLabel value="other" control={<Radio />} label="อื่นๆ" />
                                    </RadioGroup>
                                </FormControl>
                                <div className="2xl:ml-8">
                                    <TextField
                                        id="other-reason"
                                        multiline
                                        rows={4}
                                        error={otherError}
                                        helperText="please fill detail."
                                        variant="outlined"
                                        className="w-1/2"
                                        InputProps={{
                                            readOnly: reason == 'other' ? false : true,
                                        }}
                                    />
                                </div>
                                <div className="2xl:mt-4">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        style={{ width: "112px", height: "33px" }}
                                        onClick={sendReport}
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                            <BasePostResModal postResStatus={resStatus} closePostResModal={closeResModal} postRes={res} />
                        </div>
                    </ThemeProvider>
                </Fade>
            </Modal>
        </div>
    );
}