"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { X, Plus } from "lucide-react"
import type { JobDetail } from "@/lib/getJob"

interface ApplicationFormPageProps {
  job: JobDetail
}

export default function ApplicationFormPage({ job }: ApplicationFormPageProps) {
  // Generate years for birth year dropdown
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 15 - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  // フォーム状態
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastNameKana, setLastNameKana] = useState("")
  const [firstNameKana, setFirstNameKana] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!birthYear || !birthMonth || !birthDay) {
      alert("生年月日を選択してください")
      return
    }

    const jobUrl = `${window.location.origin}/job/${job.id}`

    const payload = {
      last_name: lastName,
      first_name: firstName,
      last_name_kana: lastNameKana,
      first_name_kana: firstNameKana,
      birth_date: `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`,
      phone,
      email,
      address,
      companyName: job.companyName ?? "",
      jobName: job.jobName ?? job.title ?? "",
      jobUrl,
    }

    try {
      const res = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("送信に失敗しました")

      alert("応募情報を送信しました。ご応募ありがとうございます！")
    } catch (error) {
      console.error(error)
      alert("送信中にエラーが発生しました。時間をおいて再度お試しください。")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <SiteHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {job.companyName ? `${job.companyName} ` : ""}
            {job.jobName ?? job.title} の求人に応募する
          </h1>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
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
                    <Input
                      placeholder="姓"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="名"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Furigana */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    ふりがな <span className="text-red-500">必須</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input
                      placeholder="せい"
                      value={lastNameKana}
                      onChange={(e) => setLastNameKana(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="めい"
                      value={firstNameKana}
                      onChange={(e) => setFirstNameKana(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    生年月日 <span className="text-red-500">必須</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <Select value={birthYear} onValueChange={setBirthYear} required>
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
                    <Select value={birthMonth} onValueChange={setBirthMonth} required>
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
                    <Select value={birthDay} onValueChange={setBirthDay} required>
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

                {/* Phone Number */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    電話番号 <span className="text-red-500">必須</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="例：09012345678"
                    className="mt-2"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    メールアドレス <span className="text-red-500">必須</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="例：example@email.com"
                    className="mt-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    住所 <span className="text-red-500">必須</span>
                  </Label>
                  <Input
                    placeholder="例：東京都渋谷区○○1-2-3"
                    className="mt-2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
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
      <SiteFooter />
    </div>
  )
}
