"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Search, Send, Phone, MoreVertical, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  contenu: string
  date: string
  moi: boolean
}

interface Conversation {
  id: number
  nom: string
  avatar: string
  dernierMessage: string
  heure: string
  nonLus: number
  enLigne: boolean
  messages: Message[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1, nom: "Marie Nkosi", avatar: "",
    dernierMessage: "D'accord, je passerai demain matin",
    heure: "09:45", nonLus: 2, enLigne: true,
    messages: [
      { id: 1, contenu: "Bonjour, est-ce que le Samsung Galaxy est encore disponible ?", date: "09:30", moi: false },
      { id: 2, contenu: "Oui, il est toujours en stock avec la promotion à 329 000 FCFA", date: "09:35", moi: true },
      { id: 3, contenu: "Parfait ! Je peux passer le récupérer à votre boutique ?", date: "09:40", moi: false },
      { id: 4, contenu: "Bien sûr, nous sommes ouverts de 8h à 18h", date: "09:42", moi: true },
      { id: 5, contenu: "D'accord, je passerai demain matin", date: "09:45", moi: false },
    ],
  },
  {
    id: 2, nom: "Pierre Makaya", avatar: "",
    dernierMessage: "Merci pour les informations",
    heure: "Hier", nonLus: 0, enLigne: false,
    messages: [
      { id: 1, contenu: "Bonjour, quel est le prix du pack alimentaire ?", date: "Lun 14:00", moi: false },
      { id: 2, contenu: "Le pack familial 50kg est à 45 000 FCFA en promotion", date: "Lun 14:05", moi: true },
      { id: 3, contenu: "Merci pour les informations", date: "Lun 14:10", moi: false },
    ],
  },
  {
    id: 3, nom: "Alice Bouanga", avatar: "",
    dernierMessage: "Je veux commander le canapé cuir",
    heure: "Hier", nonLus: 1, enLigne: false,
    messages: [
      { id: 1, contenu: "Je veux commander le canapé cuir", date: "Hier 16:20", moi: false },
    ],
  },
  {
    id: 4, nom: "David Ngoma", avatar: "",
    dernierMessage: "Ok merci beaucoup !",
    heure: "25/07", nonLus: 0, enLigne: true,
    messages: [
      { id: 1, contenu: "Le climatiseur est-il toujours en promo ?", date: "25/07 10:00", moi: false },
      { id: 2, contenu: "Oui, à 550 000 FCFA au lieu de 650 000", date: "25/07 10:05", moi: true },
      { id: 3, contenu: "Ok merci beaucoup !", date: "25/07 10:10", moi: false },
    ],
  },
  {
    id: 5, nom: "Sarah Mbenza", avatar: "",
    dernierMessage: "Pouvez-vous me livrer à Pointe-Noire ?",
    heure: "24/07", nonLus: 3, enLigne: false,
    messages: [
      { id: 1, contenu: "Pouvez-vous me livrer à Pointe-Noire ?", date: "24/07 15:30", moi: false },
    ],
  },
]

export default function CommercantMessagesPage() {
  const { data: session } = useSession()
  const [selectedId, setSelectedId] = useState<number>(1)
  const [saisie, setSaisie] = useState("")
  const [recherche, setRecherche] = useState("")

  if (!session || (session.user.role !== "MERCHANT" && session.user.role !== "SHOP_MANAGER" && session.user.role !== "ADMIN")) redirect("/auth/connexion")

  const conversation = CONVERSATIONS.find((c) => c.id === selectedId)!
  const filtrees = CONVERSATIONS.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  )

  function getInitiales(nom: string) {
    return nom.split(" ").map((n) => n[0]).join("").toUpperCase()
  }

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="commercant" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Messages</h1>
          <p className="mt-1 text-gray-600">Échangez avec vos clients</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex h-[600px]">
            <div className="w-80 shrink-0 border-r border-gray-100">
              <div className="border-b border-gray-100 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className="input-field pl-9 w-full"
                    placeholder="Rechercher..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(600px-73px)]">
                {filtrees.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-primary-50/50",
                      selectedId === conv.id && "bg-primary-50"
                    )}
                  >
                    <div className="relative shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                        {getInitiales(conv.nom)}
                      </div>
                      {conv.enLigne && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-dark">{conv.nom}</span>
                        <span className="text-xs text-gray-400">{conv.heure}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">{conv.dernierMessage}</p>
                    </div>
                    {conv.nonLus > 0 && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                        {conv.nonLus}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                    {getInitiales(conversation.nom)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">{conversation.nom}</p>
                    <p className="text-xs text-gray-400">
                      {conversation.enLigne ? "En ligne" : "Hors ligne"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {conversation.messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.moi ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2.5",
                      msg.moi
                        ? "bg-primary-100 text-primary-900 rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    )}>
                      <p className="text-sm">{msg.contenu}</p>
                      <p className={cn(
                        "mt-1 text-right text-[10px]",
                        msg.moi ? "text-primary-600" : "text-gray-400"
                      )}>
                        {msg.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <input
                    className="input-field flex-1"
                    placeholder="Votre message..."
                    value={saisie}
                    onChange={(e) => setSaisie(e.target.value)}
                  />
                  <button className="btn-primary px-4">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
