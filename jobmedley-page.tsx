import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, User, UserPlus, ChevronRight, Home } from "lucide-react"
import { getPrefectureGroups } from "@/lib/getPrefectures"

export default async function Component() {
  const prefectures = await getPrefectureGroups()

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
          <span>介護事務求人トップ</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">介護事務の</h1>
                <p className="text-lg text-gray-600">求人 転職 就職 アルバイト募集情報</p>
              </div>
              <div className="flex-1">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="介護士の女性"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* Search History */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <Search className="w-4 h-4 text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">検索履歴から選択</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-teal-600">検索履歴をもっと見る</span>
              <Link href="/search?prefecture=神奈川県" className="flex items-center text-gray-700 hover:text-teal-600">
                <span>神奈川県</span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Search Tabs */}
        <Tabs defaultValue="prefecture" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="prefecture" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              都道府県から選択
            </TabsTrigger>
            <TabsTrigger value="employment" className="flex items-center">
              雇用形態 給与から選択
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center">
              特徴から選択
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prefecture">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
              {Object.entries(prefectures).map(([area, prefs]) => (
                <div key={area} className="space-y-3">
                  <h3 className="font-semibold text-gray-800 text-center">{area}</h3>
                  <div className="space-y-2">
                    {prefs.map((pref) => (
                      <Link
                        key={pref.id}
                        href={`/search?prefecture=${encodeURIComponent(pref.id)}`}
                        className="flex items-center justify-between p-2 text-sm text-teal-600 hover:bg-teal-50 rounded transition-colors"
                      >
                        <span>{pref.name}</span>
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="employment">
            <div className="text-center py-8 text-gray-500">雇用形態 給与の選択肢がここに表示されます</div>
          </TabsContent>

          <TabsContent value="features">
            <div className="text-center py-8 text-gray-500">特徴の選択肢がここに表示されます</div>
          </TabsContent>
        </Tabs>

        {/* Location Search */}
        <Card className="mt-8 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <MapPin className="w-4 h-4 text-teal-600" />
              </div>
              <Button variant="ghost" className="text-teal-600 font-semibold">
                自宅周辺から探す
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Keyword Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input type="text" placeholder="キーワードで検索する" className="w-full" />
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6">
                <Search className="w-4 h-4 mr-2" />
                検索
              </Button>
              <Button variant="outline" className="text-teal-600 border-teal-600">
                職種を変更
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pickup Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Banner Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg p-6 text-white flex items-center">
                <div className="flex-1">
                  <div className="text-lg font-bold mb-1">スカウト経由だと</div>
                  <div className="text-2xl font-bold mb-2">内定率17倍!!</div>
                  <div className="text-sm">スカウトしてもらいましょう</div>
                </div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center ml-4">
                  <div className="text-2xl">📧</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-lg p-6 text-white">
                <div className="text-xl font-bold mb-2">スピード選考優遇!</div>
                <div className="text-sm">平均2.4倍早くPRに選考する事業所の求人をもとに優遇します</div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">スピード返信の介護事務の求人</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Card 1 */}
                <Card className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="オフィスワーク"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">ケアプランナー記録業務中心の介護事務求人</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">給与:</span> 正職員 月給 243,000円 から 303,000円
                      </div>
                      <div>
                        <span className="font-medium">仕事:</span> 高齢者の方の受付 事務業務 経験浅めの求人
                      </div>
                      <div>
                        <span className="font-medium">内容:</span> 業務（マニュアルあり）身体的な負担が少ない
                      </div>
                      <div>
                        <span className="font-medium">応募:</span> 未経験者歓迎経験 学歴不問 未経験でも安心
                      </div>
                      <div>
                        <span className="font-medium">勤務:</span> 高齢者介護施設 経験者のPCスキルが必要
                      </div>
                      <div>
                        <span className="font-medium">住所:</span> 愛知県名古屋市千種区 最寄駅は地下鉄東山線
                        覚王山駅より徒歩約10分
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded">スピード返信</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">正職員のみ</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Star className="w-4 h-4 mr-1" />
                        キープする
                      </Button>
                      <Link href="/job/1" className="flex-1">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">求人を見る</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Card 2 */}
                <Card className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="チームミーティング"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">みつばメソッド実施三鷹の管理事務スタッフ求人</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">給与:</span> 正職員 月給 265,000円 から 315,000円
                      </div>
                      <div>
                        <span className="font-medium">仕事:</span> 高齢者介護 事務処理 未経験者歓迎の求人
                      </div>
                      <div>
                        <span className="font-medium">内容:</span> 介護記録などのパソコン入力業務
                      </div>
                      <div>
                        <span className="font-medium">応募:</span> 高校卒業 事務経験1年以上歓迎のPCスキル
                      </div>
                      <div>
                        <span className="font-medium">勤務:</span> 介護施設運営での業務経験 平日のみ
                      </div>
                      <div>
                        <span className="font-medium">住所:</span> 埼玉県さいたま市大宮区三橋1丁目1609-1
                        みつばメソッド実施三鷹 JR線駅より徒歩約6分
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded">スピード返信</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">1日の求人</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">未経験</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Star className="w-4 h-4 mr-1" />
                        キープする
                      </Button>
                      <Link href="/job/2" className="flex-1">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">求人を見る</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Card 3 */}
                <Card className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="介護施設"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">社会福祉法人つくみ福祉会 本部の介護事務求人</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">給与:</span> 正職員 月給 201,000円 から 305,300円
                      </div>
                      <div>
                        <span className="font-medium">仕事:</span> はがき等 会計ソフトでの入力作業（未経験）
                      </div>
                      <div>
                        <span className="font-medium">内容:</span> ワード エクセルなどのPC業務や電話対応
                      </div>
                      <div>
                        <span className="font-medium">応募:</span> 普通自動車運転免許証（AT限定可）64歳以下
                      </div>
                      <div>
                        <span className="font-medium">勤務:</span> 生活相談員として勤務（介護 福祉 社会）
                      </div>
                      <div>
                        <span className="font-medium">住所:</span> 大分県津久見市平成町9-15
                        津久見市営業所駅より徒歩約7分
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded">スピード返信</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">車通勤可能</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">未経験</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Star className="w-4 h-4 mr-1" />
                        キープする
                      </Button>
                      <Link href="/job/3" className="flex-1">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">求人を見る</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Card 4 */}
                <Card className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="給与アップ"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">ALSOK介護 本社の事務事務スタッフ求人</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">給与:</span> 正職員 月給 195,600円 から
                      </div>
                      <div>
                        <span className="font-medium">仕事:</span> 介護保険を運営しているALSOK介護事業
                      </div>
                      <div>
                        <span className="font-medium">内容:</span> 社での仕事業務です（1）文書作成 電話の対応
                      </div>
                      <div>
                        <span className="font-medium">応募:</span> 普通自動車運転免許証（経験者優遇）65歳以下
                      </div>
                      <div>
                        <span className="font-medium">勤務:</span> 1）未経験者でもOK（研究者目標1年/定年まで）
                      </div>
                      <div>
                        <span className="font-medium">住所:</span> 埼玉県さいたま市大宮区三橋1丁目796番地
                        JR大宮駅より約7分 西武バス（大宮駅西口）
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded">スピード返信</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">車通勤可能</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Star className="w-4 h-4 mr-1" />
                        キープする
                      </Button>
                      <Link href="/job/4" className="flex-1">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">求人を見る</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Jobs */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">最近見た求人</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src="/placeholder.svg?height=60&width=80"
                    alt="介護施設"
                    width={80}
                    height={60}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800">コンフォートガーデンあさひ野の介護事務求人</h4>
                    <p className="text-xs text-gray-600">正職員 月給 191,500円 から</p>
                    <p className="text-xs text-gray-600">神奈川県横浜市旭区あさひ野1丁目24-6</p>
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">
                      車通勤可能
                    </span>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-teal-600">
                  求人をもっと見る
                </Button>
              </CardContent>
            </Card>

            {/* Job Experience Stories */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">新着転職体験談</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👩</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        在職中でも気軽に応募できるのと担当者とメールのやり取りが履歴書できるのでメリット...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">介護事務 40代</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👩</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        ジョブメドレーさんは高齢に沿った事業所を紹介してくれるので色々と選択肢が出せ...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">介護事務 40代</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👩</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        面接先との連絡がメッセージ機能でやりとりしやすかったです。面接の事前のサポー...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">介護事務 40代</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-teal-600 mt-4">
                  体験談をもっと見る
                </Button>
              </CardContent>
            </Card>

            {/* Job Search Tips */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">必ず役立つ仕事探し術</h3>
                <div className="space-y-3">
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">💼</span>
                    ぴったりな仕事を探すには
                  </Link>
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">✈️</span>
                    応募の仕方
                  </Link>
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">📝</span>
                    履歴書の書き方
                  </Link>
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">📧</span>
                    メールやメッセージの書き方
                  </Link>
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">📱</span>
                    初回勤務までの準備
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Popular Columns */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">人気のコラムランキング</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      1位
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        失業手当（失業保険）はいくらもらえる？改正された失業給付条件や申請方法を...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      2位
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        年間休日の平均や内訳は？123日 120日 110日 105日って実際どのくらい休み...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      3位
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        バイタルサインとは？おさえておきたい正常値や異常値の目安 正確な測定方法
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-teal-600 mt-4">
                  コラムをもっと見る
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
                  【2024年変更点あり】年末調整とは？対象者や書き方 確定...
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
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded">求人の見方 転職ガイド</span>
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
                  コロナ5類移行「面会制限やや緩和」50％以上 医療 介護従...
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
              介護事務の求人をお探しならジョブメドレー。あなたにぴったりの求人が見つかります。ジョブメドレーは
              医療介護従事者が転職をする際に転職 就職
              復職を支援する求人サイトです。ほぼすべての医療介護職種を取り扱っており 介護事務の求人を含む
              全国306万件の事業所の正社員 アルバイト
              パート募集情報を掲載しています（2025年6月19日現在）。求人の応募から入職まで
              専任のキャリアサポートが転職をサポートします。また 会員登録をしていただくと 希望条件に合った新着求人や
              スカウトメッセージを受け取ることができます。介護事務の転職
              就職なら医療介護求人サイト「ジョブメドレー」にお任せください。
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
                  各種ご相談 お問い合わせ窓口
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
