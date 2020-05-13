import React,{useState,useContext} from 'react';
import styled from '@emotion/styled';
import Layout from '../components/layout/Layout'
import { Fragment } from 'react';
import Router,{useRouter} from 'next/router';
import {css} from'@emotion/core';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import FileUploader from 'react-firebase-file-uploader';
import {FirebaseContext} from '../firebase';
import firebase from '../firebase';
//validation hook
import useValidation from '../Hooks/useValidation';
import validarCrearProducto from '../validation/validarCrearProducto';
import Error404 from '../components/layout/404';


export default function NuevoProducto() {
  //state de las imagenes
  const [nombreimagen,guardarNombre]=useState('');
  const [subiendo,guardarSubiendo]=useState(false);
  const [progreso,guardarProgreso]=useState(0);
  const [urlimagen,guardarUrlImagen]=useState('');

  const [error,guardarError]=useState(false);

  const STATE_INITIAL={
      nombre:'',
      empresa:'',
      //imagen:'',
      url:'',
      descripcion:''
  }
   const {
        valores,
        errores,
        handleSubmit,
        hanbleChange,
        handleBlur
    }=useValidation(STATE_INITIAL,validarCrearProducto,crearProducto)
    //hook del routing
    const router=useRouter();

    //context con las operaciones crud de firebase:
    const {usuario,firebase}=useContext(FirebaseContext);
    // console.log(usuario);
    function crearProducto(){
      //si el user no esta auth llega al log
      if(!usuario){
        return router.push('/login');
      }

      //creamos el objeto del nuevo producto:
      const producto={
        nombre,
        empresa,
        url,
        urlimagen,
        descripcion,
        votos:0,
        comentarios:[],
        creado:Date.now(),
        creador:{
          id:usuario.uid,
          nombre:usuario.displayName
        },
        haVotado:[]
      }
      //insertar en firebase
      firebase.db.collection('productos').add(producto);
      return router.push('/');
    }

    const handleUploadStart = () =>
    {
      guardarProgreso: (0);
      guardarSubiendo: (true);
    };
  const handleProgress = progreso => guardarProgreso ({progreso});
  const handleUploadError = error => {
    guardarSubiendo(error);
    console.error(error);
  };
  const handleUploadSuccess = nombre => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre)
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url=>{
        guardarUrlImagen(url);  
      });
  };


    const{nombre,empresa,imagen,url,descripcion}=valores;

  return (
    <div>
        <Layout>
          {!usuario? <Error404/> : (
            
            <Fragment>
                <h1
                css={css`
                    text-align:center;
                    margin-top:5rem;
                    font-family:'Montserrat',sans-serif;
                `}
                >Nuevo Producto</h1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >

                  <fieldset>
                    <legend>Información General</legend>
                  
                    <Campo>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                        type="text"
                        id="nombre"
                        placeholder="Nombre del producto"
                        name="nombre"
                        value={nombre}
                        onChange={hanbleChange}
                        onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.nombre &&<Error>{errores.nombre}</Error>}
       

                    <Campo>
                        <label htmlFor="nombre">Empresa</label>
                        <input
                        type="text"
                        id="empresa"
                        placeholder="Tu Empresa o compañia"
                        name="empresa"
                        value={empresa}
                        onChange={hanbleChange}
                        onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.empresa &&<Error>{errores.empresa}</Error>}

                     <Campo>
                        <label htmlFor="imagen">Imagen</label>
                        <FileUploader
                        accept="image/*"
                        id="imagen"
                        name="imagen"
                        // value={imagen}
                        // onChange={hanbleChange}
                        // onBlur={handleBlur}
                        randomizeFilename
                        storageRef={firebase.storage.ref("productos")}
                        onUploadStart={handleUploadStart}
                        onUploadError={handleUploadError}
                        onUploadSuccess={handleUploadSuccess}
                        onProgress={handleProgress}
                        />
                    </Campo>
                    {/* {errores.imagen &&<Error>{errores.imagen}</Error> */}

                    <Campo>
                        <label htmlFor="url">Sitio web</label>
                        <input
                        placeholder="Sitio web de tu producto. Ej:http://www.coffe.com"
                        type="url"
                        id="url"
                        name="url"
                        value={url}
                        onChange={hanbleChange}
                        onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.url &&<Error>{errores.url}</Error>}

                    </fieldset>
                    <fieldset>
                      <legend>Sobre tu Producto</legend>

                      <Campo>
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                        placeholder="Agrega una descripción del producto"
                        id="descripcion"
                        name="descripcion"
                        value={descripcion}
                        onChange={hanbleChange}
                        onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.descripcion &&<Error>{errores.descripcion}</Error>}
                    </fieldset>
                    {error && <Error>{error}</Error>}
                    <InputSubmit 
                    type="submit"
                    value="Crear Producto"
                    />
                </Formulario>
          </Fragment>
          )}
            
        </Layout>
    </div>
  )
}
