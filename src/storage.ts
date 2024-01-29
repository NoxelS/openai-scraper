import { MysqlError, Pool } from 'mysql';


/**
 * @description Executes a query in a transaction
 *
 * @param query Query to execute
 * @param inputs Inputs to query
 * @param callback Callback function
 * @param pool Pool to use
 */
export function query(query: string, inputs: any[], callback: (error: MysqlError, result: any[]) => void, pool: Pool) : void {
    pool.getConnection(function (error, connection) {
        if (error) callback(error, []);
        connection.beginTransaction(function (error) {
            if (error) {
                // Transaction Error (Rollback and release connection)
                connection.rollback(function () {
                    connection.destroy();
                    callback(error, []);
                });
            } else {
                connection.query(query, inputs, function (error, results) {
                    if (error) {
                        // Query Error (Rollback and release connection)
                        connection.rollback(function () {
                            connection.destroy();
                            callback(error, []);
                        });
                    } else {
                        connection.commit(function (error) {
                            if (error) {
                                connection.rollback(function () {
                                    connection.destroy();
                                    callback(error, []);
                                });
                            } else {
                                connection.destroy();
                                callback(error, results);
                            }
                        });
                    }
                });
            }
        });
    });
}