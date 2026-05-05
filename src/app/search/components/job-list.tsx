"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobCard from "@/components/job-card"
import type { Job } from "@/lib/types"

interface JobListProps {
  jobs: Job[]
}

export default function JobList({ jobs }: JobListProps) {
  return (
    <Tabs defaultValue="recommended" className="mb-8">
      <TabsContent value="recommended" className="mt-6">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">該当する求人がありません</div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} horizontal />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="newest">
        <div className="text-center py-8 text-gray-500">新着順の求人一覧がここに表示されます</div>
      </TabsContent>

      <TabsContent value="nearest">
        <div className="text-center py-8 text-gray-500">自宅に近い順の求人一覧がここに表示されます</div>
      </TabsContent>
    </Tabs>
  )
} 