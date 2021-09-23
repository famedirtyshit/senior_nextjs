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
    height: "430px",
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

export default function BaseModalChangePassword(props) {
  const classes = useStyles();
  const [errorInputCurrentPassword, setErrorInputCurrentPassword] =
    useState(false);
  const [errorInputNewPassword, setErrorInputNewPassword] = useState(false);
  const [errorInputConfirmNewPassword, setErrorInputConfirmNewPassword] =
    useState(false);
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSubModal, setOpenSubModal] = useState(true);

  const handleOpenSubModal = () => {
    setOpenSubModal(true);
  };
  const handleCloseSubmodal = () => {
    setOpenSubModal(false);
  };

  function resetPassword(currentPassword, newPassword) {
    const auth = getAuth();
    let credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        console.log("re-authen");
        updatePassword(auth.currentUser, newPassword)
          .then(() => {
            console.log("update success");
            clearAllState();
            props.handleClose();
          })
          .catch((error) => {
            console.log("---------------------");
            console.log("set password error");
            console.log(error);
            console.log("---------------------");
          });
      })
      .catch((e) => {
        console.log("re-authen fail");
        setAlert(true);
        setErrorMessage("your current password is not correct !!");
        console.log(e);
      });
  }

  const clearAllState = () => {
    setErrorInputCurrentPassword(false);
    setErrorInputNewPassword(false);
    setErrorInputConfirmNewPassword(false);
    setAlert(false);
  };

  const pressCancel = () => {
    props.handleClose();
    clearAllState();
  };

  const pressSave = () => {
    let currentPassword = document.getElementById("currentPassword").value;
    let newPassword = document.getElementById("newPassword").value;
    let confirmNewPassword =
      document.getElementById("confirmNewPassword").value;
    let errorCurrentPassword = false;
    let errorNewPassword = false;
    let errorConfirmNewPassword = false;

    if (currentPassword == "" || currentPassword.length < 6) {
      setErrorInputCurrentPassword(true);
      errorCurrentPassword = true;
      setAlert(true);
      setErrorMessage("password must be at least 6 characters");
      return;
    } else {
      setErrorInputCurrentPassword(false);
      errorCurrentPassword = false;
      setAlert(false);
      setErrorMessage("");
    }
    if (newPassword == "" || newPassword.length < 6) {
      setErrorInputNewPassword(true);
      errorNewPassword = true;
      setAlert(true);
      setErrorMessage("new password must be at least 6 characters");
      return;
    } else {
      setErrorInputNewPassword(false);
      errorNewPassword = false;
      setAlert(false);
      setErrorMessage("");
    }
    if (confirmNewPassword == "" || confirmNewPassword.length < 6) {
      setErrorInputConfirmNewPassword(true);
      errorConfirmNewPassword = true;
      setAlert(true);
      setErrorMessage("new password must be at least 6 characters");
      return;
    } else {
      setErrorInputConfirmNewPassword(false);
      errorConfirmNewPassword = false;
      setAlert(false);
      setErrorMessage("");
    }
    if (
      newPassword == "" ||
      confirmNewPassword == "" ||
      newPassword != confirmNewPassword
    ) {
      setErrorInputNewPassword(true);
      errorNewPassword = true;
      setErrorInputConfirmNewPassword(true);
      errorConfirmNewPassword = true;
      setAlert(true);
      setErrorMessage("new password and confirm password must be the same");
      return;
    } else {
      setErrorInputNewPassword(false);
      errorNewPassword = false;
      setErrorInputConfirmNewPassword(false);
      errorConfirmNewPassword = false;
      setAlert(false);
      setErrorMessage("");
    }
    if (
      errorCurrentPassword == true ||
      errorNewPassword == true ||
      errorConfirmNewPassword == true
    ) {
      console.log("something error");
    } else {
      resetPassword(currentPassword, newPassword);
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.openModalChangePassword}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.openModalChangePassword}>
          <div className={classes.paper}>
            {alert ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : (
              <div className="2xl:h-12"></div>
            )}

            <div className="2xl:absolute" style={{ right: "710px" }}></div>
            <p className="2xl:text-center 2xl:text-2xl 2xl:mt-2">
              เปลี่ยนรหัสผ่านของคุณ
            </p>
            <div className="2xl:flex 2xl:flex-wrap 2xl:justify-center">
              <div className="2xl:mt-6 ">
                <input
                  className={
                    errorInputCurrentPassword
                      ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  }
                  id="currentPassword"
                  type="text"
                  placeholder="รหัสผ่านปัจจุบัน"
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
                    errorInputNewPassword
                      ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  }
                  id="newPassword"
                  type="text"
                  placeholder="รหัสผ่านใหม่"
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
                    errorInputConfirmNewPassword
                      ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  }
                  id="confirmNewPassword"
                  type="text"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  style={{
                    width: "419px",
                    height: "55px",
                    fontSize: "20px",
                    padding: "20px",
                  }}
                />
              </div>
            </div>
            <div className="2xl:absolute 2xl:ml-52 2xl:mt-10">
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
              className="2xl:absolute 2xl:ml-80 2xl:mt-10"
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
        </Fade>

        {/* <div>
        
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.subModal}
            open={openSubModal}
            onClose={handleCloseSubmodal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openSubModal}>
              <div className={classes.subPaper}>
                <h2 id="transition-modal-title">Transition modal</h2>
                <p id="transition-modal-description">
                  react-transition-group animates me.
                </p>
              </div>
            </Fade>
          </Modal>
        </div> */}
      </Modal>
    </div>
  );
}
