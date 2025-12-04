import { getAiInsights } from '@/api/ai/ai-insights-request'
import { LoadingSpinner } from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { useGeneralStore } from '@/stores/general/general.store'
import { Lightbulb } from 'lucide-react'

export function InsightsComponent() {
  const aiInsights = useGeneralStore((store) => store.aiInsights)
  const isLoading = useGeneralStore((store) => store.isLoading)
  return (
    <div className="flex flex-col gap-5 rounded-2xl p-4 max-w-[360px] min-w-[360px] sm:max-w-[540px] sm:min-w-[450px] font-poppins border-2 border-cyan-200 hover:shadow-md hover:shadow-cyan-700">
      <h2 className="text-xs sm:text-sm font-semibold">
        You can request AI generated insights based <br /> on the next 8 days'
        weather overview
      </h2>
      <div className="flex flex-row gap-3 justify-center">
        <Button
          className="cursor-pointer bg-stone-200"
          variant={'outline'}
          onClick={getAiInsights}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex items-center gap-1">
              <Lightbulb className="text-yellow-500" size={30} />
              Get Weather Insights
            </div>
          )}
        </Button>
      </div>
      {aiInsights && <p>{aiInsights}</p>}
    </div>
  )
}
