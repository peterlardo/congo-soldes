import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phone: true, role: true, status: true,
        createdAt: true, lastLoginAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { id, userId, status, role } = body
    const targetId = id || userId

    if (!targetId) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (role && session.user.role === "SUPER_ADMIN") updateData.role = role

    const user = await prisma.user.update({
      where: { id: targetId },
      data: updateData,
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_UPDATE_USER",
        entityType: "User",
        entityId: targetId,
        newValues: updateData,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erreur mise à jour utilisateur:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await request.json()
    await prisma.user.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_DELETE_USER",
        entityType: "User",
        entityId: id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}