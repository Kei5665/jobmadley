import { z } from "zod"

export const applicationFormSchema = z.object({
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

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>
