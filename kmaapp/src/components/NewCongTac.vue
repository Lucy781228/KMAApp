<template>
    <form method="post">
        <NcModal v-if="modal" @close="closeModal" title="THÊM QUÁ TRÌNH CÔNG TÁC">
            <div class="modal__content">
                <div class="block-list">
                    <div class="block-list__item">
                        <label>Ngày bắt đầu</label>
                        <NcTextField :value.sync="business.ngayBatDau" type="date" />
                        <span class="error" :class="{ active: startDateError }">{{ startDateError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Ngày kết thúc</label>
                        <NcTextField :value.sync="business.ngayKetThuc" type="date" />
                        <span class="error" :class="{ active: endDateError }">{{ endDateError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Chức vụ</label>
                        <NcTextField :value.sync="business.chucVu" />
                        <span class="error" :class="{ active: positionError }">{{ positionError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Đơn vị</label>
                        <NcTextField :value.sync="business.donVi" />
                        <span class="error" :class="{ active: unitError }">{{ unitError }}</span>
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
    name: "NewCongTac",
    components: {
        NcModal,
        NcButton,
        NcTextField,
        NcSelect,
    },
    data() {
        return {
            modal: true,
            business: {
                ngayBatDau: null,
                ngayKetThuc: null,
                chucVu: "",
                donVi: "",
            },
        };
    },

    props: ['kma_uid',],

    computed: {
        startDateError() {
            if (!this.business.ngayBatDau) {
                return 'Ngày bắt đầu không được để trống'
            }
            return ''
        },
        endDateError() {
            if (!this.business.ngayKetThuc) {
                return 'Ngày kết thúc không được để trống'
            }
            else if (this.business.ngayBatDau && this.business.ngayBatDau > this.business.ngayKetThuc) {
                return 'Ngày kết thúc phải sau ngày bắt đầu'

            }
            return ''
        },
        unitError() {
            if (!this.business.donVi) {
                return 'Đơn vị không được để trống'
            }
            return ''
        },
        positionError() {
            if (!this.business.chucVu) {
                return 'Chức vụ không được để trống'
            }
            return ''
        },
        isDisabled() {
            if (this.startDateError || this.endDateError || this.unitError || this.positionError) {
                return true
            }
            return false
        }
    },

    methods: {
        async createUser(event) {
            if (!this.startDateError && !this.endDateError && !this.unitError && !this.positionError) {
                event.preventDefault()
                try {
                    const response = await axios.post('/apps/kmaapp/create_kma_business', {
                        kma_uid: this.kma_uid,
                        start_time: this.business.ngayBatDau,
                        end_time: this.business.ngayKetThuc,
                        unit: this.business.donVi,
                        position: this.business.chucVu,
                    });
                    this.$emit('refresh-business-list');
                    showSuccess(t('kmaapp', 'Tạo thành công!'))
                    this.modal = false
                } catch (e) {
                    console.error(e);
                    showError(t('kmaapp', 'Could not create the user'));
                }
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
  