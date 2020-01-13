const WebDriver = require('selenium-webdriver'),
      Builder = WebDriver.Builder,
      chrome = require('selenium-webdriver/chrome'),
      firefox = require('selenium-webdriver/firefox'),
      edge = require('selenium-webdriver/edge'),
      Transaction = require('./Transaction.model'),
      uuid  =  require ('uuid/v1'),
      crypto = require('crypto')

module.exports = class Scenario {
	constructor (cfg) {
		this.sto = {}
		for (let i in cfg)
			this[i] = cfg[i]
		this.status = "passed"
		this.model = {
			uuid : uuid(),
			name : cfg.name,
			children : [],
			start : Date.now(),
			stop : null
		}
	}

	async driver(name) {
		return new Promise(async resolve => {
			let tmp = new Builder()
                        .forBrowser(name)
                        .build()
            await tmp
            await tmp.manage().deleteAllCookies()
        	await tmp.manage().window().maximize()
        	resolve(tmp)
		})
	}

	async run(dta, lib, cfg, dep) {
		return new Promise(async resolve => {
			//console.log(dta, lib, cfg, dep)
			if(cfg.depend !== undefined && dep.depend[cfg.depend] === "failed")
				this.status = "failed"

			let i = 0,
				k = 0,
				wd = await this.driver(cfg.agent)

			for (i = 0; i < cfg.content[0].length; i++)
				this.sto[cfg.content[0]]

			for (i = 0; i < cfg.content[1].length; i++, k++) {
				let tmp = {
					uuid : uuid(),
					name : cfg.prefix + "T" + (k < 10 ? "0" + k : k) + "_" + cfg.content[1][i],
					status : "passed",
					start : Date.now(),
					historyId : crypto.createHmac('sha256', 'secret').update(cfg.prefix + cfg.content[1][i]).digest('hex'),
					stop : null,
					stage: "finished",
					statusDetails : {
						"known": false,
					    "muted": false,
					    "flaky": false
					},
			        steps: [],
			        attachments: [],
			        labels : [
			        	{
			        		name : "suite",
			        		value : this.model.name
			        	}
			        ]
				},
				name = cfg.content[1][i],
				limit = i + 2 + cfg.content[1][i+1],
				args = []; i += 2;

				for(; i < limit; i++) args.push(cfg.content[1][i].match(/^\$(.+)/) !== null ? this.sto[cfg.content[1][i].match(/^\$(.+)/)[1]] : cfg.content[1][i]);

				console.log(name, args)

				if (this.status !== "failed") {
					tmp.status = lib[name](args, new Transaction(2, wd), 2, this)
					await tmp.status.then(e => { tmp.status = (e !== "passed") ? "broken" : "passed" })
									.catch(async e => { 
										this.status = "failed";
										tmp.status = "failed";
										tmp.statusDetails.message = "" + e
										tmp.statusDetails.trace = "" + e.stack	
										tmp.attachments.push(await new Promise(r => {
											let el = {
												name : tmp.name + "_errorScreen",
												source : uuid() + "-attachment",
												type : "image/png"
											}

											wd.takeScreenshot().then((img, err) => require('fs').writeFile(dta.allure.dir + '/allure-results/' + el.source + '.png', img, 'base64', () => r(el)))
								    	}))
										console.error(e) })
					tmp.stop = Date.now()
					await new Promise(r => setTimeout(() => r(true), cfg.THINK_TIME))
				} else {
					tmp.status = "skipped"
					tmp.stop = Date.now()
				}

				i--
				this.model.children.push(tmp.uuid)
				dta.allure.tra.push(tmp)
			};
			//console.log(dta)
			this.model.stop = Date.now()
			dep.depend[this.model.name] = this.status
			dta.allure.cmp.children.push(this.model.uuid)
			dta.allure.scr.push(this.model)
			await wd.quit()
			resolve(dta.allure)
		})
	}
}