const express = require('express');
const user = require('../user.model');
const paciente = require('../paciente.model');
const expediente = require('../expediente.model');
const consulta = require('../consulta.model');
const connection = require("../conexion")
const { body, param, validationResult } = require('express-validator');
const transporter = require('../mail');
var router = express.Router();
var usariosConectados = [];
var Receta = [];
var isPacienteLlamada;
var DoctorCall = "";


//obtener toda una tabla
router.get('/user', [], (req, res) => {
  user.getAll(connection, (data => {
    res.json(data);
  }))
});

router.get('/correo/:mail', [
  param('mail').not().isEmpty().isString(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }

  let correo = req.params.mail;
  res.json({ success: true, correo: correo });
  enviarMail(correo);
});

router.post('/Registro', [
  body('Nombre').not().isEmpty().isString(),
  body('Email').not().isEmpty().isString(),
  body('UsrName').not().isEmpty().isString(),
  body('Pswd').not().isEmpty().isString(),
  body('Role').not().isEmpty().isString(),
  body('Asignados').not().isEmpty().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  user.create(connection, body, (data => {
    res.json(data);
  }))
});

router.get('/Login/:id', [
  param('id').not().isEmpty().isNumeric(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let id = req.params.id;
  user.getId(connection, id, (data => {
    res.json(data);
  }))
});

// Borrar un  usario mediante el id
router.post('/borrar', [
  body('UsrID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  user.delete(connection, body, (data => {
    res.json(data);
  }))
});


//Actualizar un usario
router.put('/user', [
  body('Nombre').not().isEmpty().isString(),
  body('Email').not().isEmpty().isString(),
  body('UsrName').not().isEmpty().isString(),
  body('Pswd').not().isEmpty().isString(),
  body('Role').not().isEmpty().isString(),
  body('Asignados').not().isEmpty().isString(),
  body('UsrID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  user.update(connection, body, (data => {
    res.json(data);
  }))
});

router.post('/conectados', [
  body('Nombre').not().isEmpty().isString(),
  body('Estado').not().isEmpty().isString()
], (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  res.json({success:false,err:JSON.stringify(errors)})
  return
  }
  var usuario = new Object();
  usuario.Nombre= req.body.Nombre;
  usuario.Estado= req.body.Estado;
  console.log(usuario);
  if(verificar(usuario)){
    usariosConectados.push(usuario);
    res.json({succes:true, conectados: usariosConectados});
  }else{
    res.json({succes:false, mensaje:"ese vato ya esta concectado"});
  }
  
  
});


router.post('/desconectar',[
  body('Nombre').not().isEmpty().isString(),
  body('Estado').not().isEmpty().isString()
 ], (req, res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  res.json({success:false,err:JSON.stringify(errors)})
  return
  }
  var usuario = new Object();
  usuario.Nombre= req.body.Nombre;
  usuario.Estado= req.body.Estado;

  var index = -1;

  for(let i=0; i<usariosConectados.length; i++){
    if(usariosConectados[i].Nombre==usuario.Nombre){
      index=i;
    }
  }

  console.log("index of: " + index);
   if (index !== -1) {
      usariosConectados.splice(index,1);
   }else{
    res.json({succes:false, mensaje: "No existe ese usario"});
    return
   }
  res.json({succes:true,conectados: usariosConectados});
});

router.get('/conectados', [], (req,res)=>{
  res.json({succes:true, conectados: usariosConectados});
});

router.get('/cambiarEstado/:Nombre', [ 
param('Nombre').not().isEmpty().isString()
], (req, res)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  res.json({success:false,err:JSON.stringify(errors)})
  return
  }

  nombre=req.params.Nombre;
  console.log(nombre);
  
  let band= true;
  usariosConectados.forEach((user) => {
    if(user.Nombre==nombre){
      band=false;
      if(user.Estado == "Desocupado"){
        user.Estado = "Ocupado";
      }else{
        user.Estado = "Desocupado";
      }
    }

    
  });

  if(band){
    res.json({succes:false, mensaje:"no hay nadie conectado con ese nombre"});
    return
  }
  res.json({succes: true, conectados: usariosConectados});
});
 function verificar(user){
    for(let i=0; i<usariosConectados.length; i++){
      if(usariosConectados[i].Nombre==user.Nombre){
        return false;
      }
    }
    return true;
  }

function enviarMail(correo) {
  console.log("entro la wea");
  console.log(correo);
  direccion = "http://localhost:4200/welcome";
  console.log(direccion);

  var mailOptions = {
    from: 'medicaApp69@gmail.com',
    to: correo,
    subject: 'Verificacion de doctor',
    text: 'Da click al link para verificarte como medico',
    html: '<a href = "' + direccion + '">Verificacion de correo<a>'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

router.get('/paciente', [], (req, res) => {
  paciente.ObtenerTodo(connection, (data) => {
    res.json(data);
  })
});

router.get('/paciente/:id', [
  param('id').not().isEmpty().isNumeric()
], (req, res) => {
  console.log("entre");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }

  let id = req.params.id;
  console.log(id);
  paciente.porID(connection, id, (data) => {
    res.json(data);
  })

});


router.post('/RegistroPac', [
  body('Nombre').not().isEmpty().isString(),
  body('Estado').not().isEmpty().isString(),
  body('Localidad').not().isEmpty().isString(),
  body('Edad').not().isEmpty().isNumeric(),
  body('Genero').not().isEmpty().isString(),
  body('Telefono').not().isEmpty().isString(),
  body('ExpID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors), mensaje: 'Error en las validaciones' })
    return
  }
  let body = req.body;
  paciente.crear(connection, body, (data => {
    res.json(data)
  }))
});



router.post('/borrarPaciente', [
  body('PacID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  paciente.borrar(connection, body, (data) => {
    res.json(data);
  })
});


router.put('/paciente', [
  body('Nombre').not().isEmpty().isString(),
  body('Estado').not().isEmpty().isString(),
  body('Localidad').not().isEmpty().isString(),
  body('Edad').not().isEmpty().isNumeric(),
  body('Genero').not().isEmpty().isString(),
  body('Telefono').not().isEmpty().isString(),
  body('ExpID').not().isEmpty().isNumeric(),
  body('PacID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  paciente.actualizar(connection, body, (data) => {
    res.json(data);
  })
});

// Rutas de EXpedientes

router.get('/expediente', [], (req, res) => {
  expediente.all(connection, (data) => {
    res.json(data);
  })
});

router.post('/RegistroExp', [
  body('Fecha').not().isEmpty().isString(),
  body('Peso').not().isEmpty().isNumeric(),
  body('Altura').not().isEmpty().isString(),
  body('Talla').not().isEmpty().isNumeric(),
  body('PresionArt').not().isEmpty().isString(),
  body('PulsoCardiaco').not().isEmpty().isNumeric(),
  body('MotivoConsulta').not().isEmpty().isString(),
  body('HistorialMedico').not().isEmpty().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  expediente.insertar(connection, body, (data) => {
    res.json(data);
  })
});

router.get('/expediente/:id', [
  param('id').not().isEmpty().isNumeric()
], (req, res) => {
  console.log("entre");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }

  let id = req.params.id;
  console.log(id);
  expediente.id(connection, id, (data) => {
    res.json(data);
  })
});

router.post('/borrarExpediente', [
  body('PacID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  expediente.eliminar(connection, body, (data) => {
    res.json(data);
  })
});

router.put('/expediente', [
  body('Fecha').not().isEmpty().isString(),
  body('Peso').not().isEmpty().isNumeric(),
  body('Altura').not().isEmpty().isFloat(),
  body('Talla').not().isEmpty().isNumeric(),
  body('PresionArt').not().isEmpty().isString(),
  body('PulsoCardiaco').not().isEmpty().isNumeric(),
  body('MotivoConsulta').not().isEmpty().isString(),
  body('HistorialMedico').not().isEmpty().isString(),
  body('PacID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  expediente.InstertarAct(connection, body, (data) => {
    res.json(data);
  })
});


//Rutas de consulta
router.post('/RegistroCons', [
  body('Fecha').not().isEmpty().isString(),
  body('UsrID').not().isEmpty().isNumeric(),
  body('PacID').not().isEmpty().isNumeric(),
  body('NotasMedicas').not().isEmpty().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  consulta.insert(connection, body, (data) => {
    res.json(data);
  })

});

router.get('/consulta', [], (req, res) => {
  consulta.Tocho(connection, (data) => {
    res.json(data);
  })
});

router.get('/consulta/:id', [
  param('id').not().isEmpty().isNumeric()
], (req, res) => {
  console.log("entre");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }

  let id = req.params.id;
  console.log(id);
  consulta.porid(connection, id, (data) => {
    res.json(data);
  })
});

router.post('/borrarConsulta', [
  body('ConID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  consulta.ayos(connection, body, (data) => {
    res.json(data);
  })
});


router.put('/consulta', [
  body('Fecha').not().isEmpty().isString(),
  body('UsrID').not().isEmpty().isNumeric(),
  body('PacID').not().isEmpty().isNumeric(),
  body('NotasMedicas').not().isEmpty().isString(),
  body('ConID').not().isEmpty().isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let body = req.body;
  consulta.again(connection, body, (data) => {
    res.json(data);
  })
});

router.get('/receta',[],(req,res)=>{
  res.json({succes:true, array: Receta});
});

router.post('/receta', [
  body('Doctor').not().isEmpty().isString(),
  body('Paciente').not().isEmpty().isString(),
  body('Fecha').not().isEmpty().isString(),
  body('Razon').not().isEmpty().isString(),
  body('Diagnostico').not().isEmpty().isString(),
  body('Tratamiento').not().isEmpty().isString(),
  body('Farmacos').not().isEmpty().isString()
], (req, res)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  res.json({success:false,err:JSON.stringify(errors)})
  return
  }

  var receta = new Object();
  receta.Doctor= req.body.Doctor;
  receta.Paciente= req.body.Paciente;
  receta.Fecha= req.body.Fecha;
  receta.Razon= req.body.Razon;
  receta.Diagnostico= req.body.Diagnostico;
  receta.Tratamiento= req.body.Tratamiento;
  receta.Farmacos = req.body.Farmacos

  Receta.push(receta);
  res.json({succes:true, array:Receta})
});

router.get('/callPaciente/:id', [
    param('id').not().isEmpty().isNumeric()
  ], (req, res) => {
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
      res.json({success:false,err:JSON.stringify(errors)})
      return
     }
     let id = req.params.id;
     isPacienteLlamada = id;
     res.json({success: true, mesaje: 'El paciente esta wardao'})
  });

  router.get('/callPaciente', [], (req, res) => {
    res.json({succes: true, pacienteID: isPacienteLlamada})
  });

  router.get('/obtenerDoctor', [], (req, res)=>{
  res.json({succes: true, Doctor: DoctorCall})
});

router.get('/ConectarDoctor/:name', [
  param('name').not().isEmpty().isString()
], (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ success: false, err: JSON.stringify(errors) })
    return
  }
  let nombre = req.params.name;
   DoctorCall = nombre;
  res.json({succes: true, mensaje:"Todo chilo papu"})
});

router.get('/EliminarDoc', [], (req,res)=>{
  DoctorCall="";
  res.json({succes:true, mensaje:"Se eliminao el doc Conectado"});
});

module.exports = router;