/**
 * 格式化日期為 YYYY-MM-DD 格式
 * @param date 要格式化的日期
 * @returns 格式化後的日期字符串
 */
export function formatDate(date: Date | null | undefined): string {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

/**
 * 解析日期字符串為 Date 對象
 * @param dateStr 日期字符串 (YYYY-MM-DD 格式)
 * @returns Date 對象或 null
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date
} 