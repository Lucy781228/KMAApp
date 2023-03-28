<template>
  <div v-if="loading"></div>
  <div v-else-if="!isAdmin">Bạn không có quyền truy cập app này.</div>
  <NcContent v-else id="content" app-name="kmaapp">
    <NcAppNavigation>
      <div class="nav">
        <NcAppNavigationItem id="quanlyhoso" :exact="true" :title="t('kmaapp', 'Quản lý hồ sơ')"
          to="/apps/kmaapp/quanlyhoso">
          <template #icon>
            <BookOutline :size="20" />
          </template>
        </NcAppNavigationItem>
        <NcAppNavigationItem id="timkiem" :exact="true" :title="t('kmaapp', 'Tìm kiếm')" to="/apps/kmaapp/timkiem">
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
import { NcAppContent, NcActions, NcActionButton, NcButton } from "@nextcloud/vue";
import { NcAppNavigation } from "@nextcloud/vue";
import { NcAppNavigationItem } from "@nextcloud/vue";
import { NcContent } from "@nextcloud/vue";
import BookOutline from 'vue-material-design-icons/BookOutline'
import Magnify from 'vue-material-design-icons/Magnify'
import TabMenu from "./components/TabMenu";
import axios from "@nextcloud/axios";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
export default {
  name: "App",
  components: {
    NcAppContent,
    NcAppNavigation,
    NcAppNavigationItem,
    NcContent,
    BookOutline,
    Magnify,
    NcActionButton,
    NcActions,
    NcButton
  },
  data() {
    return {
      isAdmin: false,
      loading: false,
      showButton: false,
    };
  },

  mounted() {
    this.checkAdmin()
  },

  methods: {
    async checkAdmin() {
      try {
        this.loading = true
        const response = await axios.get(generateUrl('apps/kmaapp/check_admin'))
        this.isAdmin = response.data.isAdmin
        this.loading = false
      } catch (e) {
        this.isAdmin = false
      }
    }
  }
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
