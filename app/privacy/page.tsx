import fs from "fs"
import path from "path"

// サーバーコンポーネント
export default function PrivacyPolicyPage() {
  // リポジトリ直下の doc/privacy.md を読み込む
  const markdown = fs.readFileSync(path.join(process.cwd(), "doc/privacy.md"), "utf8")

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">プライバシーポリシー</h1>
      {/* マークダウンをそのままテキスト表示（改行保持） */}
      <article className="prose whitespace-pre-wrap max-w-none">
        {markdown}
      </article>
    </main>
  )
} 