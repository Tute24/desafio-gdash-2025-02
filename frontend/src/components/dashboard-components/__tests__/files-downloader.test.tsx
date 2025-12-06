import { describe, it, expect, vi, type Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { getFile } from '@/api/weather/get-file-request'
import { FilesDownloader } from '../downloader/files-downloader'

vi.mock('@/api/weather/get-file-request')

const mockGetFile = getFile as unknown as Mock

describe('FilesDownloader', () => {
  it('renders buttons for CSV and XLSX download', () => {
    render(<FilesDownloader />)

    expect(screen.getByText('xlsx')).toBeInTheDocument()
    expect(screen.getByText('csv')).toBeInTheDocument()
  })

  it('calls getFile when clicking xlsx and csv buttons', async () => {
    mockGetFile.mockResolvedValue({ success: true })

    render(<FilesDownloader />)

    fireEvent.click(screen.getByText('xlsx'))
    fireEvent.click(screen.getByText('csv'))

    await waitFor(() => {
      expect(getFile).toHaveBeenCalledWith('xlsx')
      expect(getFile).toHaveBeenCalledWith('csv')
    })
  })
})
