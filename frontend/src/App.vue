<script setup lang="ts">
import { RouterView } from 'vue-router'
import TimeMachine from './components/TimeMachine.vue'
</script>

<template>
  <header>
    <TimeMachine />
  </header>

  <RouterView />
</template>

<style>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

header {
  padding: 1rem 0;
}

nav {
  padding: 1rem 0;
}

nav a {
  color: #2c3e50;
  text-decoration: none;
  padding: 0 1rem;
}

nav a.router-link-active {
  color: #42b883;
}
</style>
