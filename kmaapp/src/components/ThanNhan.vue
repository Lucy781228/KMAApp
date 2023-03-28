<template>
    <div>
        <h2 v-if="!isExist">Không có thân nhân nào.</h2>
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
                <NcButton :disabled="disabledAll" :readonly="readonly" type="error" :wide="true" @click="deleteRelation">
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
                    <th>Họ và tên</th>
                    <th>Ngày sinh</th>
                    <th>SĐT</th>
                    <th>Địa chỉ</th>
                    <th>Hình thức quan hệ</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in relation" :key="item.relations_id">
                    <td>
                        <input type="checkbox" :disabled="disabledAll" v-model="item.checked" @change="updateCheckedItems">
                    </td>
                    <td>{{ index + 1 }}</td>
                    <td v-if="!isEditing[index]">{{ item.full_name }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.full_name" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.date_of_birth }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.date_of_birth" type="date" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.phone }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.phone" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.address }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.address" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.relationship }}</td>
                    <td v-if="isEditing[index]">
                        <select class="field" v-model="item.relationship">
                            <option v-for="option in quanHe" :value="option.text">
                                {{ option.text }}
                            </option>
                        </select>
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
                                @click="updateRelation(index)">
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
            <NewThanNhan @modal-updated="updateModal" :kma_uid="kma_uid" @refresh-relation-list="fetchRelations" />
        </div>
    </div>
</template>
  
<script>
import { NcTextField, NcButton, NcSelect } from "@nextcloud/vue";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import NewThanNhan from './NewThanNhan'
import DeleteOutline from 'vue-material-design-icons/DeleteOutline'
import Close from 'vue-material-design-icons/Close'
import Check from 'vue-material-design-icons/Check'
import Plus from 'vue-material-design-icons/Plus'
import PencilOutline from 'vue-material-design-icons/PencilOutline'
import axios from '@nextcloud/axios'

export default {
    name: "ThanNhan",
    components: {
        NewThanNhan,
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
            quanHe: [
                { text: 'Bố ruột' },
                { text: 'Mẹ ruột' },
                { text: 'Người nuôi dưỡng hợp pháp' },
                { text: 'Vợ' },
                { text: 'Chồng' },
                { text: 'Con ruột' },
                { text: 'Con nuôi hợp pháp' },
            ],
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
        relation: {
            type: Array,
            required: true
        }
    },

    mounted() {
        this.fetchRelations()
    },

    computed: {
        isExist() {
            return this.relation.length > 0;
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
            this.fetchRelations()
        },

        deleteRelation() {
            const checkedEducation = this.relation.filter(education => education.checked);
            if (checkedEducation.length === 0) {
                showError(t('kmaapp', 'Chọn ít nhất một Thân Nhân để xóa'));
                return;
            }

            checkedEducation.forEach(education => {
                this.deleteRelationAPI(education.relations_id);
            });

            showSuccess(t('kmaapp', 'Xóa thành công!'));
        },

        updateAllCheckedItems() {
            this.relation.forEach(user => {
                user.checked = this.checkedAll;
            });
        },

        updateCheckedItems() {
            this.checkedAll = this.relation.every(user => user.checked);
        },

        updateModal(modal) {
            this.show = modal
        },

        async updateRelation(index) {
            if (this.checkEdit(index)) {
                this.$set(this.isEditing, index, false)
                this.clickedIndex = null;
                this.disabledAll = false
                try {
                    const response = await axios.put('/apps/kmaapp/update_kma_relation', {
                        relations_id: this.relation[index].relations_id,
                        kma_uid: this.relation[index].kma_uid,
                        full_name: this.relation[index].full_name,
                        date_of_birth: this.relation[index].date_of_birth,
                        phone: this.relation[index].phone,
                        address: this.relation[index].address,
                        relationship: this.relation[index].relationship,
                    });
                    this.fetchRelations()
                    showSuccess(t('kmaapp', 'Cập nhật thành công!'))
                } catch (e) {
                    console.error(e);
                }
            }
        },

        checkEdit(index) {
            let isValid = true
            if (!this.relation[index].full_name) {
                showError('Họ và tên không được để trống')
                isValid = false
            }
            if (!this.relation[index].relationship) {
                showError('Hình thức quan hệ không được để trống')
                isValid = false
            }
            const regex = /^\d{10}$/
            if (this.relation[index].phone && !regex.test(this.relation[index].phone)) {
                showError('SĐT phải có 10 chữ số')
                isValid = false
            }
            return isValid
        },

        async fetchRelations() {
            try {
                const response = await axios.get(generateUrl('apps/kmaapp/kma_relation_by_uid/' + this.kma_uid))
                this.relation = response.data.relations
                this.show = false
                this.$emit('relation-updated', this.relation)
            } catch (e) {
                console.error(e)
            }
        },

        async deleteRelationAPI(relations_id) {
            try {
                const response = await axios.delete(generateUrl('apps/kmaapp/delete_kma_relation/' + relations_id))
                this.fetchRelations()
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
  