import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Typography } from "@material-ui/core";
import { Paper, Button, Grid, Accordion } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import initFirebase from "@utils/initFirebase";
import { Alert } from "@material-ui/lab";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  updateEmail,
  EmailAuthProvider,
  fetchProviders,
} from "firebase/auth";
const CryptoJS = require("crypto-js");

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '1px solid #000',
    borderRadius: "15px ",
    boxShadow: theme.shadows[20],
    padding: theme.spacing(2, 4, 3),
    width: "513px",
    height: "350px",
  },
  subModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subPaper: {
    backgroundColor: theme.palette.background.paper,
    // border: '1px solid #000',
    borderRadius: "15px ",
    boxShadow: theme.shadows[20],
    padding: theme.spacing(2, 4, 3),
    width: "513px",
    height: "430px",
  },
}));

export default function BaseModalChangeEmail(props) {
  const classes = useStyles();
  const [errorInputNewEmail, setErrorInputNewEmail] = useState(false);
  const [errorInputCurrentPassword, setErrorInputCurrentPassword] =
    useState(false);
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function resetEmail(newEmail, currentPassword) {
    const auth = getAuth();
    let credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    reauthenticateWithCredential(auth.currentUser, credential).then(() => {
        console.log('reauthen')
        verifyBeforeUpdateEmail(auth.currentUser, newEmail, null).then((res) => {
            console.log('send verify email.')
            console.log(res)
            clearAllState();
            props.handleClose();
        }).catch(e => {
            console.log('error')
            console.log(e)
        })
    }).catch(e => {
        setAlert(true);
        setErrorMessage("wrong password or email already");
        console.log('reauthen fail')
        console.log(e)
        console.log('-----------')
    })
  }

  const clearAllState = () => {
    setErrorInputCurrentPassword(false);
    setErrorInputNewEmail(false);
    setAlert(false);
  };

  const pressCancel = () => {
    props.handleClose();
    clearAllState();
  };

  const pressSave = () => {
    let currentPassword = document.getElementById("currentPassword").value;
    let newEmail = document.getElementById("newEmail").value;

    let errorCurrentPassword = false;
    let errorNewEmail = false;

    if (newEmail == "" || newEmail.length < 6) {
      setErrorInputNewEmail(true);
      errorNewEmail = true;
    } else {
      setErrorInputNewEmail(false);
      errorNewEmail = false;
    }
    if (currentPassword == "" || currentPassword.length < 6) {
      setErrorInputCurrentPassword(true);
      errorCurrentPassword = true;
    } else {
      setErrorInputCurrentPassword(false);
      errorCurrentPassword = false;

      if (errorCurrentPassword == true || errorNewEmail == true) {
        console.log("something error");
      } else {
          resetEmail(newEmail, currentPassword);
          console.log(currentPassword);
          console.log(newEmail);
      }
    }
}

    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={props.openModalChangeEmail}
          onClose={props.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={props.openModalChangeEmail}>
            <div className={classes.paper}>
              {alert ? (
                <Alert severity="error">{errorMessage}</Alert>
              ) : (
                <div className="2xl:h-12"></div>
              )}

              <div className="2xl:absolute" style={{ right: "710px" }}></div>
              <p className="2xl:text-center 2xl:text-2xl 2xl:mt-2">
                เปลี่ยน Email address ของคุณ
              </p>
              <div className="2xl:flex 2xl:flex-wrap 2xl:justify-center">
                <div className="2xl:mt-6 ">
                  <input
                    className={
                      errorInputNewEmail
                        ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    }
                    id="newEmail"
                    type="text"
                    placeholder="New E-mail่"
                    style={{
                      width: "419px",
                      height: "55px",
                      fontSize: "20px",
                      padding: "20px",
                    }}
                  />
                </div>
                <div className="2xl:mt-4">
                  <input
                    className={
                      errorInputCurrentPassword
                        ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    }
                    id="currentPassword"
                    type="text"
                    placeholder="รหัสผ่าน"
                    style={{
                      width: "419px",
                      height: "55px",
                      fontSize: "20px",
                      padding: "20px",
                    }}
                  />
                </div>

                <div className="2xl:absolute 2xl:ml-28 2xl:mt-48">
                  <Button
                    // variant="contained"
                    color="error"
                    size="large"
                    style={{ width: "112px", height: "33px" }}
                    onClick={() => pressCancel()}
                  >
                    CENCEL
                  </Button>
                </div>
                <div
                  className="2xl:absolute 2xl:ml-80 2xl:mt-48"
                  // style={{ marginLeft: "220px" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    style={{ width: "112px", height: "33px" }}
                    onClick={() => {
                      pressSave();
                    }}
                  >
                    SAVE
                  </Button>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  };

