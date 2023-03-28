<template>
  <div class="wrapper">
    <div class="tabs">
      <div v-for="(tab, index) in tabs" :key="index" @click="selectedTab = index"
        :class="{ active: selectedTab === index }">
        {{ tab.title }}
      </div>
    </div>
    <div class="tab-content">
      <component :is="tabs[selectedTab].component" :users="users" :userByBusiness="userByBusiness"></component>
    </div>
  </div>
</template>
  
<script>
import Chung from './Chung'
import CongTac from './CongTac'
import DaoTao from './DaoTao'
import KhenThuong from './KhenThuong'
import KyLuat from './KyLuat'
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'

export default {
  name: "TabMenu",
  data() {
    return {
      selectedTab: 0,
      tabs: [
        { title: 'Chung', component: 'Chung' },
        { title: 'Công Tác', component: 'CongTac' },
        { title: 'Đào Tạo', component: 'DaoTao' },
        { title: 'Khen Thưởng', component: 'KhenThuong' },
        { title: 'Kỷ Luật', component: 'KyLuat' },
      ],
    }
  },
  components: {
    Chung,
    CongTac,
    DaoTao,
    KhenThuong,
    KyLuat,
  },

  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_user'))
        this.users = response.data.users

      } catch (e) {
        console.error(e)
      }
    },

    async fetchBusinesses() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_businesses'))
        this.businesses = response.data.businesses
        this.userByBusiness = this.users.filter((user) => {
          return this.businesses.some((business) => business.kma_uid === user.kma_uid)
        }
        )
      } catch (e) {
        console.error(e)
      }
    }
  }
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
