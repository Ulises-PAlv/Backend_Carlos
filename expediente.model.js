module.exports ={
    all: (connection, callback) => {
        connection.query('select * from Expedientes', (err,results)=> {
            if(err){
                callback({array: null, id: null, succes: false, err: JSON.stringify(err)});
                return;
            }
            callback({array: results, id: null, succes:true});
        });
    },

    insertar: (connection, body, callback) => {
        connection.query('insert into Expedientes SET ?', body, (err, results) => {
            if (err) {
            callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
            return;
            }
            callback({ array: null, id: null, success: true });
        });
    },

    id: (connection, id, callback) => {
        connection.query('select * from Expedientes where ExpID = ' + id, (err, results) => {
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

    eliminar: (connection,body,callback) => {
        connection.query('delete from Expedientes where PacID = '+body.PacID, (err, results) => {
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

    InstertarAct: (connection,body,callback) => {
        connection.query('update Expedientes set Fecha = ?, Peso = ?, Altura = ?, PresionArt = ?, PulsoCardiaco = ?, MotivoConsulta = ?, HistorialMedico = ? WHERE PacID= ?', 
        [body.Fecha,body.Altura,body.Talla,body.PresionArt,body.PulsoCardiaco, body.MotivoConsulta, body.HistorialMedico, body.PacID], (err, results) => {
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