<template>
  <form method="post" action="#">
    <NcModal v-if="modal" @close="closeModal" title="THÊM CÁN BỘ" size="large">
      <div class="modal__content">
        <div class="block-list block-list-2">
          <div class="block-list__item">
            <label>Họ và tên (*)</label>
            <NcTextField :value.sync="hoVaTen" />
            <!-- <span v-if="!hoVaTen">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Tên người dùng (*)</label>
            <NcTextField :value.sync="tenNguoiDung" />
            <!-- <span v-if="!tenNguoiDung">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Giới tính</label>
            <select class="field" v-model="gioiTinh">
              <option v-for="option in gioitinh" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            <!-- <span v-if="!gioiTinh">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Đơn vị (*)</label>
            <select class="field" v-model="donVi">
              <option v-for="option in donvi" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            <!-- <span v-if="!donVi">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Ngày sinh</label>
            <NcTextField :value.sync="ngaySinh" type="date" />
          </div>
          <div class="block-list__item">
            <label>Chức vụ (*)</label>
            <select class="field" v-model="chucVu">
              <option v-for="option in chucvu" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            <!-- <span v-if="!chucVu">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Địa chỉ (*)</label>
            <NcTextField :value.sync="diaChi" />
            <!-- <span v-if="!diaChi">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Ngày vào Đảng)</label>

            <NcTextField :value.sync="ngayVaoDang" type="date" />
          </div>
          <div class="block-list__item">
            <label>SĐT (*)</label>

            <NcTextField :value.sync="sdt" />
            <!-- <span v-if="!sdt">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Lương</label>

            <NcTextField :value.sync="luong" />
          </div>
          <div class="block-list__item">
            <label>Email (*)</label>
            <NcTextField :value.sync="email" />
            <!-- <span v-if="!email">Please fill out this field</span> -->
          </div>
          <div class="block-list__item">
            <label>Hệ số lương</label>
            <NcTextField :value.sync="heSoLuong" />
          </div>
          <div class="block-list__item">
            <label>CCCD/CMND</label>
            <NcTextField :value.sync="cccd" />
          </div>
          <div class="block-list__item">
            <label>Bậc thuế</label>
            <NcTextField :value.sync="bacThue" />
          </div>
        </div>
          <NcButton type="primary" :wide="true">
            THÊM MỚI
          </NcButton>
      </div>
    </NcModal>
  </form>
</template>

<script>
import { NcModal, NcTextField, NcButton, NcSelect } from "@nextcloud/vue";

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
      hoVaTen: "",
      gioiTinh: "option1",
      ngaySinh: "",
      diaChi: "",
      sdt: "",
      email: "",
      cccd: "",
      tenNguoiDung: "",
      donVi: "",
      chucVu: "",
      ngayVaoDang: "",
      luong: "",
      heSoLuong: "",
      bacThue: "",
      gioitinh: [
        { value: 'option1', text: 'Nam' },
        { value: 'option2', text: 'Nữ' },
      ],
      donvi: [
        { value: 'option1', text: 'Nam' },
        { value: 'option2', text: 'Nữ' },
      ],
      chucvu: [
        { value: 'option1', text: 'Nam' },
        { value: 'option2', text: 'Nữ' },
      ],
    };
  },
  methods: {
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
.block-list .block-list__item {
  min-height: 100px;
  margin-bottom: 1rem;
}

@media only screen and (min-width: 900px) {
  .block-list {
    display: -webkit-box;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    background-color: #ffffff;
    margin: 1em auto;
    height: 700px;
    overflow-y: scroll;
  }

  .block-list:after {
    content: "";
    -webkit-box-flex: 1;
    flex: auto;
  }

  .block-list__item {
    height: 4em;
    width: 25%;
    box-sizing: border-box;
    border-right: 10px solid white;
  }

  .block-list-2 .block-list__item {
    width: 50%;
  }

  .block-list-2 .block-list__item:nth-child(2n) {
    border: none;
  }
}

.modal__content {
  margin: 50px;
  text-align: left;
}

.myButton {
  display: flex;
  justify-content: center;
}

.field {
  width: 100%;
  /* height: 25%; */
}
</style>
