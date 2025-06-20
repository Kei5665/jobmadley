"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, User, UserPlus, ChevronRight, Home, ChevronLeft } from "lucide-react"
import { useState } from "react"

interface JobDetailPageProps {
  jobId?: string
}

export default function JobDetailPage({ jobId = "1" }: JobDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    "/placeholder.svg?height=400&width=600&text=介護事務スタッフ1",
    "/placeholder.svg?height=400&width=600&text=介護事務スタッフ2",
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="text-2xl font-bold text-teal-500">ジョブメドレー</div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">LINEで仕事探し 履歴書添削 ご利用ガイド 求人掲載をお考えの方へ</div>
              <Search className="w-5 h-5 text-gray-400" />
              <Button variant="ghost" size="sm" className="text-teal-600">
                <MapPin className="w-4 h-4 mr-1" />
                最近見た求人
              </Button>
              <Button variant="ghost" size="sm" className="text-teal-600">
                <Star className="w-4 h-4 mr-1" />
                キープ
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-1" />
                ログイン
              </Button>
              <Button variant="ghost" size="sm">
                <UserPlus className="w-4 h-4 mr-1" />
                会員登録
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Home className="w-4 h-4 mr-1" />
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/" className="hover:text-teal-600">
            介護事務の求人
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/search?prefecture=東京都" className="hover:text-teal-600">
            東京都
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/search?prefecture=東京都" className="hover:text-teal-600">
            東京都の求人
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/search?prefecture=東京都&city=中野区" className="hover:text-teal-600">
            中野区
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>リブウェル足立入谷の介護事務求人</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Carousel */}
            <div className="relative mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt="介護事務スタッフ"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Job Title and Actions */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Badge className="bg-red-500 text-white mr-2">NEW</Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    リブウェル足立入谷【2025年09月01日オープン予定】の事務員（介護事務）求人（夜勤無し）
                  </h1>
                </div>
                <div className="flex flex-col space-y-3 ml-6">
                  <Link href={`/apply/${jobId}`}>
                    <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg">
                      応募画面へ進む
                      <div className="text-xs ml-2 bg-white text-red-500 px-2 py-1 rounded">
                        約1分!
                        <br />
                        すぐ完了
                      </div>
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    キープする
                  </Button>
                </div>
              </div>

              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg inline-block mb-4">
                月給208,770円～211,570円
              </div>
              <p className="text-sm text-gray-500">最終更新日 2025/06/12</p>
            </div>

            {/* Job Description */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  【東京都足立区】2025年秋にオープン予定!!★住宅型有料老人ホームの事務職募集☆事務経験を活かして活躍いただけます☆
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  「明し業界でも、ここまで業がつく理由がある～体験る、続ける、成長できる――そんな介護の現場に～」
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ＼有休消化率80％以上／入社時収得OK／入居者より高水準の給与／
                  <br />
                  安心して働けて、しっかり休める。あなたのなりたい自分に、ここから始まる。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">「ビオネストグループについて」</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ビオネストグループは、大阪、兵庫を中心に全国で介護事業・医療事業・障がい福祉事業などを幅広く手がけております。
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  全国に約500事業所・従業員約5,000名の規模で、医療・介護・障がい福祉の3つのヘルスケア事業を融合し、地域住民の皆様に提供することでビジョンに掲げています。ここ数年で介護施設の事業所が増え、スピード感を持って大きく成長していることを実感できます。成長過程にあることで「会社のこれからを担がたくて働いているやりがいが感じられる環境です。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  医療・介護・障がい福祉の3つのヘルスケア事業を通して、地域に根ざしたヘルスケアエコシステムの構築ができるように取り組んでいます。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">「なりたい自分に」</h3>
                <p className="text-gray-700 leading-relaxed">
                  従業員の「なりたい自分に」近づく場として、ビオネストグループはあなたいと思い、コーポレートスローガンに掲げています。当社では、あなたのなりたい自分を叶えるステージをご用意することが可能です。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">未経験でも安心☆☆</h3>
                <p className="text-gray-700 leading-relaxed">
                  OJTでしっかり指導いたしますので未経験の方も安心してお仕事を始めていただけます。
                </p>
              </div>
            </div>
            {/* Detailed Job Information */}
            <div className="space-y-8 mt-12">
              {/* 募集職種 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">事業内容</h3>
                <p className="text-gray-700">事業所（介護事務）</p>
              </div>

              {/* 仕事内容 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">仕事内容</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-600">正職員</Badge>
                  <Badge className="bg-green-100 text-green-600">未経験OK</Badge>
                  <Badge className="bg-purple-100 text-purple-600">オープニングスタッフ</Badge>
                </div>
                <p className="text-gray-700 mb-4">（入職は2025年9月1日となります。）</p>
                <p className="text-gray-700 mb-4">住宅型有料老人ホームでの事務のお仕事です。</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
                  <li>事務作業</li>
                  <li>来客対応</li>
                  <li>電話対応</li>
                  <li>介護記録業務</li>
                  <li>介護保険業務</li>
                  <li>請求業務等</li>
                </ul>
                <div className="text-gray-700 space-y-2">
                  <p>・事務の文章業務・会社の決める業務</p>
                  <p>・経営事務の文章業務・会社の決める業務事務</p>
                  <p>・事務担当・6ヶ月</p>
                  <p>・その他事務、その他業務により業務内容が変更する</p>
                  <p>（評価者の業務担当、事務担当、心身の健康状況、受け入れ先の目標、会社の目標等）</p>
                  <p>状況、その他</p>
                  <p>事務上記・なし</p>
                </div>
              </div>

              {/* 診療科目・サービス形態 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">診療科目・サービス形態</h3>
                <Badge className="bg-orange-100 text-orange-600">介護職員</Badge>
              </div>

              {/* 給与 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">給与</h3>
                <p className="text-lg font-semibold text-gray-800 mb-4">【正職員】月給208,770円〜211,570円</p>
                <div className="text-gray-700 space-y-2">
                  <p>
                    内訳：基本給：160,000円、処遇改善手当：17,000円、特定処遇改善手当：18,000円、地域手当：16,500円、職務手当（固定残業代含む）27,270円（1）から1,270円
                  </p>
                  <p>※固定残業代の詳細は面接時にお伝えします</p>
                  <p>住居手当：月7,000円</p>
                  <p>通勤手当：上限22,000円/月　時間による支給</p>
                  <p>昇給あり：年2回</p>
                  <p>賞与あり：年2回</p>
                  <p>（支給時期6ヶ月・月1回程度の査定を実施）</p>
                </div>
              </div>

              {/* 待遇 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">待遇</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-600">社会保険完備</Badge>
                  <Badge className="bg-green-100 text-green-600">ボーナス・賞与あり</Badge>
                  <Badge className="bg-purple-100 text-purple-600">交通費支給</Badge>
                  <Badge className="bg-orange-100 text-orange-600">社会保険完備</Badge>
                  <Badge className="bg-pink-100 text-pink-600">住宅手当支給</Badge>
                </div>
                <div className="text-gray-700 space-y-1">
                  <p>契約に応じて手当あり</p>
                  <p>雇用保険、労災保険、健康保険、厚生年金</p>
                  <p>業務委託制度あり　制服貸与</p>
                  <p>退職金制度あり　健康診断あり</p>
                  <p>内部研修制度あり　上達7回まで</p>
                  <p>雇用の安定確保制度あり（年収）</p>
                  <p>マイカー通勤可　駐車場あり</p>
                  <p>ライフサポート倶楽部あり</p>
                  <p>正社員登用制度あり</p>
                  <p>正社員雇用制度あり</p>
                </div>
              </div>

              {/* 教育体制・研修 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">教育体制・研修</h3>
                <Badge className="bg-green-100 text-green-600">研修制度あり</Badge>
              </div>

              {/* 勤務時間 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">勤務時間</h3>
                <p className="text-gray-700">9:00〜18:00（休憩60分）</p>
              </div>

              {/* 休日 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">休日</h3>
                <Badge className="bg-blue-100 mb-4 text-blue-600">年間休日数100日</Badge>
                <div className="text-gray-700 space-y-1">
                  <p>シフト制</p>
                  <p>月9日休み（2月のみ8日休み）</p>
                </div>
              </div>

              {/* Long vacations and special vacations */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">長期休暇・特別休暇</h3>
                <div className="text-gray-700 space-y-2">
                  <p>（有給休暇の取得を奨励しています）</p>
                  <p>ご本人の希望を考慮します。</p>
                  <p>
                    当施設では、一人ひとりのお仕事の効率的な仕組み作りに4回以上、特に働きやすさを目指して上記の上記体制を整えています。有給休暇の取得率100％を目指しています。
                  </p>
                  <p>
                    業務に対する効率的な仕組み作りを実施、介護に対する効率的な仕組み作りを実施すること、メリハリをつけて働いていただくことを重視しています。
                  </p>
                </div>
              </div>

              {/* 応募要件 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">応募要件</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-green-100 text-green-600">未経験可</Badge>
                  <Badge className="bg-blue-100 text-blue-600">ブランク可</Badge>
                  <Badge className="bg-purple-100 text-purple-600">学歴不問</Badge>
                  <Badge className="bg-orange-100 text-orange-600">年齢不問</Badge>
                  <Badge className="bg-pink-100 text-pink-600">資格不問</Badge>
                  <Badge className="bg-gray-100 text-gray-600">60代活躍</Badge>
                </div>
                <p className="text-gray-700">PC（Excel・Word）基本操作が可能な方</p>
              </div>

              {/* 歓迎要件 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">歓迎要件</h3>
                <div className="text-gray-700 space-y-1">
                  <p>実務経験者歓迎</p>
                  <p>介護職員初任者研修</p>
                  <p>介護福祉士実務者研修（旧ホームヘルパー・介護職員基礎研修）</p>
                  <p>介護福祉士資格者歓迎</p>
                </div>
              </div>

              {/* 選考プロセス */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">選考プロセス</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <p className="text-gray-700">ジョブメドレーの応募フォームからご応募ください</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <p className="text-gray-700">採用担当者より連絡後、WEBテストの受験をしていただきます</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <p className="text-gray-700">1次面接・WEBテスト受験</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <p className="text-gray-700">採用担当者より合否結果の連絡をさせていただきます</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      5
                    </div>
                    <p className="text-gray-700">2次面接・適性検査</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      6
                    </div>
                    <p className="text-gray-700">採用担当者より合否</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      7
                    </div>
                    <p className="text-gray-700">入職手続きを実施いただく</p>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">※応募から内定まで平均1週間〜1ヶ月程度となります。</p>
                    <p className="text-sm text-gray-600">※応募状況によって選考期間が前後する場合がございます。</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Photo Gallery */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">写真</h3>
              <div className="grid grid-cols-2 gap-4">
                <Image
                  src="/placeholder.svg?height=200&width=300&text=職場風景1"
                  alt="職場風景1"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <Image
                  src="/placeholder.svg?height=200&width=300&text=職場風景2"
                  alt="職場風景2"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Facility Information */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">事業所情報</h3>

              <div className="space-y-6">
                {/* Company Name */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="font-medium text-gray-700">法人・施設名</div>
                  <div className="md:col-span-3">
                    <Link href="#" className="text-teal-600 hover:underline">
                      リブウェル足立入谷
                    </Link>
                  </div>
                </div>

                {/* Job Categories */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="font-medium text-gray-700">募集職種</div>
                  <div className="md:col-span-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          介護職員(介護職員、ヘルパー)の求人
                        </Link>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          介護職員(介護職員、ヘルパー)の求人
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          訪問介護職員(介護職員、ヘルパー)の求人
                        </Link>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          ケアマネジャー(介護支援専門員)の求人
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          事務員(介護事務、医療事務等)の求人
                        </Link>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          サービス提供責任者(訪問介護)の求人
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          サービス提供責任者(訪問介護)の求人
                        </Link>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          事務員(介護事務、医療事務等)の求人
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          事務員(介護事務、医療事務等)の求人
                        </Link>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          訪問介護職員(介護職員、ヘルパー)の求人
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          訪問介護職員(介護職員、ヘルパー)の求人
                        </Link>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          機能訓練指導員(理学療法士、作業療法士等)の求人
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          機能訓練指導員(理学療法士、作業療法士等)の求人
                        </Link>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          事務員(介護事務、医療事務等)の求人
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          事務員(介護事務、医療事務等)の求人
                        </Link>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          事務員(介護事務、医療事務等)の求人
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Access Information */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="font-medium text-gray-700">アクセス</div>
                  <div className="md:col-span-3">
                    <div className="space-y-4">
                      <div>
                        <Badge className="bg-orange-100 text-orange-600 mb-2">事業所住所</Badge>
                        <p className="text-gray-700">東京都品川区東五反田7丁目14-8</p>
                        <Link href="#" className="text-teal-600 hover:underline text-sm">
                          大きな地図で見る
                        </Link>
                      </div>

                      {/* Map Placeholder */}
                      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=250&width=400&text=Googleマップ"
                          alt="地図"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>目黒駅、五反田駅、大崎駅から徒歩で通勤可能</p>
                        <p>目黒駅、五反田駅、大崎駅から徒歩で通勤可能な立地です 7から22分</p>
                        <p>目黒駅、五反田駅、大崎駅から徒歩で通勤可能な立地です 5から6分</p>
                      </div>

                      <Link href="#" className="text-teal-600 hover:underline text-sm">
                        Google Mapで見る
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Facility Details */}
            <div className="border-t pt-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="font-medium text-gray-700">設立年月日</div>
                <div className="md:col-span-3 text-gray-700">2025年9月1日</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-medium text-gray-700">施設・サービス形態</div>
                <div className="md:col-span-3">
                  <div className="space-y-1">
                    <Link href="#" className="block text-teal-600 hover:underline">
                      介護、福祉施設
                    </Link>
                    <Link href="#" className="block text-teal-600 hover:underline">
                      住宅型有料老人ホーム
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  キープする
                </Button>
                <Link href={`/apply/${jobId}`}>
                  <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3">
                    応募画面へ進む
                    <div className="text-xs ml-2 bg-white text-red-500 px-2 py-1 rounded">
                      約1分!
                      <br />
                      すぐ完了
                    </div>
                  </Button>
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">応募に関するよくある質問</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">応募情報はどのように事業所に伝わりますか？</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    応募いただいた情報は、ジョブメドレーから安全に事業所へ連携されます。また、スカウト機能を「受け取る」に設定していただくと、それまでのプロフィールを見た事業所から直接スカウトが届くことがあります。ご希望の方は、プライバシーポリシーをご確認ください。
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    応募する前に事業所に質問したいときはどうすればよいですか？
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    事業所の詳細な情報を知りたい場合や、応募前に質問したいことがある場合は、ページ下の「お問い合わせ」からご連絡ください。
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">求人内容について電話で質問することはできますか？</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    応募前、ジョブメドレーにご登録いただいた方には電話でのご連絡も可能です。事業所に直接お電話いただくことも可能です。
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">応募を検討する</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    電話で応募したいときはどうすればよいですか？
                    「電話で応募」ボタンから直接お電話いただくか、お電話番号をお調べいただき、お電話ください。
                    お電話の際はジョブメドレーを見たとお伝えいただくとスムーズです。
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link href="#" className="text-teal-600 hover:underline">
                  事業所へお問い合わせする
                </Link>
              </div>
            </div>

            {/* Final Action Buttons */}
            <div className="border-t pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button variant="outline" className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  キープする
                </Button>
                <Link href={`/apply/${jobId}`}>
                  <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3">
                    応募画面へ進む
                    <div className="text-xs ml-2 bg-white text-red-500 px-2 py-1 rounded">
                      約1分!
                      <br />
                      すぐ完了
                    </div>
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm text-gray-600 mb-4">
                ジョブメドレーの求人で気になることがあれば気軽にお問い合わせください。9:00〜18:00（土日祝除く）
              </div>

              <div className="text-center">
                <Link href="#" className="text-teal-600 hover:underline">
                  お問い合わせする
                </Link>
              </div>
            </div>

            {/* Scout Banner */}
            <div className="mt-12 mb-8">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg p-6 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl mr-2">📧</span>
                    <span className="text-xl font-bold">スカウト経由の応募</span>
                    <span className="text-2xl ml-2">⭐</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    内定率<span className="text-4xl text-yellow-300">1.7</span>倍!!
                  </div>
                  <div className="text-sm">スカウトしてもらいましょう</div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
              </div>

              <div className="text-center mt-4">
                <Link href="#" className="text-teal-600 hover:underline text-sm">
                  イメージに合いそうなお仕事をお探しの方はこちら
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">東京都の介護事務の新着求人</h3>
                <div className="space-y-4">
                  {/* Related Job 1 */}
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Image
                      src="/placeholder.svg?height=60&width=80"
                      alt="ホームケアまき"
                      width={80}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">ホームケアまきの介護事務求人</h4>
                      <p className="text-xs text-gray-600 mb-1">正職員 月給 231,000円 ～ 245,000円</p>
                      <p className="text-xs text-gray-600 mb-2">東京都文京区千駄木3-42-5 セントラルガーデン</p>
                      <Badge variant="secondary" className="text-xs">
                        職場の環境
                      </Badge>
                    </div>
                  </div>

                  {/* Related Job 2 */}
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Image
                      src="/placeholder.svg?height=60&width=80"
                      alt="SmartWorX"
                      width={80}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">株式会社SmartWorXの外資系求人</h4>
                      <p className="text-xs text-gray-600 mb-1">正職員 月給 250,000円 ～ 300,000円</p>
                      <p className="text-xs text-gray-600 mb-2">東京都中田区谷中大手町7丁目2-5 ダイヤモンド</p>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          職場の環境
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          1日の求人
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Related Job 3 */}
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Image
                      src="/placeholder.svg?height=60&width=80"
                      alt="PDハウス中野日高"
                      width={80}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">
                        PDハウス中野日高（医療）/ 株式会社サンウェルズ
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">正職員 月給 220,000円 ～</p>
                      <p className="text-xs text-gray-600 mb-2">東京都中野区谷中二丁目1番地東京予定</p>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          車通勤可能
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          オープン3年以内
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" className="w-full text-teal-600 mt-4">
                  求人をもっと見る
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">なるほど！ジョブメドレー新着記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Article 1 */}
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="養護老人ホーム"
                width={300}
                height={150}
                className="w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  養護老人ホームとは？特養との違いや仕事内容を紹介
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded">職種を知る</span>
                  <span>2024/08/13</span>
                </div>
              </CardContent>
            </Card>

            {/* Article 2 */}
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="年末調整"
                width={300}
                height={150}
                className="w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  【2024年変更点あり】年末調整とは？対象者や書き方、確定...
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">仕事お役立ち情報</span>
                  <span>2023/10/04</span>
                </div>
              </CardContent>
            </Card>

            {/* Article 3 */}
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="転職面接"
                width={300}
                height={150}
                className="w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  異業種への転職は難しい？失敗しないための転職活動の...
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded">求人の見方・転職ガイド</span>
                  <span>2023/06/19</span>
                </div>
              </CardContent>
            </Card>

            {/* Article 4 */}
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="コロナ対策"
                width={300}
                height={150}
                className="w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  コロナ5類移行「面会制限やや緩和」50％以上 医療・介護従...
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">コラム</span>
                  <span>2023/05/30</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
              なるほど！ジョブメドレーをもっと見る
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-teal-500">ジョブメドレー</div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
            </Button>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-600 leading-relaxed">
              介護事務の求人をお探しならジョブメドレー。あなたにぴったりの求人が見つかります。ジョブメドレーは、医療介護従事者が転職をする際に転職・就職・復職を支援する求人サイトです。ほぼすべての医療介護職種を取り扱っており、介護事務の求人を含む、全国306万件の事業所の正社員、アルバイト・パート募集情報を掲載しています（2025年6月19日現在）。求人の応募から入職まで、専任のキャリアサポートが転職をサポートします。また、会員登録をしていただくと、希望条件に合った新着求人や、スカウトメッセージを受け取ることができます。介護事務の転職、就職なら医療介護求人サイト「ジョブメドレー」にお任せください。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">ジョブメドレーについて</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  ご利用ガイド
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  ご利用規約
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  外部送信ポリシー
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  ヘルプ
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  ミッション
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  なるほど！ジョブメドレー
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  転職体験談
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  お知らせ
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  運営会社情報
                </Link>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">採用担当者様へ</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  求人掲載をお考えの企業様
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  リンク設置について
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  採用担当ログイン
                </Link>
              </div>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">お困りの方はこちら</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  各種ご相談・お問い合わせ窓口
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
