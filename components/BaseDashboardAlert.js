import { useState } from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import utilStyles from '@styles/Util.module.css';
import Image from 'next/image';
import ICONS from '@constants/ICONS';
import IMAGES from '@constants/IMAGES';

const theme = createTheme({
    palette: {
        primary: {
            light: '#FFD76B',
            main: '#FFD76B',
            dark: '#FFD76B',
            contrastText: '#fff',
        },
    },
});

const alertStyles = makeStyles((theme) => ({
    style: {
        position: 'fixed',
        top: '800px',
        right: '80px'
    }
}))

const contentStyles = makeStyles((theme) => ({
    style: {
        width: '387px',
        height: '264px',
        background: '#FFFFFF',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.35)',
        borderRadius: '27px',
        marginBottom: '12px'
    }
}))

const postStyles = makeStyles((theme) => ({
    style: {
        height: '62px',
        width: '100%',
        display: 'flex'
    },
    imageContainer: {
        height: '55px',
        width: '55px',
        position: 'relative'
    },
    postDetail: {
        width: '280px'
    },
}))

export default function BaseDashboardAlert(prop) {
    const alertClasses = alertStyles();
    const contentClasses = contentStyles();
    const postClasses = postStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState();

    const handleClick = (newPlacement) => (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };

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

    const close = () => {
        setOpen(false);
    }

    return (
        <div className={alertClasses.style}>
            <ThemeProvider theme={theme}>
                <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <div className={contentClasses.style + '  ' + 'relative'}>
                                <div onClick={close} className="absolute right-5 top-4 cursor-pointer">
                                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="9.5" cy="9.04762" rx="9.5" ry="9.04762" fill="#EBEBEB" />
                                        <rect x="3.61914" y="8.14258" width="11.7619" height="1.80952" rx="0.904762" fill="#505050" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold 2xl:pl-8 2xl:pt-5">Notifications</p>
                                {prop.dashboardData && prop.dashboardData.result == true
                                    ?
                                    <div>
                                        <p className="text-textGray text-sm font-medium 2xl:px-5 2xl:pt-2">
                                            {
                                                prop.dashboardData && prop.dashboardData.searchResult.length > 0
                                                    ?
                                                    `มี ${prop.dashboardData.searchResult.length} โพสพบเจอแมวได้ถูกเพิ่มเข้ามาในพื้นที่บริเวณใกล้เคียงกับ
                                        โพสแมวหายของคุณ`
                                                    :
                                                    `ขณะนี้ไม่มีคนพบแมวบริเวณใกล้เคียงแมวหายของคุณ`
                                            }
                                        </p>
                                        <div className={"relative 2xl:h-32 2xl:mx-5 2xl:mt-3 overflow-y-scroll "}>
                                            {
                                                prop.dashboardData && prop.dashboardData.searchResult.length > 0
                                                    ?
                                                    prop.dashboardData.searchResult.map((post, postIndex) => {
                                                        return (
                                                            <div key={'post-' + postIndex} onClick={() => { window.location.href = 'dashboard' }} className={'cursor-pointer mb-8 ' + postClasses.style}>
                                                                <div className={postClasses.imageContainer}>
                                                                    {post.urls.length > 0
                                                                        ?
                                                                        <Image alt={'thumbnail-' + postIndex} src={post.urls[0].url} layout="fill"></Image>
                                                                        :
                                                                        <Image alt={'thumbnail-' + postIndex} src={IMAGES.defaultImg} layout="fill"></Image>
                                                                    }
                                                                </div>
                                                                <div className={"flex flex-wrap content-center text-xs font-normal " + postClasses.postDetail}>
                                                                    <p className="mx-1">Date:{convertDateFormat(post.date)}</p>
                                                                    <p className="mx-1">Sex:{post.sex == 'unknow' ? 'Unknow' : post.sex == true ? "Male" : "Female"}</p>
                                                                    <p className="mx-1">Male:{post.collar == true ? "Have" : "Not Have"}</p>
                                                                    <p className="mx-1">Description:{post.description.length > 15 ? post.description + '...' : post.description}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    :
                                                    <h1 className={"text-2xl font-bold absolute " + utilStyles.centerAbsolute}>ไม่มีโพส</h1>
                                            }
                                        </div>
                                    </div>
                                    :
                                    <div className="relative 2xl:h-5/6 2xl:mx-5">
                                        <h1 className={"text-2xl font-bold absolute " + utilStyles.centerAbsolute}>มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่ภายหลัง</h1>
                                    </div>
                                }
                            </div>
                        </Fade>
                    )}
                </Popper>
                <Fab onClick={handleClick('top-end')} color="primary" aria-label="noti-button">
                    <IconButton aria-label="noti-icon">
                        {prop.dashboardData && prop.dashboardData.searchResult.length > 0 && prop.dashboardData.result == true
                            ?
                            <div className="w-2 h-2">
                                <Image alt="bellAlert" src={ICONS.bellAlert} layout='fill' />
                            </div>
                            :
                            <div className="w-2 h-2">
                                <Image alt="bell" src={ICONS.bell} layout='fill' />
                            </div>
                        }
                    </IconButton>
                </Fab>
            </ThemeProvider>
        </div>
    );
}
