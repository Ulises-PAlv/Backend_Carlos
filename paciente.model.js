module.exports = {
    
    ObtenerTodo: (connection, callback) => {
        connection.query('select * from Pacientes', (err,results)=> {
            if(err){
                callback({array: null, id: null, succes: false, err: JSON.stringify(err)});
                return;
            }
            callback({array: results, id: null, succes:true});
        });
    },

    porID: (connection, id, callback) => {
        connection.query('select * from Pacientes where PacID = ' + id, (err, results) => {
            if(err){
                callback({array: null, id: null, succes: false, err: JSON.stringify(err)});
                return;
            }

            console.log("-->", results);
            if(results.length == 0){
              callback({array: null, id: null, message: "el id no existe"});
               return;
            }

            callback({array: results[0], id:null, succes:true});
        });
    },

    crear: (connection, body, callback) => {
        connection.query('insert into Pacientes SET ?', body, (err, results) => {
            if (err) {
            callback({ array: null, id: null, success: false, err: JSON.stringify(err), mensaje: 'Error en sql' });
            return;
            }
            callback({ array: null, id: null, success: true });
        });
    },

    borrar:  (connection,body,callback) => {
        connection.query('delete from Pacientes where PacID = '+body.PacID, (err, results) => {
        if (err) {
            callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
           return;
        }

        console.log("-->", results);
        if(results.affectedRows == 0){
            callback({array: null, id: null, message: "el id no existe"});
            return;
        }

        callback({ array: null, id: null, success: true });
        })
    },

    actualizar: (connection,body,callback) => {
        connection.query('update Pacientes set Nombre = ?, Estado = ?, Localidad = ?, Edad = ?, Genero = ?, Telefono = ?, ExpID = ? WHERE PacID= ?', 
        [body.Nombre,body.Estado,body.Localidad,body.Edad,body.Genero, body.Telefono, body.ExpID, body.PacID], (err, results) => {
        if (err) {
            callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
            return;
        }
        console.log("-->", results);
        if(results.affectedRows == 0){
            callback({array: null, id: null, message: "el id no existe"});
            return;
        }
        
        callback({ array: null, id: null, success: true });
        });
    }
}