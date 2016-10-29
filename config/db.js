var mysql = require('mysql');

function DbConnection() {
    this.pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'mis',
        debug: false    
    });
}

DbConnection.prototype.query = function(queryStr, callback) {
    this.pool.getConnection(function(err, connection) {
        if (err) {
            try { connection.release(); } catch(ex) {}
            callback(err, {});
            return;
        }
        
        connection.query(queryStr, function(err, rows) {
            connection.release();
            callback(err, rows);
        });
    });
};

DbConnection.prototype.escape = mysql.escape;

module.exports = new DbConnection();