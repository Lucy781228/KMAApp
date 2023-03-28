<template>
  <div class="wrapper">
    <div class="header">
      <h2>{{ user[0].full_name }}</h2>
    </div>
    <br>
    <div class="tab-border">
      <div class="tabs">
        <div v-for="(tab, index) in tabs" :key="index" @click="selectedTab = index"
          :class="{ active: selectedTab === index }">
          {{ tab.title }}
        </div>
      </div>
      <div class="tab-content">
        <component @user-updated="updateDataUser" @business-updated="updateDataBusiness" @education-updated="updateDataEducation"
        @khenthuong-updated="updateDataKhenThuong" @kyluat-updated="updateDataKyLuat" @relation-updated="updateDataRelation"
        :business="business" :kma_uid="kma_uid" :education="education" :kyLuat="kyLuat" :khenThuong="khenThuong" :relation="relation"
          :is="tabs[selectedTab].component">
        </component>
      </div>
    </div>

  </div>
</template>
  
<script>
import QTCongTac from './QTCongTac'
import ThongTinChung from './ThongTinChung'
import QTDaoTao from './QTDaoTao'
import QTKyLuat from './QTKyLuat'
import QTKhenThuong from './QTKhenThuong'
import ThanNhan from './ThanNhan'
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'

export default {
  name: "TabMenuCB",
  data() {
    return {
      user: [],
      business: [],
      education: [],
      khenThuong: [],
      kyLuat: [],
      bonus: [],
      relation: [],
      selectedTab: 0,
      tabs: [
        { title: 'Thông tin chung', component: 'ThongTinChung' },
        { title: 'Quá trình công tác', component: 'QTCongTac' },
        { title: 'Quá trình đào tạo', component: 'QTDaoTao' },
        { title: 'Quá trình khen thưởng', component: 'QTKhenThuong' },
        { title: 'Quá trình kỷ luật', component: 'QTKyLuat' },
        { title: 'Hồ sơ thân nhân', component: 'ThanNhan' },
      ],
    }
  },
  props: ['kma_uid',],

  mounted() {
    this.fetchUsers()
    this.fetchBusinesses()
    this.fetchEducations()
    this.fetchKhenThuong()
    this.fetchKyLuat()
    this.fetchRelations()
  },
  components: {
    ThongTinChung,
    QTCongTac,
    QTDaoTao,
    QTKhenThuong,
    QTKyLuat,
    ThanNhan,
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/kma_user/' + this.kma_uid))
        console.log(response.data.users)
        this.user = response.data.users
        console.log(this.user)
      } catch (e) {
        console.error(e)
      }
    },
    async fetchBusinesses() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/kma_business_by_uid/' + this.kma_uid))
        this.business = response.data.businesses
        console.log(this.business)
      } catch (e) {
        console.error(e)
      }
    },
    async fetchRelations() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/kma_relation_by_uid/' + this.kma_uid))
        this.relation = response.data.relations
      } catch (e) {
        console.error(e)
      }
    },

    async fetchEducations() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/kma_education_by_uid/' + this.kma_uid))
        this.education = response.data.educations
      } catch (e) {
        console.error(e)
      }
    },

    async fetchKhenThuong() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/kma_bonus_by_uid/' + this.kma_uid))
        this.bonus = response.data.bonuses
        this.khenThuong = this.bonus.filter((e) => e.type === 1)
      } catch (e) {
        console.error(e)
      }
    },

    async fetchKyLuat() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/kma_bonus_by_uid/' + this.kma_uid))
        this.bonus = response.data.bonuses
        this.kyLuat = this.bonus.filter((e) => e.type === 0)
      } catch (e) {
        console.error(e)
      }
    },

    updateDataUser(user) {
      this.user = user
    },

    updateDataBusiness(business) {
      this.business = business
    },

    updateDataEducation(education) {
      this.education = education
    },

    updateDataRelation(relation) {
      this.relation = relation
    },

    updateDataKhenThuong(khenThuong) {
      this.khenThuong = khenThuong
    },

    updateDataKyLuat(kyLuat) {
      this.kyLuat = kyLuat
    }
  },
}
</script>
  
<style scoped>
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  height: 85%;
}

.tab-border {
  border: 1px solid gray;
  width: 100%;
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

.combo-action {
  position: absolute;
  right: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  grid-gap: 15px;
}

.header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  grid-gap: 45%;
  width: 100%;
}
</style>
