<template>
    <div>
        <h2 v-if="!isExist">Không có quá trình công tác nào.</h2>
        <NcButton v-if="!isExist" :disabled="disabled" :readonly="readonly" type="primary" @click="show = !show">
            <template #icon>
                <Plus :size="20" />
            </template>
            <template>Thêm mới</template>
        </NcButton>
        <div class="wrap" v-if="isExist">
            <div class="combo-action">
                <NcButton :disabled="disabledAll" :readonly="readonly" type="primary" :wide="true" @click="show = !show">
                    <template #icon>
                        <Plus :size="20" />
                    </template>
                </NcButton>
                <NcButton :disabled="disabledAll" :readonly="readonly" type="error" :wide="true" @click="deleteBusiness">
                    <template #icon>
                        <DeleteOutline :size="20" />
                    </template>
                </NcButton>
            </div>
        </div>
        <br>
        <br>
        <table v-if="isExist">
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" v-model="checkedAll" :disabled="disabledAll" @change="updateAllCheckedItems">
                    </th>
                    <th>STT</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Chức vụ</th>
                    <th>Đơn vị</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in business" :key="item.business_id">
                    <td>
                        <input type="checkbox" :disabled="disabledAll" v-model="item.checked" @change="updateCheckedItems">
                    </td>
                    <td>{{ index + 1 }}</td>
                    <td v-if="!isEditing[index]">{{ item.start_time }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.start_time" type="date" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.end_time }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.end_time" type="date" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.position }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.position" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.unit }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.unit" type="text" />
                    </td>
                    <td>
                        <div v-if="!isEditing[index]">
                            <NcButton class="button" :disabled="isDisabled(index)" :readonly="readonly" type="tertiary"
                                :wide="true" @click="startEditing(index)">
                                <template #icon>
                                    <PencilOutline :size="20" />
                                </template>
                            </NcButton>
                        </div>
                        <div v-else>
                            <NcButton class="button" :disabled="disabled" :readonly="readonly" type="tertiary" :wide="true"
                                @click="cancelEdit(index)">
                                <template #icon>
                                    <Close :size="20" />
                                </template>
                            </NcButton>
                            <NcButton class="button" :disabled="disabled" :readonly="readonly" type="tertiary" :wide="true"
                                @click="updateBusiness(index)">
                                <template #icon>
                                    <Check :size="20" />
                                </template>
                            </NcButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="show">
            <NewCongTac @modal-updated="updateModal" :kma_uid="kma_uid" @refresh-business-list="fetchBusinesses" />
        </div>
    </div>
</template>
  
<script>
import { NcTextField, NcButton, NcSelect } from "@nextcloud/vue";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import NewCongTac from './NewCongTac'
import DeleteOutline from 'vue-material-design-icons/DeleteOutline'
import Close from 'vue-material-design-icons/Close'
import Check from 'vue-material-design-icons/Check'
import Plus from 'vue-material-design-icons/Plus'
import PencilOutline from 'vue-material-design-icons/PencilOutline'
import axios from '@nextcloud/axios'

export default {
    name: "QTCongTac",
    components: {
        NewCongTac,
        NcButton,
        NcTextField,
        NcSelect,
        DeleteOutline,
        Plus,
        PencilOutline,
        Check,
        Close
    },
    data() {
        return {
            show: false,
            checkedAll: false,
            selectedItems: [],
            isEditing: [],
            clickedIndex: null,
            disabledAll: false,
        }
    },
    props: {
        kma_uid: {
            type: String,
            required: true
        },
        business: {
            type: Array,
            required: true
        }
    },

    mounted() {
        this.fetchBusinesses()
    },

    computed: {
        isExist() {
            return this.business.length > 0;
        },
        isDisabled() {
            return (index) => {
                return this.clickedIndex !== null && index !== this.clickedIndex;
            };
        },
    },

    methods: {
        startEditing(index) {
            this.$set(this.isEditing, index, true)
            this.clickedIndex = index
            this.disabledAll = true
        },

        cancelEdit(index) {
            this.$set(this.isEditing, index, false)
            this.clickedIndex = null;
            this.disabledAll = false
            this.fetchBusinesses()
        },

        deleteBusiness() {
            const checkedBusiness = this.business.filter(business => business.checked);
            if (checkedBusiness.length === 0) {
                showError(t('kmaapp', 'Chọn ít nhất một Quá Trình Công Tác để xóa'));
                return;
            }

            checkedBusiness.forEach(business => {
                this.deleteBusinessAPI(business.business_id);
            });

            showSuccess(t('kmaapp', 'Xóa thành công!'));
        },

        updateAllCheckedItems() {
            this.business.forEach(user => {
                user.checked = this.checkedAll;
            });
        },

        updateCheckedItems() {
            this.checkedAll = this.business.every(user => user.checked);
        },

        updateModal(modal) {
            this.show = modal
        },

        async updateBusiness(index) {
            if (this.checkEdit(index)) {
                this.$set(this.isEditing, index, false)
                this.clickedIndex = null;
                this.disabledAll = false
                try {
                    const response = await axios.put('/apps/kmaapp/update_kma_business', {
                        business_id: this.business[index].business_id,
                        kma_uid: this.business[index].kma_uid,
                        start_time: this.business[index].start_time,
                        end_time: this.business[index].end_time,
                        unit: this.business[index].unit,
                        position: this.business[index].position,
                    });
                    this.fetchBusinesses()
                    showSuccess(t('kmaapp', 'Cập nhật thành công!'))
                } catch (e) {
                    console.error(e);
                }
            }
        },

        checkEdit(index) {
            let isValid = true
            if (!this.business[index].start_time) {
                showError('Ngày bắt đầu không được để trống')
                isValid = false
            }
            if (!this.business[index].end_time) {
                showError('Ngày kết thúc không được để trống')
                isValid = false
            }
            if (!this.business[index].position) {
                showError('Chức vụ không được để trống')
                isValid = false
            }
            if (!this.business[index].unit) {
                showError('Đơn vị không được để trống')
                isValid = false
            }
            if (this.business[index].start_time > this.business[index].end_time) {
                showError('Ngày kết thúc phải sau ngày bắt đầu')
                isValid = false
            }
            return isValid
        },

        async fetchBusinesses() {
            try {
                const response = await axios.get(generateUrl('apps/kmaapp/kma_business_by_uid/' + this.kma_uid))
                this.business = response.data.businesses
                this.show = false
                this.$emit('business-updated', this.business)
            } catch (e) {
                console.error(e)
            }
        },

        async deleteBusinessAPI(business_id) {
            try {
                console.log(generateUrl('apps/kmaapp/delete_kma_user/' + business_id))
                const response = await axios.delete(generateUrl('apps/kmaapp/delete_kma_business/' + business_id))
                this.fetchBusinesses()
                console.log(response)
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

label {
    color: #006aa3;
}

.combo-action {
    position: absolute;
    right: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    grid-gap: 15px;
}

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

.button {
    display: inline-block;
}
</style>
  