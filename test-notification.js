// スタンバイ整備士応募通知のテストスクリプト

function buildInternalLarkCard(input, isMechanic = false) {
  const appliedAt = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
  const normalizedSource = (input.applicationSource ?? (typeof input.jobUrl === 'string' && input.jobUrl.includes('source=standby') ? 'standby' : undefined))?.trim().toLowerCase()
  const isStandby = normalizedSource === 'standby'

  const details = [
    `1. 氏名: ${input.lastName ?? ''} ${input.firstName ?? ''}`,
    `2. ふりがな: ${input.lastNameKana ?? ''} ${input.firstNameKana ?? ''}`,
    `3. 生年月日: ${input.birthDate ?? ''}`,
    `4. 電話番号: ${input.phone ?? ''}`,
    `5. メールアドレス: ${input.email ?? ''}`,
  ].join('\n')

  const jobLines = []
  if (input.companyName || input.jobName || input.jobUrl || input.jobId) {
    jobLines.push(
      `会社名: ${input.companyName ?? '—'}`,
      `求人名: ${input.jobName ?? '—'}`,
      `求人URL: ${input.jobUrl ?? `https://ridejob.jp/job/${input.jobId ?? '—'}`}`,
    )
  }

  const utmLines = []
  if (input.utmSource || input.utmMedium) {
    if (input.utmSource) utmLines.push(`流入元: ${input.utmSource}`)
    if (input.utmMedium) utmLines.push(`メディア: ${input.utmMedium}`)
  }

  let titleEmoji = '🟦'
  let titleText = 'ライドジョブ求人サイトから応募がありました！'

  if (isMechanic && isStandby) {
    titleEmoji = '🔧'
    titleText = 'スタンバイから整備士の応募がありました！'
  } else if (isMechanic) {
    titleEmoji = '🔧'
    titleText = 'ライドジョブ求人サイトから整備士の応募がありました！'
  } else if (isStandby) {
    titleEmoji = '🟦'
    titleText = 'スタンバイからの応募がありました！'
  }

  return {
    msg_type: "interactive",
    card: {
      elements: [
        { tag: "div", text: { tag: "lark_md", content: `**${titleEmoji} ${titleText}**\n応募日時: ${appliedAt}` } },
        { tag: "hr" },
        { tag: "div", text: { tag: "lark_md", content: `**📋 応募内容**\n${details}` } },
        ...(jobLines.length > 0 ? [
          { tag: "hr" },
          { tag: "div", text: { tag: "lark_md", content: `**💼 求人情報**\n${jobLines.join('\n')}` } },
        ] : []),
        ...(utmLines.length > 0 ? [
          { tag: "hr" },
          { tag: "div", text: { tag: "lark_md", content: `**📊 流入経路**\n${utmLines.join('\n')}` } },
        ] : []),
      ]
    }
  }
}

// テストケース
const testCases = [
  {
    name: '1. スタンバイから整備士求人への応募',
    input: {
      lastName: '山田',
      firstName: '太郎',
      lastNameKana: 'やまだ',
      firstNameKana: 'たろう',
      birthDate: '1990-01-01',
      phone: '090-1234-5678',
      email: 'test@example.com',
      companyName: 'テスト株式会社',
      jobName: '整備士募集（未経験歓迎）',
      jobUrl: 'https://ridejob.jp/job/123?source=standby',
      applicationSource: 'standby',
      utmSource: 'google',
      utmMedium: 'cpc'
    },
    isMechanic: true
  },
  {
    name: '2. 通常ルートから整備士求人への応募',
    input: {
      lastName: '鈴木',
      firstName: '花子',
      lastNameKana: 'すずき',
      firstNameKana: 'はなこ',
      birthDate: '1985-05-15',
      phone: '080-9876-5432',
      email: 'test2@example.com',
      companyName: 'サンプル自動車',
      jobName: '自動車整備士',
      jobUrl: 'https://ridejob.jp/job/456',
      utmSource: 'facebook',
      utmMedium: 'social'
    },
    isMechanic: true
  },
  {
    name: '3. スタンバイから通常求人への応募',
    input: {
      lastName: '佐藤',
      firstName: '次郎',
      lastNameKana: 'さとう',
      firstNameKana: 'じろう',
      birthDate: '1992-12-20',
      phone: '070-1111-2222',
      email: 'test3@example.com',
      companyName: '運送会社ABC',
      jobName: 'ドライバー募集',
      jobUrl: 'https://ridejob.jp/job/789?source=standby',
      applicationSource: 'standby'
    },
    isMechanic: false
  },
  {
    name: '4. 通常ルートから通常求人への応募',
    input: {
      lastName: '田中',
      firstName: '三郎',
      lastNameKana: 'たなか',
      firstNameKana: 'さぶろう',
      birthDate: '1988-08-08',
      phone: '090-3333-4444',
      email: 'test4@example.com',
      companyName: '配送センター',
      jobName: '配送ドライバー',
      jobUrl: 'https://ridejob.jp/job/999'
    },
    isMechanic: false
  }
]

console.log('='.repeat(80))
console.log('スタンバイ整備士応募通知テスト')
console.log('='.repeat(80))
console.log()

testCases.forEach((testCase, index) => {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`テストケース ${index + 1}: ${testCase.name}`)
  console.log('='.repeat(80))

  const card = buildInternalLarkCard(testCase.input, testCase.isMechanic)

  // タイトル部分を抽出して表示
  const titleContent = card.card.elements[0].text.content
  console.log('\n【通知タイトル】')
  console.log(titleContent)

  // 詳細を表示
  console.log('\n【カード全体】')
  console.log(JSON.stringify(card, null, 2))
})

console.log('\n' + '='.repeat(80))
console.log('テスト完了')
console.log('='.repeat(80))
