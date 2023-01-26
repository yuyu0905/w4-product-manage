import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';
import { url, apiPath } from './env.js';
import { pagination } from '../components/pagination.js';
import { productModal } from '../components/productModal.js';
import { delProductModal } from '../components/delProductModal.js';

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
                this.$refs.productModal.showModal();
            } else if(operateType === 'modify') {
                this.tempProduct = {
                    ...product
                }
                this.$refs.productModal.showModal();
            } else if(operateType === 'delete') {
                this.tempProduct = {
                    ...product
                }
                this.$refs.delProductModal.showModal();
            }
        },
    },
    components: {
        pagination,
        productModal,
        delProductModal,
    },
    mounted() {
        // 取出 cookie 的 token
        const token =  document.cookie.replace(/(?:(?:^|.*;\s*)w4-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 加入 header
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
    },

});

app.mount('#app');