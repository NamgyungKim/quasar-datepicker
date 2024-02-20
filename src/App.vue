<template>
  <main>
    <DatePicker v-model="range" :select-date-list="selectDateList" />
  </main>
</template>

<script setup lang="ts">
import { ref, type UnwrapRef } from 'vue'
import DatePicker from '@/components/DatePicker.vue'
import QDate, { today } from '@/plugins/date'
import type { SelectDateListType } from '@/type/type'

const newDate = new Date()
const qDate = new QDate()
const range = ref([
  qDate.formatDate(newDate, 'YYYY-MM-DD'),
  qDate.formatDate(newDate, 'YYYY-MM-DD')
])
const selectDateList = ref<UnwrapRef<SelectDateListType>>([
  {
    name: '오늘',
    date: [today, today]
  },
  {
    name: '어제',
    date: [qDate.subtractDate(today, 1), qDate.subtractDate(today, 1)]
  },
  {
    name: '30일',
    date: [qDate.subtractDate(today, 30), today]
  },
  {
    name: '직접선택',
    date: [null, null]
  }
])
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
}

hr {
  background: #eee;
  height: 1px;
  border: 0;
  margin: 20px 0;
}
.btn-wrap {
  display: flex;
  justify-content: end;
  gap: 10px;
}
</style>
