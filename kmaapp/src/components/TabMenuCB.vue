<template>
  <div class="wrapper">
    <div class="header">
      <h2>hhgg</h2>
      <div class="combo-action">
        <NcButton v-show="!edit" :disabled="disabled" :readonly="readonly" type="primary" :wide="true"
          @click="changeEdit">
          <template #icon>
            <PencilOutline :size="20" />
          </template>
          <template>Chỉnh sửa hồ sơ</template>
        </NcButton>
        <NcButton v-show="!edit" :disabled="disabled" :readonly="readonly" type="error" :wide="true" @click="edit = true">
          <template #icon>
            <ArrowUpDropCircleOutline :size="20" />
          </template>
          <template>Quay lại</template>
        </NcButton>
        <NcButton v-show="edit" :disabled="disabled" :readonly="readonly" type="error" :wide="true" @click="edit = false">
          <template #icon>
            <PencilOutline :size="20" />
          </template>
          <template>Hủy</template>
        </NcButton>
        <NcButton v-show="edit" :disabled="disabled" :readonly="readonly" type="primary" :wide="true"
          @click="changeSave">
          <template #icon>
            <ArrowUpDropCircleOutline :size="20" />
          </template>
          <template>Lưu</template>
        </NcButton>
      </div>
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
        <component :save="save" :edit="edit" :kma_uid="kma_uid" :is="tabs[selectedTab].component"></component>
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
import PencilOutline from 'vue-material-design-icons/PencilOutline'
import ArrowUpDropCircleOutline from 'vue-material-design-icons/ArrowUpDropCircleOutline'
import { NcButton } from "@nextcloud/vue";

export default {
  name: "TabMenuCB",
  data() {
    return {
      edit: false,
      save: true,
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
  props: ['kma_uid'],
  computed: {
    fullName() {
      // return this.$route.query.full_name
    }
  },
  components: {
    ThongTinChung,
    QTCongTac,
    QTDaoTao,
    QTKhenThuong,
    QTKyLuat,
    ThanNhan,
    PencilOutline,
    ArrowUpDropCircleOutline,
    NcButton
  },
  methods: {
    changeEdit() {
      this.edit = true
      this.save = false
      console.log(this.kma_uid)
    },
    changeSave() {
      this.save = true
      this.edit = false
    },
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
