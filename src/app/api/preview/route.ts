import { NextRequest, NextResponse } from "next/server"
import { draftMode } from "next/headers"

const previewSecret = process.env.MICROCMS_PREVIEW_SECRET

export async function GET(request: NextRequest) {
  const url = request.nextUrl

  if (!previewSecret) {
    console.error("MICROCMS_PREVIEW_SECRET が環境変数に設定されていません")
    return new NextResponse("Preview is not configured", { status: 500 })
  }

  const secret = url.searchParams.get("secret")
  if (secret !== previewSecret) {
    return new NextResponse("Invalid secret", { status: 401 })
  }

  const type = url.searchParams.get("type")
  const id = url.searchParams.get("id")
  const draftKey = url.searchParams.get("draftKey")

  if (!type || !id || !draftKey) {
    return new NextResponse("Missing preview parameters", { status: 400 })
  }

  if (type !== "job") {
    return new NextResponse("Unsupported preview type", { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  const redirectUrl = new URL(`/preview/${type}/${id}`, request.url)
  redirectUrl.searchParams.set("draftKey", draftKey)

  return NextResponse.redirect(redirectUrl)
}

