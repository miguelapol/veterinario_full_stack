import express from "express";
import dotenv from 'dotenv'
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterionarioroutes.js'
import pacientesRoutes from "./routes/pacientesRoutes.js";
import cors from 'cors'


const app = express();
app.use(express.json())
//escanea y encuentra el .env
dotenv.config();
conectarDB();
const dominiosPermitidos=[process.env.FRONTEND_URL]
const corsOptions={
    origin: function(origin,callback) {
        if (dominiosPermitidos.indexOf(origin)!==-1) {
            // el origen de request es permitido
            callback(null,true);
        }else{
            callback(new Error('No permitido por cors'))
        }
    }
}
app.use(cors(corsOptions))
app.use("/api/veterinarios",veterinarioRoutes);
app.use("/api/pacientes",pacientesRoutes);



const PORT =process.env.PORT || 4000;
app.listen(4000,()=>{
    console.log('Servidor funcionando puerto 4000');
})

