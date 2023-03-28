<template>
    <div class="wrappers" v-if="show">
        <NcSelect class="select" placeholder="Chọn danh mục tìm kiếm" v-model="selectedOption" :options="options" />
        <div class="block-list" v-if="selectedOption.value === 1">
            <div class="block-list__item">
                <label>Họ và tên</label>
                <NcTextField :value.sync="user.hoVaTen" />
            </div>
            <div class="block-list__item">
                <label>Đơn vị</label>
                <select class="field" v-model="user.donVi">
                    <option v-for="option in donvi" :value="option.unit_id">
                        {{ option.unit_name }}
                    </option>
                </select>
            </div>
            <div class="block-list__item">
                <label>Chức vụ</label>
                <select class="field" v-model="user.chucVu">
                    <option v-for="option in chucvu" :value="option.position_id">
                        {{ option.position_name }}
                    </option>
                </select>
            </div>
            <div class="block-list__item">
                <label>Năm sinh từ</label>
                <NcTextField :value.sync="user.ngayBatDau" type="date" />
            </div>
            <div class="block-list__item">
                <label>Đến năm</label>
                <NcTextField :value.sync="user.ngayKetThuc" type="date" />
            </div>
            <div class="block-list__item">
                <label>Đảng viên</label>
                <select class="field" v-model="user.dangVien">
                    <option v-for="option in dangVien" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>
        </div>
        <div class="block-list" v-if="selectedOption.value === 2">
            <div class="block-list__item">
                <label>Từ</label>
                <NcTextField :value.sync="user.ngayBatDau" type="date" />
            </div>
            <div class="block-list__item">
                <label>Đến</label>
                <NcTextField :value.sync="user.ngayKetThuc" type="date" />
            </div>
        </div>
        <div class="wraps" v-if="!selectedOption.value == 0">
            <div class="combo-action">
                <NcButton :disabled="disabledAll" :readonly="readonly" type="secondary" :wide="true" @click="reset">
                    <template #icon>
                        <BackupRestore :size="20" />
                    </template>
                    <template>Khôi phục</template>
                </NcButton>
                <NcButton :disabled="disabledAll" :readonly="readonly" type="primary" :wide="true" @click="showResult">
                    <template #icon>
                        <PencilOutline :size="20" />
                    </template>
                    <template>Tìm kiếm</template>
                </NcButton>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if="temp.value == 1">
        <div class="wrapper" v-if="!usersExist">
            <br><br>
            <div :style="{ textAlign: '#center' }">
                Không có dữ liệu.
            </div>
        </div>
        <div v-else class="wrap">
            <br><br>
            <div class="combo-action-1">
                <NcButton :disabled="disabled" :readonly="readonly" type="success" :wide="true" @click="exportExcel_1">
                    <template #icon>
                        <DatabaseExportOutline :size="20" />
                    </template>
                    <template>Xuất Excel</template>
                </NcButton>
            </div>
            <br><br><br>
        </div>
        <table v-if="usersExist">
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
                <tr v-for="item in users">
                    <td :style="{ color: '#006aa3', fontWeight: 'bold', cursor: 'pointer' }">
                        {{ item.full_name }}
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
    <div v-else-if="temp.value == 2">
        <div class="wrapper" v-if="!businessesExist">
            <br><br>
            <div :style="{ textAlign: '#center' }">
                Không có dữ liệu.
            </div>
        </div>
        <div v-else class="wrap">
            <br><br>
            <div class="combo-action-1">
                <NcButton :disabled="disabled" :readonly="readonly" type="success" :wide="true" @click="exportExcel_2">
                    <template #icon>
                        <DatabaseExportOutline :size="20" />
                    </template>
                    <template>Xuất Excel</template>
                </NcButton>
            </div>
            <br><br><br>
        </div>
        <table v-if="businessesExist">
            <thead>
                <tr>
                    <th>Tên người dùng</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Chức vụ</th>
                    <th>Đơn vị</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in businesses">
                    <td :style="{ color: '#006aa3', fontWeight: 'bold', cursor: 'pointer' }">
                        {{ item.kma_uid }}
                    </td>
                    <td>{{ item.start_time }}</td>
                    <td>{{ item.end_time }}</td>
                    <td>{{ item.position }}</td>
                    <td>{{ item.unit }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
</template>
  
<script>
import * as XLSX from 'xlsx';
import { NcTextField, NcButton, NcSelect } from "@nextcloud/vue";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import ResultCB from './ResultCB'
import BackupRestore from 'vue-material-design-icons/BackupRestore'
import Close from 'vue-material-design-icons/Close'
import Check from 'vue-material-design-icons/Check'
import Plus from 'vue-material-design-icons/Plus'
import PencilOutline from 'vue-material-design-icons/PencilOutline'
import axios from '@nextcloud/axios'
import DatabaseExportOutline from 'vue-material-design-icons/DatabaseExportOutline'

export default {
    name: "SearchMenu",
    components: {
        ResultCB,
        NcButton,
        NcTextField,
        NcSelect,
        BackupRestore,
        Plus,
        PencilOutline,
        Check,
        Close,
        DatabaseExportOutline
    },
    data() {
        return {
            show: true,
            selectedOption: { label: 'Chọn danh mục tìm kiếm', value: 0 },
            temp: { label: 'Chọn danh mục tìm kiếm', value: 0 },
            options: [
                { label: 'Cán Bộ', value: 1 },
                { label: 'Quá Trình Công Tác', value: 2 },
                { label: 'Quá Trình Đào Tạo', value: 3 },
                { label: 'Quá Trình Khen Thưởng', value: 4 },
                { label: 'Quá Trình Kỷ Luật', value: 5 },
                { label: 'Thân Nhân Cán Bộ', value: 6 }
            ],
            user: {
                hoVaTen: "",
                chucVu: null,
                donVi: null,
                ngayBatDau: null,
                ngayKetThuc: null
            },
            dangVien: [
                { value: 1, text: 'Có' },
                { value: 0, text: 'Không' },
            ],
            donvi: [],
            chucvu: [],
            users: [],
            business: {
                ngayBatDau: null,
                ngayKetThuc: null
            },
            businesses: [],
            education: {
                ngayBatDau: null,
                ngayKetThuc: null
            },
            educations: []
        }
    },
    mounted() {
        this.fetchPositions()
        this.fetchUnits()
    },
    watch: {
        selectedOption: function (newVal, oldVal) {
            this.temp = this.selectedOption
            if (newVal && newVal.value === 1) {
                this.fetchUsers();
            }
            if (newVal && newVal.value === 2) {
                this.fetchBusinesses();
            }
        }
    },
    computed: {
        usersExist() {
            return this.users.length > 0;
        },
        businessesExist() {
            return this.businesses.length > 0;
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

    methods: {
        exportExcel_1() {
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

        exportExcel_2() {
            const data = this.businesses.map((item) => {
                return {
                    'Tên người dùng': item.kma_uid,
                    'Ngày bắt đầu': item.start_time,
                    'Ngày kết thúc': this.end_time,
                    'Chức vụ': this.unit,
                    'Đơn vị': this.position,
                };
            });
            // Creating a workbook using SheetJS
            const workbook = XLSX.utils.book_new();

            // Creating a worksheet and adding the data to it
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

            // Creating the file and downloading it
            const filename = 'QTCongTac.xlsx';
            XLSX.writeFile(workbook, filename);
        },

        isMale(gender) {
            return gender == 1;
        },

        isFeMale(gender) {
            return gender == 0;
        },
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
        reset() {
            this.user.chucVu = null
            this.user.hoVaTen = ""
            this.user.donVi = null
            this.user.ngayBatDau = null
            this.user.ngayKetThuc = null
            this.user.dangVien = null
            this.business.ngayBatDau = null
            this.business.ngayKetThuc = null
        },
        showResult() {
            if (this.selectedOption.value === 1) {
                if (this.user.ngayBatDau > this.user.ngayKetThuc) {
                showError(t('kmaapp', 'Ngày kết thúc phải sau ngày bắt đầu'))
                return
            }
            if (this.user.hoVaTen) this.users = this.users.filter(user => user.full_name.includes(this.user.hoVaTen));
            if (this.user.ngayBatDau) this.users = this.users.filter(user => new Date(user.date_of_birth) >= new Date(this.user.ngayBatDau));
            if (this.user.ngayKetThuc) this.users = this.users.filter(user => new Date(user.date_of_birth) <= new Date(this.user.ngayKetThuc));
            if (this.user.donVi) this.users = this.users.filter(user => user.unit_id === this.user.donVi);
            if (this.user.chucVu) this.users = this.users.filter(user => user.position_id === this.user.chucVu);
            if (this.user.dangVien === 1) {
                this.users = this.users.filter(user => {
                    const joinedDate = new Date(user.communist_party_joined);
                    return !isNaN(joinedDate.getTime());
                });
            }
            if (this.user.dangVien === 0) {
                this.users = this.users.filter(user => {
                    const joinedDate = new Date(user.communist_party_joined);
                    return isNaN(joinedDate.getTime());
                });
            }
            this.show = !this.show
            console.log(this.show)
            console.log(this.temp.value)
            return
            }

            else if (this.selectedOption.value === 2) {
                if (this.business.ngayBatDau > this.business.ngayKetThuc) {
                showError(t('kmaapp', 'Ngày kết thúc phải sau ngày bắt đầu'))
                return
            }
            if (this.business.ngayBatDau) this.businesses = this.businesses.filter(user => new Date(user.start_time) >= new Date(this.business.ngayBatDau));
            if (this.business.ngayKetThuc) this.businesses = this.businesses.filter(user => new Date(user.end_time) <= new Date(this.business.ngayKetThuc));
            this.show = !this.show
            console.log(this.show)
            console.log(this.temp.value)
            return
            }
            

        },

        async fetchUsers() {
            try {
                const response = await axios.get(generateUrl('apps/kmaapp/all_kma_user'))
                this.users = response.data.users
                console.log(this.users)

            } catch (e) {
                console.error(e)
            }
        },

        async fetchBusinesses() {
            try {
                const response = await axios.get(generateUrl('apps/kmaapp/all_kma_businesses'))
                this.businesses = response.data.businesses
            } catch (e) {
                console.error(e)
            }
        },

        async fetchEducations() {
            try {
                const response = await axios.get(generateUrl('apps/kmaapp/all_kma_educations'))
                this.educations = response.data.educations
            } catch (e) {
                console.error(e)
            }
        },
    }
};
</script>
<style scoped>
.block-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    grid-gap: 15px;
    width: 100%;
    height: 50%;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 35px;
}

.field {
    width: 100%;
}

.wrappers {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid gray;
    width: 50%;
    height: 40%;
    border-radius: 10px;
}

.wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid gray;
    width: 95%;
    height: 90%;
}

.select {
    width: 100%;
}

.wraps {
    position: relative;
}

.field {
    width: 100%;
}

.combo-action {
    position: absolute;
    right: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    grid-gap: 15px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 35px;

}

table {
    table-layout: auto;
    border-collapse: collapse;
    width: 100%;
    padding: 10px;
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

.combo-action-1 {
    position: absolute;
    right: 0;
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    grid-gap: 15px;
    width: 15%;
}

.wrap {
    position: relative;
}

</style>
  