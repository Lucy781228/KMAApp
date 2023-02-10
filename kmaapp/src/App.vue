<template>
  <NcContent id="content" app-name="kmaapp">
    <NcAppNavigation >
      <div class="nav">
        <NcAppNavigationItem id="quanlyhoso" :exact="true" :title="t('kmaapp', 'Quản lý hồ sơ')" to="/apps/kmaapp/quanlyhoso">
        <template #icon>
          <BookOutline :size="20" />
        </template>
      </NcAppNavigationItem>
      <NcAppNavigationItem  id="thongtincanbo" :exact="true" :title="t('kmaapp', 'Tìm kiếm')">
        <template #icon>
          <Magnify :size="20" />
        </template>
      </NcAppNavigationItem>
      </div>
    </NcAppNavigation>
    <NcAppContent class="parent">
      <router-view />
    </NcAppContent>
  </NcContent>
</template>

<script>
import { NcAppContent } from "@nextcloud/vue";
import { NcAppNavigation } from "@nextcloud/vue";
import { NcAppNavigationItem } from "@nextcloud/vue";
import { NcContent } from "@nextcloud/vue";
import BookOutline from 'vue-material-design-icons/BookOutline'
import Magnify from 'vue-material-design-icons/Magnify'
import TabMenu from "./components/TabMenu";
import axios from "@nextcloud/axios";
export default {
  name: "App",
  components: {
    NcAppContent,
    NcAppNavigation,
    NcAppNavigationItem,
    NcContent,
    BookOutline,
    Magnify,
  },
};
</script>

<style scoped>
.nav {
  margin: 10px;
}

.parent {
  position: relative;
}

</style>
