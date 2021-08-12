import Head from 'next/head'
import BaseButton from '@components/BaseButton'
import IMAGES from '@constants/IMAGES'
import ICON from '@constants/ICON'
import Image from 'next/dist/client/image'
import HomeStyle from '@styles/Home.module.css'
import { Typography } from '@material-ui/core'

export default function Home() {
    return (
        <div className={" mx-auto " + HomeStyle.bgImg}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 pt-3">
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
                <section className="down-botton 2xl:flex 2xl:flex-wrap 2xl:justify-end 2xl:mt-40">    
                    <div className="2xl:mr-28"> 
                        <Image src={IMAGES.bgDownBt} alt="bgDownBt" width="89" height="89"/>      
                    </div>
               </section>
               <section className="why-catUs-container 2xl:mt-96 2xl:mr-60 2xl:ml-52"> 
                    <p className="2xl:text-white 2xl:text-4xl 2xl:font-black 2xl:text-center 2xl:mt-32">ทำไมต้องใช้ CatUs</p>  
                    <section className="2xl:flex 2xl:flex-wrap 2xl:justify-center 2xl:mt-32 ">
                        <div className="2xl:shadow-lg 2xl:rounded-3xl" style={{backgroundColor:'#FFFFFF',width:"673px",height:"534px"}}>
                        </div>
                        <div className="2xl:ml-16">
                            <p className="2xl:text-white 2xl:text-4xl 2xl:font-black ">What is Lorem Ipsum</p>
                            <p className="2xl:text-white 2xl:text-4xl font-extralight">Lorem Ipsum is simply dummy <br />text of the printing and  <br />typesetting industry. </p>
                        </div>
                    </section>
                    <section className="2xl:flex 2xl:flex-wrap 2xl:mt-48 2xl:justify-center">      
                        <div className="2xl:mr-16">
                            <p className="2xl:text-white 2xl:text-4xl 2xl:font-black">What is Lorem Ipsum</p>
                            <p className="2xl:text-white 2xl:text-4xl font-extralight">Lorem Ipsum is simply dummy <br />text of the printing and  <br />typesetting industry. </p>
                        </div>
                        <div className="2xl:shadow-lg 2xl:rounded-3xl" style={{backgroundColor:'#FFFFFF',width:"673px",height:"534px"}}>
                        </div>
                    </section>
                    <section className="howToUse 2xl:text-center" style={{marginTop:"35rem"}}>
                        <p className="2xl:text-4xl 2xl:font-medium" >1. Typesetting industrys Lorem Ipsum has been the industry's </p>
                        <section className="2xl:flex 2xl:flex-wrap 2xl:mt-32 2xl:justify-center ">
                            <Image src={IMAGES.group} alt="Group" width="70.9" height="338.9" />
                            <div className="2xl:shadow-lg 2xl:rounded-3xl 2xl:ml-40"  style={{backgroundColor:'#368665',width:"829px",height:"586"}} />
                        </section>
                    </section>
               </section>  
            </main>  
            <footer className="2xl:mt-28">
            <div style={{backgroundColor:'#F4C444',width:"1920px",height:"331px"}}>

            </div>
            </footer>
        </div>
    )
}
