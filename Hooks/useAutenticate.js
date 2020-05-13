import React,{useEffect,useState} from 'react';
import firebase from '../firebase';

function useAutenticate(){
    const [usuarioAutenticado,guardarUsuarioAutenticado]=useState(null);
    useEffect(()=>{
        const unsuscribe=firebase.auth.onAuthStateChanged(usuario=>{
            if(unsuscribe){
                guardarUsuarioAutenticado(usuario);
            }else{
                guardarUsuarioAutenticado(null);
            }
        })
        return ()=>unsuscribe();

    },[])
    return usuarioAutenticado;
}

export default useAutenticate;