const LIB = {
	Portail : async (arr, tr, inc) => {
		return new Promise((resolve, reject) => {
			//console.log(arr, tr, inc)
			resolve(tr.end())
		})
	},
	Connexion : async (arr, tr, inc) => {
		return new Promise((resolve, reject) => {
			//console.log(arr, tr, inc)
			//reject(new Error("Unable to connect"))
			resolve(tr.end())
		})
	},
	PageFournisseur : async (arr, tr, inc, scope) => {
		return new Promise((resolve, reject) => {
			scope.sto.count = typeof scope.sto.count === "number" ? scope.sto.count+1 : 0
			new Promise((res, rej) => {
				if (scope.sto.count === 2) res(true); else rej(new Error("failure"))
			}).then(() => resolve(tr.end())).catch(e => tr.fail(arr, tr, inc, scope, e, resolve, reject, LIB.PageFournisseur))
		})
	}
}

module.exports = LIB