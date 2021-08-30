import Head from 'next/head'
import { useState, useEffect, useRef } from 'react';
import initFirebase from '@utils/initFirebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut, sendPasswordResetEmail, updatePassword, verifyBeforeUpdateEmail, reauthenticateWithCredential, updateEmail, EmailAuthProvider, fetchProviders } from "firebase/auth";
const CryptoJS = require("crypto-js");
export default function Feed() {

    // const firebase = useRef(null);

    useEffect(() => {
        console.log('first mount')
        let res = initFirebase();
        if (res != false) {
            // firebase.current = res.app;
            console.log('init firebase');
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    const uid = user.uid;
                    // console.log(user)
                    // console.log('-----------');
                    // let id;
                    // id = await user.getIdToken();
                    console.log(user)
                } else {
                    console.log('User is not found');
                }
            });
            // const user = auth.currentUser;
            // if (user) {
            //     let id;
            //     async () => {
            //         id = await user.getIdToken();
            //         console.log(id);
            //     }
            // } else {
            //     console.log('No user is signed in.');
            // }
        } else {
            console.log('init firebase error')
        }
    }, [])

    const signup = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value)
            .then((userCredential) => {
                console.log(userCredential)
                const user = userCredential.user;
                logOut();
                // console.log(userCredential);
                console.log('signup');
                // console.log(user);
                sendEmailVerification(user)
                    .then(() => {
                        console.log('Email verification sent!');
                        // ...
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode.replace('auth/', ""));
                // console.log(errorMessage);
            });
    }

    const signin = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, document.getElementById('email2').value, document.getElementById('password2').value)
            .then((userCredential) => {

                const user = userCredential.user;
                // console.log(user);
                console.log('signin');
                if (!user.emailVerified) {
                    logOut();
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode.replace('auth/', ""));
                // console.log(errorMessage);
            });

    }

    const logOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('signout')
        }).catch((error) => {
            console.log('signout fail')
            console.log(error)
        });

    }

    function resetPassword() {
        // Localize the UI to the selected language as determined by the lang
        // parameter.
        const auth = getAuth();
        let credential = EmailAuthProvider.credential(auth.currentUser.email, 'abcdefg');
        reauthenticateWithCredential(auth.currentUser, credential).then(() => {
            console.log('reauthen')
            updatePassword(auth.currentUser, 'newPassword').then(() => {
                console.log('update success')
                //then log out to let user sign in with new password
            }).catch((error) => {
                // An error ocurred
                // ...
                console.log('---------------------')
                console.log('set password error')
                console.log(error)
                console.log('---------------------')
            });
        }).catch(e => {
            console.log('reauthen fail')
            console.log(e)
            console.log('-----------')
        })
        // sendPasswordResetEmail(auth, auth.currentUser.email)
        //     .then(() => {
        //         console.log('send email reset password')
        //     })
        //     .catch((error) => {
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         console.log('---------------------')
        //         console.log('send password reset error')
        //         console.log(errorCode)
        //         console.log(errorMessage)
        //         console.log('---------------------')
        //     });
    }

    const checkUser = () => {
        const auth = getAuth();
        console.log(auth.currentUser)
    }

    const resetEmail = () => {
        const auth = getAuth();
        // console.log(firebase.auth.EmailAuthProvider.credential());
        let credential = EmailAuthProvider.credential(auth.currentUser.email, 'abcdefg');
        reauthenticateWithCredential(auth.currentUser, credential).then(() => {
            console.log('reauthen')
            verifyBeforeUpdateEmail(auth.currentUser, 'taratorn.famedirtyshit@mail.kmutt.ac.th', null).then((res) => {
                console.log('send verify email.')
                console.log(res)
            }).catch(e => {
                console.log('error')
                console.log(e)
            })
        }).catch(e => {
            console.log('reauthen fail')
            console.log(e)
            console.log('-----------')
        })
        // updateEmail(auth.currentUser, "famedirtyshit@gmail.com").then(() => {
        //     console.log('update email!')
        // }).catch((error) => {
        //     console.log('reset email fail')
        //     console.log(error)
        //     console.log('-----------')
        // });
    }

    const checkEmailUsed = () => {
        const auth = getAuth();
        console.log(auth.getUserByEmail("famedirtyshit@gmail.com"));
    }

    const passphrase = "e3j4inf9J";
    let ciphertext;

    const encrypt = () => {
        ciphertext = CryptoJS.AES.encrypt('testMyPassword12()6>|3', passphrase).toString();
        console.log(ciphertext)
    }

    const decrypt = () => {
        const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        console.log(originalText);
        return originalText;
    }


    return (
        <div className={"2xl:container mx-auto "}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="p-8">
                email <input id="email" className="border border-solid border-gray-700" type="text"></input><br></br>
                password <input id="password" className="border border-solid border-gray-700 mt-1" type="password"></input><br></br>
                <button onClick={signup} className="border border-solid border-gray-700 mt-4 p-1">signup</button>
            </div>
            <div className="p-8">
                email <input id="email2" className="border border-solid border-gray-700" type="text"></input><br></br>
                password <input id="password2" className="border border-solid border-gray-700 mt-1" type="password"></input><br></br>
                <button onClick={signin} className="border border-solid border-gray-700 mt-4 p-1">signin</button>
            </div>
            <button onClick={logOut}>sign out</button><br></br>
            <button onClick={resetPassword}>reset password</button><br></br>
            <button onClick={checkUser}>check</button><br></br>
            <button onClick={resetEmail}>reset email</button><br></br>
            <br></br>
            <br></br>
            <button onClick={encrypt}>encrypt</button><br></br>
            <button onClick={decrypt}>decrypt</button><br></br><br></br>
            <button onClick={checkEmailUsed}>check mail</button><br></br>
        </div >
    )
}
// ᴴ ᴵ ᴶ ᴷ ᴸ ᴹ ᴺ ᴼ ᴾ ᵠ ᴿ ˁ ᵀ ᵁ ᵛ ᵂ ˣ ʸ 