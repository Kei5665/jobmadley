"use client"

import React, { useRef, useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Checkbox } from "@/shared/ui/checkbox"
import SiteHeader from "@/shared/components/site-header"
import SiteFooter from "@/shared/components/site-footer"
import type { ApplicationFormData, JobDetail } from "@/shared/types"
import { applicationFormSchema, type ApplicationFormValues } from "@/features/application/schema"
import { useApplySourceCapture } from "@/features/application/hooks/useApplySourceCapture"
import {
  buildBirthDate,
  postApplication,
  pushStandbyCv,
  resolveApplyContext,
} from "@/features/application/lib/submitApplication"

export interface ApplicationFormPageProps {
  job: JobDetail | null
}

export default function ApplicationFormPage({ job }: ApplicationFormPageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
  })

  const [agreement, setAgreement] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const hasPushedStandbyCv = useRef(false)

  useApplySourceCapture()

  const onSubmit = async (data: ApplicationFormValues) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const { applicationSource, jobUrl, utmSource, utmMedium } = resolveApplyContext()

      const applicationData: ApplicationFormData = {
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana,
        firstNameKana: data.firstNameKana,
        birthDate: buildBirthDate(data.birthYear, data.birthMonth, data.birthDay),
        phone: data.phone,
        email: data.email,
        companyName: job?.companyName || "",
        jobName: job?.jobName || "",
        jobUrl,
        applicationSource,
        utmSource,
        utmMedium,
      }

      await postApplication({
        ...applicationData,
        jobId: job?.id ?? "",
        applyEmail: job?.applyEmail ?? "",
        applicationSource,
      })

      if (applicationSource === "standby" && !hasPushedStandbyCv.current) {
        pushStandbyCv({
          jobId: job?.id ?? "",
          jobName: job?.jobName ?? "",
          companyName: job?.companyName ?? "",
          jobUrl,
          source: applicationSource,
        })
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
