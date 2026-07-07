"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, MessageSquare, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [chargement, setChargement] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setChargement(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Message envoyé avec succès !")
    setChargement(false)
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16">
        <div className="container-congo text-center">
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-yellow-300" />
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Contact</h1>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Une question ? Une suggestion ? N&apos;hésitez pas à nous contacter
          </p>
        </div>
      </section>

      <section className="container-congo py-16">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-dark">Envoyez-nous un message</h2>
            <p className="mt-2 text-gray-600">Nous vous répondrons dans les plus brefs délais</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Nom</label>
                  <input className="input-field" placeholder="Votre nom" required />
                </div>
                <div>
                  <label className="label-field">Prénom</label>
                  <input className="input-field" placeholder="Votre prénom" />
                </div>
              </div>
              <div>
                <label className="label-field">Email</label>
                <input type="email" className="input-field" placeholder="votre@email.com" required />
              </div>
              <div>
                <label className="label-field">Sujet</label>
                <select className="input-field">
                  <option>Information générale</option>
                  <option>Devenir commerçant</option>
                  <option>Support technique</option>
                  <option>Réclamation</option>
                  <option>Partenariat</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="label-field">Message</label>
                <textarea className="input-field" rows={5} placeholder="Votre message..." required />
              </div>
              <button type="submit" disabled={chargement} className="btn-primary w-full">
                {chargement ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {chargement ? "Envoi..." : "Envoyer le message"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-dark">Nos coordonnées</h2>
            <p className="mt-2 text-gray-600">Nous sommes à votre écoute</p>
            <div className="mt-8 space-y-6">
              {[
                { icone: <MapPin className="h-5 w-5" />, titre: "Adresse", contenu: "Brazzaville, République du Congo" },
                { icone: <Phone className="h-5 w-5" />, titre: "Téléphone", contenu: "+242 05 555 55 55", lien: "tel:+24205555555" },
                { icone: <Mail className="h-5 w-5" />, titre: "Email", contenu: "contact@congosoldes.cg", lien: "mailto:contact@congosoldes.cg" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
                    {item.icone}
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">{item.titre}</h3>
                    {item.lien ? (
                      <a href={item.lien} className="text-gray-600 hover:text-primary-500 transition-colors">{item.contenu}</a>
                    ) : (
                      <p className="text-gray-600">{item.contenu}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-gray-50 p-6">
              <h3 className="font-semibold text-dark">Horaires d&apos;ouverture</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p>Lundi - Vendredi : 08h00 - 18h00</p>
                <p>Samedi : 09h00 - 15h00</p>
                <p>Dimanche : Fermé</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
