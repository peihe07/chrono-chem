<template>
  <div class="era-view">
    <h1>Era {{ id }}</h1>
    <div class="content">
      <div class="scientists">
        <h2>Scientists</h2>
        <ul>
          <li v-for="scientist in scientists" :key="scientist.id">
            {{ scientist.name }}
          </li>
        </ul>
      </div>
      <div class="events">
        <h2>Events</h2>
        <ul>
          <li v-for="event in events" :key="event.id">
            {{ event.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Scientist {
  id: number
  name: string
}

interface Event {
  id: number
  title: string
}

const route = useRoute()
const id = route.params.id

const scientists = ref<Scientist[]>([])
const events = ref<Event[]>([])

onMounted(async () => {
  try {
    const [scientistsRes, eventsRes] = await Promise.all([
      fetch(`http://localhost:8000/api/scientists/?era=${id}`),
      fetch(`http://localhost:8000/api/events/?era=${id}`)
    ])
    scientists.value = await scientistsRes.json()
    events.value = await eventsRes.json()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<style scoped>
.era-view {
  padding: 2rem;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

h2 {
  color: #42b883;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: #f8f9fa;
  border-radius: 4px;
}
</style> 