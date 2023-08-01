import Veterinario  from "../models/Veterinario.js"
import generarJWT  from "../helpers/generarJWT.js";
import generarId from "../helpers/generarid.js";
import emailRegistro from "../helpers/emailregistro.js";
import  emailOlvidePassword from "../helpers/emailOlvidePassword.js"
const registrar=async (req, res) => {

const {email,nombre}=req.body;
const existeUsuario=await Veterinario.findOne({email})
if(existeUsuario){
    const error= new Error("Usuario Ya registrado");
    return res.status(400).json({msg:error.message})
}
try {
    //save new user veterinario
    const veterinario=new Veterinario(req.body);
    const veterinarioGuardado=await veterinario.save();
    //Enviar el email
    emailRegistro({
        email,
        nombre,
        token:veterinarioGuardado.token,
    });

    res.json(veterinarioGuardado);
} catch (error) {
    console.log(error.response);
}

}
const perfil=(req, res) => {
    const {veterinario}=req;
    console.log("perfil");
    console.log(veterinario);
    res.json({veterinario});
}
const confirmar=async(req, res) => {
    const {token}=req.params;
    const userConfirm= await Veterinario.findOne({token})
    console.log(userConfirm)
    if(!userConfirm){
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }
    try {
        userConfirm.token=null;
        userConfirm.confirmado=true;
        await userConfirm.save();

        res.json({msg:'Usuario Confirmado correctamente..'})
    } catch (error) {
        console.log(error)
    }

   
}
const autentificar=async(req, res) => {
const {email,password} = req.body;
//comprobar si el user existe
const usuario=await Veterinario.findOne({email})
if(!usuario){
    const error = new Error("El usuario no existe");
    return res.status(404).json({msg: error.message})
}
//comprobar si el usuario esta confirmado
if (!usuario.confirmado) {
    const error = new Error("tu cuenta  no esta confirmada");
    return res.status(403).json({msg: error.message})
}
//autentificar password
if (await usuario.comprobarPassword(password)) {
    //autentificar
    usuario.token=
    res.json({
      _id:usuario._id,
    nombre:usuario.nombre,
    email:usuario.email,
    web:usuario.web,
    telefono:usuario.telefono,
    token:generarJWT(usuario.id)
})
    console.log('password correcto');
}else{
    const error = new Error("El password es incorrecto");
    return res.status(404).json({msg: error.message})
}



};
const olvidePassword=async(req, res) => {
 const {email}= req.body
 const existeVeterinario=await  Veterinario.findOne({email});
 if (!existeVeterinario) {
    const error = new Error("No existe el email");
    return res.status(400).json({msg: error.message})
 }
 try {
    existeVeterinario.token=generarId();
    await existeVeterinario.save();
    //enviar email con instrucciones
    emailOlvidePassword({
        email,
        nombre: existeVeterinario.nombre,
        token: existeVeterinario.token
    })
    res.json({msg:"Hemos enviado un email con las intrucciones"})
 } catch (error) {
    console.log(error)
 }
}
const comprobarToken=async(req, res) => {
    const{token} = req.params
    console.log(token)
    const tokenValido=await Veterinario.findOne({token});
    if(tokenValido){
        res.json({msg:"token valido usuario existe"})
    }else{
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }

}
const nuevoPassword=async(req, res) => {
    const{token} = req.params;
    const{password} = req.body;
    
    const veterinario=await Veterinario.findOne({token})
    if(!veterinario){
        const error= new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }
    try {
        veterinario.token=null;
        veterinario.password=password;
        await veterinario.save();
        return res.json({msg: 'Password Modificado correctamente'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Hubo un error al modificar el password' });
    }
}
const actualizarPerfil=async (req,res)=>{
    const veterinario=await Veterinario.findById(req.params.id)
   
    if(!veterinario){
        const error =new Error("Hubo un error ");
        return res.status(400).json({msg:error.message});
    }
    const {email}=req.body
    if(veterinario.email!==req.body.email){
        const existeEmail= await Veterinario.findOne({email})
        if(existeEmail){
        const error =new Error("email ya existe");
        return res.status(400).json({msg:error.message});
        }
    }
    try {
    
        veterinario.nombre=req.body.nombre
        veterinario.email=req.body.email 
        veterinario.web=req.body.web
        veterinario.telefono=req.body.telefono 
        const veterinarioActualizado=await veterinario.save()
        res.json(veterinarioActualizado)
        

    } catch (error) {
        console.log(error);
    }
}
const actualizarPassword=async (req,res)=>{  
    //leer los datos
    const {id}=req.veterinario;
    const {pwd_actual,pwd_nuevo}=req.body;
    //Comprobar que el veterinario existe
    const veterinario=await Veterinario.findById(id)
    if(!veterinario){
        const error =new Error("Hubo un error ");
        return res.status(400).json({msg:error.message});
    }

    //Comprobar el password actual
    if(await veterinario.comprobarPassword(pwd_actual)){
        //almacenar el nuevo password
        veterinario.password=pwd_nuevo;
        await veterinario.save();
        res.json({msg:"Password actualizado correctamente"})
    }else{
        const error =new Error("El password actual no es correcto");
        return res.status(400).json({msg:error.message});
    }
    //almacenar el nuevo password
}

export{
    registrar,perfil,confirmar,autentificar,olvidePassword,comprobarToken,nuevoPassword,actualizarPerfil,actualizarPassword
}
