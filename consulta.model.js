module.exports = {
    Tocho: (connection, callback) => {
        connection.query('select * from consultas', (err,results)=> {
            if(err){
                callback({array: null, id: null, succes: false, err: JSON.stringify(err)});
                return;
            }
            callback({array: results, id: null, succes:true});
        });
    },

    insert: (connection, body, callback) => {
        connection.query('insert into consultas SET ?', body, (err, results) => {
            if (err) {
            callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
            return;
            }
            callback({ array: null, id: null, success: true });
        });
    },

    porid: (connection, id, callback) => {
        connection.query('select * from consultas where ConID = ' + id, (err, results) => {
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

    ayos: (connection,body,callback) => {
        connection.query('delete from consultas where ConID = '+body.ConID, (err, results) => {
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

    again: (connection,body,callback) => {
        connection.query('update consultas set Fecha = ?, UsrID = ?, PacID = ?, NotasMedicas = ? WHERE ConID= ?', 
        [body.Fecha,body.UsrID, body.PacID, body.NotasMedicas, body.ConID], (err, results) => {
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