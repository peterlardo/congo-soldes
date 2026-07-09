import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (slug) {
      const page = await prisma.cmsPage.findUnique({
        where: { slug, status: "PUBLISHED" },
      })
      if (!page) return NextResponse.json({ error: "Page non trouvée" }, { status: 404 })
      return NextResponse.json(page)
    }

    const pages = await prisma.cmsPage.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true, slug: true, updatedAt: true },
      orderBy: { title: "asc" },
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error("Erreur CMS:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}