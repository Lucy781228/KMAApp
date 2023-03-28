<template>
    <div>
        <h2 v-if="!isExist">Không có quá trình đào tạo nào.</h2>
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
                <NcButton :disabled="disabledAll" :readonly="readonly" type="error" :wide="true" @click="deleteEducation">
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
                    <th>Ngày tốt nghiệp</th>
                    <th>Đơn vị</th>
                    <th>Chuyên ngành</th>
                    <th>Văn bằng</th>
                    <th>Kết quả</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in education" :key="item.education_id">
                    <td>
                        <input type="checkbox" :disabled="disabledAll" v-model="item.checked" @change="updateCheckedItems">
                    </td>
                    <td>{{ index + 1 }}</td>
                    <td v-if="!isEditing[index]">{{ item.admision_time }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.admision_time" type="date" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.graduate_time }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.graduate_time" type="date" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.training_unit }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.training_unit" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.specialization }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.specialization" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.diploma }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.diploma" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.graduated_with }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.graduated_with" type="text" />
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
                                @click="updateEducation(index)">
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
            <NewDaoTao @modal-updated="updateModal" :kma_uid="kma_uid" @refresh-education-list="fetchEducations" />
        </div>
    </div>
</template>
  
<script>
import { NcTextField, NcButton, NcSelect } from "@nextcloud/vue";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import NewDaoTao from './NewDaoTao'
import DeleteOutline from 'vue-material-design-icons/DeleteOutline'
import Close from 'vue-material-design-icons/Close'
import Check from 'vue-material-design-icons/Check'
import Plus from 'vue-material-design-icons/Plus'
import PencilOutline from 'vue-material-design-icons/PencilOutline'
import axios from '@nextcloud/axios'

export default {
    name: "QTDaoTao",
    components: {
        NewDaoTao,
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
        education: {
            type: Array,
            required: true
        }
    },

    mounted() {
        this.fetchEducations()
    },

    computed: {
        isExist() {
            return this.education.length > 0;
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
            this.fetchEducations()
        },

        deleteEducation() {
            const checkedEducation = this.education.filter(education => education.checked);
            if (checkedEducation.length === 0) {
                showError(t('kmaapp', 'Chọn ít nhất một Quá Trình Đào Tạo để xóa'));
                return;
            }

            checkedEducation.forEach(education => {
                this.deleteEducationAPI(education.education_id);
            });

            showSuccess(t('kmaapp', 'Xóa thành công!'));
        },

        updateAllCheckedItems() {
            this.education.forEach(user => {
                user.checked = this.checkedAll;
            });
        },

        updateCheckedItems() {
            this.checkedAll = this.education.every(user => user.checked);
        },

        updateModal(modal) {
            this.show = modal
        },

        async updateEducation(index) {
            if (this.checkEdit(index)) {
                this.$set(this.isEditing, index, false)
                this.clickedIndex = null;
                this.disabledAll = false
                try {
                    const response = await axios.put('/apps/kmaapp/update_kma_education', {
                        education_id: this.education[index].education_id,
                        kma_uid: this.education[index].kma_uid,
                        graduate_time: this.education[index].graduate_time,
                        admision_time: this.education[index].admision_time,
                        training_unit: this.education[index].training_unit,
                        specialization: this.education[index].specialization,
                        diploma: this.education[index].diploma,
                        graduated_with: this.education[index].graduated_with,
                    });
                    this.fetchEducations()
                    showSuccess(t('kmaapp', 'Cập nhật thành công!'))
                } catch (e) {
                    console.error(e);
                }
            }
        },

        checkEdit(index) {
            let isValid = true
            if (!this.education[index].admision_time) {
                showError('Ngày bắt đầu không được để trống')
                isValid = false
            }
            if (!this.education[index].graduate_time) {
                showError('Ngày tốt nghiệp không được để trống')
                isValid = false
            }
            if (!this.education[index].training_unit) {
                showError('Đơn vị không được để trống')
                isValid = false
            }
            if (!this.education[index].specialization) {
                showError('Chuyên ngành không được để trống')
                isValid = false
            }
            if (!this.education[index].diploma) {
                showError('Văn bằng không được để trống')
                isValid = false
            }
            if (!this.education[index].graduated_with) {
                showError('Kết quả không được để trống')
                isValid = false
            }
            if (this.education[index].admision_time > this.education[index].graduate_time) {
                showError('Ngày tốt nghiệp phải sau ngày bắt đầu')
                isValid = false
            }
            return isValid
        },

        async fetchEducations() {
            try {
                const response = await axios.get(generateUrl('apps/kmaapp/kma_education_by_uid/' + this.kma_uid))
                this.education = response.data.educations
                this.show = false
                this.$emit('education-updated', this.education)
            } catch (e) {
                console.error(e)
            }
        },

        async deleteEducationAPI(education_id) {
            try {
                const response = await axios.delete(generateUrl('apps/kmaapp/delete_kma_education/' + education_id))
                this.fetchEducations()
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
  