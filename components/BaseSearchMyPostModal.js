import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import utilStyles from '@styles/Util.module.css';
import Carousel from 'react-material-ui-carousel';
import Image from 'next/image';
import IMAGES from '@constants/IMAGES';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '1366px',
        height: '597px'
    },
}));

const postDataStyles = makeStyles((theme) => ({
    style: {
        height: '546px'
    },
    itemStyle: {
        height: '500px'
    },
}))

export default function BaseSearchMyPostModal(prop) {
    const classes = useStyles();
    const postDataClasses = postDataStyles();

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

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={prop.searchMyPostStatus}
                onClose={prop.closeSearchByMyPostModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={prop.searchMyPostStatus}>
                    <div className={classes.paper + ' relative'}>
                        <p onClick={prop.closeSearchByMyPostModal} className="cursor-pointer absolute top-6 right-6 text-4xl font-bold">X</p>
                        {
                            prop.searchMyPostLoading == true
                                ?
                                <div className={'absolute ' + utilStyles.centerAbsolute}>
                                    <CircularProgress />
                                </div>
                                :
                                prop.myPostData && prop.myPostData.result == false
                                    ?
                                    <div className={'absolute ' + utilStyles.centerAbsolute}>
                                        <h1 className="text-4xl font-bold">มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่ภายหลัง</h1>
                                    </div>
                                    :
                                    prop.myPostData && prop.myPostData.searchResult.length < 1
                                        ?
                                        <div className={'absolute ' + utilStyles.centerAbsolute}>
                                            <h1 className="text-4xl font-bold">คุณยังไม่มีโพส</h1>
                                        </div>
                                        :
                                        prop.myPostData != null
                                            ?
                                            <div className="block h-full mx-4">
                                                {prop.searchType
                                                    ?
                                                    <p className="font-bold text-lg -mt-2">Search From My{prop.searchType != 'all' ? prop.searchType == 'lost' ? ' Found' : ' Lost' : ''} Post</p>
                                                    :
                                                    null
                                                }
                                                <Carousel animation="slide" autoPlay={false} navButtonsAlwaysVisible={prop.myPostData.searchResult.length > 1 ? true : false} className="h-full">
                                                    {prop.myPostData.searchResult.map((item, i) => {
                                                        return (
                                                            <div className={"grid 2xl:grid-cols-3 px-4 justify-items-center mt-4 " + postDataClasses.itemStyle} key={'dashboard-page-' + (i + 1)}>
                                                                {item.map((pageItem, pageItemIndex) => {
                                                                    return (
                                                                        <div className={`cursor-pointer `} onClick={() => { prop.setMyPostSelected({ page: i, post: pageItemIndex }); prop.closeSearchByMyPostModal() }} key={'dashboard-item-' + (i + 1) + '-' + (pageItemIndex + 1)}>
                                                                            {
                                                                                pageItem.urls.length > 0
                                                                                    ?
                                                                                    <Carousel navButtonsAlwaysInvisible={pageItem.urls.length < 2 ? true : false} indicators={false} className="">
                                                                                        {pageItem.urls.map((urlItem, urlIndex) => {
                                                                                            return (
                                                                                                <div key={'image-preview-dashboard-' + (pageItemIndex + 1) + '-' + urlIndex} className="mx-auto">
                                                                                                    <Image src={urlItem.url} alt={'previewImg-dashboard-' + (pageItemIndex + 1) + '-' + urlIndex} width="310" height="310" />
                                                                                                </div>
                                                                                            )
                                                                                        })}
                                                                                    </Carousel>
                                                                                    :
                                                                                    <Image key={'image-preview-dashboard-default-' + (pageItemIndex + 1)} src={IMAGES.defaultImg} alt={'previewImg-dashboard-default' + (pageItemIndex + 1)} width="310" height="310" />
                                                                            }
                                                                            <div className="px-3 pt-8">
                                                                                <p className="text-lg font-medium"><span className="text-lg font-medium">Date: </span>{convertDateFormat(pageItem.date)}</p>
                                                                                <p className="text-lg font-medium"><span className="text-lg font-medium">Sex: </span>{pageItem.sex != "unknow" ? pageItem.sex == "true" ? "Male" : "Female" : 'Unknow'}</p>
                                                                                <p className="text-lg font-medium"><span className="text-lg font-medium">Collar: </span>{pageItem.collar ? 'Have' : 'Not Have'}</p>
                                                                                <p className="text-lg font-medium"><span className="text-lg font-medium">Description: </span>{pageItem.description ? pageItem.description.length > 15 ? pageItem.description.substring(0, 15) + '...' : pageItem.description : '-'}</p>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )
                                                    })}
                                                </Carousel>
                                            </div>
                                            : null
                        }
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}