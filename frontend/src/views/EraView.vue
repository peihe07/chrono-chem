<template>
  <div class="era-view">
    <div class="era-header">
      <h1>{{ eraTitle }}</h1>
      <div class="era-period">{{ year }}年</div>
    </div>

    <div class="content">
      <div class="chemists-section">
        <div class="section-header">
          <h2>化學家</h2>
          <span class="count-badge">{{ chemists.length }}</span>
        </div>
        
        <div v-if="chemists.length === 0" class="empty-state">
          <div class="empty-icon">🔬</div>
          <p>該時代沒有化學家數據</p>
        </div>
        
        <div v-else class="chemists-grid">
          <div 
            v-for="chemist in chemists" 
            :key="chemist.id" 
            class="chemist-card"
            @click="selectChemist(chemist)"
          >
            <div class="chemist-image">
              <img 
                v-if="chemist.portrait_path" 
                :src="`/api${chemist.portrait_path}`" 
                :alt="chemist.name"
                @error="handleImageError"
              >
              <div v-else class="default-image">
                <span class="initials">{{ getInitials(chemist.name) }}</span>
              </div>
            </div>
            
            <div class="chemist-info">
              <h3 class="chemist-name">{{ chemist.name }}</h3>
              <div class="chemist-years">
                {{ chemist.birth_year }} - {{ chemist.death_year || '現今' }}
              </div>
              <p class="chemist-description">{{ chemist.description }}</p>
            </div>
            
            <div class="card-overlay">
              <span class="view-more">查看詳情</span>
            </div>
          </div>
        </div>
      </div>

      <div class="events-section">
        <div class="section-header">
          <h2>重要事件</h2>
          <span class="count-badge">{{ events.length }}</span>
        </div>
        
        <div v-if="events.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <p>該時代沒有重要事件</p>
        </div>
        
        <div v-else class="events-timeline">
          <div 
            v-for="event in events" 
            :key="event.id" 
            class="event-card"
          >
            <div class="event-year">{{ event.year }}年</div>
            <div class="event-content">
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ChemistDialog
      v-if="selectedChemist"
      :show="!!selectedChemist"
      :chemist="selectedChemist"
      @close="selectedChemist = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getChemists, getEvents } from '@/api/chemists'
import ChemistDialog from '@/components/ChemistDialog.vue'
import type { Chemist, HistoricalEvent, PaginatedResponse } from '@/api/chemists'

const route = useRoute()
const year = computed(() => Number(route.params.year) || 1774)
const eraTitle = computed(() => `${year.value}年代`)
const chemists = ref<Chemist[]>([])
const events = ref<HistoricalEvent[]>([])
const selectedChemist = ref<Chemist | null>(null)

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-portrait.png'
}

const selectChemist = (chemist: Chemist) => {
  selectedChemist.value = chemist
}

onMounted(async () => {
  try {
    console.log('開始載入數據，時代:', year.value)
    
    const [chemistsData, eventsData] = await Promise.all([
      getChemists(year.value),
      getEvents(year.value)
    ])
    
    console.log('化學家數據:', chemistsData)
    console.log('事件數據:', eventsData)
    
    if (chemistsData && Array.isArray(chemistsData.results)) {
      chemists.value = chemistsData.results
      console.log('設置化學家數據:', chemists.value)
    } else {
      console.warn('化學家數據格式不正確:', chemistsData)
      chemists.value = []
    }
    
    if (eventsData && Array.isArray(eventsData.results)) {
      events.value = eventsData.results
      console.log('設置事件數據:', events.value)
    } else {
      console.warn('事件數據格式不正確:', eventsData)
      events.value = []
    }
  } catch (error) {
    console.error('載入數據時發生錯誤:', error)
    chemists.value = []
    events.value = []
  }
})
</script>

<style scoped>
.era-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.era-header {
  text-align: center;
  margin-bottom: 3rem;
}

.era-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.era-period {
  font-size: 1.2rem;
  color: #666;
  margin-top: 0.5rem;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.count-badge {
  background: #42b883;
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  margin-left: 1rem;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 12px;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.chemists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.chemist-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  position: relative;
}

.chemist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.chemist-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.chemist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-image {
  width: 100%;
  height: 100%;
  background: #42b883;
  display: flex;
  align-items: center;
  justify-content: center;
}

.initials {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
}

.chemist-info {
  padding: 1.5rem;
}

.chemist-name {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.chemist-years {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.chemist-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(66, 184, 131, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.chemist-card:hover .card-overlay {
  opacity: 1;
}

.view-more {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.events-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.event-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1.5rem;
}

.event-year {
  font-size: 1.2rem;
  font-weight: bold;
  color: #42b883;
  min-width: 80px;
}

.event-content {
  flex: 1;
}

.event-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.event-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .chemists-grid {
    grid-template-columns: 1fr;
  }
  
  .era-view {
    padding: 1rem;
  }
}
</style> 