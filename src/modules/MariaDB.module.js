const mdb = require('mariadb')

module.exports = class MariaDB {
	constructor () {}

	async init () {
		return new Promise(async (resolve, reject) => {
			try {
				this.pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, connectionLimit: 5})
				let tmp = this.pool.getConnection()
				await tmp; tmp.release()
			} catch (e) { console.error(e) }
		})
	}

	async query(req) {
		return new Promise(async (resolve, reject) => {
			let tmp = this.pool.getConnection()
			await tmp; 
			tmp.query(req)
			   .then(res => {
			   		tmp.release()
			   		resolve(res)
			   })
			   .catch(e => {
			   		tmp.release()
			   		reject(e)
			   })
		})
	}
}