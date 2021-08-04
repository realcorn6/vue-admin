<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
    export default {
        name: "SvgIcon",
        // props: ['iconClass', 'className'],
        props: {
            iconClass: {
                type: String, // 定义接收的值的类型
                default: ''
            },
            className: {
                type: String, // 定义接收的值的类型
                default: ''
            }
        },
        computed: {
            iconName: function() { return "#icon-${this.iconClass}" },
            svgClass: function() {
                if (this.className) {
                    return 'svg-icon ${this.className}'
                } else {
                    return 'svg-icon'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
}
</style>
