import type { JobDetail } from "@/lib/types"

interface JobDescriptionProps {
  job: JobDetail
}

export default function JobDescription({ job }: JobDescriptionProps) {
  return (
    <div className="space-y-8 mt-12 border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800">募集内容</h2>
      
      {/* アピールポイント */}
      {job.descriptionAppeal && (
        <div>
          <h3 className="text-lg border-t pt-8 font-semibold text-gray-800 mb-4">アピールポイント</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{job.descriptionAppeal}</div>
        </div>
      )}

      {/* 募集職種 */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">募集職種</h3>
        {job.jobCategory ? (
          <p className="text-gray-700">{job.jobCategory.name}</p>
        ) : (
          <p className="text-gray-700">職種情報なし</p>
        )}
      </div>

      {/* 仕事内容 */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">仕事内容</h3>
        {job.descriptionWork ? (
          <div className="text-gray-700 mb-6 whitespace-pre-wrap">{job.descriptionWork}</div>
        ) : (
          <p className="text-gray-700 mb-4">仕事内容なし</p>
        )}
      </div>

      {/* 求める人材 */}
      {job.descriptionPerson && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">求める人材</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{job.descriptionPerson}</div>
        </div>
      )}

      {/* 勤務時間 */}
      {job.workHours && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">勤務時間</h3>
          <p className="text-gray-700">{job.workHours}</p>
        </div>
      )}

      {/* 休日 */}
      {job.holidays && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">休日</h3>
          <p className="text-gray-700">{job.holidays}</p>
        </div>
      )}

      {/* 勤務地 */}
      {(job.addressPrefMuni || job.addressLine || job.addressBuilding || job.access) && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">勤務地</h3>
          <div className="space-y-2 text-gray-700">
            {job.addressZip && <p>〒{job.addressZip}</p>}
            {job.addressPrefMuni && <p>{job.addressPrefMuni}</p>}
            {job.addressLine && <p>{job.addressLine}</p>}
            {job.addressBuilding && <p>{job.addressBuilding}</p>}
            {job.access && (
              <div>
                <h4 className="font-medium mt-4 mb-2">アクセス</h4>
                <p>{job.access}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 社会保険 */}
      {job.socialInsurance && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">社会保険</h3>
          <p className="text-gray-700">{job.socialInsurance}</p>
        </div>
      )}

      {/* 福利厚生 */}
      {job.descriptionBenefits && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">福利厚生</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{job.descriptionBenefits}</div>
        </div>
      )}

      {/* その他備考 */}
      {job.descriptionOther && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">その他</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{job.descriptionOther}</div>
        </div>
      )}
    </div>
  )
} 