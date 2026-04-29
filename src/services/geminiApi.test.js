import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getGeminiBuster } from './geminiApi'

vi.mock('@google/generative-ai', () => {
  const mockGenerateContent = vi.fn()
  class MockGoogleGenerativeAI {
    constructor() {}
    getGenerativeModel() {
      return {
        generateContentStream: mockGenerateContent
      }
    }
  }
  return {
    GoogleGenerativeAI: MockGoogleGenerativeAI,
    _mockGenerateContent: mockGenerateContent // Exported for the test to use
  }
})

// Access the shared mock via the module
import { _mockGenerateContent as mockGenerateContent } from '@google/generative-ai'

describe('geminiApi service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset env var mock for each test
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key')
  })

  it('should stream content from the model', async () => {
    const mockStream = {
      stream: [
        { text: () => 'Election' },
        { text: () => ' is a process' }
      ]
    }
    mockGenerateContent.mockResolvedValue(mockStream)

    const onChunk = vi.fn()
    const result = await getGeminiBuster('Election', null, onChunk)

    expect(onChunk).toHaveBeenCalledTimes(2)
    expect(onChunk).toHaveBeenCalledWith('Election')
    expect(onChunk).toHaveBeenCalledWith('Election is a process')
    expect(result).toBe('Election is a process')
  })

  it('should handle errors gracefully', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Failure'))

    const onChunk = vi.fn()
    await expect(getGeminiBuster('Election', null, onChunk)).rejects.toThrow()
  })

  it('should throw error if API key is missing', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '')
    // We expect the error message from the service
    await expect(getGeminiBuster('Term')).rejects.toThrow('Gemini API Key is missing')
  })
})
