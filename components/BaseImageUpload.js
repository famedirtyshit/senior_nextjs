import BaseButton from "@components/BaseButton";
import BaseCropModal from "@components/BaseCropModal";
import Image from 'next/dist/client/image'
import IMAGES from '@constants/IMAGES';
import UtilStyles from "@styles/Util.module.css";
import { useState, useEffect } from "react";

export default function BaseImageUpload() {
    const [imageRawFile, setImageRawFile] = useState([]);
    const [cropModalStatus, setCropModalStatus] = useState(false);

    useEffect(() => {
        if (imageRawFile.length > 0) {
            setCropModalStatus(true);
        } else {
            setCropModalStatus(false);
        }
    }, [imageRawFile])

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
            return false;
        }
        return true;
    }

    const closeCropModal = () => {
        setImageRawFile([]);
        setCropModalStatus(false);
    }

    return (
        <div>
            <div className="2xl:w-full 2xl:mt-3 rounded-lg h-80 bg-textGray relative">
                <div className={"absolute " + UtilStyles.centerAbsolute}>
                    <Image src={IMAGES.imageLogo} alt='imageLogo' width="50" height="50" />
                </div>
            </div>
            <input style={{ display: 'none' }} type="file" name='file-image' multiple accept="image/png,image/jpeg" id='file-upload' onChange={inputImageHandle} />
            <div onClick={chooseImage}>
                <BaseButton fill={true} fillColor={'mainGreen'} textColor={'white'} round={true} roundSize={'lg'} value={'Upload an Image'} customClass={'2xl:mt-6 2xl:w-full bg-opacity-75'}></BaseButton>
            </div>
            <BaseCropModal cropModalStatus={cropModalStatus} closeCropModal={closeCropModal} imageRawFile={imageRawFile} />
        </div>
    )
}