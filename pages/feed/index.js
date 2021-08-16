import Head from 'next/head'
import FeedStyle from '@styles/Feed.module.css';
import BaseButton from '@components/BaseButton'
import IMAGES from '@constants/IMAGES';
import Image from 'next/dist/client/image';
import Slider from '@material-ui/core/Slider';
import BaseCheckbox from '@components/BaseCheckBox';
import BasePostItem from '@components/BasePostItem';
import Pagination from '@material-ui/lab/Pagination';
import cn from 'classnames'
import { useState, useEffect } from 'react';

export default function Home() {

    const [postType, setPostType] = useState('all');
    const [male, setMale] = useState(true);
    const [female, setFemale] = useState(true);
    const [haveCollar, setHaveCollar] = useState(true);
    const [notHaveCollar, setNotHaveCollar] = useState(true);

    useEffect(() => {

    })

    const setAllType = () => {
        setPostType('all');
    }

    const setFoundType = () => {
        setPostType('found');
    }

    const setLostType = () => {
        setPostType('lost');
    }

    const getRadiusValue = (value) => {
        return value;
    }

    const handleMaleChange = (event) => {
        setMale(event.target.checked);
    };

    const handleFemaleChange = (event) => {
        setFemale(event.target.checked);
    };

    const handleHaveCollarChange = (event) => {
        setHaveCollar(event.target.checked);
    };

    const handleNotHaveCollarChange = (event) => {
        setNotHaveCollar(event.target.checked);
    };

    return (
        <div className={"2xl:container mx-auto " + FeedStyle.bgImg}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={"head-sec"}>
                <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 pt-3">
                    <h1 className="2xl:text-5xl 2xl:font-black text-white">Catus</h1>
                </header>
                <section className="w-9/12 bg-mainCream mx-auto rounded-2xl shadow-lg 2xl:mt-20">
                    <div className="2xl:flex 2xl:flex-wrap 2xl:py-16">
                        <div className="2xl:ml-16">
                            <Image src={IMAGES.user} alt='default-user' width="112" height="112" />
                        </div>
                        <div className="2xl:ml-12 text-xl font-normal">
                            <p>Name: Guest</p>
                            <p>Facebook: -</p>
                            <p>Instragram: -</p>
                            <p>Tel: -</p>
                        </div>
                        <div className="2xl:ml-64 2xl:text-center 2xl:pl-12">
                            <p className="text-xl font-normal text-textGray">Please login</p>
                            <BaseButton fill={true} fillColor={'mainGreen'} textColor={'white'} round={true} roundSize={'lg'} value={'Login'} customClass={'2xl:mt-4 2xl:px-32'}></BaseButton>
                        </div>
                    </div>
                </section>
                <section className="2xl:mt-32 2xl:grid 2xl:grid-cols-3 2xl:mx-56 text-center">
                    <p className={"cursor-pointer text-2xl font-bold 2xl:pb-2 " + cn({
                        'text-mainGreen border-b-4 border-mainGreen': postType === 'all',
                    })} onClick={setAllType}>All</p>
                    <p className={"cursor-pointer text-2xl font-bold 2xl:pb-2 " + cn({
                        'text-mainGreen border-b-4 border-mainGreen': postType === 'found',
                    })} onClick={setFoundType}>Found</p>
                    <p className={"cursor-pointer text-2xl font-bold 2xl:pb-2 " + cn({
                        'text-mainGreen border-b-4 border-mainGreen': postType === 'lost',
                    })} onClick={setLostType}>Lost</p>
                </section>
            </div>
            <main>
                <section className="2xl:mt-32 2xl:grid 2xl:grid-cols-4 2xl:mx-56">
                    <div>
                        <p className="text-xl font-medium">ITEM (90)</p>
                        <p className="text-white 2xl:px-6 py-2 bg-darkCream rounded-3xl shadow-lg cursor-pointer 2xl:mt-10 text-center">ค้นหาด้วยข้อมูล Post ของฉัน</p>
                        <p className="text-xl font-medium 2xl:mt-11">Change Location</p>
                        <div className="map 2xl:mt-7 h-60 relative shadow-lg" style={{ backgroundColor: '#E8E8E8' }}>
                            <p className="absolute text-white 2xl:px-6 py-2 bg-mainGreen rounded-3xl shadow-lg cursor-pointer 2xl:mt-7 2xl:top-1/3 2xl:left-16">ระบุตำแหน่งด้วยตนเอง</p>
                        </div>
                        <p className="text-xl font-medium 2xl:mt-6">Radius</p>
                        <Slider
                            defaultValue={1}
                            getAriaValueText={getRadiusValue}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks={[{ value: 1, label: '1KM' }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5, label: '5KM' }]}
                            min={1}
                            max={5}
                            color="primary"
                        />
                        <p className="text-xl font-medium 2xl:mt-3">Sex</p>
                        <div className="sex-checkbox 2xl:ml-8">
                            <BaseCheckbox checkValue={male} setValue={handleMaleChange} label='male' />
                            <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5">Male</p>
                            <br />
                            <BaseCheckbox checkValue={female} setValue={handleFemaleChange} label='female' />
                            <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5" >Female</p>
                        </div>
                        <p className="text-xl font-medium 2xl:mt-3">Pet collar</p>
                        <div className="collar-checkbox 2xl:ml-8">
                            <BaseCheckbox checkValue={haveCollar} setValue={handleHaveCollarChange} label='have collar' />
                            <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5">Have</p>
                            <br />
                            <BaseCheckbox checkValue={notHaveCollar} setValue={handleNotHaveCollarChange} label='not have collar' />
                            <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5" >Not have</p>
                        </div>
                    </div>
                    <div className="2xl:col-span-3">
                        <div className="2xl:flex flex-wrap">
                            <p className="text-xl font-normal text-white bg-mainGreen cursor-pointer 2xl:py-1 2xl:px-6 2xl:ml-auto">latest</p>
                        </div>
                        <div className="2xl:grid 2xl:grid-cols-3 2xl:gap-4 2xl:ml-9 2xl:mt-8">
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                        </div>
                    </div>
                    <div className="2xl:col-span-4 2xl:mt-16 2xl:mb-8">
                        <div className="2xl:flex flex-wrap">
                            <div className="2xl:ml-auto">
                                <Pagination count={10} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="2xl:h-48 bg-mainGreen">
            </footer>
        </div >
    )
}
