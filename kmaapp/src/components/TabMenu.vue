<template>
  <div class="wrapper">
      <div class="tabs">
        <div v-for="(tab, index) in tabs" :key="index" @click="selectedTab = index"
          :class="{ active: selectedTab === index }">
          {{ tab.title }}
        </div>
      </div>
      <div class="tab-content">
        <component :is="tabs[selectedTab].component"></component>
      </div>
  </div>
</template>
  
<script>
import Chung from './Chung'
export default {
  name: "TabMenu",
  data() {
    return {
      selectedTab: 0,
      tabs: [
        { title: 'Chung', component: 'Chung' },
        { title: 'Công Tác', component: 'Chung' },
        { title: 'Đào Tạo', component: 'Chung' },
        { title: 'Khen Thưởng', component: 'Chung' },
        { title: 'Kỷ Luật', component: 'Chung' },
      ],
    }
  },
  components: {
    Chung,
  },
}
</script>
  
<style scoped>
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid gray;
  width: 95%;
  height: 90%;
}
.tabs {
  display: flex;
}

.tabs>div {
  padding: 15px;
  cursor: pointer;
  background-color: #f5f5f5;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
}

.tabs>div.active {
  background-color: #006aa3;
  color: white;
}

.tab-content {
  padding: 10px;
}

</style>
