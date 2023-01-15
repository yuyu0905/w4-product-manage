// 分頁元件
export const pagination = {
    template: '#pagination',
    props: ['pagination'],
    methods: {
        changePage(page) {
            // 呼叫根元件的方法 取名 & 參數
            this.$emit('changePage', page);
        }
    }
}