import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { initierPaiement, validerPaiementManuel } from "@/lib/paiement"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "COMMERCANT" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const result = await initierPaiement(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur paiement:", error)
    return NextResponse.json({ error: "Erreur lors du paiement" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { paiementId } = await request.json()
    const result = await validerPaiementManuel(paiementId, session.user.id)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
