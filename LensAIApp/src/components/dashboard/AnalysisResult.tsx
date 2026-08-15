import type { AnalysisResult as AnalysisResultType } from '../../types'

interface AnalysisResultProps {
  result: AnalysisResultType
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <section className="analysis-result">
      <h3>Analysis Result</h3>

      <div className="result-grid">
        <div className="result-block">
          <dt>Image Type</dt>
          <dd>{result.imageType}</dd>
        </div>

        <div className="result-block">
          <dt>Detected Objects</dt>
          <dd>{result.detectedObjects.join(', ')}</dd>
        </div>

        <div className="result-block">
          <dt>Text Detected</dt>
          <dd>{result.extractedText.join(', ')}</dd>
        </div>

        <div className="result-block">
          <dt>Dominant Colors</dt>
          <dd>{result.dominantColors.join(', ')}</dd>
        </div>

        <div className="result-block full-width">
          <dt>AI Description</dt>
          <dd>{result.aiDescription}</dd>
        </div>

        <div className="result-block full-width">
          <dt>Confidence</dt>
          <dd>{result.confidence}%</dd>
        </div>
      </div>
    </section>
  )
}
