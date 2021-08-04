<template>
  <div class="nav-wrap">
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      text-color="#fff"
      background-color="transparent"
      active-text-color="#fff"
      router
    >
      <template v-for="item in this.router">
        <el-submenu
          :index="item.path"
          :key="item.id"
          v-if="!item.hidden"
        >
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.id"
            :index="subItem.path"
            >{{ subItem.meta.name }}</el-menu-item
          >
        </el-submenu>
      </template>
      <svg-icon iconClass="menu" className="menu"></svg-icon>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Nav",
  data() {
    return {
      isCollapse: false,
      router: this.$router.options.routes,
    };
  },
  methods: {},
  mounted() {
    console.log(this.router);
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
.nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
}
</style>
