<template>
  <div>
    <div v-if="loading"></div>
    <div v-else-if="!usersExist">
      <br><br>
      <div :style="{ textAlign: '#center' }">
        Không có dữ liệu.
      </div>
    </div>
    <div v-else>
      <div class="wrap">
        <div class="combo-action">
          <NcButton :disabled="disabled" :readonly="readonly" type="success" :wide="true" @click="exportExcel">
            <template #icon>
              <DatabaseExportOutline :size="20" />
            </template>
            <template>Xuất Excel</template>
          </NcButton>
        </div>
        <br><br><br>
      </div>
      <table>
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Đơn vị</th>
            <th>Chức vụ</th>
            <th>Tên người dùng</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredUsers">
            <td :style="{ color: '#006aa3', fontWeight: 'bold', cursor: 'pointer' }">
              <router-link :to="{ path: '/apps/kmaapp/quanlyhoso/' + item.kma_uid }">
                {{ item.full_name }}
              </router-link>
            </td>
            <td>{{ item.date_of_birth }}</td>
            <td v-if="isMale(item.gender)">Nam</td>
            <td v-else-if="isFeMale(item.gender)">Nữ</td>
            <td v-else></td>
            <td> {{ userUnit(item.unit_id) }}</td>
            <td> {{ userPosition(item.position_id) }}</td>
            <td>{{ item.kma_uid }}</td>
            <td>{{ item.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { subscribe, unsubscribe } from "@nextcloud/event-bus";
import { NcButton, NcActions, NcActionButton } from "@nextcloud/vue";
import DatabaseExportOutline from 'vue-material-design-icons/DatabaseExportOutline'
import ViewList from 'vue-material-design-icons/ViewList'
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'

export default {
  name: "CongTac",
  components: {
    NcButton,
    NcActions,
    NcActionButton,
    ViewList,
    DatabaseExportOutline,
  },
  data() {
    return {
      loading: false,
      showComponent: false,
      show: false,
      checkedAll: false,
      selectedItems: [],
      users: [],
      businesses: [],
      userByBusiness: [],
      chucvu: [],
      donvi: [],
      gioitinh: [
        { value: 1, text: 'Nam' },
        { value: 0, text: 'Nữ' },
      ],
    };
  },

  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        return this.businesses.some((business) => business.kma_uid === user.kma_uid);
      });
    },
    usersExist() {
      return this.filteredUsers.length > 0;
    },
    userPosition() {
      return positionId => {
        const position = this.chucvu.find(
          position => position.position_id === positionId
        );
        return position ? position.position_name : '';
      };
    },
    userUnit() {
      return unitId => {
        const unit = this.donvi.find(
          unit => unit.unit_id === unitId
        );
        return unit ? unit.unit_name : '';
      };
    },
  },

  mounted() {
    this.fetchPositions()
    this.fetchUnits()
    this.fetchUsers()
    this.fetchBusinesses()
  },

  methods: {

    isMale(gender) {
      return gender == 1;
    },

    isFeMale(gender) {
      return gender == 0;
    },

    exportExcel() {
      const data = this.filteredUsers.map((item) => {
        return {
          'Họ và tên': item.full_name,
          'Ngày sinh': item.date_of_birth,
          'Giới tính': this.isMale(item.gender) ? 'Nam' : this.isFeMale(item.gender) ? 'Nữ' : '',
          'Đơn vị': this.userUnit(item.unit_id),
          'Chức vụ': this.userPosition(item.position_id),
          'Tên người dùng': item.kma_uid,
          'Email': item.email
        };
      });
      // Creating a workbook using SheetJS
      const workbook = XLSX.utils.book_new();

      // Creating a worksheet and adding the data to it
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

      // Creating the file and downloading it
      const filename = 'CanBoCongTac.xlsx';
      XLSX.writeFile(workbook, filename);
    },

    async fetchUsers() {
      try {
        this.loading = true
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_user'))
        this.users = response.data.users
      this.show = false

      } catch (e) {
        console.error(e)
      }
    },

    async fetchBusinesses() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_businesses'))
        this.businesses = response.data.businesses
        this.loading = false
      } catch (e) {
        console.error(e)
      }
    },

    async fetchPositions() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_positions'))
        this.chucvu = response.data.positions
      } catch (e) {
        console.error(e)
      }
    },

    async fetchUnits() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_units'))
        this.donvi = response.data.units
      } catch (e) {
        console.error(e)
      }
    },
  }
};
</script>
<style scoped>
table {
  table-layout: auto;
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  text-align: left;
  padding: 18px 8px;
  border-bottom: 1px solid gray;
}

th {
  font-weight: bold;
}

.combo-action {
  position: absolute;
  right: 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  grid-gap: 15px;
  width: 10%;
}

.wrap {
  position: relative;
}
</style>
