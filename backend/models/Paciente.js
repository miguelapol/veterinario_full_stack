import mongoose from 'mongoose';
const pacientesSchema=mongoose.Schema({
    nombre:{
        type: 'string',
        required: true
    },
    propietario:{
        type: 'string',
        required: true
    },
    email:{
        type: 'string',
        required: true
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas:{
        type: 'string',
        required: true
    },
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Veterinario"
    }
},{
    trimetamps:true
})

const Paciente =mongoose.model('Paciente',pacientesSchema)

export default Paciente