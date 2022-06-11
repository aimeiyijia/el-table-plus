<script setup lang="ts">
import { ref, reactive } from "vue";
const data: any = [
  {
    name: "刘小凡",
    sex: "男",
    age: 18,
    address: "江苏省 南京市",
    desc: {
      height: 180,
    },
  },
  {
    name: "张如霞",
    sex: "女",
    age: 16,
    address: "江苏省 南京市",
    desc: {
      height: 160,
    },
  },
  {
    name: "张如霞",
    sex: "女",
    age: 16,
    address: "江苏省 南京市",
    desc: {
      height: 160,
    },
  },
  {
    name: "张如霞",
    sex: "女",
    age: 16,
    address: "江苏省 南京市",
    desc: {
      height: 160,
    },
  },
  {
    name: "张如霞",
    sex: "女",
    age: 16,
    address: "江苏省 南京市",
    desc: {
      height: 160,
    },
  },
  {
    name: "张如霞",
    sex: "女",
    age: 16,
    address: "江苏省 南京市",
    desc: {
      height: 160,
    },
  },
  {
    name: "张如霞",
    sex: "女",
    age: 16,
    address: "江苏省 南京市",
    desc: {
      height: 160,
    },
  },
  {
    name: "张如霞",
    sex: "女",
    age: 16,
    address: "江苏省 南京市",
    desc: {
      height: 160,
    },
  },
  {
    name: "张如霞",
    sex: "女",
    age: 16,
    address: "江苏省 南京市",
    desc: {
      height: 160,
    },
  },
];
const columns: any = [
  { label: "姓名", type: "selection", prop: "selection" },
  { label: "姓名", type: "index", prop: "index" },
  { label: "姓名", prop: "name" },
  { label: "性别", prop: "sex" },
  { label: "年龄", prop: "age" },
  { label: "地址", prop: "address" },
  { label: "描述", prop: "desc.height" },
  {
    label: "操作",
    fixed: "right",
    prop: "handle",
    width: "240",
    slots: {
      customRender: "handle",
      customTitle: "handleTitle",
    },
  },
];

const colAttrs = {
  align: "center",
};

const pagination = {
  pageSizes: [10, 20, 30, 50],
  layout: "prev, pager, next, sizes, total, slot",
  background: true,
  defaultPageSize: 10,
  defaultCurrentPage: 4,
};

const directives = reactive({
  // 高度自适应指令配置项
  heightAdaptive: {
    bottomOffset: 60,
  },
});

const handleDetail = (a: any) => {
  console.log(a);
};

const handlePageChange = (a: any) => {
  console.log(a, "页面变化");
};
const handleSizeChange = (a: any) => {
  console.log(a, "个数变化");
};
const handlePrevClick = (a: any) => {
  console.log(a, "上一步");
};
const handleNextClick = (a: any) => {
  console.log(a, "下一步");
};
</script>

<template>
  <el-table-plus
    :pagination="pagination"
    :data="data"
    :columns="columns"
    :colAttrs="colAttrs"
    :directives="directives"
    :total="100"
    @page-change="handlePageChange"
    @size-change="handleSizeChange"
    @prev-click="handlePrevClick"
    @next-click="handleNextClick"
  >
    <template #handle="{ cellValue, row, column }">
      <el-button type="primary" @click="handleDetail({ cellValue, row, column })">
        查看详情
      </el-button>
      <el-button type="danger">删除</el-button>
    </template>
    <template #handleTitle>我是自定义的操作标题</template>
    <template #pagination>分页插槽</template>
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
