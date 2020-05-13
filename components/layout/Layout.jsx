import React,{Fragment, useContext} from 'react';
import Link from 'next/link';
import Header from './Header';
import {Global,css} from '@emotion/core';
import Head from 'next/head';


const Layout = props => {

    return ( 
        <Fragment>
            <Global
                styles={css`
                    :root{
                        --gris:#3d3d3d;
                        --gris2:#6F6F6F;
                        --gris3:#e1e1e1;
                        --naranja:#DA552F;
                    }
                    html{
                        font-size:62.5%;
                        box-sizing:border-box;
                    }
                    *,*:before,*:after{
                        box-sizing:inherit;
                    }
                    body{
                        font-size:1.6rem;/*16 pix*/
                        line-height:1.5; 
                        font-family:'Montserrat',serif;
                    }
                    h1,h2,h3{
                        margin:0 0 2rem 0;
                        line-height:1.5;
                    }
                    h1,h2{
                        font-family:'Montserrat',serif;
                        font-weight:600;
                    }
                    h3{
                        font-family:'Source Sans Pro', sans-serif;
                    }
                    ul{
                        list-style:none;
                        margin:0;
                        padding:0
                    }
                    a{
                        text-decoration:none;
                    }
                    img{
                        max-width:100%;
                        max-height:100%;
                    }
                `}
            />
            <Head>
                   
                    <title>NowHunt</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossOrigin="anonymous" />
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;1,900&family=Source+Sans+Pro:wght@400;700&display=swap" rel="stylesheet"/>
                    <link rel="stylesheet" href="/static/css/app.css"/>

            </Head>

            <Header/>
                <main>
                    {props.children}
                </main>
        </Fragment>
     );
}
 
export default Layout;