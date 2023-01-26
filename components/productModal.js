import { url, apiPath } from '../js/env.js';

export const productModal = {
    template: '#productModal',
    props: ['tempProduct', 'operateType'],
    data() {
        return {
            productModal: '',
        }
    },
    methods: {
        // 新增圖片
        createImagesUrl() {
            if(!this.tempProduct.imagesUrl) {
                this.tempProduct.imagesUrl = [];
            }
            this.tempProduct.imagesUrl.push('');
        },

        // 刪除圖片
        deleteImagesUrl() {
            this.tempProduct.imagesUrl.pop();
        },

        // 新增 & 修改 產品
        saveProduct() {
            let api = `${url}/api/${apiPath}/admin/product`;
            
            if(this.operateType === 'modify') {
                api = `${url}/api/${apiPath}/admin/product/${this.tempProduct.id}`
            }
            axios[this.operateType === 'create' ? 'post' : 'put'](`${api}`,{ data: this.tempProduct })
                .then(res => {
                    alert(res.data.message);
                    this.productModal.hide();
                    this.$emit('reloadPage');
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },

        showModal() {
            this.productModal.show();
        }
    },
    mounted() {
        // dom 生成後，再取得 model
        this.productModal = new bootstrap.Modal(this.$refs.productModal, { keyboard: false });
    }
}