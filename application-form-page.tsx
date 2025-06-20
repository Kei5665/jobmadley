"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { X, Plus } from "lucide-react"

interface ApplicationFormPageProps {
  jobId?: string
}

export default function ApplicationFormPage({ jobId = "1" }: ApplicationFormPageProps) {
  const [interviewDates, setInterviewDates] = useState([{ date: "", time: "" }])

  const addInterviewDate = () => {
    setInterviewDates([...interviewDates, { date: "", time: "" }])
  }

  const removeInterviewDate = (index: number) => {
    if (interviewDates.length > 1) {
      setInterviewDates(interviewDates.filter((_, i) => i !== index))
    }
  }

  const updateInterviewDate = (index: number, field: "date" | "time", value: string) => {
    const updated = [...interviewDates]
    updated[index][field] = value
    setInterviewDates(updated)
  }

  // Generate years for birth year dropdown
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 15 - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  // Generate hours and minutes for interview time
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = ["00", "15", "30", "45"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="text-2xl font-bold text-teal-500">ジョブメドレー</div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">みつばメゾン大宮三橋の介護職募集求人に応募する</h1>
        </div>

        <form className="space-y-8">
          {/* Basic Information Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">基本情報</h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    氏名 <span className="text-red-500">必須</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input placeholder="姓" required />
                    <Input placeholder="名" required />
                  </div>
                </div>

                {/* Furigana */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    ふりがな <span className="text-red-500">必須</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input placeholder="せい" required />
                    <Input placeholder="めい" required />
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    生年月日 <span className="text-red-500">必須</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="西暦" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}年
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="月" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {month}月
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="日" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}日
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    性別 <span className="text-red-500">必須</span>
                  </Label>
                  <RadioGroup className="flex space-x-6 mt-2" required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">女性</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">男性</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Phone Number */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    電話番号 <span className="text-red-500">必須</span>
                  </Label>
                  <Input type="tel" placeholder="例：09012345678" className="mt-2" required />
                </div>

                {/* Email */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">メールアドレス</Label>
                  <Input type="email" placeholder="例：example@email.com" className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    事業所からの連絡をメールで受け取りたい場合は入力してください。
                  </p>
                </div>

                {/* Address */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    住所 <span className="text-red-500">必須</span>
                  </Label>
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="都道府県" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tokyo">東京都</SelectItem>
                          <SelectItem value="kanagawa">神奈川県</SelectItem>
                          <SelectItem value="saitama">埼玉県</SelectItem>
                          <SelectItem value="chiba">千葉県</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="市区町村" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shibuya">渋谷区</SelectItem>
                          <SelectItem value="shinjuku">新宿区</SelectItem>
                          <SelectItem value="minato">港区</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input placeholder="町名 番地" required />
                    <Input placeholder="建物名 部屋番号" />
                  </div>
                </div>

                {/* Current Employment Status */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    現在の職業状況 <span className="text-red-500">必須</span>
                  </Label>
                  <RadioGroup className="flex space-x-6 mt-2" required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employed" id="employed" />
                      <Label htmlFor="employed">就業中</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unemployed" id="unemployed" />
                      <Label htmlFor="unemployed">離職中</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">在学中</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Details Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">応募内容</h2>

              <div className="space-y-6">
                {/* Job Position */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">応募職種</Label>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md">
                    <span className="text-gray-800">介護職員（正職員）</span>
                  </div>
                </div>

                {/* Experience Years */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">応募職種の経験年数</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="未設定" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">未経験</SelectItem>
                      <SelectItem value="less-than-1">1年未満</SelectItem>
                      <SelectItem value="1-3">1年から3年未満</SelectItem>
                      <SelectItem value="3-5">3年から5年未満</SelectItem>
                      <SelectItem value="5-10">5年から10年未満</SelectItem>
                      <SelectItem value="10-plus">10年以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Qualifications */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">保有資格 免許</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="kaigo-shoninsya" />
                      <Label htmlFor="kaigo-shoninsya" className="text-sm">
                        介護職員初任者研修（旧ヘルパー2級）
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="kaigo-jitsumusya" />
                      <Label htmlFor="kaigo-jitsumusya" className="text-sm">
                        介護福祉士実務者研修（旧ヘルパー1級）
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="kaigo-fukushishi" />
                      <Label htmlFor="kaigo-fukushishi" className="text-sm">
                        介護福祉士
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="driving-license" />
                      <Label htmlFor="driving-license" className="text-sm">
                        普通自動車運転免許
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other-qualification" />
                      <Label htmlFor="other-qualification" className="text-sm">
                        その他
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-teal-600 mt-2">資格取得支援制度がある事業所の求人 資格を活かせる求人</p>
                </div>

                {/* Interview Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">面談希望日</Label>
                  <p className="text-xs text-gray-500 mt-1 mb-3">
                    面談希望日を第3希望まで入力してください。
                    <br />
                    ※事業所の都合により ご希望に添えない場合があります。
                  </p>

                  <div className="space-y-4">
                    {interviewDates.map((interview, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">希望日{index + 1}</Label>
                          <div className="flex space-x-2 mt-1">
                            <Input
                              type="date"
                              className="flex-1"
                              value={interview.date}
                              onChange={(e) => updateInterviewDate(index, "date", e.target.value)}
                            />
                            <Select
                              value={interview.time}
                              onValueChange={(value) => updateInterviewDate(index, "time", value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="時" />
                              </SelectTrigger>
                              <SelectContent>
                                {hours.map((hour) => (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="self-center text-gray-500">時</span>
                            <Select>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="分" />
                              </SelectTrigger>
                              <SelectContent>
                                {minutes.map((minute) => (
                                  <SelectItem key={minute} value={minute}>
                                    {minute}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="self-center text-gray-500">分</span>
                          </div>
                        </div>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInterviewDate(index)}
                            className="mt-6"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {interviewDates.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addInterviewDate}
                      className="mt-3 text-teal-600 border-teal-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      面談候補日を追加する
                    </Button>
                  )}

                  <div className="mt-4">
                    <Button type="button" variant="ghost" className="text-teal-600 text-sm">
                      希望時間を追加する
                    </Button>
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">事業所への質問 アピールポイント等</Label>
                  <Textarea
                    placeholder="事業所への質問やアピールポイントがあれば入力してください。"
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" required className="mt-1" />
                  <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                    利用規約 個人情報の取り扱いに同意して応募します。
                    <br />
                    <Link href="#" className="text-teal-600 hover:underline">
                      利用規約
                    </Link>
                    ・
                    <Link href="#" className="text-teal-600 hover:underline">
                      個人情報の取り扱い
                    </Link>
                    をご確認ください。
                  </Label>
                </div>

                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 text-lg font-semibold"
                  >
                    応募する
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">応募完了すると事業所に応募情報が送信されます。</p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="inline-block mb-4">
            <div className="text-xl font-bold text-teal-500">ジョブメドレー</div>
          </Link>
          <p className="text-xs text-gray-500">
            医療介護従事者のための転職支援サービス 求人サイト「ジョブメドレー」を運営しています。
          </p>
        </div>
      </footer>
    </div>
  )
}
