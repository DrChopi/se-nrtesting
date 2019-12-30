const fs = require('fs'),
	  uuid  =  require ('uuid/v1')

module.exports = class Allure {
	constructor (name, dir) {
		this.dir = dir
		this.cmp = {
			uuid : uuid(),
			name : name,
			children : [],
			befores : [],
			afters : [],
			links : [],
			start : Date.now(),
			stop : null	
		}; this.scr = []
		this.tra = []

		if (!fs.existsSync(dir + '/allure-results'))
			fs.mkdirSync(dir + '/allure-results')
	}

	async write () {
		this.cmp.stop = Date.now()
		return new Promise (async resolve => {
			console.log(this.scr)

			await new Promise(r => fs.writeFile(this.dir + '/allure-results/' + this.cmp.uuid + '-container.json', JSON.stringify(this.cmp), 'ascii', () => r(true)));
			for (let i = 0; i < this.scr.length; i++)
				await new Promise(r => fs.writeFile(this.dir + '/allure-results/' + this.scr[i].uuid + '-container.json', JSON.stringify(this.scr[i]), 'ascii', () => r(true)));
			for (let i = 0; i < this.tra.length; i++)
				await new Promise(r => fs.writeFile(this.dir + '/allure-results/' + this.tra[i].uuid + '-result.json', JSON.stringify(this.tra[i]), 'ascii', () => r(true)));
			
			setTimeout(() => resolve(true), 2000)
		})
	}
}