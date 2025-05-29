<template>
  <div class="chemist-detail" v-if="props.isVisible">
    <div class="chemist-detail__content">
      <h2>{{ props.chemist.name }}</h2>
      <div class="chemist-detail__info">
        <p>{{ props.chemist.description }}</p>
        <div class="chemist-detail__timeline">
          <h3>重要發現</h3>
          <ul>
            <li v-for="discovery in props.chemist.discoveries" :key="discovery.id">
              {{ discovery.year }}: {{ discovery.description }}
            </li>
          </ul>
        </div>
      </div>
      <div class="chemist-detail__feedback">
        <div class="rating">
          <span v-for="star in 5" :key="star" @click="rateChemist(star)">
            ⭐
          </span>
        </div>
        <textarea v-model="comment" placeholder="分享您的想法..."></textarea>
        <button @click="submitFeedback">提交回饋</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Chemist } from '@/types/index'
import { feedbackApi } from '@/api/feedback'

const props = defineProps<{
  chemist: Chemist
  isVisible: boolean
}>()

const comment = ref('')
const rating = ref(0)

const rateChemist = (stars: number) => {
  rating.value = stars
}

const submitFeedback = async () => {
  try {
    await feedbackApi.submitFeedback({
      chemist: props.chemist.id,
      rating: rating.value,
      comment: comment.value
    })
    comment.value = ''
    rating.value = 0
  } catch (error) {
    console.error('提交回饋失敗:', error)
  }
}
</script>

<style scoped>
.chemist-detail {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
}

.chemist-detail__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chemist-detail__info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chemist-detail__timeline {
  margin-top: 1rem;
}

.chemist-detail__feedback {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rating {
  display: flex;
  gap: 0.5rem;
  cursor: pointer;
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}
</style> 