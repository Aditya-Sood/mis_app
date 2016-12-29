/*
*@author rajatbajaj
*/

var mysql = require('mysql');


/*creating a connection pool instead of a single connection
*so that the previous connection can be again used
*making the connection establishment fast
*/

function DbConnection() {
    this.pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: '8800',
        database: 'mis1',
        debug: false    
    });
}


/*
*parameterising the queries for sql injection prevention
*arguments are 1. Sql query (use ? where to use the variable) ,2. list of parameters,3.callback function
*eg query('SELECT * FROM users WHERE id = ?',['2013JE0194'],function(err,result){
*    if(err)
*        callback(err,{});
*    else
*        callback(false,result);
*})
*/

DbConnection.prototype.query = function(queryStr, params = [], callback) {
    this.pool.getConnection(function(err, connection) {
        if (err) {
            try { connection.release(); } catch(ex) {}
            callback(err,{'err_msg':err.message});
            return;
        }
        
        connection.query(queryStr,params, function(err, rows) {
            connection.release();
            callback(err, rows);
        });
    });
};


/*
*for escaping the special characters in the input
*/
DbConnection.prototype.escape = mysql.escape;


module.exports = new DbConnection();