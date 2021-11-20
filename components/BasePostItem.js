import IMAGES from '@constants/IMAGES';
import Image from 'next/image';
import moment from 'moment';

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
        if (descData == undefined) {
            return '-';
        }
        let maxLength = 15;
        let convertString = descData;
        if (convertString.length > maxLength) {
            return convertString.substring(0, maxLength) + '...';
        } else {
            return descData
        }
    }

    const emitPostData = () => {
        prop.onClickFunction(prop.position);
    }

    return (
        <div onClick={emitPostData} className="post-item cursor-pointer px-auto mt-6 md:mt-0">
            <p className="text-right text-textGray text-sm font-medium md:px-0 px-6">{prop.data.post != undefined ? moment(new Date(prop.data.post.createdAt)).fromNow() : moment(new Date(prop.data.createdAt)).fromNow()}</p>
            <div className="flex justify-center md:justify-start">
                <Image src={prop.data.post != undefined ? prop.data.post.urls.length > 0 ? prop.data.post.urls[0].url : IMAGES.defaultImg : prop.data.urls.length > 0 ? prop.data.urls[0].url : IMAGES.defaultImg} alt='item-thumbnail' width="326" height="326" />
            </div>
                <div className="post-item-desc lg:ml-4 text-center md:text-left">
                    <p className="lg:text-lg lg:font-medium">Date: {convertDateFormat(prop.data.post != undefined ? prop.data.post.date : prop.data.date)}</p>
                    <p className="lg:text-lg lg:font-medium">Sex: {prop.data.post != undefined ? prop.data.post.sex != 'unknow' ? prop.data.post.sex == 'true' ? 'Male' : 'Female' : prop.data.post.sex : prop.data.sex != 'unknow' ? prop.data.sex == 'true' ? 'Male' : 'Female' : prop.data.sex}</p>
                    <p className="lg:text-lg lg:font-medium">Collar: {prop.data.post != undefined ? prop.data.post.collar == true ? 'have' : 'not have' : prop.data.collar == true ? 'have' : 'not have'}</p>
                    <p className="lg:text-lg lg:font-medium">Description: {convertDesc(prop.data.post != undefined ? prop.data.post.description : prop.data.description)}</p>
                </div>
        </div>
    )
}