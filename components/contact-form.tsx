'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm(): JSX.Element {
  const [topic, setTopic] = useState<string>('')
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      company: String(formData.get('company') || ''),
      contactName: String(formData.get('contactName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      topic: topic || String(formData.get('topic') || ''),
      detail: String(formData.get('detail') || ''),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || '送信に失敗しました')
      }
      setState('success')
      setMessage('送信が完了しました。担当者よりご連絡いたします。')
      form.reset()
      setTopic('')
    } catch (err: any) {
      setState('error')
      setMessage(err?.message || '送信に失敗しました')
    }
  }

  const isSubmitting = state === 'submitting'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 会社名（必須） */}
      <div>
        <Label htmlFor="company" className="flex items-center gap-2">
          <span>会社名</span>
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
        </Label>
        <Input id="company" name="company" required aria-required className="mt-2" />
      </div>

      {/* ご担当者名（必須） */}
      <div>
        <Label htmlFor="contactName" className="flex items-center gap-2">
          <span>ご担当者名</span>
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
        </Label>
        <Input id="contactName" name="contactName" required aria-required className="mt-2" />
      </div>

      {/* 会社のメールアドレス（必須） */}
      <div>
        <Label htmlFor="email" className="flex items-center gap-2">
          <span>会社のメールアドレス</span>
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
        </Label>
        <Input id="email" name="email" type="email" required aria-required className="mt-2" />
      </div>

      {/* 電話番号（必須） */}
      <div>
        <Label htmlFor="phone" className="flex items-center gap-2">
          <span>電話番号</span>
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
        </Label>
        <Input id="phone" name="phone" type="tel" required aria-required className="mt-2" />
      </div>

      {/* お問い合わせ内容（必須・選択） */}
      <div>
        <Label className="flex items-center gap-2">
          <span>お問い合わせ内容</span>
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
        </Label>
        <div className="mt-2">
          <Select value={topic} onValueChange={setTopic} name="topic" required>
            <SelectTrigger aria-label="お問い合わせ内容を選択">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consult">採用について相談したい</SelectItem>
              <SelectItem value="service">サービス内容を知りたい</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* お問い合わせ詳細（自由記述） */}
      <div>
        <Label htmlFor="detail">お問い合わせ詳細（自由記述）</Label>
        <Textarea id="detail" name="detail" className="mt-2 min-h-[140px]" placeholder="ご相談内容・ご要望などをご記入ください" />
      </div>

      {message && (
        <p className={state === 'success' ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>{message}</p>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-[#1f1fff] hover:bg-[#1800b6] text-white py-6 text-base md:text-lg">
          {isSubmitting ? '送信中…' : '送信'}
        </Button>
      </div>
    </form>
  )
}


