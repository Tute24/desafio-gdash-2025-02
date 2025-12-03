import { getFile } from '@/api/weather/get-file-request'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'

export function FilesDownloader() {
  async function fileDownloadHandler(type: 'csv' | 'xlsx') {
    const response = await getFile(type)
    if (!response.success) {
      window.alert(`Couldn't download the file. Try again later.`)
    }
  }
  return (
    <div className="flex flex-col gap-5 max-w-[250px] border-2 rounded-2xl border-cyan-200 ml-5 py-5 sm:px-2 font-inter text-center">
      <h2 className="text-xs sm:text-sm font-semibold">
        You can export the weather data by clicking on the buttons below:
      </h2>
      <div className="flex flex-row gap-3 justify-center">
        <Button
          className="cursor-pointer bg-stone-200"
          variant={'outline'}
          onClick={() => fileDownloadHandler('xlsx')}
        >
          <Download />
          xlsx
        </Button>
        <Button
          className="cursor-pointer bg-stone-200"
          variant={'outline'}
          onClick={() => fileDownloadHandler('csv')}
        >
          <Download />
          csv
        </Button>
      </div>
    </div>
  )
}
