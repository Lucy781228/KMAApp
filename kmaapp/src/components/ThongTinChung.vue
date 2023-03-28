<template>
  <div class="wrap">
    <div class="combo-action">
      <div v-show="!edit" ></div>
      <NcButton v-show="!edit" :disabled="disabled" :readonly="readonly" type="primary"  @click="changeEdit">
        <template #icon>
          <PencilOutline :size="20" />
        </template>
        <template>Chỉnh sửa</template>
      </NcButton>
      <NcButton v-show="edit" :disabled="disabled" :readonly="readonly" type="error"  @click="changeEdit">
        <template #icon>
          <PencilOutline :size="20" />
        </template>
        <template>Hủy</template>
      </NcButton>
      <NcButton v-show="edit" :disabled="disabled" :readonly="readonly" type="primary" @click="updateUser">
        <template #icon>
          <ArrowUpDropCircleOutline :size="20" />
        </template>
        <template>Lưu</template>
      </NcButton>
      <div></div>
    </div>
    <br>
    <br v-if="!edit"> <br v-if="!edit">
    <div class="block-list">
      <div class="block-list-item">
        <label>Họ và tên (*)</label>
        <div v-if="!edit">{{ user[0].full_name }}</div>
        <NcTextField :value.sync="user[0].full_name" v-if="edit" />
        <!-- <span v-if="!hoVaTen">Please fill out this field</span> -->
      </div>
      <div class="block-list-item">
        <label>Tên người dùng (*)</label>
        <div v-if="!edit">{{ user[0].kma_uid }}</div>
        <NcTextField :value.sync="user[0].kma_uid" :disabled="true" v-if="edit" />
        <!-- <span v-if="!tenNguoiDung">Please fill out this field</span> -->
      </div>
      <div class="block-list-item">
        <label>Giới tính</label>
        <div v-if="!edit">{{ user[0].gender === 1 ? 'Nam' : (user[0].gender === 0 ? 'Nữ' : '') }}</div>
        <select class="field" v-model="user[0].gender" v-if="edit">
          <option v-for="option in gioitinh" :value="option.value">
            {{ option.text }}
          </option>
        </select>
        <!-- <span v-if="!gioiTinh">Please fill out this field</span> -->
      </div>
      <div class="block-list-item">
        <label>Đơn vị (*)</label>
        <div v-if="!edit">{{ userUnit(user[0].unit_id) }}</div>
        <select class="field" v-model="user[0].unit_id" v-if="edit">
          <option v-for="option in donvi" :value="option.unit_id">
            {{ option.unit_name }}
          </option>
        </select>
        <!-- <span v-if="!donVi">Please fill out this field</span> -->
      </div>
      <div class="block-list-item">
        <label>Ngày sinh</label>
        <div v-if="!edit">{{ user[0].date_of_birth }}</div>
        <NcTextField :value.sync="user[0].date_of_birth" type="date" v-if="edit" />
      </div>
      <div class="block-list-item">
        <label>Chức vụ (*)</label>
        <div v-if="!edit">{{ userPosition(user[0].position_id) }}</div>
        <select class="field" v-model="user[0].position_id" v-if="edit">
          <option v-for="option in chucvu" :value="option.position_id">
            {{ option.position_name }}
          </option>
        </select>
        <!-- <span v-if="!chucVu">Please fill out this field</span> -->
      </div>
      <div class="block-list-item">
        <label>Địa chỉ</label>
        <div v-if="!edit">{{ user[0].address }}</div>
        <NcTextField :value.sync="user[0].address" v-if="edit" />
        <!-- <span v-if="!diaChi">Please fill out this field</span> -->
      </div>
      <div class="block-list-item">
        <label>Ngày vào Đảng</label>
        <div v-if="!edit">{{ user[0].communist_party_joined }}</div>
        <NcTextField :value.sync="user[0].communist_party_joined" type="date" v-if="edit" />
      </div>
      <div class="block-list-item">
        <label>SĐT</label>
        <div v-if="!edit">{{ user[0].phone }}</div>
        <NcTextField :value.sync="user[0].phone" v-if="edit" />
        <!-- <span v-if="!sdt">Please fill out this field</span> -->
      </div>
      <div class="block-list-item">
        <label>Lương</label>
        <div v-if="!edit">{{ user[0].salary }}</div>
        <NcTextField :value.sync="user[0].salary" v-if="edit" />
      </div>
      <div class="block-list-item">
        <label>Email (*)</label>
        <div v-if="!edit">{{ user[0].email }}</div>
        <NcTextField :value.sync="user[0].email" v-if="edit" />
        <!-- <span v-if="!email">Please fill out this field</span> -->
      </div>
      <div class="block-list-item">
        <label>Hệ số lương (*)</label>
        <div v-if="!edit">{{ user[0].coefficients_salary }}</div>
        <NcTextField :value.sync="user[0].coefficients_salary" v-if="edit" />
      </div>
      <div class="block-list-item">
        <label>CCCD/CMND</label>
        <div v-if="!edit">{{ user[0].id_number }}</div>
        <NcTextField :value.sync="user[0].id_number" v-if="edit" />
      </div>
      <div class="block-list-item">
        <label>Bậc thuế (*)</label>
        <div v-if="!edit">{{ user[0].tax }}</div>
        <NcTextField :value.sync="user[0].tax" v-if="edit" />
      </div>
    </div>
  </div>
</template>

<script>
import { NcTextField, NcButton, NcSelect } from "@nextcloud/vue";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import PencilOutline from 'vue-material-design-icons/PencilOutline'
import ArrowUpDropCircleOutline from 'vue-material-design-icons/ArrowUpDropCircleOutline'
import axios from '@nextcloud/axios'

export default {
  name: "ThongTinChung",
  components: {
    NcButton,
    NcTextField,
    NcSelect,
    PencilOutline,
    ArrowUpDropCircleOutline,
  },
  data() {
    return {
      edit: false,
      user: [],
      chucvu: [],
      donvi: [],
      gioitinh: [
        { value: 1, text: 'Nam' },
        { value: 0, text: 'Nữ' },
      ],
    }
  },
  props: ['kma_uid'],
  computed: {
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
    isMale(gender) {
      return gender == 1;
    },

    isFeMale(gender) {
      return gender == 0;
    },

    changeEdit() {
      this.edit = !this.edit
    },

    async updateUser() {
      this.edit = false
      try {
        const response = await axios.put('/apps/kmaapp/update_kma_user', {
          kma_uid: this.user[0].kma_uid,
          full_name: this.user[0].full_name,
          date_of_birth: this.user[0].date_of_birth,
          gender: this.user[0].gender,
          phone: this.user[0].phone,
          address: this.user[0].address,
          id_number: this.user[0].id_number,
          email: this.user[0].email,
          position_id: this.user[0].position_id,
          salary: this.user[0].salary,
          coefficients_salary: this.user[0].coefficients_salary,
          tax: this.user[0].tax,
          day_joined: null,
          communist_party_joined: this.user[0].communist_party_joined,
          communist_party_confirmed: null,
          unit_id: this.user[0].unit_id,
        });
        this.fetchUsers()
        this.$emit('user-updated', this.user)
        showSuccess(t('kmaapp', 'Cập nhật thành công!'))
      } catch (e) {
        console.error(e);
      }
    },
    isMale(gender) {
      return gender == 1;
    },

    isFeMale(gender) {
      return gender == 0;
    },

    async fetchUsers() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/kma_user/' + this.kma_uid))
        this.user = response.data.users
        console.log(this.user)
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
.wrap {
  position: relative;
}

.block-list {
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  grid-gap: 40px 70px;
  width: 100%;
  height: 100%;
}

.block-list-item {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 5px;
}

.field {
  width: 100%;
}

label {
  color: #006aa3;
}

.combo-action {
  position: absolute;
  right: 0;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  grid-gap: 15px;
}
</style>
