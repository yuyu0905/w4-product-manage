import { url, apiPath } from '../js/env.js';

export const delProductModal = {
    template: '#delProductModal',
    props: ['tempProduct'],
    data() {
        return {
            delProductModal: '',
        }
    },
    methods: {
        // 刪除商品
        deleteProduct() {
            axios.delete(`${url}/api/${apiPath}/admin/product/${this.tempProduct.id}`,{ data: this.tempProduct })
            .then(res => {
                alert(res.data.message);
                this.delProductModal.hide();
                this.$emit('reloadPage');
            })
            .catch(err => {
                alert(err.data.message);
            });
        },

        showModal() {
            this.delProductModal.show();
        }
    },
    mounted() {
        // dom 生成後，再取得 model
        this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal, { keyboard: false });
    }
}