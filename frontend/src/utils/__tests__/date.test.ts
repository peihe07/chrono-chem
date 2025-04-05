import { describe, it, expect } from 'vitest'
import { formatDate, parseDate } from '../date'

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-03-23')
      expect(formatDate(date)).toBe('2024-03-23')
    })

    it('handles invalid date', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })
  })

  describe('parseDate', () => {
    it('parses date string correctly', () => {
      expect(parseDate('2024-03-23')).toEqual(new Date('2024-03-23'))
    })

    it('handles invalid date string', () => {
      expect(parseDate('invalid-date')).toBeNull()
    })
  })
}) 