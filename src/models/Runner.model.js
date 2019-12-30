const Allure = require('../modules/Allure.module'),
	  MariaDB = require('../modules/MariaDB.module'),
	  Scenario = require('./Scenario.model')

module.exports = class Runner {
	constructor (name, location, db) {
		this.name = name
		this.depend = {}
		this.lib = require(location)
		this.init = this.prepare(db === undefined ? null : db)
	}

	async prepare (db) {
		return new Promise (async resolve => {
			let i = new MariaDB(db)
			let tmp = { allure : new Allure(this.name, '.'),
				db : db == null ? null : await i.init()
			}; resolve(tmp)
		})
	}

	async run (cfg, lst) {
		return new Promise (async resolve => {			
			let tmp = new Scenario(cfg)
			this.init.allure = await tmp.run(await this.init, this.lib, cfg, this)
			if (lst === "LAST")
				this.init.allure.write()
			resolve(true)
		})
	}
}