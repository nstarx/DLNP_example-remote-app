<template>
  <button 
    @click="sayHello" 
    class="magic-button"
    :class="{ 'magic-sparkle': isSparkle }"
  >
    <span class="magic-icon">✨</span>
    {{ buttonText }}
    <span class="magic-icon">✨</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const buttonText = ref('Magic Button')
const isSparkle = ref(false)

const sayHello = () => {
  // Create sparkle effect
  isSparkle.value = true
  
  // Say hello with a fun message
  alert('✨ Hello! ✨\nMagic is happening!')
  
  // Reset sparkle effect after animation
  setTimeout(() => {
    isSparkle.value = false
  }, 500)
}
</script>

<style scoped>
.magic-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.magic-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.magic-button:active {
  transform: translateY(0);
}

.magic-button.magic-sparkle {
  animation: sparkle 0.5s ease-in-out;
}

.magic-icon {
  font-size: 18px;
  margin: 0 4px;
}

@keyframes sparkle {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .magic-button {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
  }
  
  .magic-button:hover {
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
  }
  
  .magic-button.magic-sparkle {
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.8);
  }
}
</style>