import { useState,useEffect,createContext } from 'react'
import clienteAxios from '../config/axios'


const AuthContext =createContext()

const AuthProvider=({children}) =>{
    const [cargando,setCargando]=useState(true)
    const [auth,setAuth]= useState({})
    // si el usuario esta autenficado
    useEffect(() =>{
        const autentificarUsuario= async() =>{
            const token = localStorage.getItem('token')
            if (!token){
                setCargando(false)
                return
            }
            const config= {
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            try {
                const{data}= await clienteAxios('/veterinarios/perfil',config)

            } catch (error) {
                console.log(error.response.data.msg);
                setAuth({})
            }
            setCargando(false)
        }
        autentificarUsuario()
    },[])
    const cerrarSesion=()=>{
        localStorage.removeItem('token')
        setAuth({})
    }
    const actualizarPerfil=async datos=>{
        const token = localStorage.getItem('token')
            if (!token){
                setCargando(false)
                return
            }
            const config= {
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            try {
              const url=`/veterinarios/perfil/${datos._id}`
              const {data}=await clienteAxios.put(url,datos,config)

              setAuth(data.veterinario)
              return{
                 msg: 'Cambiado correctamente'
              }
            } catch (error) {
                return{
                    msg: error.response.data.msg,
                    error: true
                }
            }
    }
    //va interactuar con el api
    const guardarPassword=async (datos)=>{
        const token = localStorage.getItem('token')
            if (!token){
                setCargando(false)
                return
            }
            const config= {
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
           try {
            const url='veterinarios/actualizar-password'
            const {data}=await clienteAxios.put(url,datos,config)
            console.log(data);

            return{
                msg: data.msg
            }
           } catch (error) {
                return{
                     msg: error.response.data.msg,
                     error: true
                }
           }     
    }
    return(
        <AuthContext.Provider
        value={{
            auth,
            setAuth,
            cargando,
            cerrarSesion,
            actualizarPerfil,
            guardarPassword
        }}
        >
              {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext