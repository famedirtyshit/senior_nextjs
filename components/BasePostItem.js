import IMAGES from '@constants/IMAGES';
import Image from 'next/dist/client/image';

export default function BasePostItem(prop) {

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

    const convertDesc = (descData) => {
        if(descData == undefined){
            return '-';
        }
        let maxLength = 15;
        let convertString = descData;
        if(convertString.length > maxLength){
            return convertString.substring(0,maxLength) + '...';
        }else{
            return descData
        }
    }

    return (
        <div className="post-item cursor-pointer">
            <Image src={prop.data.post.urls.length > 0 ? prop.data.post.urls[0].url : IMAGES.defaultImg} alt='item-thumbnail' width="326" height="326" />
            <div className="post-item-desc 2xl:ml-4">
                <p className="2xl:text-lg 2xl:font-medium">Date: {convertDateFormat(prop.data.post.date)}</p>
                <p className="2xl:text-lg 2xl:font-medium">Sex: {prop.data.post.sex != 'unknow' ? prop.data.post.sex == 'true' ? 'Male' : 'Female' : prop.data.post.sex}</p>
                <p className="2xl:text-lg 2xl:font-medium">Collar: {prop.data.post.collar == true ? 'have' : 'not have'}</p>
                <p className="2xl:text-lg 2xl:font-medium">Description: {convertDesc(prop.data.post.description)}</p>
            </div>
        </div>
    )
}