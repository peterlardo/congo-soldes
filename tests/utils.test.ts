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
} from "@/lib/utils"

describe("formatPrix", () => {
  it("formate un prix en FCFA", () => {
    expect(formatPrix(15000)).toContain("15")
  })
})

describe("calculerReduction", () => {
  it("calcule le pourcentage de réduction", () => {
    expect(calculerReduction(10000, 7500)).toBe(25)
  })

  it("retourne 0 si prix normal <= 0", () => {
    expect(calculerReduction(0, 100)).toBe(0)
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
})

describe("genererReference", () => {
  it("génère une référence au format CS-XXXX-XXXX", () => {
    const ref = genererReference()
    expect(ref).toMatch(/^CS-[A-Z0-9]+-[A-Z0-9]+$/)
  })
})

describe("getInitiales", () => {
  it("retourne les 2 premières initiales", () => {
    expect(getInitiales("Jean Dupont")).toBe("JD")
  })

  it("gère un nom seul", () => {
    expect(getInitiales("Jean")).toBe("J")
  })
})

describe("calculerDistance", () => {
  it("calcule la distance entre deux points (Brazzaville -> Pointe-Noire)", () => {
    const dist = calculerDistance(-4.2634, 15.2429, -4.7761, 11.866)
    expect(dist).toBeGreaterThan(300)
    expect(dist).toBeLessThan(400)
  })
})

describe("getAbonnementLabel", () => {
  it("retourne le label français", () => {
    expect(getAbonnementLabel("PREMIUM")).toBe("Premium")
    expect(getAbonnementLabel("INCONNU")).toBe("INCONNU")
  })
})

describe("getStatutLabel", () => {
  it("retourne le label français du statut", () => {
    expect(getStatutLabel("EN_ATTENTE")).toBe("En attente")
    expect(getStatutLabel("INCONNU")).toBe("INCONNU")
  })
})
