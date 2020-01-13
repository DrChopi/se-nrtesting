module.exports = class Transaction {
	constructor (max_tries, wd) {
		this.max_tries = max_tries
		this.status = "passed"
		this.wd = wd
		this.act = null
	}

	async fail(args, tr, inc, scope, err, res, rej, self) {
		if (inc < this.max_tries) { res(err); return 0; }
		let tmp = {};

		this.status = "broken"
		for (; inc > 0 && (typeof await tmp) !== "string" ; inc--) {
			tmp = await self(args, tr, inc-1, scope);
			await tmp
		}; (typeof tmp) === "string" ? res(tmp) : rej(tmp)
	}

	async end() {
		await this.act
		console.log(this.status)
		return this.status
	}


	// methode example
	/*async met() {
		await this.act
		this.act = new Promise((resolve, reject) => {
			try {
				:: method
			} catch (e) { reject(new Error(e)); }
		}); return this.act
	}*/
}