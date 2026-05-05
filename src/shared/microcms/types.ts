/** microCMS リストレスポンス */
export interface MicroCMSListResponse<T> {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}
