module.exports = class Transaction {
	constructor (max_tries, wd) {
		this.max_tries = max_tries
		this.status = "passed"
		this.step = "running"
		this.wd = wd
		this.act = null
	}

	async fail(args, tr, inc, scope, err, res, rej, self) {
		if (inc < 2) resolve(false);

		this.status = "broken"
		for (; inc > 0 && this.step !== "finished"; inc--) await self(arg, tr, 0, scope);

		if (this.step !== "finished")
			rej(err)
		else
			res("broken")
	}

	async end() {
		await this.act
		return this.step === "running" ? "fail" : this.status
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