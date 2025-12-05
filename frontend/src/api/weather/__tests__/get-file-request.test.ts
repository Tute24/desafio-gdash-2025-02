import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest'

import { useGeneralStore } from '@/stores/general/general.store'
import { AxiosApi } from '@/api/axios-api'
import RequestErrorHandler from '@/api/request-error-handler'
import { getFile } from '../get-file-request'

vi.mock('@/api/axios-api')
vi.mock('@/api/request-error-handler')
vi.mock('@/stores/general/general.store')

const mockUseGeneralStore = useGeneralStore.getState as unknown as Mock
const mockAxiosApi = AxiosApi as Mock
const mockRequestErrorHandler = RequestErrorHandler as Mock

const mockCreateObjectURL = vi.fn(() => 'mock-url')
const mockRevokeObjectURL = vi.fn()

globalThis.URL.createObjectURL = mockCreateObjectURL
globalThis.URL.revokeObjectURL = mockRevokeObjectURL

const mockClick = vi.fn()
const mockRemove = vi.fn()

vi.stubGlobal('document', {
  createElement: vi.fn(() => ({
    href: '',
    download: '',
    click: mockClick,
    remove: mockRemove,
  })),
  body: {
    appendChild: vi.fn(),
  },
})

describe('getFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle successfull request', async () => {
    const mockSetIsLoading = vi.fn()

    mockUseGeneralStore.mockReturnValue({
      setIsLoading: mockSetIsLoading,
    })

    const mockBlob = new Uint8Array([1, 2, 3])

    mockAxiosApi.mockResolvedValueOnce({
      status: 200,
      data: mockBlob,
    })

    const result = await getFile('csv')

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true)

    expect(mockAxiosApi).toHaveBeenCalledWith({
      httpMethod: 'get',
      route: 'weather/csv',
      responseType: 'blob',
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockClick).toHaveBeenCalled()
    expect(mockRemove).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalled()

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false)
    expect(result).toEqual({ success: true })
  })

  it('should return success false when status is not 200', async () => {
    const mockSetIsLoading = vi.fn()

    mockUseGeneralStore.mockReturnValue({
      setIsLoading: mockSetIsLoading,
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 500,
      data: null,
    })

    const result = await getFile('xlsx')

    expect(result).toEqual({ success: false })
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(mockClick).not.toHaveBeenCalled()
  })

  it('should call RequestErrorHandler on API error', async () => {
    const mockSetIsLoading = vi.fn()

    mockUseGeneralStore.mockReturnValue({
      setIsLoading: mockSetIsLoading,
    })

    const error = new Error('mock error')

    mockAxiosApi.mockRejectedValueOnce(error)

    const result = await getFile('csv')

    expect(mockRequestErrorHandler).toHaveBeenCalledWith({ error })
    expect(result).toEqual({ success: false })
  })
})
