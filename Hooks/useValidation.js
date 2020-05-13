import React, { useState,useEffect } from 'react';

//const[state, setState]=useState([])

const useValidation = (stateInicial,validar,fn) => {
    const[valores,guardarValores]=useState(stateInicial);
    const[errores,guardarErrores]=useState({});
    const[submitForm,guardarSubmitForm]=useState(false);
    useEffect(()=>{
        if(submitForm){
            const noErrores=Object.keys(errores).length===0;
            
            if(noErrores){
                fn();//function que se ejecuta en el componente;
            }
            guardarSubmitForm(false);
        }
    },[errores]);

    //function que se ejecuta conforme el usuario escribe algo:
    const hanbleChange=e=>{
        guardarValores({
            ...valores,
            [e.target.name]:e.target.value
        })
    };

    //function ejecutada cuando hay sumbit
    const handleSubmit=e=>{
        e.preventDefault();
        const erroresValidation=validar(valores);
        guardarErrores(erroresValidation);
        guardarSubmitForm(true);
    }
    //cuando se realiza el evento de blur, sale del input
    const handleBlur=()=>{
        const erroresValidation=validar(valores);
        guardarErrores(erroresValidation);
    }
    return {
        valores,
        errores,

        handleSubmit,
        hanbleChange,
        handleBlur
    };
}
 
export default useValidation;