import type { ImageAsset } from '../../types'

interface RecentAnalysisCardProps {
  item: ImageAsset
}

export function RecentAnalysisCard({ item }: RecentAnalysisCardProps) {
  const statusLabel = item.confidence ? `${item.status} · ${item.confidence}%` : item.status

  return (
    <div className="recent-card">
      <div className="recent-thumb" aria-label={`${item.name} preview`}>
        {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt={item.name} /> : <span>{item.name.charAt(0).toUpperCase()}</span>}
      </div>

      <div className="recent-body">
        <div className="recent-header-row">
          <h4>{item.name}</h4>
        </div>
        <p className="recent-type">{item.type}</p>
        <p className="recent-meta">
          <span>{statusLabel}</span>
        </p>
        <p className="recent-date">{new Date(item.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </div>
  )
}
