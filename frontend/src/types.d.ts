declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Era {
  id: number;
  title: string;
  description: string;
}

interface Scientist {
  id: number;
  name: string;
  era: number;
  description: string;
}

interface Event {
  id: number;
  title: string;
  era: number;
  date: string;
  description: string;
} 