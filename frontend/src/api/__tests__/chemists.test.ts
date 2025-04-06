import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sendMessage, getChemists, getEvents } from '../chemists'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = axios as any

describe('Chemists API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('應該能獲取化學家列表', async () => {
    const mockChemists = [
      {
        id: 1,
        name: '安東尼·拉瓦錫',
        era: 1774,
        description: '法國化學家'
      }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: mockChemists })

    const result = await getChemists()
    expect(result).toEqual(mockChemists)
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/chemists/')
  })

  it('應該能獲取特定年份的事件', async () => {
    const mockEvents = [
      {
        id: 1,
        title: '發現氧氣',
        year: 1774,
        description: '拉瓦錫發現氧氣'
      }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: mockEvents })

    const result = await getEvents(1774)
    expect(result).toEqual(mockEvents)
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/events/?year=1774')
  })

  it('應該能發送訊息給化學家', async () => {
    const mockResponse = {
      user_message: { content: '測試訊息', role: 'user' },
      assistant_message: { content: '這是化學家的回應', role: 'assistant' }
    }

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse })

    const result = await sendMessage(1, '測試訊息')
    expect(result).toEqual(mockResponse)
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/chemists/1/send_message/', {
      content: '測試訊息'
    })
  })
}) 