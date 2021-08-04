<template>
  <div class="main-wrap">
    内容区
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Main",
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
.main-wrap {
  position: fixed;
  left: $navMenu;
  top: $header;
  right: 0;
  bottom: 0;
  border: 30px solid #f7f7f7;
  border-bottom: none;
}
</style>
