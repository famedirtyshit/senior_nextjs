import BaseButton from "@components/BaseButton";
import BaseCropModal from "@components/BaseCropModal";
import Image from 'next/image'
import IMAGES from '@constants/IMAGES';
import UtilStyles from "@styles/Util.module.css";
import { useState, useEffect } from "react";
import Carousel from 'react-material-ui-carousel'


export default function BaseImageUpload(prop) {
    const [imageRawFile, setImageRawFile] = useState([]);
    const [cropModalStatus, setCropModalStatus] = useState(false);
    const [imageCropFile, setImageCropFile] = useState([]);

    useEffect(() => {
        if (imageRawFile.length > 0) {
            setCropModalStatus(true);
        } else {
            setCropModalStatus(false);
        }
    }, [imageRawFile])

    useEffect(() => {
        setImageCropFile([]);
        for (let i = 0; i < prop.image.length; i++) {
            blobToDataURL(prop.image[i], function (dataUrl) {
                setImageCropFile(imageCropFile => [...imageCropFile, dataUrl]);
            });
        }
    }, [prop.image])

    const blobToDataURL = (blob, callback) => {
        let fr = new FileReader();
        fr.onload = function (e) { callback(e.target.result); }
        fr.readAsDataURL(blob);
    }

    const chooseImage = () => {
        let inputEle = document.getElementById('file-upload');
        inputEle.click();
    }

    const inputImageHandle = (event) => {
        let files = event.target.files;
        if (!checkImageLength(files)) {
            setImageRawFile([]);
            return false;
        } else {
            setImageRawFile(files);
        }
    }

    const checkImageLength = (img) => {
        if (img.length > 5) {
            alert('maximum image upload is 5 image');
            document.getElementById('file-upload').value = null;
            return false;
        }
        return true;
    }

    const closeCropModal = () => {
        setCropModalStatus(false);
        document.getElementById('file-upload').value = null;
    }

    return (
        <div>
            <div className="2xl:w-5/6 2xl:mx-auto 2xl:mt-3 rounded-lg h-80 bg-textGray relative">
                {
                    imageCropFile.length > 0 ?
                        <Carousel navButtonsAlwaysVisible={true} className="block h-full">
                            {
                                imageCropFile.map((item, i) => <Image key={i} src={item} alt={'previewImg-' + i} layout="fill"  />)
                            }
                        </Carousel>
                        :
                        <div className={"absolute " + UtilStyles.centerAbsolute}>
                            <Image src={IMAGES.imageLogo} alt='imageLogo' width="50" height="50" />
                        </div>
                }
            </div>
            <input style={{ display: 'none' }} type="file" name='file-image' multiple accept="image/png,image/jpeg" id='file-upload' onChange={inputImageHandle} />
            <BaseButton onClickFunction={chooseImage} fill={true} fillColor={'mainOrange'} textColor={'white'} round={true} roundSize={'lg'} value={'Upload an Image'} customClass={'2xl:mt-6 2xl:w-full bg-opacity-75'}></BaseButton>
            <BaseCropModal setImage={prop.setImage} cropModalStatus={cropModalStatus} closeCropModal={closeCropModal} imageRawFile={imageRawFile} />
        </div>
    )
}