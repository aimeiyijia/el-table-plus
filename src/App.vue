<script setup lang="ts">
const data: any = [
  {
    name: '刘小凡',
    sex: '男',
    age: 18,
    address: '江苏省 南京市',
    desc: {
      height: 180,
    },
  },
  {
    name: '张如霞',
    sex: '女',
    age: 16,
    address: '江苏省 南京市',
    desc: {
      height: 160,
    },
  },
]
const columns: any = [
  { label: '姓名', prop: 'name' },
  { label: '性别', prop: 'sex' },
  { label: '年龄', prop: 'age' },
  { label: '地址', prop: 'address' },
  { label: '描述', prop: 'desc.height' },
]
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <el-table-plus :data="data" :columns="columns" @click="() => {}"></el-table-plus>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
