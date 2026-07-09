import { describe, it, expect } from "vitest"
import {
  formatPrix,
  calculerReduction,
  slugify,
  genererReference,
  getInitiales,
  calculerDistance,
  getAbonnementLabel,
  getStatutLabel,
  cn,
  getNotificationLabel,
  getTempsRestant,
  formatDate,
  formatTaux,
  tronquerTexte,
  validerEmail,
  validerTelephone,
  genererMotDePasse,
  getRoleLabel,
  getStatusCouleur,
} from "@/lib/utils"

describe("formatPrix", () => {
  it("formate un prix en FCFA", () => {
    expect(formatPrix(15000)).toContain("15")
  })

  it("ajoute le symbole FCFA", () => {
    expect(formatPrix(15000)).toMatch(/FCFA$/)
  })

  it("formate les milliers", () => {
    expect(formatPrix(1000000)).toContain("1")
  })

  it("gère zéro", () => {
    expect(formatPrix(0)).toContain("0")
  })
})

describe("calculerReduction", () => {
  it("calcule le pourcentage de réduction", () => {
    expect(calculerReduction(10000, 7500)).toBe(25)
  })

  it("retourne 0 si prix normal <= 0", () => {
    expect(calculerReduction(0, 100)).toBe(0)
  })

  it("retourne 100 si gratuit", () => {
    expect(calculerReduction(1000, 0)).toBe(100)
  })

  it("retourne 0 si nouveau prix >= prix normal", () => {
    expect(calculerReduction(1000, 1500)).toBe(0)
  })
})

describe("slugify", () => {
  it("convertit un texte en slug", () => {
    expect(slugify("Promotion Congolaise")).toBe("promotion-congolaise")
  })

  it("supprime les accents", () => {
    expect(slugify("Côte d'Ivoire")).toBe("cote-d-ivoire")
  })

  it("gère les caractères spéciaux", () => {
    expect(slugify("Prix: 50% !")).toBe("prix-50")
  })

  it("gère le texte vide", () => {
    expect(slugify("")).toBe("")
  })

  it("convertis en minuscules", () => {
    expect(slugify("PROMOTION")).toBe("promotion")
  })
})

describe("genererReference", () => {
  it("génère une référence au format CS-XXXX-XXXX", () => {
    const ref = genererReference()
    expect(ref).toMatch(/^CS-[A-Z0-9]+-[A-Z0-9]+$/)
  })

  it("génère des références uniques", () => {
    const refs = new Set(Array.from({ length: 100 }, () => genererReference()))
    expect(refs.size).toBe(100)
  })
})

describe("getInitiales", () => {
  it("retourne les 2 premières initiales", () => {
    expect(getInitiales("Jean Dupont")).toBe("JD")
  })

  it("gère un nom seul", () => {
    expect(getInitiales("Jean")).toBe("J")
  })

  it("gère les espaces multiples", () => {
    expect(getInitiales("  Jean   Dupont  ")).toBe("JD")
  })

  it("gère chaîne vide", () => {
    expect(getInitiales("")).toBe("")
  })
})

describe("calculerDistance", () => {
  it("calcule la distance entre deux points (Brazzaville -> Pointe-Noire)", () => {
    const dist = calculerDistance(-4.2634, 15.2429, -4.7761, 11.866)
    expect(dist).toBeGreaterThan(300)
    expect(dist).toBeLessThan(400)
  })

  it("retourne 0 pour le même point", () => {
    expect(calculerDistance(-4.2634, 15.2429, -4.2634, 15.2429)).toBe(0)
  })
})

describe("getAbonnementLabel", () => {
  it("retourne le label français", () => {
    expect(getAbonnementLabel("PREMIUM")).toBe("Premium")
    expect(getAbonnementLabel("STANDARD")).toBe("Standard")
    expect(getAbonnementLabel("GRATUIT")).toBe("Gratuit")
    expect(getAbonnementLabel("ENTREPRISE")).toBe("Entreprise")
  })

  it("retourne la clé par défaut si inconnue", () => {
    expect(getAbonnementLabel("INCONNU")).toBe("INCONNU")
  })
})

describe("getStatutLabel", () => {
  it("retourne le label français du statut", () => {
    expect(getStatutLabel("EN_ATTENTE")).toBe("En attente")
    expect(getStatutLabel("VALIDE")).toBe("Valide")
    expect(getStatutLabel("REFUSE")).toBe("Refusé")
  })

  it("retourne la clé par défaut si inconnue", () => {
    expect(getStatutLabel("INCONNU")).toBe("INCONNU")
  })
})

describe("cn", () => {
  it("fusionne les classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2")
  })

  it("supprime les classes en conflit", () => {
    expect(cn("px-4", "px-6")).toBe("px-6")
  })
})

describe("getNotificationLabel", () => {
  it("retourne le label des différents types", () => {
    expect(getNotificationLabel("WELCOME")).toBe("Bienvenue")
    expect(getNotificationLabel("SHOP_APPROVED")).toBe("Boutique approuvée")
    expect(getNotificationLabel("PAYMENT_RECEIVED")).toBe("Paiement reçu")
  })
})

describe("formatDate", () => {
  it("formate une date ISO", () => {
    const result = formatDate("2024-01-15T10:30:00Z")
    expect(result).toBeTruthy()
  })

  it("formate un objet Date", () => {
    const result = formatDate(new Date("2024-01-15"))
    expect(result).toBeTruthy()
  })
})

describe("formatTaux", () => {
  it("formate un taux avec %", () => {
    expect(formatTaux(0.256)).toContain("26")
    expect(formatTaux(0.256)).toContain("%")
  })

  it("gère les valeurs extrêmes", () => {
    expect(formatTaux(0)).toContain("0")
    expect(formatTaux(1)).toContain("100")
  })
})

describe("tronquerTexte", () => {
  it("tronque un texte long", () => {
    expect(tronquerTexte("Un texte très long pour le test", 10)).toBe("Un texte t...")
  })

  it("ne tronque pas un texte court", () => {
    expect(tronquerTexte("Court", 10)).toBe("Court")
  })
})

describe("validerEmail", () => {
  it("valide un email correct", () => {
    expect(validerEmail("test@example.com")).toBe(true)
    expect(validerEmail("user@congo.cg")).toBe(true)
  })

  it("rejette un email invalide", () => {
    expect(validerEmail("invalide")).toBe(false)
    expect(validerEmail("")).toBe(false)
  })
})

describe("validerTelephone", () => {
  it("valide un numéro congolais", () => {
    expect(validerTelephone("+242061234567")).toBe(true)
    expect(validerTelephone("061234567")).toBe(true)
  })

  it("rejette un numéro invalide", () => {
    expect(validerTelephone("123")).toBe(false)
    expect(validerTelephone("")).toBe(false)
  })
})

describe("genererMotDePasse", () => {
  it("génère un mot de passe de la longueur demandée", () => {
    const mdp = genererMotDePasse(16)
    expect(mdp.length).toBe(16)
  })

  it("contient différents types de caractères", () => {
    const mdp = genererMotDePasse(20)
    expect(mdp).toMatch(/[a-z]/)
    expect(mdp).toMatch(/[A-Z]/)
    expect(mdp).toMatch(/[0-9]/)
  })
})

describe("getRoleLabel", () => {
  it("retourne le label français", () => {
    expect(getRoleLabel("SUPER_ADMIN")).toBe("Super Admin")
    expect(getRoleLabel("MERCHANT")).toBe("Commerçant")
    expect(getRoleLabel("CLIENT")).toBe("Client")
  })
})

describe("getStatusCouleur", () => {
  it("retourne les couleurs pour chaque statut", () => {
    expect(getStatusCouleur("ACTIVE")).toBe("green")
    expect(getStatusCouleur("PENDING")).toBe("yellow")
    expect(getStatusCouleur("SUSPENDED")).toBe("red")
  })

  it("retourne gris par défaut", () => {
    expect(getStatusCouleur("INCONNU")).toBe("gray")
  })
})
