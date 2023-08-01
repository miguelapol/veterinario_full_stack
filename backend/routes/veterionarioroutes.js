import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import {registrar,perfil,confirmar,autentificar,olvidePassword,comprobarToken,nuevoPassword,actualizarPerfil,actualizarPassword} from "../controllers/veterinarioController.js"
const router=express.Router();

//area publica
router.post('/',registrar)
router.get('/confirmar/:token',confirmar)
router.post('/login',autentificar)
router.post('/olvide-password',olvidePassword)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

//area private
router.get('/perfil',checkAuth, perfil)
router.put('/perfil/:id',checkAuth,actualizarPerfil)
router.put('/actualizar-password',checkAuth,actualizarPassword)

export default router;