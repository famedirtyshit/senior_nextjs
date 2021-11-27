import Head from 'next/head'
import Link from 'next/link';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import HistoryStyle from '@styles/History.module.css';
import Footer from '@components/Footer';
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import initFirebase from '@utils/initFirebase';
import accountUtil from '@utils/accountUtil';
import CircularProgress from '@material-ui/core/CircularProgress';
import UtilStyle from '@styles/Util.module.css';
import Pagination from '@material-ui/lab/Pagination';

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

const mainStyles = makeStyles((theme) => ({
    paper: {
        width: '1433px',
        height: '1149px',
        '@media only screen and (min-width: 1440px)': {
            width: '1366px',
            height: '1450px',
        },
        '@media only screen and (max-width: 1440px)': {
            width: '1200px',
            height: '1450px',
        },
        '@media only screen and (max-width: 1280px)': {
            width: '95%',
            height: '1450px',
        },
        '@media only screen and (max-width: 768px)': {
            width: '100%',
            height: '1450px',
        },
        background: '#F6F7F9',
        borderRadius: '20px 20px 20px 20px',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '122px',
        '@media only screen and (max-width: 1024px)': {
            marginTop: '80px',
        },
        marginBottom: '155px'
    },
}));

const historyContainerStyles = makeStyles((theme) => ({
    paper: {
        width: '1112px',
        height: '729px',
        '@media only screen and (max-width: 1280px)': {
            width: '95%',
            height: '729px',
        },
        '@media only screen and (max-width: 768px)': {
            width: '100%',
            height: '729px',
        },
        background: '#FFFFFF',
        borderRadius: '20px 20px 20px 20px',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '114px',
        marginBottom: 'auto'
    },
}));

const borderRadiusLeftStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: '20px 0px 0px 0px',
    },
}));

const borderRadiusRightStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: '0px 20px 0px 0px',
    },
}));

export default function History() {

    const firstRender = useRef(true);
    const [historyType, setHistoryType] = useState('all');
    const [userAccount, setUserAccount] = useState(null);
    const [historyPost, setHistoryPost] = useState(null);
    const [errorStatus, setErrorStatus] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [allHistoryPost, setAllHistoryPost] = useState(null);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState('createdAt');

    useEffect(() => {
        let res = initFirebase();
        if (res != false) {
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    let account = await accountUtil.getUser(user.uid);
                    if (account.data.result === true) {
                        setUserAccount(account.data.searchResult[0]);
                        let HistoryResult = await accountUtil.getMyHistory(account.data.searchResult[0]._id);
                        if (HistoryResult.data.result == false) {
                            setErrorStatus(true);
                            setLoadingStatus(false);
                        } else {
                            let dataFormat = [];
                            let dataPerPage = [];
                            let AllPostType = HistoryResult.data.searchResult.postFound.concat(HistoryResult.data.searchResult.postLost);
                            AllPostType.sort((a, b) => {
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            })
                            setAllHistoryPost(AllPostType);
                            AllPostType.map((item, index) => {
                                dataPerPage.push(item);
                                if ((index + 1) % 4 == 0 || index == AllPostType.length - 1) {
                                    dataFormat.push(dataPerPage);
                                    dataPerPage = [];
                                }
                            })
                            setHistoryPost(dataFormat);
                            setLoadingStatus(false);
                            firstRender.current = false;
                        }
                    } else {
                        setUserAccount(null);
                        alert('user not found');
                        signOut(auth).then(() => {
                            window.location.href = '/authen';
                        }).catch((error) => {
                            window.location.href = '/authen';
                            console.log('signout fail')
                            console.log(error)
                        });
                    }
                } else {
                    setUserAccount(null);
                    window.location.href = '/authen';
                }
            });
        } else {
            setErrorStatus(true);
            setLoadingStatus(false);
            console.log('init firebase error')
        }
    }, [])

    useEffect(() => {
        if (errorStatus != true) {
            setLoadingStatus(true);
            setPage(1);
            if (historyType == 'all') {
                if (firstRender.current == false) {
                    let dataFormat = [];
                    let dataPerPage = [];
                    allHistoryPost.sort((a, b) => {
                        if (sortType == 'createdAt') {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        } else if (sortType == 'expireAt') {
                            return new Date(a.expires) - new Date(b.expires);
                        }
                    })
                    allHistoryPost.map((item, index) => {
                        dataPerPage.push(item);
                        if ((index + 1) % 4 == 0 || index == allHistoryPost.length - 1) {
                            dataFormat.push(dataPerPage);
                            dataPerPage = [];
                        }
                    })
                    setHistoryPost(dataFormat);
                    setLoadingStatus(false);
                }
            } else {
                let selectedHistoryPostType = allHistoryPost.filter(post => { return post.status == historyType });
                let dataFormat = [];
                let dataPerPage = [];
                selectedHistoryPostType.sort((a, b) => {
                    if (sortType == 'createdAt') {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    } else if (sortType == 'expireAt') {
                        return new Date(a.expires) - new Date(b.expires);
                    }
                })
                selectedHistoryPostType.map((item, index) => {
                    dataPerPage.push(item);
                    if ((index + 1) % 4 == 0 || index == selectedHistoryPostType.length - 1) {
                        dataFormat.push(dataPerPage);
                        dataPerPage = [];
                    }
                })
                setHistoryPost(dataFormat);
                setLoadingStatus(false);
            }
        }
    }, [historyType, sortType])


    const mainClasses = mainStyles();
    const historyContainer = historyContainerStyles();
    const borderRadiusLeftClasses = borderRadiusLeftStyles();
    const borderRadiusRightClasses = borderRadiusRightStyles();

    const setAllType = () => {
        setHistoryType('all');
    }
    const setCompleteType = () => {
        setHistoryType('complete');
    }
    const setDeleteType = () => {
        setHistoryType('delete');
    }
    const setExpireType = () => {
        setHistoryType('expire');
    }
    const setDeleteByAdminType = () => {
        setHistoryType('deleteByAdmin');
    }

    const convertDateFormat = (dateData) => {
        let dateConvert = new Date(dateData);
        let year;
        let month;
        let date;
        year = dateConvert.getFullYear();
        month = dateConvert.getMonth() + 1;
        date = dateConvert.getDate();
        return `${date}/${month}/${year}`;
    }

    const setPageHistory = (page) => {
        setPage(page);
    }

    const setSortByCreatedAt = () => {
        setSortType('createdAt');
    }

    const setSortByExpireAt = () => {
        setSortType('expireAt');
    }

    return (
        <div style={{ fontFamily: 'Prompt' }} className={"mx-auto " + HistoryStyle.bgImg}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
            </Head>
            <ThemeProvider theme={theme}>
                <div className="head-sec">
                    <header className="flex flex-wrap justify-between lg:mx-64 sm:mx-20 pt-3 mx-8">
                        <Link href='/'>
                            <a>
                                <h1 className="lg:text-5xl text-4xl font-black text-white">Catus</h1>
                            </a>
                        </Link>
                    </header>
                </div>
                <main className={mainClasses.paper}>
                    <div className="main-header">
                        <div className="top-10 absolute left-5">
                            <Link href="/account">
                                <a>
                                    <ArrowBackIosIcon
                                        style={{ color: "black", width: "40px", height: "40px" }}
                                        className="cursor-pointer"
                                    />
                                </a>
                            </Link>
                        </div>
                        <div className="lg:top-9 absolute left-16 lg:text-4xl sm:text-2xl sm:top-11 text-xl top-11 font-semibold">
                            <p>History</p>
                        </div>
                        <div className="flex flex-wrap border-b border-gray-300 pt-28">
                            <p className={cn({
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10 border-b-4 border-gray-500': historyType == 'all',
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10': historyType != 'all',
                            })} onClick={setAllType}>All</p>
                            <p className={cn({
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10 border-b-4 border-gray-500': historyType == 'complete',
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10': historyType != 'complete',
                            })} onClick={setCompleteType}>Complete</p>
                            <p className={cn({
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10 border-b-4 border-gray-500': historyType == 'delete',
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10': historyType != 'delete',
                            })} onClick={setDeleteType}>Delete</p>
                            <p className={cn({
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10 border-b-4 border-gray-500': historyType == 'expire',
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10': historyType != 'expire',
                            })} onClick={setExpireType}>Expire</p>
                            <p className={cn({
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10 border-b-4 border-gray-500': historyType == 'deleteByAdmin',
                                'lg:text-xl font-semibold cursor-pointer mx-auto px-2 md:px-16 sm:px-10': historyType != 'deleteByAdmin',
                            })} onClick={setDeleteByAdminType}>Delete by admin</p>
                        </div>
                        <div className={historyContainer.paper}>
                            <div className="grid grid-cols-11 relative">
                                <div className={"col-span-4 pt-14 pb-2 border-b border-gray-300 bg-historyGrayBg " + borderRadiusLeftClasses.paper}>
                                    <p className="md:text-base font-semibold text-start pl-14">Post</p>
                                </div>
                                <div onClick={setSortByCreatedAt} className="flex items-center justify-center col-span-2 pt-14 pb-2 border-b border-gray-300 bg-historyGrayBg">
                                    <p className="md:text-base font-semibold text-center cursor-pointer hidden sm:block">Posted on</p>
                                    <div className="cursor-pointer hidden sm:block">
                                        {
                                            sortType == 'createdAt'
                                                ?
                                                <svg width="13" height="6" viewBox="0 0 13 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.24534 5.32228C5.18349 5.27546 5.13129 5.22364 5.08589 5.1698L0.346648 1.55707C-0.115476 1.20447 -0.115696 0.633039 0.346868 0.280288C0.809211 -0.072296 1.55909 -0.0722859 2.02188 0.280311L6.10335 3.39182L10.2063 0.264706C10.6685 -0.0880451 11.4186 -0.0880349 11.8813 0.264729C12.1123 0.44111 12.2279 0.671992 12.2279 0.902873C12.2279 1.13375 12.1123 1.36513 11.8809 1.54101L7.12082 5.16983C7.07542 5.22366 7.02344 5.27532 6.96137 5.3223C6.72449 5.50286 6.41348 5.58945 6.10335 5.58543C5.79301 5.58961 5.48156 5.50284 5.24534 5.32228Z" fill="black" />
                                                </svg>
                                                :
                                                <svg width="13" height="6" viewBox="0 0 13 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.98122 0.263661C7.04307 0.310473 7.09527 0.362301 7.14067 0.416134L11.8799 4.02887C12.342 4.38146 12.3423 4.9529 11.8797 5.30565C11.4174 5.65823 10.6675 5.65822 10.2047 5.30563L6.12321 2.19412L2.02023 5.32123C1.55811 5.67398 0.808007 5.67397 0.345224 5.32121C0.114272 5.14483 -0.00131181 4.91395 -0.00131181 4.68306C-0.00131181 4.45218 0.114272 4.2208 0.345664 4.04493L5.10574 0.416107C5.15114 0.362274 5.20313 0.310615 5.2652 0.263637C5.50207 0.0830824 5.81308 -0.00351374 6.12321 0.000502564C6.43356 -0.00367272 6.745 0.0830992 6.98122 0.263661Z" fill="black" />
                                                </svg>

                                        }
                                    </div>
                                </div>
                                <div onClick={setSortByExpireAt} className="flex items-center justify-center col-span-2 pt-14 pb-2 border-b border-gray-300 bg-historyGrayBg">
                                    <p className="md:text-base font-semibold text-center cursor-pointer hidden sm:block">History expire at</p>
                                    <div className="cursor-pointer hidden sm:block">
                                        {
                                            sortType == 'expireAt'
                                                ?
                                                <svg width="13" height="6" viewBox="0 0 13 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.24534 5.32228C5.18349 5.27546 5.13129 5.22364 5.08589 5.1698L0.346648 1.55707C-0.115476 1.20447 -0.115696 0.633039 0.346868 0.280288C0.809211 -0.072296 1.55909 -0.0722859 2.02188 0.280311L6.10335 3.39182L10.2063 0.264706C10.6685 -0.0880451 11.4186 -0.0880349 11.8813 0.264729C12.1123 0.44111 12.2279 0.671992 12.2279 0.902873C12.2279 1.13375 12.1123 1.36513 11.8809 1.54101L7.12082 5.16983C7.07542 5.22366 7.02344 5.27532 6.96137 5.3223C6.72449 5.50286 6.41348 5.58945 6.10335 5.58543C5.79301 5.58961 5.48156 5.50284 5.24534 5.32228Z" fill="black" />
                                                </svg>
                                                :
                                                <svg width="13" height="6" viewBox="0 0 13 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.98122 0.263661C7.04307 0.310473 7.09527 0.362301 7.14067 0.416134L11.8799 4.02887C12.342 4.38146 12.3423 4.9529 11.8797 5.30565C11.4174 5.65823 10.6675 5.65822 10.2047 5.30563L6.12321 2.19412L2.02023 5.32123C1.55811 5.67398 0.808007 5.67397 0.345224 5.32121C0.114272 5.14483 -0.00131181 4.91395 -0.00131181 4.68306C-0.00131181 4.45218 0.114272 4.2208 0.345664 4.04493L5.10574 0.416107C5.15114 0.362274 5.20313 0.310615 5.2652 0.263637C5.50207 0.0830824 5.81308 -0.00351374 6.12321 0.000502564C6.43356 -0.00367272 6.745 0.0830992 6.98122 0.263661Z" fill="black" />
                                                </svg>

                                        }
                                    </div>
                                </div>
                                <div className={"col-span-3 pt-14 pb-2 border-b border-gray-300 bg-historyGrayBg " + borderRadiusRightClasses.paper}>
                                    <p className="md:text-base font-semibold text-center ">Note</p>
                                </div>
                                {
                                    loadingStatus == true ?
                                        <div className="col-span-11 mx-auto mt-72 mb-44">
                                            <CircularProgress />
                                        </div>
                                        :
                                        errorStatus == true ?
                                            <div className="col-span-11 mx-auto mt-72 mb-44 text-lg font-semibold ">
                                                <p>error please retry later</p>
                                            </div>
                                            :
                                            historyPost < 1 ?
                                                <div className="col-span-11 mx-auto mt-72 mb-44 text-lg font-semibold ">
                                                    <p>no history</p>
                                                </div>
                                                :
                                                historyPost[page - 1].map((item, index) => {
                                                    return (
                                                        <div className="col-span-11 grid grid-cols-11 grid-rows-1 border-b border-gray-300" key={index}>
                                                            <div className="sm:col-span-2 col-span-3 sm:h-32 flex items-center justify-center">
                                                                <p className="text-base font-semibold text-center">post {item.postType}</p>
                                                            </div>
                                                            <div className="sm:col-span-2 col-span-4 text-center sm:h-32 flex items-center justify-center ">
                                                                <p className="text-sm font-semibold text-center">Date: {convertDateFormat(item.date)} Sex: {item.sex == 'unknow' ? 'Unknow' : item.sex == 'true' ? 'Male' : 'Female'} Collar: {item.collar == true ? 'Have' : 'Not Have'} Description: {item.description ? item.description.length > 15 ? item.description.substring(0, 15) + '...' : item.description : '-'}</p>
                                                            </div>
                                                            <div className="sm:col-span-2 sm:h-32 flex items-center justify-center">
                                                                <p className="text-base font-semibold text-center hidden sm:block">{convertDateFormat(item.createdAt)}</p>
                                                            </div>
                                                            <div className="sm:col-span-2 sm:h-32 flex items-center justify-center">
                                                                <p className="text-base font-semibold text-center hidden sm:block">{convertDateFormat(item.expires)}</p>
                                                            </div>
                                                            <div className="sm:col-span-3 sm:h-32 flex items-center justify-center">
                                                                {item.status == 'complete'
                                                                    ?
                                                                    <p className="text-base font-semibold text-center text-green-500">{'Complete'}</p>
                                                                    :
                                                                    null
                                                                }
                                                                {item.status == 'delete'
                                                                    ?
                                                                    <p className="text-base font-semibold text-center text-red-500">{'Delete'}</p>
                                                                    :
                                                                    null
                                                                }
                                                                {item.status == 'expire'
                                                                    ?
                                                                    <p className="text-base font-semibold text-center text-yellow-500">{'Expire'}</p>
                                                                    :
                                                                    null
                                                                }
                                                                {item.status == 'deleteByAdmin'
                                                                    ?
                                                                    <p className="text-base font-semibold text-center text-blue-500">{'Delete by admin'}</p>
                                                                    :
                                                                    null
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                }
                                <div className={"col-span-11 h-20 flex justify-end items-center"}>
                                    <Pagination onChange={(e, page) => { setPageHistory(page) }} page={page} count={historyPost == null ? 1 : historyPost.length} disabled={loadingStatus == true || errorStatus == true ? true : false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </ThemeProvider>
            <Footer color='blue' />
        </div>
    )
}