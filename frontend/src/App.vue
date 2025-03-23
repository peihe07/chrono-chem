<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <router-link to="/era/1">1774</router-link> |
      <router-link to="/era/2">1869</router-link> |
      <router-link to="/era/3">1898</router-link>
    </nav>
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
