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
          <th>{{ item.username }}</th>
          <th>{{ item.fullname }}</th>
          <th>{{ item.password }}</th>
          <th>{{ item.email }}</th>
          <th>{{ item.group }}</th>
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
              <NcActionButton>
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
import { subscribe, unsubscribe } from "@nextcloud/event-bus";
import { NcButton, NcActions, NcActionButton } from "@nextcloud/vue";
import Delete from 'vue-material-design-icons/Delete'
import Pencil from 'vue-material-design-icons/Pencil'
import ViewList from 'vue-material-design-icons/ViewList'
import NewUser from './NewUser'


export default {
  name: "UserList",
  components: {
    NcButton,
    NcActions,
    NcActionButton,
    Delete,
    ViewList,
    Pencil,
    NewUser,
  },
  data() {
    return {
      show: false,
      rows: [
        {
          id: 1,
          username: "123",
          fullname: "Nguyen Van B",
          password: "abdc",
          email: "guhj@gmail.com",
          group: "cntt",
        },
        {
          id: 2,
          username: "321",
          fullname: "Nguyen Van B",
          password: "abdc",
          email: "guhj@gmail.com",
          group: "cntt",
        },
      ],
    };
  },
};
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
