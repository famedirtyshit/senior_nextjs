/* eslint-disable @next/next/no-img-element */
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const theme = createTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#356053',
            dark: '#3f50b5',
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

const modalStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '80%',
        height: '80%',
    },
}));


export default function BaseCropModal(prop) {
    const [cropperStatus, setCropperStatus] = useState(false);
    const [croppedImage, setCroppedImage] = useState([]);

    useEffect(() => {
        setCroppedImage([]);
        if (cropperStatus == true) {
            let checkExist = setInterval(function () {
                if (document.getElementById('image-crop')) {
                    clearInterval(checkExist);
                    initCropper(1);
                }
            }, 100);
        }
    }, [cropperStatus, prop.imageRawFile])

    useEffect(() => {
        if (croppedImage.length === prop.imageRawFile.length) {
            emitCroppedImage();
            prop.closeCropModal();
        }
        else if (croppedImage.length > 0) {
            initCropper(croppedImage.length + 1);
        }
    }, [croppedImage])

    const modalClasses = modalStyles();

    const initCropper = async (imagePosition) => {
        if (imagePosition <= prop.imageRawFile.length) {
            initImage(imagePosition - 1);
            let image = document.getElementById('image-crop');
            let myCrop = image.cropper;
            if (myCrop) {
                // console.log('destroy')
                await myCrop.destroy();
            }
            const cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                ready() {
                    // console.log('ready')
                }
            })
        }
    }

    const initImage = (imageIndex) => {
        if (prop.imageRawFile[imageIndex]) {
            let image = document.getElementById('image-crop');
            let imgSrc = URL.createObjectURL(prop.imageRawFile[imageIndex]);
            image.src = imgSrc;
        }
    }

    const checkCropperStatus = () => {
        if (cropperStatus == false) {
            setCropperStatus('first');
        } else if (cropperStatus == 'first') {
            setCropperStatus(true);
        }
    }

    const resetCropper = () => {
        let image = document.getElementById('image-crop');
        let myCrop = image.cropper;
        myCrop.reset();
    }

    const cropImage = () => {
        let image = document.getElementById('image-crop');
        let myCrop = image.cropper;
        myCrop.getCroppedCanvas({
            // width: 160,
            // height: 90,
            // minWidth: 256,
            // minHeight: 256,
            // maxWidth: 4096,
            // maxHeight: 4096,
            fillColor: '#fff',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        }).toBlob((blob) => {
            setCroppedImage([...croppedImage, blob]);
        })
    }

    const emitCroppedImage = () => {
        prop.setImage(croppedImage);
    }

    return (
        <div>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.css" integrity="sha512-+VDbDxc9zesADd49pfvz7CgsOl2xREI/7gnzcdyA9XjuTxLXrdpuz21VVIqc5HPfZji2CypSbxx1lgD7BgBK5g==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css" integrity="sha512-0SPWAwpC/17yYyZ/4HSllgaK7/gg9OlVozq8K7rf3J8LvCjYEEIfzzpnA2/SSjpGIunCSD18r3UhvDcu/xncWA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js" integrity="sha512-ooSWpxJsiXe6t4+PPjCgYmVfr1NS5QXJACcR/FPpsdm6kqG1FmQ2SVyg2RXeVuCRBLr0lWHnWJP6Zs1Efvxzww==" crossorigin="anonymous" referrerPolicy="no-referrer" onLoad={checkCropperStatus()} ></Script>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.js" integrity="sha512-ZK6m9vADamSl5fxBPtXw6ho6A4TuX89HUbcfvxa2v2NYNT/7l8yFGJ3JlXyMN4hlNbz0il4k6DvqbIW5CCwqkw==" crossorigin="anonymous" referrerPolicy="no-referrer" onLoad={checkCropperStatus()} ></Script>
            <Modal
                aria-labelledby="crop-modal-title"
                aria-describedby="crop-modal-description"
                className={modalClasses.modal}
                open={prop.cropModalStatus}
                onClose={prop.closeCropModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={prop.cropModalStatus}>
                    <ThemeProvider theme={theme}>
                        <div className={modalClasses.paper}>
                            <div className="block 2xl:h-5/6 ">
                                {/* <Image id="image-crop" alt="img-for-crop" height="100" width="100" layout="fixed" src="/images/map.png" style={{ display: 'block', maxWidth: '100%' }} /> */}
                                <img id="image-crop" alt="img-for-crop" style={{ display: 'block', maxWidth: '100%' }} />
                            </div>
                            <div className="2xl:flex flex-wrap 2xl:h-1/6 2xl:items-center 2xl:justify-between">
                                <div className="2xl:flex-grow-0.9" >
                                    <Button onClick={resetCropper} variant="contained" color="default" className={"2xl:max-h-14"}>Reset</Button>
                                </div>
                                <p>{croppedImage.length + 1} of {prop.imageRawFile.length}</p>
                                <Button onClick={cropImage} variant="contained" color="primary" className={"2xl:max-h-14"}>{croppedImage.length + 1 === prop.imageRawFile.length ? 'Finish' : 'Crop'}</Button>
                                <Button onClick={prop.closeCropModal} variant="contained" color="secondary" className={"2xl:max-h-14 2xl:ml-8"}>Cancel</Button>
                            </div>
                        </div>
                    </ThemeProvider>
                </Fade>
            </Modal>
        </div >
    )
}