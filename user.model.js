module.exports = {
 
    create: (connection, body, callback) => {
    connection.query('insert into Users SET ?', body, (err, results) => {
    if (err) {
    callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
    return;
    }
    callback({ array: null, id: null, success: true });
    });
    },
    
    
    getAll: (connection, callback) => {
       connection.query('select * from Users', (err, results) => {
       if (err) {
        callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
         return;
        }
        callback({ array: results, id: null, success: true });
        })
    },

    getId: (connection, id, callback) => {
        connection.query('select * from Users where UsrID = ' + id, (err, results) => {
        if (err) {
        callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
        return;
        }

        console.log("-->", results);
        if(results.length == 0){
            callback({array: null, id: null, message: "el id no existe"});
            return;
        }

        callback({ array: null, id: results[0] || null, success: true });
        })
    },

    delete: (connection,body,callback) => {
        connection.query('delete from Users where UsrID = '+body.UsrID, (err, results) => {
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

    update: (connection,body,callback) => {
        connection.query('update Users set Nombre = ?, Email = ?, UsrName = ?, Pswd = ?, Role = ?, Asignados = ? WHERE UsrID= ?', 
        [body.Nombre,body.Email,body.UsrName,body.Pswd,body.Role, body.Asignados, body.UsrID], (err, results) => {
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