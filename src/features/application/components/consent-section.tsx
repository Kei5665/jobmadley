"use client"

import Link from "next/link"
import type { FieldErrors } from "react-hook-form"
import { Checkbox } from "@/shared/ui/checkbox"
import type { ApplicationFormValues } from "@/features/application/schema"

type ConsentSectionProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  errors: FieldErrors<ApplicationFormValues>
}

export function ConsentSection({ checked, onChange, errors }: ConsentSectionProps) {
  return (
    <>
      <div className="flex items-start justify-center space-x-2">
        <Checkbox
          id="agreement"
          checked={checked}
          onCheckedChange={(value) => onChange(value as boolean)}
        />
        <label htmlFor="agreement" className="text-sm leading-5">
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            利用規約・個人情報の取り扱い
          </Link>
          について同意します。
        </label>
      </div>
      {errors.agreement && (
        <p className="text-red-500 text-sm">{errors.agreement.message}</p>
      )}
    </>
  )
}
