import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuid } from "uuid"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)" }, { status: 400 })
    }

    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${uuid()}.${ext}`
    const uploadDir = join(process.cwd(), "public", "uploads", folder)

    await mkdir(uploadDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/${folder}/${filename}`

    return NextResponse.json({ url, filename }, { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
