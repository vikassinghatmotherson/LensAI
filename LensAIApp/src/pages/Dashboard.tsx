import { useMemo, useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { StatCard } from '../components/dashboard/StatCard'
import { UploadImage } from '../components/dashboard/UploadImage'
import { RecentAnalysisCard } from '../components/dashboard/RecentAnalysisCard'
import { AnalysisResult } from '../components/dashboard/AnalysisResult'
import type { AnalysisResult as AnalysisResultType, ImageAsset } from '../types'

const initialAnalyses: ImageAsset[] = [
  {
    id: '1',
    name: 'Invoice',
    type: 'Document',
    size: 123000,
    uploadedAt: '2026-08-15T09:00:00.000Z',
    status: 'Processed',
    confidence: 98,
  },
  {
    id: '2',
    name: 'Landscape',
    type: 'Scene',
    size: 980000,
    uploadedAt: '2026-08-08T09:00:00.000Z',
    status: 'Processed',
    confidence: 94,
  },
  {
    id: '3',
    name: 'Product',
    type: 'Product',
    size: 756000,
    uploadedAt: '2026-08-05T09:00:00.000Z',
    status: 'Processing',
  },
]

export function Dashboard() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null)
  const stats = useMemo(
    () => [
      { label: 'Images Analyzed', value: '24' },
      { label: 'Processing', value: '2' },
      { label: 'This Month', value: '18' },
    ],
    [],
  )

  return (
    <AppLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Good morning, User</p>
            <h1>Analyze an image and discover what&apos;s inside it.</h1>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <UploadImage onAnalyze={setAnalysisResult} />

        {analysisResult ? <AnalysisResult result={analysisResult} /> : null}

        <section className="recent-section">
          <div className="section-header">
            <h2>Recent Analyses</h2>
          </div>

          <div className="recent-list">
            {initialAnalyses.length > 0 ? (
              initialAnalyses.map((item) => <RecentAnalysisCard key={item.id} item={item} />)
            ) : (
              <div className="empty-state">
                <h3>No images analyzed yet</h3>
                <p>Upload your first image to see what LensAI can discover.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
