import Head from 'next/head'
import BaseButton from '@components/BaseButton'
import IMAGES from '@constants/IMAGES'
import ICON from '@constants/ICON'
import Image from 'next/dist/client/image'
export default function Home() {
    return (
        <div className="2xl:container mx-auto">
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 mt-3">
                <h1 className="2xl:text-5xl 2xl:font-black">Catus</h1>
                <div className="account-action">
                    <BaseButton value={'Login'}></BaseButton>
                    <BaseButton style={'color: white'} fill={true} fillColor={'mainGreen'} textColor={'white'} round={true} roundSize={'lg'} value={'Sign Up'} customClass={'2xl:ml-4'}></BaseButton>
                </div>
            </header>
            <main className="2xl:mt-72 2xl:relative">
                <section className="about 2xl:ml-64 2xl:w-4/12">
                    <h1 className="2xl:text-5xl 2xl:font-black">About <span className="text-mainOrange">CatUs</span></h1>
                    <p className="mt-2">Nulla ea enim irure  Non dolore laborum cupidatat incididunt. Nostrud excepteur do aliqua proident mollit dolore consectetur anim consectetur elit eiusmod qui dolore dolore. Laboris fugiat ad irure dolor.</p>
                    <BaseButton style={'color: white'} fill={true} fillColor={'mainGreen'} textColor={'white'} round={true} roundSize={'lg'} value={'Get Started'} customClass={'2xl:mt-4'}></BaseButton>
                </section>
                <section className="cat-img 2xl:absolute 2xl:-top-10 2xl:right-28">
                    <Image src={IMAGES.catModalHomePage} alt='cat' width="878" height="346"/>
                </section>
            </main>
        </div>
    )
}
