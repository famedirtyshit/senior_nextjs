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
    '@media only screen and (min-width: 768px)': {
      width: "513px",
      height: "360px",
    }, 
    '@media only screen and (max-width: 767px)': {
        width: "350px",
        height: "380px",
        },
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
    let credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        console.log("reauthen");
        verifyBeforeUpdateEmail(auth.currentUser, newEmail, null)
          .then((res) => {
            console.log("send verify email.");
            console.log(res);
            clearAllState();
            props.handleClose();
          })
          .catch((e) => {
            console.log("error");
            setAlert(true);
            setErrorMessage(e.message);
            console.log(e.message);
            console.log(e);
          });
      })
      .catch((e) => {
        setAlert(true);
        setErrorMessage(e.message);
        console.log("reauthen fail");
        console.log(e);
        console.log("-----------");
      });
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
  };

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
            <div className="relative">
            {alert ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : (
              <div className="sm:h-12 h-12"></div>
            )}

            <div className="sm:absolute" style={{ right: "710px" }}></div>
            <p className="text-center sm:text-2xl text-xl mt-2">
              เปลี่ยน Email address ของคุณ
            </p>
            <div className="sm:flex sm:flex-wrap sm:justify-center">
              <div className="mt-6">
                <input
                  className={
                    errorInputNewEmail
                      ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  }
                  id="newEmail"
                  type="text"
                  placeholder="อีเมลใหม่"
                  style={{
                    width: "300px",
                    height: "55px",
                    fontSize: "20px",
                    padding: "20px",
                  }}
                />
              </div>
              <div className="mt-4">
                <input
                  className={
                    errorInputCurrentPassword
                      ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  }
                  id="currentPassword"
                  type="password"
                  placeholder="รหัสผ่าน"
                  style={{
                    width: "300px",
                    height: "55px",
                    fontSize: "20px",
                    padding: "20px",
                  }}
                />
              </div>

              <div className="absolute sm:ml-28 sm:mt-48 mt-12 ml-12">
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
                className="absolute sm:ml-80 sm:mt-48 ml-40 mt-12"
                // className="absolute sm:ml-80 sm:mt-48 ml-40 mt-12"
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
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
