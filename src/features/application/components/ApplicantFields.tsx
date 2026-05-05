"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Input } from "@/shared/ui/input"
import type { ApplicationFormValues } from "@/features/application/schema"

type ApplicantFieldsProps = {
  register: UseFormRegister<ApplicationFormValues>
  errors: FieldErrors<ApplicationFormValues>
}

/**
 * 氏名 / ふりがな / 電話番号 / メールアドレス を一括で描画する。
 * 生年月日と同意チェックは別コンポーネント。
 */
export function ApplicantFields({ register, errors }: ApplicantFieldsProps) {
  return (
    <>
      {/* 氏名 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <label className="text-sm font-medium text-gray-700 md:text-right md:pt-2">
          氏名 <span className="text-red-500">必須</span>
        </label>
        <div className="md:col-span-3 flex gap-2">
          <div className="flex-1">
            <Input placeholder="姓" {...register("lastName")} className="w-full" />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
          <div className="flex-1">
            <Input placeholder="名" {...register("firstName")} className="w-full" />
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
            <Input placeholder="せい" {...register("lastNameKana")} className="w-full" />
            {errors.lastNameKana && (
              <p className="text-red-500 text-sm mt-1">{errors.lastNameKana.message}</p>
            )}
          </div>
          <div className="flex-1">
            <Input placeholder="めい" {...register("firstNameKana")} className="w-full" />
            {errors.firstNameKana && (
              <p className="text-red-500 text-sm mt-1">{errors.firstNameKana.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 電話番号 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <label className="text-sm font-medium text-gray-700 md:text-right md:pt-2">
          電話番号 <span className="text-red-500">必須</span>
        </label>
        <div className="md:col-span-3">
          <Input placeholder="例: 09012345678" {...register("phone")} className="w-full" />
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
          <Input placeholder="例: example@gmail.com" {...register("email")} className="w-full" />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
    </>
  )
}
