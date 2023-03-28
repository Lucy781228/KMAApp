<template>
    <div>
        <h2 v-if="!isExist">Không có quá trình kỷ luật nào.</h2>
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
                <NcButton :disabled="disabledAll" :readonly="readonly" type="error" :wide="true" @click="deleteBonus">
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
                    <th>Số quyết định</th>
                    <th>Cơ quan quyết định</th>
                    <th>Thời gian</th>
                    <th>Hình thức</th>
                    <th>Lý do</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in kyLuat" :key="item.bonus_id">
                    <td>
                        <input type="checkbox" :disabled="disabledAll" v-model="item.checked" @change="updateCheckedItems">
                    </td>
                    <td>{{ index + 1 }}</td>
                    <td v-if="!isEditing[index]">{{ item.number_decision }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.number_decision" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.department_decision }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.department_decision" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.time }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.time" type="date" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.form }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.form" type="text" />
                    </td>
                    <td v-if="!isEditing[index]">{{ item.reason }}</td>
                    <td v-if="isEditing[index]">
                        <NcTextField :value.sync="item.reason" type="text" />
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
                                @click="updateBonus(index)">
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
            <NewKyLuat @modal-updated="updateModal" :kma_uid="kma_uid" @refresh-kyluat-list="fetchKyLuat" />
        </div>
    </div>
</template>
  
<script>
import { NcTextField, NcButton, NcSelect } from "@nextcloud/vue";
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import NewKyLuat from './NewKyLuat'
import DeleteOutline from 'vue-material-design-icons/DeleteOutline'
import Close from 'vue-material-design-icons/Close'
import Check from 'vue-material-design-icons/Check'
import Plus from 'vue-material-design-icons/Plus'
import PencilOutline from 'vue-material-design-icons/PencilOutline'
import axios from '@nextcloud/axios'

export default {
    name: "QTKyLuat",
    components: {
        NewKyLuat,
        NcButton,
        NcTextField,
        NcSelect,
        DeleteOutline,
        Plus,
        PencilOutline,
        Check,
        Close,
    },
    data() {
        return {
            bonus: [],
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
        kyLuat: {
            type: Array,
            required: true
        }
    },

    mounted() {
        this.fetchKyLuat()
    },

    computed: {
        isExist() {
            return this.kyLuat.length > 0;
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
            this.fetchKyLuat()
        },

        deleteBonus() {
            const checkedKhenThuong = this.kyLuat.filter(kyLuat => kyLuat.checked);
            if (checkedKhenThuong.length === 0) {
                showError(t('kmaapp', 'Chọn ít nhất một Quá Trình Kỷ Luật để xóa'));
                return;
            }

            checkedKhenThuong.forEach(kyLuat => {
                this.deleteBonusAPI(kyLuat.bonus_id);
            });

            showSuccess(t('kmaapp', 'Xóa thành công!'));
        },

        updateAllCheckedItems() {
            this.kyLuat.forEach(user => {
                user.checked = this.checkedAll;
            });
        },

        updateCheckedItems() {
            this.checkedAll = this.kyLuat.every(user => user.checked);
        },

        updateModal(modal) {
            this.show = modal
        },

        async updateBonus(index) {
            if (this.checkEdit(index)) {
                this.$set(this.isEditing, index, false)
                this.clickedIndex = null;
                this.disabledAll = false
                try {
                    const response = await axios.put('/apps/kmaapp/update_kma_bonus', {
                        bonus_id: this.kyLuat[index].bonus_id,
                        kma_uid: this.kyLuat[index].kma_uid,
                        time: this.kyLuat[index].time,
                        form: this.kyLuat[index].form,
                        reason: this.kyLuat[index].reason,
                        number_decision: this.kyLuat[index].number_decision,
                        department_decision: this.kyLuat[index].department_decision,
                        type: this.kyLuat[index].type,
                    });
                    this.fetchKyLuat()
                    showSuccess(t('kmaapp', 'Cập nhật thành công!'))
                } catch (e) {
                    console.error(e);
                }
            }
        },

        checkEdit(index) {
            let isValid = true
            if (!this.kyLuat[index].number_decision) {
                showError('Số quyết định không được để trống')
                isValid = false
            }
            if (!this.kyLuat[index].department_decision) {
                showError('Cơ quan quyết định không được để trống')
                isValid = false
            }
            if (!this.kyLuat[index].time) {
                showError('Thời gian không được để trống')
                isValid = false
            }
            if (!this.kyLuat[index].form) {
                showError('Hình thức không được để trống')
                isValid = false
            }
            return isValid
        },

        async fetchKyLuat() {
            try {
                const response = await axios.get(generateUrl('apps/kmaapp/kma_bonus_by_uid/' + this.kma_uid))
                this.bonus = response.data.bonuses
                this.kyLuat = this.bonus.filter((e) => e.type === 0)
                this.show = false
                this.$emit('kyluat-updated', this.kyLuat)
            } catch (e) {
                console.error(e)
            }
        },

        async deleteBonusAPI(bonus_id) {
            try {
                const response = await axios.delete(generateUrl('apps/kmaapp/delete_kma_bonus/' + bonus_id))
                this.fetchKyLuat()
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
  