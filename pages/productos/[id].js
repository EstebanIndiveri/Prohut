import React,{useEffect,useContext,useState, Fragment} from 'react';
import {useRouter} from 'next/router';
import {FirebaseContext} from '../../firebase';
import Layout from '../../components/layout/Layout'
import Error404 from '../../components/layout/404';
import {css} from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es}from 'date-fns/locale';
import{Campo,InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto=styled.div`
    padding:5rem;
   @media(min-width:768px){
    display:grid;
    grid-template-columns:2fr 1fr;
    column-gap:2rem;
   }
`;

const CreadorProducto=styled.p`
    padding:.5rem 2rem;
    background-color:#DA552F;
    color:#fff;
    text-transform:uppercase;
    font-weight:bold;
    display:inline-block;
    text-align:center;
`;
const Imagen=styled.img`
    max-height:40rem;
`;

const Producto = () => {
    //state del compt:
    const [producto,guardarProducto]=useState({});
    const [error,guardarError]=useState(false);
    const [comentario,guardarComentario]=useState({});
    const[consultarDB,guardarConsultarDB]=useState(true);
    //routing de next para el id
    const router=useRouter();
    const {query:{id}}=router;
    //context de firebse:
    const {firebase,usuario}=useContext(FirebaseContext);
    useEffect(()=>{
        if(id &&consultarDB){
            const obtenerProducto=async()=>{
                const productoQuery=await firebase.db.collection("productos").doc(id);
                const producto=await productoQuery.get();
                if(producto.exists){
                    guardarProducto(producto.data());
                    guardarConsultarDB(false);
                }else{
                    guardarError(true);
                    guardarConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    },[id])

    if(Object.keys(producto).length===0 &&!error)return 'Cargando..'
    const{comentarios,creado,descripcion,empresa,nombre,url,urlimagen,votos,creador,haVotado}=producto;
    
    //admin voteS:
    const votarProducto=async ()=>{
        if(!usuario){
            return router.push('/login');
        }
        //tengo y sumo votes
        const nuevoTotal=votos+1;
        //varifico si el user voto=
        if(haVotado.includes(usuario.uid)){
            return
        }
        //guardar id del usuario que voto
        const hanVotado=[...haVotado,usuario.uid]
        //actualizar votos en la db:
        await firebase.db.collection("productos").doc(id).update({votos:nuevoTotal,haVotado:hanVotado})
        
        //act state
        guardarProducto({
            ...producto,
            votos:nuevoTotal
        })
        guardarConsultarDB(true); // hay un voto por eso consulta
    }

    //creo los coments
    const comentarioChange=e=>{
        guardarComentario({
            ...comentario,
            [e.target.name]:e.target.value
        })
    }
    const agregarComentario= async e=>{
        e.preventDefault();
        if(!usuario){
            return router.push('/login');
        }

        //información extra del comment
        comentario.usuarioId=usuario.uid;
        comentario.usuarioNombre=usuario.displayName;

        //copia comment y agregar al arreglo
        const nuevosComentarios=[...comentarios,comentario];
        //actualizar DB:
        await firebase.db.collection("productos").doc(id).update({
            comentarios:nuevosComentarios
        })
        //actualizar el state
        guardarProducto({
            ...producto,
            comentarios:nuevosComentarios
        });
        guardarConsultarDB(true); //consulto porque se agrego una consulta de nuevo xddd
    }
    //identifica el comment del creater:
    const esCreador=id=>{
        if(creador.id==id){
            return true;
        }
    }
    const puedeBorrar=()=>{
        if(!usuario) return false;
        if(creador.id===usuario.uid){
            return true;
        }
    }
    //elimina de db:
    const eliminarProducto=async()=>{
        if(!usuario){
            return router.push('/login');
        }
        if(creador.id!==usuario.uid){
            return router.push('/');
        }
        try {
            await firebase.db.collection("productos").doc(id).delete();
            router.push('/');
        } catch (error) {
            console.error(error);
        }
    }

    return ( 
        <Layout>
            <Fragment>
                {error ? (<Error404/>):(

                        <div className="contenedor">
                        <h1 css={css`
                            text-align:center;
                            margin-top:5rem;
                        `}>{nombre}</h1>
                    

                    <ContenedorProducto>
                        <div>
                        <p>Publicado hace: {formatDistanceToNow(new Date(creado),{locale:es})}</p>
                        <p>Por: {creador.nombre} de {empresa} </p>
                        <Imagen src={urlimagen}/>

                        <p>{descripcion}</p>

                        {/*comentario*/}
                        
                        {usuario && (
                            <Fragment>
                            <h2>Agrega tu comentario</h2>
                            <form
                            onSubmit={agregarComentario}
                            >
                                <Campo>
                                    <input
                                    type="text"
                                    name="mensaje"
                                onChange={comentarioChange}
                                    />
                                </Campo>
                                <InputSubmit
                                type="submit"
                                value="Agregar Comentario"
                                />
                            </form>
                            </Fragment>
                        )}

                        <h2 css={css`
                            margin:2rem 0;
                        `
                        }                        
                        >Comentarios</h2>
                        {comentarios.length===0?
                        (<p>Aún no hay comentarios, agrega uno"</p>)
                        :(
                            <ul>
                            {comentarios.map((comentario,i)=>(
                                <li
                                key={`${comentario.usuarioId}-${i}`}
                                css={css`
                                border:1px solid #e1e1e1;
                                padding:2rem;
                                `}
                                >
                                    <p>{comentario.mensaje}</p>
                                    <p>Escrito por: 
                                        <span
                                        css={css`
                                            font-weight:bold;
                                        `}
                                        >
                                           {''} {comentario.usuarioNombre}
                                        </span>
                                    </p>
                                    {esCreador(comentario.usuarioId)&&<CreadorProducto>Es Creador</CreadorProducto>}
                                </li>
                            ))}
                            </ul>
                        )} 
                            
                        </div>
                        <aside>
                         <Boton
                         target="_blank"
                         bgColor="true"
                         href={url}
                         >Visitar sitio web</Boton>
                        <div
                        css={css`
                            margin-top:5rem;
                        `}
                        >
                         <p css={css`text-align:center;`}>{votos} Votos</p>
                         </div>
                        {usuario && (
                         <Boton
                         onClick={votarProducto}
                         >Votar</Boton>
                        )}
                        </aside>
                    </ContenedorProducto>
                    {puedeBorrar() && 
                    <Boton
                        onClick={eliminarProducto}
                    >Eliminar Producto</Boton>
                    }
                    </div>

                )}
                    
            </Fragment> 
        </Layout>
     );
}
 
export default Producto;