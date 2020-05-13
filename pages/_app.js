import App from 'next/app';
import firebase,{FirebaseContext} from '../firebase';
import useAutenticate from '../Hooks/useAutenticate';
const MyApp =props=>{
    const usuario=useAutenticate();
    
    const {Component,pageProps}=props

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario
            }}
        >
            <Component{...pageProps}/>
        </FirebaseContext.Provider>
    )
}

export default MyApp;