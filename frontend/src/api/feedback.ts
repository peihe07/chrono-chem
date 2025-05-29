import axios from 'axios'

interface FeedbackData {
  chemist: number
  rating: number
  comment: string
}

export const feedbackApi = {
  submitFeedback: async (data: FeedbackData) => {
    const response = await axios.post('/api/feedback/', data)
    return response.data
  },

  getChemistFeedbacks: async (chemistId: number) => {
    const response = await axios.get(`/api/feedback/?chemist=${chemistId}`)
    return response.data
  }
} 