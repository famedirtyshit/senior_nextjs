import IMAGES from '@constants/IMAGES';
import Image from 'next/dist/client/image';

export default function BasePostItem(prop) {
    return (
        <div className="post-item">
            <Image src={IMAGES.defaultImg} alt='item-thumbnail' width="326" height="326" />
            <div className="post-item-desc 2xl:ml-4">
                <p className="2xl:text-lg 2xl:font-medium">Location: -</p>
                <p className="2xl:text-lg 2xl:font-medium">Date: -</p>
                <p className="2xl:text-lg 2xl:font-medium">Sex: -</p>
                <p className="2xl:text-lg 2xl:font-medium">Collar: -</p>
                <p className="2xl:text-lg 2xl:font-medium">Description: -</p>
            </div>
        </div>
    )
}