<template>
  <form method="post">
    <NcModal v-if="modal" @close="closeModal" title="THÊM CÁN BỘ" size="large">
      <div class="modal__content">
        <div class="block-list">
          <div class="block-list__item">
            <label>Họ và tên (*)</label>
            <NcTextField :value.sync="user.hoVaTen" />
            <!-- <span v-if="!hoVaTen">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Tên người dùng (*)</label>
            <NcTextField :value.sync="user.tenNguoiDung" />
            <!-- <span v-if="!tenNguoiDung">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Giới tính</label>
            <select class="field" v-model="user.gioiTinh">
              <option v-for="option in gioitinh" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            <!-- <span v-if="!gioiTinh">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Đơn vị (*)</label>
            <select class="field" v-model="user.donVi">
              <option v-for="option in donvi" :value="option.unit_id">
                {{ option.unit_name }}
              </option>
            </select>
            <!-- <span v-if="!donVi">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Ngày sinh</label>
            <NcTextField :value.sync="user.ngaySinh" type="date" />
          </div>
          <div class="block-list__item">
            <label>Chức vụ (*)</label>
            <select class="field" v-model="user.chucVu">
              <option v-for="option in chucvu" :value="option.position_id">
                {{ option.position_name }}
              </option>
            </select>
            <!-- <span v-if="!chucVu">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Địa chỉ</label>
            <NcTextField :value.sync="user.diaChi" />
            <!-- <span v-if="!diaChi">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Ngày vào Đảng</label>

            <NcTextField :value.sync="user.ngayVaoDang" type="date" />
          </div>
          <div class="block-list__item">
            <label>SĐT</label>

            <NcTextField :value.sync="user.sdt" />
            <!-- <span v-if="!sdt">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Lương</label>

            <NcTextField :value.sync="user.luong" />
          </div>
          <div class="block-list__item">
            <label>Email</label>
            <NcTextField :value.sync="user.email" />
            <!-- <span v-if="!email">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Hệ số lương (*)</label>
            <NcTextField :value.sync="user.heSoLuong" />
          </div>
          <div class="block-list__item">
            <label>CCCD/CMND (*)</label>
            <NcTextField :value.sync="user.cccd" />
          </div>
          <div class="block-list__item">
            <label>Bậc thuế (*)</label>
            <NcTextField :value.sync="user.bacThue" />
          </div>
        </div>
        <br>
        <NcButton class="my-button" type="primary" @click="createUser" :wide="true">
          THÊM MỚI
        </NcButton>
      </div>
    </NcModal>
  </form>
</template>

<script>
import { NcModal, NcTextField, NcButton, NcSelect } from "@nextcloud/vue";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'

export default {
  name: "NewUser",
  components: {
    NcModal,
    NcButton,
    NcTextField,
    NcSelect,
  },
  data() {
    return {
      modal: true,
      user: {
        tenNguoiDung: "",
        hoVaTen: "",
        ngaySinh: null,
        gioiTinh: null,
        sdt: null,
        diaChi: null,
        cccd: "",
        email: "",
        chucVu: null,
        luong: null,
        heSoLuong: "",
        bacThue: "",
        ngayVaoDang: null,
        donVi: null,
      },
      gioitinh: [
        { value: 1, text: 'Nam' },
        { value: 0, text: 'Nữ' },
      ],
      donvi: [],
      chucvu: [],
    };
  },
  mounted() {
    this.fetchPositions()
    this.fetchUnits()
  },
  methods: {
    async fetchPositions() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_positions'))
        this.chucvu = response.data.positions
      } catch (e) {
        console.error(e)
        showError(t('kmaapp', 'Có lỗi xảy ra!'))
      }
    },
    async fetchUnits() {
      try {
        const response = await axios.get(generateUrl('apps/kmaapp/all_kma_units'))
        this.donvi = response.data.units
      } catch (e) {
        console.error(e)
        showError(t('kmaapp', 'Có lỗi xảy ra!'))
      }
    },
    async createUser(event) {
      event.preventDefault()
      try {
        const response = await axios.post('/apps/kmaapp/create_kma_user', {
          kma_uid: this.user.tenNguoiDung,
          full_name: this.user.hoVaTen,
          date_of_birth: this.user.ngaySinh,
          gender: this.user.gioiTinh,
          phone: this.user.sdt,
          address: this.user.diaChi,
          id_number: this.user.cccd,
          email: this.user.email,
          position_id: this.user.chucVu,
          salary: this.user.luong,
          coefficients_salary: this.user.heSoLuong,
          tax: this.user.bacThue,
          day_joined: null,
          communist_party_joined: this.user.ngayVaoDang,
          communist_party_confirmed: null,
          unit_id: this.user.donVi,
        });
        this.$emit('refresh-user-list');
        showSuccess(t('kmaapp', 'Tạo thành công!'))
      this.modal = false
      } catch (e) {
        console.error(e);
        showError(t('kmaapp', 'Could not create the user'));
      }
    },
    showModal() {
      this.hoVaTen = "",
        this.gioiTinh = "",
        this.ngaySinh = "",
        this.diaChi = "",
        this.sdt = "",
        this.email = "",
        this.cccd = "",
        this.tenNguoiDung = "",
        this.donVi = "",
        this.chucVu = "",
        this.ngayVaoDang = "",
        this.luong = "",
        this.heSoLuong = "",
        this.bacThue = "",
        this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
  },
};
</script>
<style scoped>
.modal__content {
  margin: 50px;
  text-align: left;
}

.block-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  grid-gap: 25px;
  width: 100%;
  height: 70%;
}

.field {
  width: 100%;
}
</style>
