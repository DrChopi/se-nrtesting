const LIB = {
	Portail : async (arr, tr, inc) => {
		return new Promise((resolve, reject) => {
			console.log(arr, tr, inc)
			resolve("passed")
		})
	},
	Connexion : async (arr, tr, inc) => {
		return new Promise((resolve, reject) => {
			console.log(arr, tr, inc)
			reject(new Error("Unable to connect"))
		})
	},
	PageFournisseur : async (arr, tr, inc) => {
		return new Promise((resolve, reject) => {
			console.log(arr, tr, inc)
			resolve("passed")
		})
	}
}

module.exports = LIB