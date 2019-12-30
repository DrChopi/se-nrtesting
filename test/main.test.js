const Runner = new (require('../src/index').Runner)("PIM_C01_CAS_PASSANT", __dirname + "/lib.test")

const SC01 = {
    name : "TEST01",
    desc : "",
    agent : "chrome",
    prefix : "SC01_",
    THINK_TIME : 5000,
    content : [
      [
        "Fournisseur"
      ],
      [
        "Portail", 2, "https://rec-produits.groupe-pomona.fr/nuxeo/", "Groupe Pomona",
        "Connexion", 2, "ha-file7", "Pomona@Test",
        "PageFournisseur", 0
      ]
    ]
},
SC02 = {
    name : "TEST02",
    desc : "",
    agent : "chrome",
    prefix : "SC02_",
    THINK_TIME : 5000,
    content : [
      [
        "Fournisseur"
      ],
      [
        "Portail", 2, "https://rec-produits.groupe-pomona.fr/nuxeo/", "Groupe Pomona",
        "Connexion", 2, "ha-file7", "Pomona@Test"
      ]
    ]
},
SC03 = {
    name : "TEST03",
    desc : "",
    agent : "chrome",
    prefix : "SC03_",
    THINK_TIME : 5000,
    content : [
      [
        "Fournisseur"
      ],
      [
        "Portail", 2, "https://rec-produits.groupe-pomona.fr/nuxeo/", "Groupe Pomona",
        "Connexion", 2, "ha-file7", "Pomona@Test"
      ]
    ]
}

async function f() {

	await Runner.run(SC01)
	await Runner.run(SC02)
	await Runner.run(SC03, "LAST")

}; f()