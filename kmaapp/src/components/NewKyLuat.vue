<template>
    <form method="post">
        <NcModal v-if="modal" @close="closeModal" title="THÊM QUÁ TRÌNH KỶ LUẬT">
            <div class="modal__content">
                <div class="block-list">
                    <div class="block-list__item">
                        <label>Số quyết định</label>
                        <NcTextField :value.sync="kyLuat.soQuyetDinh" />
                        <span class="error" :class="{ active: numberError }">{{ numberError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Cơ quan quyết định</label>
                        <NcTextField :value.sync="kyLuat.coQuanQuyetDinh" />
                        <span class="error" :class="{ active: departmentError }">{{ departmentError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Thời gian</label>
                        <NcTextField :value.sync="kyLuat.thoiGian" type="date" />
                        <span class="error" :class="{ active: timeError }">{{ timeError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Hình thức</label>
                        <NcTextField :value.sync="kyLuat.hinhThuc" />
                        <span class="error" :class="{ active: formError }">{{ formError }}</span>
                    </div>
                    <div class="block-list__item">
                        <label>Lý do</label>
                        <NcTextField :value.sync="kyLuat.lyDo" />
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
    name: "NewKyLuat",
    components: {
        NcModal,
        NcButton,
        NcTextField,
        NcSelect,
    },
    data() {
        return {
            modal: true,
            kyLuat: {
                soQuyetDinh: "",
                coQuanQuyetDinh: "",
                thoiGian: null,
                hinhThuc: "",
                lyDo: "",
            },
        };
    },

    props: ['kma_uid',],

    computed: {
        numberError() {
            if (!this.kyLuat.soQuyetDinh) {
                return 'Số quyết định không được để trống'
            }
            return ''
        },
        departmentError() {
            if (!this.kyLuat.coQuanQuyetDinh) {
                return 'Cơ quan quyết định không được để trống'
            }
            return ''
        },
        timeError() {
            if (!this.kyLuat.thoiGian) {
                return 'Thời gian không được để trống'
            }
            return ''
        },
        formError() {
            if (!this.kyLuat.hinhThuc) {
                return 'Hình thức không được để trống'
            }
            return ''
        },
        isDisabled() {
            if (this.numberError || this.departmentError || this.timeError || this.formError) {
                return true
            }
            return false
        }
    },

    methods: {
        async createUser(event) {
                event.preventDefault()
                try {
                    const response = await axios.post('/apps/kmaapp/create_kma_bonus', {
                        kma_uid: this.kma_uid,
                        time: this.kyLuat.thoiGian,
                        form: this.kyLuat.hinhThuc,
                        number_decision: this.kyLuat.soQuyetDinh,
                        department_decision: this.kyLuat.coQuanQuyetDinh,
                        reason: this.kyLuat.lyDo,
                        type: 0
                    });
                    this.$emit('refresh-kyluat-list');
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
  