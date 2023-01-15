import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';
import { pagination } from './pagination.js';

const url = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'vue-hexschool-product-list';

let productModal = null;
let delProductModal = null;

// 可以新增、編輯、刪除商品
// 商品啟用、關閉可以使用不同的顏色標示

// 1. 建立元件
// 2. 生成 vue 元件
// 3. 渲染至畫面上
const app = createApp({
    data() {
        return {
            products: [],
            operateType: '',
            tempProduct: {
                imagesUrl: []
            },
            pagination: {},
        }
    },
    methods: {
        checkLogin() {
            axios.post(`${url}/api/user/check`)
            .then(res => {
                // 驗證成功
                this.getProducts();
            })
            .catch(err => {
                alert(err.data.message);
                window.location = 'index.html';
            });
        },

        getProducts(pageNum = 1) { // 參數預設值
            axios.get(`${url}/api/${apiPath}/admin/products?page=${pageNum}`)
            .then(res => {
                this.products = res.data.products;
                this.pagination = res.data.pagination;
            })
            .catch(err => {
                alert(err.data.message);
                window.location = 'index.html';
            })
        },

        openModal(operateType, product) {
            this.operateType = operateType;
            if(operateType === 'create') {
                this.tempProduct = {
                    imagesUrl: []
                }
                productModal.show();
            } else if(operateType === 'modify') {
                this.tempProduct = {
                    ...product
                }
                productModal.show();
            } else if(operateType === 'delete') {
                this.tempProduct = {
                    ...product
                }
                delProductModal.show();
            }
        },
    },
    components: {
        pagination
    },
    mounted() {
        // 取出 cookie 的 token
        const token =  document.cookie.replace(/(?:(?:^|.*;\s*)w4-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 加入 header
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
    },

});

// productModal
app.component('productModal', {
    template: '#productModal',
    props: ['tempProduct', 'operateType'],
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
                    productModal.hide();
                    this.$emit('reloadPage');
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },
    },
    mounted() {
        // dom 生成後，再取得 model
        productModal = new bootstrap.Modal(document.getElementById('productModal'), { keyboard: false });
    }
});

// delProductModal
app.component('delProductModal', {
    template: '#delProductModal',
    props: ['tempProduct'],
    methods: {
        // 刪除商品
        deleteProduct() {
            axios.delete(`${url}/api/${apiPath}/admin/product/${this.tempProduct.id}`,{ data: this.tempProduct })
            .then(res => {
                alert(res.data.message);
                delProductModal.hide();
                this.$emit('reloadPage');
            })
            .catch(err => {
                alert(err.data.message);
            });
        }
    },
    mounted() {
        // dom 生成後，再取得 model
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), { keyboard: false });
    },
})

app.mount('#app');