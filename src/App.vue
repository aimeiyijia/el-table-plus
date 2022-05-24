<script setup lang="ts">
import { ref, reactive } from 'vue'
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
  {
    name: '张如霞',
    sex: '女',
    age: 16,
    address: '江苏省 南京市',
    desc: {
      height: 160,
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
  {
    name: '张如霞',
    sex: '女',
    age: 16,
    address: '江苏省 南京市',
    desc: {
      height: 160,
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
  {
    name: '张如霞',
    sex: '女',
    age: 16,
    address: '江苏省 南京市',
    desc: {
      height: 160,
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
  { label: '姓名', type: 'index', prop: 'index' },
  { label: '姓名', prop: 'name' },
  { label: '性别', prop: 'sex' },
  { label: '年龄', prop: 'age' },
  { label: '地址', prop: 'address' },
  { label: '描述', prop: 'desc.height' },
  {
    label: '操作',
    fixed: 'right',
    prop: 'handle',
    width: '240',
    slots: {
      customRender: 'handle',
      customTitle: 'handleTitle',
    },
  },
]

const colAttrs = {
  align: 'center'
}

const directives = reactive({
  // 高度自适应指令配置项
  heightAdaptive: {
    bottomOffset: 600,
  },
})

const handleDetail = (a: any) => {
  console.log(a)
}

const handlePageChange = (a: any) => {
  console.log(a, '分页')
}
</script>

<template>
  <el-table-plus :pagination="{}" :data="data" :columns="columns" :colAttrs="colAttrs" :directives="directives" :total="100" @page-change="handlePageChange">
    <template #handle="{ cellValue, row, column }">
      <el-button type="primary" @click="handleDetail({ cellValue, row, column })">
        查看详情
      </el-button>
      <el-button type="danger">删除</el-button>
    </template>
    <template #handleTitle>我是自定义的操作标题</template>
  </el-table-plus>
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
