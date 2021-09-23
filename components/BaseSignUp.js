import TextField from '@material-ui/core/TextField';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const buttonStyles = makeStyles((theme) => ({
    style: {
        borderRadius: '50px',
        paddingLeft: '65px',
        paddingRight: '65px',
        paddingTop: '15px',
        paddingBottom: '15px',
        boxShadow: '0px 4px 4px rgba(0,0,0,0.25)'
    },
    otherStyle: {
        borderRadius: '50px',
        paddingLeft: '65px',
        paddingRight: '65px',
        paddingTop: '15px',
        paddingBottom: '15px',
        border: 'solid 2px white',
        boxShadow: 'none'
    },
    border: {
        border: 'solid 2px #F0930D'
    }
}));

const inputPhoneStyles = makeStyles((theme) => ({
    style: {
        'input::-webkit-outer-spin-button input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        'input[type=number]': {
            '-moz-appearance': 'textfield',
        }
    }
}))

const theme = createTheme({
    palette: {
        primary: {
            light: '#F0930D',
            main: '#F0930D',
            dark: '#F0930D',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ffffff',
            main: '#fff',
            dark: '#fff',
            contrastText: '#F0930D',
        },
    },
});


export default function BaseSignIn(prop) {
    const [signUpStatus, setSignUpStatus] = useState('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const buttonClasses = buttonStyles();

    const nextSignUp = () => {
        let valid = prop.validateCredentialSignUp(document.getElementById('signup-email').value, document.getElementById('signup-password').value, document.getElementById('signup-confirm-password').value);
        if (!valid.status) {
            prop.setValidStatus(true);
            prop.setValidMsg(valid.msg)
            prop.setValidType(valid.type)
            return;
        } else {
            prop.setValidType(valid.type)
        }
        setSignUpStatus('contact');
        setEmail(document.getElementById('signup-email').value);
        setPassword(document.getElementById('signup-password').value);
    }

    const backSignUp = () => {
        setSignUpStatus('email');
    }

    const signUpUser = async () => {
        let valid = prop.validateContactSignUp(document.getElementById('signup-firstname').value, document.getElementById('signup-lastname').value, document.getElementById('signup-phone').value, document.getElementById('signup-facebook').value, document.getElementById('signup-instagram').value)
        if (!valid.status) {
            prop.setValidStatus(true);
            prop.setValidMsg(valid.msg)
            prop.setValidType(valid.type)
            prop.setResAlertType(false)
            return;
        } else {
            prop.setValidType(valid.type)
            prop.setResAlertType(true)
        }
        prop.setValidStatus(true);
        prop.setLoadingStatus(true);
        let signupRes = await prop.signup(email, password, document.getElementById('signup-firstname').value, document.getElementById('signup-lastname').value, document.getElementById('signup-phone').value, document.getElementById('signup-facebook').value, document.getElementById('signup-instagram').value);
        prop.setLoadingStatus(false);
        if (signupRes.data.result) {
            prop.setValidStatus(true);
            prop.setValidMsg('email verify sended please check your email.')
            prop.setValidType('pass');
            prop.setResAlertType(true);
            prop.setAuthenType('signin');
        } else {
            prop.setValidStatus(true);
            prop.setValidMsg(signupRes.data.message)
            prop.setValidType('pass')
            prop.setResAlertType(false)
        }
    }

    return (
        <div className="bg-white rounded-3xl rounded-3xl 2xl:grid 2xl:grid-cols-10">
            <ThemeProvider theme={theme}>
                <div className="2xl:col-span-4 bg-mainOrange rounded-tl-3xl rounded-bl-3xl">
                    <h1 className="text-white text-4xl font-bold text-center mt-40">Welcome Back!</h1>
                    <p className="text-white mt-12 font-normal text-center text-lg px-20">To keep connected with us please sign in with your personal info</p>
                    <div className="grid grid-cols-1 justify-items-center mt-12">
                        <Button onClick={prop.goSignIn} variant="contained" color="primary" className={buttonClasses.otherStyle}>
                            <span className="text-xl font-semibold">
                                SIGN IN
                            </span>
                        </Button>
                    </div>
                </div>
                {signUpStatus === 'email' ?
                    <div className="2xl:col-span-6 pt-28 pb-20 px-32">
                        <h1 className="text-mainOrange text-4xl font-bold text-center pb-10">Sign up to Catus</h1>
                        <div className="grid grid-cols-1 gap-7 justify-items-center">
                            <TextField required defaultValue={email} error={prop.validType == 'email' ? true : false} id="signup-email" label="Email" variant="outlined" className="w-full" />
                        <Tooltip title="At least 6 characters" arrow>
                            <TextField required defaultValue={password} error={prop.validType == 'password' ? true : false} id="signup-password" label="Password" variant="outlined" type="password" className="w-full" />
                        </Tooltip>
                            <TextField required defaultValue={password} error={prop.validType == 'confirmPassword' ? true : false} id="signup-confirm-password" label="Confirm Password" variant="outlined" type="password" className="w-full" />
                        </div>
                        <div className="grid grid-cols-1 justify-items-center mt-14">
                            <Button onClick={nextSignUp} variant="contained" color="primary" className={buttonClasses.style}>
                                <span className="text-xl font-semibold">
                                    NEXT
                                </span>
                            </Button>
                        </div>
                    </div>
                    : null
                }
                {signUpStatus === 'contact'
                    ?
                    <div className="2xl:col-span-6 pt-28 pb-c3.4 px-32">
                        <h1 className="text-mainOrange text-4xl font-bold text-center pb-10">Sign up to Catus</h1>
                        <div className="grid grid-cols-2 gap-3 justify-items-center">
                            <TextField error={prop.validType == 'firstname' ? true : false} required id='signup-firstname' label="First Name" variant="outlined" className="w-full" />
                            <TextField error={prop.validType == 'lastname' ? true : false} required id='signup-lastname' label="Last Name" variant="outlined" className="w-full" />
                            <TextField error={prop.validType == 'phone' ? true : false} required id='signup-phone' label="Phone Number" variant="outlined" type="tel" className="w-full col-span-2" />
                            <TextField error={prop.validType == 'facebook' ? true : false} id='signup-facebook' label="Facebook" variant="outlined" className="w-full col-span-2" />
                            <TextField error={prop.validType == 'instagram' ? true : false} id='signup-instagram' label="Instagram" variant="outlined" className="w-full col-span-2" />
                        </div>
                        <div className="grid grid-cols-2 justify-items-center mt-11">
                            <Button onClick={backSignUp} variant="contained" color="secondary" className={buttonClasses.style + ' ' + buttonClasses.border}>
                                <span className="text-xl font-semibold">
                                    BACK
                                </span>
                            </Button>
                            <Button onClick={signUpUser} variant="contained" color="primary" className={buttonClasses.style}>
                                <span className="text-xl font-semibold">
                                    SIGN UP
                                </span>
                            </Button>
                        </div>
                    </div>
                    :
                    null
                }
            </ThemeProvider>
        </div>
    )
}