<template>
  <div>
    <div v-if="loading"></div>
    <div v-else-if="!usersExist">
      <br><br>
      <div :style="{ textAlign: '#center' }">
        Không có dữ liệu.
      </div>
      <NcButton :disabled="disabled" :readonly="readonly" type="primary"
        @click="show = !show">
        <template #icon>
          <Plus :size="20" />
        </template>
        <template>Thêm mới</template>
      </NcButton>
    </div>
    <div v-else class="wrap">
      <div class="combo-action">
        <NcButton :disabled="disabled" :readonly="readonly" type="primary" :wide="true" @click="show = !show">
          <template #icon>
            <Plus :size="20" />
          </template>
          <template>Thêm mới</template>
        </NcButton>
        <NcButton :disabled="disabled" :readonly="readonly" type="success" :wide="true" @click="exportExcel">
          <template #icon>
            <DatabaseExportOutline :size="20" />
          </template>
          <template>Xuất Excel</template>
        </NcButton>
        <NcButton :disabled="disabled" :readonly="readonly" type="error" :wide="true" @click="deleteUser">
          <template #icon>
            <DeleteOutline :size="20" />
          </template>
          <template>Xóa</template>
        </NcButton>
      </div>
      <br><br><br>
    </div>
    <table v-if="usersExist">
      <thead>
        <tr>
          <th>
            <input type="checkbox" v-model="checkedAll" @change="updateAllCheckedItems">
          </th>
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
        <tr v-for="item in users">
          <td>
            <input type="checkbox" v-model="item.checked" @change="updateCheckedItems">
          </td>
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
    <div v-if="show">
      <NewUser @modal-updated="updateModal" @refresh-user-list="fetchUsers" />
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { subscribe, unsubscribe } from "@nextcloud/event-bus";
import { NcButton, NcActions, NcActionButton } from "@nextcloud/vue";
import DatabaseExportOutline from 'vue-material-design-icons/DatabaseExportOutline'
import Plus from 'vue-material-design-icons/Plus'
import DeleteOutline from 'vue-material-design-icons/DeleteOutline'
import ViewList from 'vue-material-design-icons/ViewList'
import NewUser from './NewUser'
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'


export default {
  name: "Chung",
  components: {
    NcButton,
    NcActions,
    NcActionButton,
    ViewList,
    NewUser,
    DatabaseExportOutline,
    Plus,
    DeleteOutline,
  },
  data() {
    return {
      loading: false,
      showComponent: false,
      show: false,
      checkedAll: false,
      selectedItems: [],
      users: [],
      chucvu: [],
      donvi: [],
      gioitinh: [
        { value: 1, text: 'Nam' },
        { value: 0, text: 'Nữ' },
      ],
    };
  },

  computed: {
    usersExist() {
      return this.users.length > 0;
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
  },

  methods: {
    exportExcel() {
      const data = this.users.map((item) => {
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
      const filename = 'CanBo.xlsx';
      XLSX.writeFile(workbook, filename);
    },

    deleteUser() {
      this.users.forEach(user => {
        if (user.checked) this.deleteUserAPI(user.kma_uid)
      });
      showError(t('kmaapp', 'Xóa thành công!'))
    },

    updateModal(modal) {
            this.show = modal
        },
        
    isMale(gender) {
      return gender == 1;
    },

    isFeMale(gender) {
      return gender == 0;
    },

    async deleteUserAPI(kma_uid) {
      try {
        console.log(generateUrl('apps/kmaapp/delete_kma_user/' + kma_uid))
        const response = await axios.delete(generateUrl('apps/kmaapp/delete_kma_user/' + kma_uid))
        this.fetchUsers()
        console.log(response)
      } catch (e) {
        console.error(e)
      }
    },
    async fetchUsers() {
      try {
        this.loading = true
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_user'))
        this.users = response.data.users
      this.show = false
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

    updateAllCheckedItems() {
      this.users.forEach(user => {
        user.checked = this.checkedAll;
      });
    },

    updateCheckedItems() {
      this.checkedAll = this.users.every(user => user.checked);
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
  padding: 8px;
  border-bottom: 1px solid gray;
}

th {
  font-weight: bold;
}

.combo-action {
  position: absolute;
  right: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  grid-gap: 15px;
  width: 40%;
}

.wrap {
  position: relative;
}
</style>
