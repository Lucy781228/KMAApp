<template>
    <form method="post">
        <NcModal v-if="modal" @close="closeModal" title="THÊM QUÁ TRÌNH ĐÀO TẠO">
            <div class="modal__content">
                <div class="block-list">
                    <div class="block-list__item">
                        <label>Ngày bắt đầu</label>
                        <NcTextField :value.sync="education.ngayBatDau" type="date" />
                        <span class="error" :class="{ active: startDateError }">{{ startDateError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Ngày tốt nghiệp</label>
                        <NcTextField :value.sync="education.ngayTotNghiep" type="date" />
                        <span class="error" :class="{ active: endDateError }">{{ endDateError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Đơn vị</label>
                        <NcTextField :value.sync="education.donVi" />
                        <span class="error" :class="{ active: unitError }">{{ unitError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Chuyên ngành</label>
                        <NcTextField :value.sync="education.chuyenNganh" />
                        <span class="error" :class="{ active: specialError }">{{ specialError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Văn bằng</label>
                        <NcTextField :value.sync="education.vanBang" />
                        <span class="error" :class="{ active: diplomaError }">{{ diplomaError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Kết quả</label>
                        <NcTextField :value.sync="education.ketQua" />
                        <span class="error" :class="{ active: graduatedError }">{{ graduatedError }}</span>
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
    name: "NewDaoTao",
    components: {
        NcModal,
        NcButton,
        NcTextField,
        NcSelect,
    },
    data() {
        return {
            modal: true,
            education: {
                ngayBatDau: null,
                ngayTotNghiep: null,
                donVi: "",
                chuyenNganh: "",
                vanBang: "",
                ketQua: "",
            },
        };
    },

    props: ['kma_uid',],

    computed: {
        startDateError() {
            if (!this.education.ngayBatDau) {
                return 'Ngày bắt đầu không được để trống'
            }
            return ''
        },
        endDateError() {
            if (!this.education.ngayTotNghiep) {
                return 'Ngày tốt nghiệp không được để trống'
            }
            else if (this.education.ngayBatDau && this.education.ngayBatDau > this.education.ngayTotNghiep) {
                return 'Ngày tốt nghiệp phải sau ngày bắt đầu'

            }
            return ''
        },
        unitError() {
            if (!this.education.donVi) {
                return 'Đơn vị không được để trống'
            }
            return ''
        },
        specialError() {
            if (!this.education.chuyenNganh) {
                return 'Chuyên ngành không được để trống'
            }
            return ''
        },
        diplomaError() {
            if (!this.education.vanBang) {
                return 'Văn bằng không được để trống'
            }
            return ''
        },
        graduatedError() {
            if (!this.education.ketQua) {
                return 'Kết quả không được để trống'
            }
            return ''
        },
        isDisabled() {
            if (this.startDateError || this.endDateError || this.unitError || this.specialError || this.diplomaError || this.graduatedError) {
                return true
            }
            return false
        }
    },

    methods: {
        async createUser(event) {
                event.preventDefault()
                try {
                    const response = await axios.post('/apps/kmaapp/create_kma_education', {
                        kma_uid: this.kma_uid,
                        admision_time: this.education.ngayBatDau,
                        graduate_time: this.education.ngayTotNghiep,
                        training_unit: this.education.donVi,
                        specialization: this.education.chuyenNganh,
                        diploma: this.education.vanBang,
                        graduated_with: this.education.ketQua
                    });
                    this.$emit('refresh-education-list');
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
</style>
  