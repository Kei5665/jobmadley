import { NextRequest, NextResponse } from "next/server"
import { getMunicipalities } from "@/lib/getMunicipalities"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const prefectureId = searchParams.get("prefecture")

  if (!prefectureId) {
    return NextResponse.json({ error: "prefecture query param is required" }, { status: 400 })
  }

  try {
    const municipalities = await getMunicipalities(prefectureId)
    // 最低限の情報だけ返す
    const payload = municipalities.map((m) => ({ id: m.id, name: m.name }))
    return NextResponse.json(payload, { status: 200 })
  } catch (err) {
    console.error("Failed to fetch municipalities", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 