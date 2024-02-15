<template>
  <main>
    <DateSelectBox v-model="range" :select-date-list="selectDateList">
      <template #default="{ date, option }">
        <div class="selected-date">
          <div class="option">
            {{ option }}
          </div>
          <div class="date">
            {{ date ? date[0] + ' ~ ' + date[1] : '날짜를 선택해주세요' }}
            <!--            <q-icon icon="mdi-calendar" class="ml-2"></q-icon>-->
          </div>
        </div>
      </template>
      <template #footer="{ setData, onHide }">
        <button @click="onHide">닫기</button>
        <button @click="setData">선택</button>
      </template>
    </DateSelectBox>
  </main>
</template>

<script setup lang="ts">
import { ref, type UnwrapRef } from 'vue'
import DateSelectBox from '@/components/dateSelecter/DateSelectBox.vue'
import QDate, { today } from '@/plugins/date'
import type { SelectDateListType } from '@/type/type'

// import DateSelectBox from '@/components/dateSelecter/DateSelectBox.vue'
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

<style scoped>
main {
  width: 100%;
  height: 100%;
}

.selected-date {
  display: inline-flex;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 4px;
  line-height: 36px;
  cursor: pointer;
  min-width: 320px;

  .option {
    padding: 0 10px;
    min-width: 100px;
  }

  .date {
    padding: 0 10px;
    border-left: 1px solid #ccc;
  }
}
</style>
