<template>
  <main>
    <DateSelectBox v-model="range">
      <template #default="{ from, to, option }">
        <div class="selected-date">
          <div class="option">{{ option.name }}</div>
          <div class="date">
            {{ from ? from + ' ~ ' + to : '날짜를 선택해주세요' }}
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
import { ref } from 'vue'
import DateSelectBox from '@/components/dateSelecter/DateSelectBox.vue'

// import DateSelectBox from '@/components/dateSelecter/DateSelectBox.vue'
const newDate = new Date()
const range = ref({
  from: newDate,
  to: newDate
})
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
