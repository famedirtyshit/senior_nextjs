/* eslint-disable @next/next/no-img-element */
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Image from 'next/dist/client/image';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import Head from 'next/head';

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

    useEffect(() => {
        if (cropperStatus == true) {
            let checkExist = setInterval(function () {
                if (document.getElementById('image-crop')) {
                    clearInterval(checkExist);
                    initCropper();
                }
            }, 100);
        }
    }, [cropperStatus, prop.imageRawFile])

    const modalClasses = modalStyles();

    const initCropper = async () => {
        initImage();
        let image = document.getElementById('image-crop');
        let myCrop = image.cropper;
        if (myCrop) {
            console.log('destroy')
            await myCrop.destroy();
        }
        const cropper = new Cropper(image, {
            aspectRatio: 3 / 4,
            ready() {
                console.log('ready')
            }
        })
    }

    const initImage = () => {
        if (prop.imageRawFile[0]) {
            let image = document.getElementById('image-crop');
            let imgSrc = URL.createObjectURL(prop.imageRawFile[0]);
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
                    <div className={modalClasses.paper}>
                        <div className="block 2xl:h-5/6 ">
                            {/* <Image id="image-crop" alt="img-for-crop" height="100" width="100" layout="fixed" src="/images/map.png" style={{ display: 'block', maxWidth: '100%' }} /> */}
                            <img id="image-crop" alt="img-for-crop" style={{ display: 'block', maxWidth: '100%' }} />
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}