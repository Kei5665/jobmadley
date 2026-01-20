"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import type { ApplicationFormData, JobDetail } from "@/lib/types"

// 応募フォームのバリデーションスキーマ
const schema = z.object({
  lastName: z.string().min(1, "姓を入力してください"),
  firstName: z.string().min(1, "名を入力してください"),
  lastNameKana: z.string().min(1, "姓（カナ）を入力してください"),
  firstNameKana: z.string().min(1, "名（カナ）を入力してください"),
  birthYear: z.string().min(1, "生年月日を入力してください"),
  birthMonth: z.string().min(1, "生年月日を入力してください"),
  birthDay: z.string().min(1, "生年月日を入力してください"),
  phone: z.string().min(1, "電話番号を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  agreement: z.boolean().refine((val) => val === true, "利用規約に同意してください"),
})

type FormData = z.infer<typeof schema>

export interface ApplicationFormPageProps {
  job: JobDetail | null
}

export default function ApplicationFormPage({ job }: ApplicationFormPageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const [agreement, setAgreement] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const hasPushedStandbyCv = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const stbUid = searchParams.get("stb_uid")
      if (stbUid) {
        window.localStorage.setItem("stb_uid", stbUid)
      }
      const rawSource = searchParams.get("source")
      const normalizedSource = rawSource?.trim().toLowerCase()
      if (normalizedSource) {
        window.localStorage.setItem("application_source", normalizedSource)
      }
    } catch (_) {
      // Ignore storage or URL parsing errors.
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const birthDate = `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`
      let applicationSource = "unknown"
      let jobUrl = ""
      let utmSource = ""
      let utmMedium = ""

      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search)
        const rawSource = searchParams.get("source")
        const normalizedSource = rawSource?.trim().toLowerCase()
        const storedSource = window.localStorage.getItem("application_source")?.trim().toLowerCase()
        applicationSource = normalizedSource || storedSource || "unknown"
        const shouldUpdateUrl = Boolean(rawSource)
        if (!rawSource && storedSource) {
          searchParams.set("source", storedSource)
        }
        jobUrl = `${window.location.origin}${window.location.pathname}`
        const queryString = searchParams.toString()
        if (queryString) {
          jobUrl = `${jobUrl}?${queryString}`
        }
        if (shouldUpdateUrl && window.history && window.history.replaceState) {
          window.history.replaceState(null, "", jobUrl)
        }

        // CookieからUTM情報を取得
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
          const [key, value] = cookie.split("=")
          acc[key] = decodeURIComponent(value)
          return acc
        }, {} as Record<string, string>)

        utmSource = cookies.utm_source || ""
        utmMedium = cookies.utm_medium || ""

        if (utmSource || utmMedium) {
          console.log("[UTM] Retrieved from cookies:", { utmSource, utmMedium })
        }
      }

      const applicationData: ApplicationFormData = {
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana,
        firstNameKana: data.firstNameKana,
        birthDate,
        phone: data.phone,
        email: data.email,
        companyName: job?.companyName || "",
        jobName: job?.jobName || "",
        jobUrl,
        applicationSource,
        utmSource,
        utmMedium,
      }

      const payload = {
        ...applicationData,
        jobId: job?.id ?? "",
        applicationSource,
      }

      await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (typeof window !== "undefined" && applicationSource === "standby" && !hasPushedStandbyCv.current) {
        const win = window as typeof window & { 
          dataLayer?: Record<string, unknown>[]
          STANBY_CV?: { send: (siteCode: string, accountId: string) => void }
        }
        win.dataLayer = win.dataLayer ?? []
        win.dataLayer.push({
          event: "standby_cv_submit",
          jobId: job?.id ?? "",
          jobName: job?.jobName ?? "",
          companyName: job?.companyName ?? "",
          jobUrl,
          source: applicationSource,
        })
        
        // スタンバイCV送信
        if (win.STANBY_CV && win.STANBY_CV.send) {
          win.STANBY_CV.send('ridejob-jp', '2171143810634182656')
        }
        
        hasPushedStandbyCv.current = true
      }
      window.location.href = "https://ridejob.pmagent.jp/applicants/new"
    } catch (err) {
      alert("応募送信に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  // 年の選択肢を生成 (1950年〜今年)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i)
  
  // 月の選択肢を生成 (1〜12月)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  
  // 日の選択肢を生成 (1〜31日)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-white">
      <Script
        id="standby-cv-tracker"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(){window.STANBY_CV=window.STANBY_CV||{},window.STANBY_CV.send=function(t,n){try{var e=new XMLHttpRequest;e.open("POST",i),e.setRequestHeader("Content-Type","application/json"),e.withCredentials=!0,e.timeout=1e4,e.send(function(t,n){var e=window.localStorage.getItem("stb_uid");return JSON.stringify({siteCode:t,accountId:n||null,uid:e||null,trackingVersion:"2"})}(t,n))}catch(t){}};var i="https://cv-tracker.stanby.com/v1/cv"}();`
        }}
      />
      <SiteHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 求人情報表示 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {job?.companyName} {job?.jobName} に応募する
          </h1>
        </div>

        {/* 基本情報セクション */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 氏名 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="text-sm font-medium text-gray-700 md:text-right md:pt-2">
                氏名 <span className="text-red-500">必須</span>
              </label>
              <div className="md:col-span-3 flex gap-2">
                <div className="flex-1">
                  <Input 
                    placeholder="姓" 
                    {...register("lastName")}
                    className="w-full"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="名" 
                    {...register("firstName")}
                    className="w-full"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ふりがな */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="text-sm font-medium text-gray-700 md:text-right md:pt-2">
                ふりがな <span className="text-red-500">必須</span>
              </label>
              <div className="md:col-span-3 flex gap-2">
                <div className="flex-1">
                  <Input 
                    placeholder="せい" 
                    {...register("lastNameKana")}
                    className="w-full"
                  />
                  {errors.lastNameKana && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastNameKana.message}</p>
                  )}
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="めい" 
                    {...register("firstNameKana")}
                    className="w-full"
                  />
                  {errors.firstNameKana && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstNameKana.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 生年月日 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="text-sm font-medium text-gray-700 md:text-right md:pt-2">
                生年月日 <span className="text-red-500">必須</span>
              </label>
              <div className="md:col-span-3">
                <div className="text-sm text-gray-600 mb-2">西暦</div>
                <div className="flex gap-2 items-center">
                  <Select onValueChange={(value) => setValue("birthYear", value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="年" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm">年</span>
                  
                  <Select onValueChange={(value) => setValue("birthMonth", value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="月" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm">月</span>
                  
                  <Select onValueChange={(value) => setValue("birthDay", value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="日" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm">日</span>
                </div>
                {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
                  <p className="text-red-500 text-sm mt-1">生年月日を入力してください</p>
                )}
              </div>
            </div>

            {/* 電話番号 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="text-sm font-medium text-gray-700 md:text-right md:pt-2">
                電話番号 <span className="text-red-500">必須</span>
              </label>
              <div className="md:col-span-3">
                <Input 
                  placeholder="例: 09012345678" 
                  {...register("phone")}
                  className="w-full"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* メールアドレス */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="text-sm font-medium text-gray-700 md:text-right md:pt-2">
                メールアドレス <span className="text-red-500">必須</span>
              </label>
              <div className="md:col-span-3">
                <Input 
                  placeholder="例: example@gmail.com" 
                  {...register("email")}
                  className="w-full"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* 利用規約同意 */}
            <div className="flex items-start justify-center space-x-2">
              <Checkbox 
                id="agreement"
                checked={agreement}
                onCheckedChange={(checked) => {
                  setAgreement(checked as boolean)
                  setValue("agreement", checked as boolean)
                }}
              />
              <label htmlFor="agreement" className="text-sm leading-5">
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                  利用規約・個人情報の取り扱い
                </Link>
                について同意します。
              </label>
            </div>
            {errors.agreement && (
              <p className="text-red-500 text-sm">{errors.agreement.message}</p>
            )}

            {/* 応募ボタン */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-md text-lg font-medium"
              >
                {(isSubmitting || isLoading) ? "送信中..." : "応募する"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
} 
