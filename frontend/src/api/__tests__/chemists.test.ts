import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { getChemists, getEvents, sendMessage } from '../chemists'

describe('Chemists API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('應該能獲取化學家列表', async () => {
    const mockChemists = [
      {
        id: 1,
        name: '約瑟夫·普利斯特里',
        birth_year: 1733,
        death_year: 1804,
        nationality: '英國',
        major_achievements: '發現氧氣',
        discoveries: ['氧氣'],
        image_url: '/images/priestley.jpg',
        model_url: '/models/priestley_lab.glb',
        era: 1
      }
    ]

    const getSpy = vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockChemists })

    const result = await getChemists()
    expect(result).toEqual(mockChemists)
    expect(getSpy).toHaveBeenCalledWith('/chemists/')
  })

  it('應該能獲取特定年份的事件', async () => {
    const mockEvents = [
      {
        id: 1,
        year: 1774,
        title: '發現氧氣',
        description: '普利斯特里發現氧氣',
        significance: '開啟了現代化學的新紀元',
        related_chemists: [1]
      }
    ]

    const getSpy = vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockEvents })

    const result = await getEvents(1774)
    expect(result).toEqual(mockEvents)
    expect(getSpy).toHaveBeenCalledWith('/events/?year=1774')
  })

  it('應該能發送訊息給化學家', async () => {
    const mockResponse = {
      status: 'success',
      data: {
        message: '你好！我是普利斯特里。'
      },
      message: '訊息發送成功'
    }

    const postSpy = vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: mockResponse })

    const result = await sendMessage(1, '你好')
    expect(result).toEqual(mockResponse)
    expect(postSpy).toHaveBeenCalledWith(
      '/chemists/1/send_message/',
      {
        content: '你好'
      }
    )
  })
}) 