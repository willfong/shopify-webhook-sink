import mariadb from "mariadb";

const pool = mariadb.createPool({
	host: process.env.MARIADB_HOSTNAME,
	database: process.env.MARIADB_DATABASE,
	user: process.env.MARIADB_USERNAME,
	password: process.env.MARIADB_PASSWORD,
	connectionLimit: process.env.MARIADB_CONNECTIONS,
});

export async function query(query, args) {
	let conn;
	try {
		conn = await pool.getConnection();
		const res = await conn.query(query, args);
		return res;
	} finally {
		if (conn) conn.release();
	}
}

export function disconnect() {
	pool.end();
}
