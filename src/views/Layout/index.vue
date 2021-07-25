<template>
  <div>
    <layout-header></layout-header>
    <layout-main></layout-main>
    <layout-nav></layout-nav>
  </div>
</template>

<script>
import LayoutHeader from "./Components/Header";
import LayoutMain from "./Components/Main";
import LayoutNav from "./Components/Nav";
export default {
  name: "index",
  components: { LayoutHeader, LayoutMain, LayoutNav },
};
</script>

<style scoped></style>
