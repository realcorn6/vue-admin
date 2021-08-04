<template>
  <div class="header-wrap">头部</div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
.header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navMenu;
  height: $header;
  background-color: #fff;
  -webkit-box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
}
</style>
