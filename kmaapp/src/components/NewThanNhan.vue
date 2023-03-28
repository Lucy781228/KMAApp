<template>
    <form method="post">
        <NcModal v-if="modal" @close="closeModal" title="THÊM MỚI THÂN NHÂN">
            <div class="modal__content">
                <div class="block-list">
                    <div class="block-list__item">
                        <label>Họ và tên</label>
                        <NcTextField :value.sync="relation.hoVaTen" />
                        <span class="error" :class="{ active: nameError }">{{ nameError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Ngày sinh</label>
                        <NcTextField :value.sync="relation.ngaySinh" type="date" />
                        <span class="error" :class="{ active: dateError }">{{ dateError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>SĐT</label>
                        <NcTextField :value.sync="relation.SDT" />
                        <span class="error" :class="{ active: phoneError }">{{ phoneError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Địa chỉ</label>
                        <NcTextField :value.sync="relation.diaChi" />
                        <span class="error" :class="{ active: addressError }">{{ addressError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Hình thức quan hệ</label>
                        <select class="field" v-model="relation.hinhThucQuanHe">
                            <option v-for="option in quanHe" :value="option.text">
                                {{ option.text }}
                            </option>
                        </select>
                        <span class="error" :class="{ active: relationshipError }">{{ relationshipError }}</span>
                    </div>
                </div>
                <br>
                <NcButton :disabled="isDisabled" class="my-button" type="primary" @click="createUser" :wide="true">
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
    name: "NewThanNhan",
    components: {
        NcModal,
        NcButton,
        NcTextField,
        NcSelect,
    },
    data() {
        return {
            modal: true,
            quanHe: [
                { text: 'Bố ruột' },
                { text: 'Mẹ ruột' },
                { text: 'Người nuôi dưỡng hợp pháp' },
                { text: 'Vợ' },
                { text: 'Chồng' },
                { text: 'Con ruột' },
                { text: 'Con nuôi hợp pháp' },
            ],
            relation: {
                hoVaTen: "",
                ngaySinh: null,
                SDT: null,
                diaChi: "",
                hinhThucQuanHe: null,
            },
        };
    },

    props: ['kma_uid',],

    computed: {
        dateError() {
            return ''
        },
        addressError() {
            return ''
        },
        relationshipError() {
            if (!this.relation.hinhThucQuanHe) {
                return 'Hình thức quan hệ không được để trống'
            }
            return ''
        },
        nameError() {
            if (!this.relation.hoVaTen) {
                return 'Họ và tên không được để trống'
            }
            return ''
        },
        phoneError() {
            const regex = /^\d{10}$/
            if (this.relation.SDT && !regex.test(this.relation.SDT)) {
                return 'SĐT phải có 10 chữ số'
            }
            return ''
        },
        isDisabled() {
            if (this.phoneError || this.nameError || this.relationshipError) {
                return true
            }
            return false
        }
    },

    methods: {
        async createUser(event) {
            event.preventDefault()
            try {
                const response = await axios.post('/apps/kmaapp/create_kma_relation', {
                    kma_uid: this.kma_uid,
                    full_name: this.relation.hoVaTen,
                    date_of_birth: this.relation.ngaySinh,
                    phone: this.relation.SDT,
                    address: this.relation.diaChi,
                    relationship: this.relation.hinhThucQuanHe,
                });
                this.$emit('refresh-relation-list');
                showSuccess(t('kmaapp', 'Tạo thành công!'))
                this.modal = false
            } catch (e) {
                console.error(e);
                showError(t('kmaapp', 'Could not create the user'));
            }

        },
        showModal() {
            this.modal = true;
        },
        closeModal() {
            this.modal = false;
            this.$emit('modal-updated', this.modal)

        },
    },
};
</script>
<style scoped>
.modal__content {
    margin: 50px;
    text-align: left;
}

.error {
    color: red;
    font-size: 12px;
    display: inline-block;
    height: 0;
}

.error.active {
    height: auto;
}

.block-list {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    grid-gap: 20px;
    width: 100%;
    height: 70%;
}

.field {
  width: 100%;
}
</style>
  