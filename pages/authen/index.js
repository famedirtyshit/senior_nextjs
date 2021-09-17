import Head from 'next/head'
import BaseSignIn from '@components/BaseSignIn';
import BaseSignUp from '@components/BaseSignUp';
import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import initFirebase from '@utils/initFirebase';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import BaseAuthenResModal from '@components/BaseAuthenResModal';
let passwordValidator = require('password-validator');
import accountUtil from '@utils/accountUtil';
import { useRouter } from 'next/router';

const sectionStyles = makeStyles((theme) => ({
    style: {

    },
}));
export default function Authen() {
    const router = useRouter();
    const [authenType, setAuthenType] = useState(router.query.type == 'signup' ? 'signup' : 'signin');
    const [validMsg, setValidMsg] = useState('');
    const [validStatus, setValidStatus] = useState(false);
    const [validType, setValidType] = useState('pass');
    const [resAlertType, setResAlertType] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);

    useEffect(() => {
        let res = initFirebase();
        if (res != false) {
            console.log('init firebase');
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // const uid = user.uid;
                    // window.location.href = '/feed';
                } else {
                    // console.log('User is not found');
                }
            });
        } else {
            console.log('init firebase error')
        }
    }, [])

    const sectionClasses = sectionStyles();

    const goSignUp = () => {
        setAuthenType('signup');
    }

    const goSignIn = () => {
        setAuthenType('signin');
    }

    const handleModalClose = () => {
        setValidStatus(false);
        // setValidMsg('');
    }

    const signIn = async () => {
        const auth = getAuth();
        let valid = validateSignIn(document.getElementById('signin-email').value, document.getElementById('signin-password').value);
        if (!valid.status) {
            setValidStatus(true);
            setValidMsg(valid.msg)
            setValidType(valid.type)
            setResAlertType(false)
            return;
        } else {
            setValidType(valid.type)
            setResAlertType(true)
        }
        try {
            let userCredential = await signInWithEmailAndPassword(auth, document.getElementById('signin-email').value, document.getElementById('signin-password').value)
            const user = userCredential.user;
            console.log('signin');
            // console.log(user)
            if (!user.emailVerified) {
                setValidStatus(true);
                setValidMsg('please verify your email before singin')
                setResAlertType(true)
                logOut();
            } else {
                window.location.href = '/feed';
            }
        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setValidStatus(true);
            setValidMsg(errorCode.replace('auth/', ""))
            setResAlertType(false)
            console.log('signin error')
            // console.log(errorCode.replace('auth/', ""));
            // console.log(error)
        };
    }

    const validateSignIn = (email, password) => {
        if (!email) {
            return { status: false, msg: 'please input your email', type: 'siemail' };
        }
        let checker = /\S+@\S+\.\S+/
        if (checker.test(email) == false) {
            return { status: false, msg: 'email format wrong', type: 'siemail' };
        }
        if (!password) {
            return { status: false, msg: 'please input your password', type: 'sipassword' };
        }
        return { status: true, msg: 'pass', type: 'pass' };
    }

    const validateCredentialSignUp = (email, password, confirmPassword) => {
        if (!email) {
            return { status: false, msg: 'please input your email', type: 'email' };
        }
        let checker = /\S+@\S+\.\S+/
        if (checker.test(email) == false) {
            return { status: false, msg: 'email format wrong', type: 'email' };
        }
        if (!password) {
            return { status: false, msg: 'please input your password', type: 'password' };
        }
        if (!confirmPassword) {
            return { status: false, msg: 'please input your confirm password', type: 'confirmPassword' };
        }
        if (password != confirmPassword) {
            return { status: false, msg: 'your password and confirm password is not match', type: 'confirmPassword' };
        }
        // let passwordChecker = /^(?=.\d)(?=.[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
        let passwordSchema = new passwordValidator();
        passwordSchema.is().min(6)
        if (passwordSchema.validate(password) == false) {
            return { status: false, msg: 'password must between 6 to 20 characters which contain at least one numeric digit, uppercase, lowercase and not have spaces', type: 'password' };
        }
        return { status: true, msg: 'pass', type: 'pass' };
    }

    const validateContactSignUp = (firstName, lastName, phone, facebook, instagram) => {
        if (!firstName) {
            return { status: false, msg: 'please input your firstname', type: 'firstname' };
        }
        if (firstName.length > 50) {
            return { status: false, msg: 'firstname length must not exceed 50 characters', type: 'firstname' };
        }
        if (!lastName) {
            return { status: false, msg: 'please input your lastname', type: 'lastname' };
        }
        if (lastName.length > 50) {
            return { status: false, msg: 'lastname length must not exceed 50 characters', type: 'lastname' };
        }
        if (!phone) {
            return { status: false, msg: 'please input your phone number', type: 'phone' };
        }
        let phoneFormat = /^\d+$/;
        if (!phoneFormat.test(phone) || phone.length !== 10) {
            return { status: false, msg: 'phone format is wrong', type: 'phone' };
        }
        if (facebook.length > 100) {
            return { status: false, msg: 'facebook length must not exceed 100 characters', type: 'facebook' };
        }
        if (instagram.length > 50) {
            return { status: false, msg: 'instagram length must not exceed 50 characters', type: 'instagram' };
        }
        return { status: true, msg: 'pass', type: 'pass' };
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

    const signup = async (email, password, firstname, lastname, phone, facebook, instagram) => {
        let res = await accountUtil.signup(email, password, firstname, lastname, phone, facebook, instagram);
        return res;
    }

    return (
        <div style={{fontFamily: 'Prompt'}} className={"2xl:container mx-auto"}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="2xl:py-8">
                <Link href="/">
                    <a>
                        <h1 className="text-mainOrange 2xl:text-7xl font-bold 2xl:ml-64 inline-block">Catus</h1>
                    </a>
                </Link>
            </header>
            <main className="bg-mainYellow mb-36 py-16 px-80">
                <section className={sectionClasses.style}>
                    {authenType == 'signin' ? <BaseSignIn validType={validType} goSignUp={goSignUp} signIn={signIn} /> : <BaseSignUp setLoadingStatus={setLoadingStatus} setResAlertType={setResAlertType} setAuthenType={setAuthenType} signup={signup} validateContactSignUp={validateContactSignUp} validateCredentialSignUp={validateCredentialSignUp} setValidStatus={setValidStatus} setValidMsg={setValidMsg} setValidType={setValidType} validType={validType} goSignIn={goSignIn} />}
                    <BaseAuthenResModal loadingStatus={loadingStatus} resAlertType={resAlertType} modalStatus={validStatus} handleModalClose={handleModalClose} msg={validMsg} />
                </section>
            </main>
        </div >
    )
}
