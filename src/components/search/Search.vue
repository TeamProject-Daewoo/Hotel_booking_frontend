<script setup>
</script>
<template>
    <div class="search-container">
        <button @click="search"><i class="fa-solid fa-magnifying-glass"></i> 어떤 숙소를 찾고 계세요?</button>
    </div>
</template>
<script>
export default {
    methods: {
        search() {
            this.$router.push('/search')
        }
    }
}
</script>
<style scoped>
.search-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;

  width: 100%;
  max-width: 600px;
  padding: 1.2rem 2rem;

  font-size: 1.1rem;
  font-weight: 500;
  text-align: left;
  color: rgba(255, 255, 255, 0.9);

  background: rgba(255, 255, 255, 0.15);
  border-style: none;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);

  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.25);
}

button > i {
  font-size: 1.2rem;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>