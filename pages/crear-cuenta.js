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
import validarCrearCuenta from '../validation/validarCrearCuenta';

export default function CrearCuenta() {
    const [error,guardarError]=useState(false);

    const STATE_INITIAL={
        nombre:'',
        email:'',
        password:''
    }

    const {
        valores,
        errores,
        handleSubmit,
        hanbleChange,
        handleBlur
    }=useValidation(STATE_INITIAL,validarCrearCuenta,crearCuenta)
    async function crearCuenta(){
        try {
        await firebase.registrar(nombre,email,password);
        Router.push('/');
            
        } catch (error) {
            console.log('Error al crear el usuario',error.message);
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
                >Crear Cuenta</h1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Campo>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                        type="text"
                        id="nombre"
                        placeholder="Tu nombre"
                        name="nombre"
                        value={nombre}
                        onChange={hanbleChange}
                        onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.nombre &&<Error>{errores.nombre}</Error>}
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
                    value="Crear cuenta"
                    />
                </Formulario>
          </Fragment>
        </Layout>
    </div>
  )
}
