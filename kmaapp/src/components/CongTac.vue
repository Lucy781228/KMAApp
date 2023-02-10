<template>
    <div>
      <table>
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Họ và tên</th>
            <th>Mật khẩu</th>
            <th>Email</th>
            <th>Phòng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rows" :key="item.id">
            <th>{{ item }}</th>
            <!-- <th>{{ item.fullname }}</th>
            <th>{{ item.password }}</th>
            <th>{{ item.email }}</th>
            <th>{{ item.group }}</th> -->
            <th>
              <NcActions>
                <NcActionButton>
                  <template #icon>
                    <ViewList :size="20" />
                  </template>
                  Xem chi tiết
                </NcActionButton>
              </NcActions>
              <NcActions>
                <NcActionButton @click="show = !show">
                  <template #icon>
                    <Pencil :size="20" />
                  </template>
                  Chỉnh sửa
                </NcActionButton>
              </NcActions>
              <NcActions>
                <NcActionButton @click="exportExcel">
                  <template #icon>
                    <Delete :size="20" />
                  </template>
                  Xóa
                </NcActionButton>
              </NcActions>
            </th>
          </tr>
        </tbody>
      </table>
      <div v-if="show">
        <NewUser />
      </div>
    </div>
  </template>
  
  <script>
  import { NcButton, NcActions, NcActionButton } from "@nextcloud/vue";
  import Delete from 'vue-material-design-icons/Delete'
  import Pencil from 'vue-material-design-icons/Pencil'
  import ViewList from 'vue-material-design-icons/ViewList'
  import NewUser from './NewUser'
  import { generateUrl } from '@nextcloud/router'
  import { showError, showSuccess } from '@nextcloud/dialogs'
  import axios from '@nextcloud/axios'
  
  export default {
    name: "UserList",
    components: {
      NcButton,
      NcActions,
      NcActionButton,
      Delete,
      ViewList,
      Pencil,
      // NewCanBo,
      NewUser,
    },
    data() {
      return {
        show: false,
        rows: [],
      };
    },
}
  </script>
  <style scoped>
  table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
  }
  
  th,
  td {
    text-align: left;
    padding: 8px;
  }
  </style>
  