<template>
  <router-view />
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-family: "SUITE", sans-serif;
}

a {
  text-decoration: none;
  color: inherit;
}

ul,
ol {
  list-style: none;
}

.datatable .dt-cell__content {
  font-size: 14px; /* 원하는 크기로 조정 */
  overflow-y: auto;
  line-height: 1.5;
  text-overflow: unset;
  white-space: unset;
}

.datatable .dt-cell__content--col-1 {
  overflow-y: hidden;
}

.datatable .dt-header .dt-row {
  height: 48px;
}

.datatable .dt-cell__content--header-1 {
  text-align: center;
}
</style>
