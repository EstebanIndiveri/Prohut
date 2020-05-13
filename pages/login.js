import React,{useState} from 'react';
import styled from '@emotion/styled';
import Layout from '../components/layout/Layout'
import { Fragment } from 'react';
import Router from 'next/router';
import {css} from'@emotion/core';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import firebase from '../firebase';

//validation hook
import useValidation from '../Hooks/useValidation';
import validarIniciarSesion from '../validation/validarIniciarSesion';

// //const [error,guardarError]=useState(false);

// const STATE_INITIAL={
//     nombre:'',
//     email:'',
//     password:''
// }

export default function Login() {
const [error,guardarError]=useState(false);

const STATE_INITIAL={
  email:'',
  password:''
}

  const {
    valores,
    errores,
    handleSubmit,
    hanbleChange,
    handleBlur
}=useValidation(STATE_INITIAL,validarIniciarSesion,iniciarSesion)

async function iniciarSesion(){
  try {
    const usuario=await firebase.login(email,password);
    // console.log(usuario);
    Router.push('/');
  } catch (error) {
    console.error('Hubo un error al iniciar sesión',error.message);
    guardarError(error.message);
  }
}

const{nombre,email,password}=valores;
  
  return (
    <div>
    <Layout>
        <Fragment>
            <h1
            css={css`
                text-align:center;
                margin-top:5rem;
                font-family:'Montserrat',sans-serif;
            `}
            >Iniciar Sesión</h1>
            <Formulario
                onSubmit={handleSubmit}
                noValidate
            >
              
                <Campo>
                    <label htmlFor="email">Email</label>
                    <input
                    type="email"
                    id="email"
                    placeholder="Tu Email"
                    name="email"
                    value={email}
                    onChange={hanbleChange}
                    onBlur={handleBlur}
                    />
                </Campo>
                {errores.email &&<Error>{errores.email}</Error>}
                
                <Campo>
                    <label htmlFor="password">Contraseña</label>
                    <input
                    type="password"
                    id="password"
                    placeholder="Tu Contraseña"
                    name="password"
                    value={password}
                    onChange={hanbleChange}
                    onBlur={handleBlur}
                    />
                </Campo>
                {errores.password &&<Error>{errores.password}</Error>}

                {error && <Error>{error}</Error>}
                <InputSubmit 
                type="submit"
                value="Iniciar sesión"
                />
            </Formulario>
      </Fragment>
    </Layout>
</div>
)
}
