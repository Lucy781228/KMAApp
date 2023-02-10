<template>
    <div class="wrap">
        <h2 v-show="!businessExist">Không có quá trình công tác nào.</h2>
        <NcButton :disabled="disabled" :readonly="readonly" type="primary" v-if="edit" @click="addNew=!addNew">
            <template #icon>
                <Plus :size="20" />
            </template>
            <template>Thêm mới</template>
        </NcButton>
        <div class="block-list" v-show="businessExist">
            <div v-for="item in business">
                <div class="block-list-item">
                    <h2>{{ item.business_id }}</h2>
                </div>
                <div class="block-list-item">
                    <label></label>
                </div>
                <div class="block-list-item">
                    <label>Thời gian bắt đầu (*)</label>
                    <div v-if="!edit">{{ item.start_time }}</div>
                <NcTextField :value.sync="newBusiness.batDau" type="date" v-if="edit"/>
                </div>
                <div class="block-list-item">
                    <label>Thời gian kết thúc (*)</label>
                    <div v-if="!edit">{{ item.end_time }}</div>
                <NcTextField :value.sync="newBusiness.ketThuc" type="date" v-if="edit"/>
                </div>
                <div class="block-list-item">
                    <label>Đơn vị (*)</label>
                    <div v-if="!edit">{{ item.unit }}</div>
                <NcTextField :value.sync="newBusiness.donVi" v-if="edit"/>
                </div>
                <div class="block-list-item">
                    <label>Chức vụ (*)</label>
                    <div v-if="!edit">{{ item.position }}</div>
                <NcTextField :value.sync="newBusiness.chucVu" v-if="edit"/>
                </div>
            </div>
            <div class="block-list-item" v-if="addNew">
                <label>Thời gian bắt đầu (*)</label>
                <NcTextField :value.sync="newBusiness.batDau" type="date" />
                <!-- <span v-if="!hoVaTen">Please fill out this field</span> -->
            </div>
            <div class="block-list-item" v-if="addNew">
                <label>Thời gian kết thúc (*)</label>
                <NcTextField :value.sync="newBusiness.ketThuc" type="date" />
                <!-- <span v-if="!tenNguoiDung">Please fill out this field</span> -->
            </div>
            <div class="block-list-item" v-if="addNew">
                <label>Đơn vị (*)</label>
                <NcTextField :value.sync="newBusiness.donVi" />
            </div>
            <div class="block-list-item" v-if="addNew">
                <label>Chức vụ (*)</label>
                <NcTextField :value.sync="newBusiness.chucVu" />
                <!-- <span v-if="!diaChi">Please fill out this field</span> -->
            </div>
        </div>
    </div>
</template>

<script>
import { NcTextField, NcButton, NcSelect } from "@nextcloud/vue";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'
import Plus from 'vue-material-design-icons/Plus'

export default {
    name: "QTCongTac",
    components: {
        NcButton,
        NcTextField,
        Plus,
    },
    data() {
        return {
            addNew: false,
            newBusiness: {
                batDau: null,
                ketThuc: null,
                donVi: "",
                chucVu: "",
            },
            business: [],
        }
    },
    props: ['kma_uid', 'edit', 'save'],
    watch: {
        save: function (newValue, oldValue) {
            if (newValue === true) {
                this.createNew();
            }
        },
        edit: function (newValue, oldValue) {
            if (newValue === false) {
                this.fetchBusiness()
            }
        }
    },
    computed: {
        businessExist() {
            return this.business.length > 0;
        },
    },
    mounted() {
        this.fetchBusiness()
    },
    methods: {
        async createNew() {
            try {
                const response = await axios.post('/apps/kmaapp/create_kma_business', {
                    business_id: null,
                    kma_uid: this.kma_uid,
                    start_time: this.business.start_time,
                    end_time: this.business.end_time,
                    unit: this.business.unit,
                    position: this.business.position,

                });
            } catch (e) {
                console.error(e);
            }
        },

        async fetchBusiness() {
            try {
                const response = await axios.get(generateUrl('/apps/kmaapp/kma_business_by_uid'), this.kma_uid)
                this.business = response.data.businesses
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
</style>
