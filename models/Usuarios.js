const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const UsuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String
});

//Método para hashear los passwords
UsuariosSchema.pre('save', async function(next){
    //Si el password ya esta hasheado
    if(!this.isModified('password')){
        return next();
    }

    //Si no
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});
//Envia alerta cuando un usuario ya esta registrado
UsuariosSchema.post('save', function(error, doc, next) {
    console.log(error.name);
    if(error.name ===  'MongoServerError' && error.code === 11000) {
        next('Ese correo ya esta registrado');
    } else {
        next(error);
    }
});

//Autenticar Usuarios
UsuariosSchema.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('Usuarios', UsuariosSchema);