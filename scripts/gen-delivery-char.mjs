// One-off: generate the delivery (フードデリバリー) lion character via Gemini Image API
// using the existing taxi/mechanic illustrations + character sheet as style refs.

import fs from "node:fs"
import path from "node:path"

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error("GEMINI_API_KEY not set")
  process.exit(1)
}

const charDir = "/Users/takedakiichi/Documents/メインプロジェクト/ライドジョブ求人/キャラ画像"
const refs = ["タクシー.png", "整備士.png", "レオ_三面図.png"].map((name) => ({
  name,
  data: fs.readFileSync(path.join(charDir, name)).toString("base64"),
  mime: "image/png",
}))

const prompt = `添付の3枚のリファレンス画像（タクシー運転手レオ、整備士レオ、レオの三面図）と
完全に同じ画風・線・配色で、フードデリバリー配達員の「レオ」を1体だけ描いてください。

要件:
- キャラクターは同一のライオン「レオ」（黄色い顔、オレンジ色のもこもこたてがみ、太い茶色の眉、
  丸い耳、ピンクのほっぺ、黒目に白いハイライト、優しい口元）を厳守
- 服装: フードデリバリー配達員の制服（赤系または黒系のジャケット、黒いキャップ）
- 大きな保温バッグ（ピザボックス型）を背負っている
- ポーズ: 正面、笑顔で右手を軽く挙げて元気に挨拶している立ち姿
- スタイル: 添付画像と同じフラット2Dイラスト、太い茶色の輪郭線
- 背景: 完全に白または透過。影・グラデーション・装飾は付けない
- アスペクト: 縦長 (3:4 程度)、キャラ全身が収まる

リファレンスのプロポーション・線の太さ・色味を厳密に守ってください。`

const body = {
  contents: [
    {
      role: "user",
      parts: [
        ...refs.map((r) => ({
          inlineData: { mimeType: r.mime, data: r.data },
        })),
        { text: prompt },
      ],
    },
  ],
  generationConfig: {
    responseModalities: ["IMAGE"],
  },
}

const model = "gemini-2.5-flash-image"
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

console.log(`[gen] requesting ${model} ...`)
const res = await fetch(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
})

if (!res.ok) {
  const text = await res.text()
  console.error(`[gen] HTTP ${res.status}:`, text.slice(0, 2000))
  process.exit(1)
}

const json = await res.json()
const parts = json?.candidates?.[0]?.content?.parts ?? []
const imagePart = parts.find((p) => p.inlineData?.data)

if (!imagePart) {
  console.error("[gen] no image in response. full body:")
  console.error(JSON.stringify(json, null, 2).slice(0, 4000))
  process.exit(1)
}

const outPath = path.join(charDir, "デリバリー.png")
fs.writeFileSync(outPath, Buffer.from(imagePart.inlineData.data, "base64"))
console.log(`[gen] saved -> ${outPath}`)
