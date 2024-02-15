<template>
  <div class="search-date">
    <div class="slot" @click.stop="onShow">
      <slot :date="props.modelValue" :option="optionName" />
    </div>
    <div v-if="showing" @before-hide="initDate" class="date-dialog">
      <div v-if="selectDateList.length > 0" class="period-setting">
        <p>기간 설정</p>
        <ul>
          <li
            v-for="(item, i) in selectDateList"
            :key="i"
            :class="selectedPeriod?.name === item.name ? 'select' : null"
            @click="settingPeriod(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="select-date">
        <div class="preview">{{ preview }}</div>
        <hr />
        <div>
          <MultiMonthSelection
            v-model="range"
            :disabled-after="disabledAfter"
            :disabled-before="disabledBefore"
            @click-date="clickDate"
          />
        </div>
        <hr />
        <div class="btn-wrap">
          <slot name="footer" :onHide="onHide" :setData="setData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, type PropType, type UnwrapRef } from 'vue'
import { addToDate, parseTimestamp, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import MultiMonthSelection from '@/components/dateSelecter/MultiMonthSelection.vue'
import QDate from '@/plugins/date.js'
import type { DateType, ScopeType, SelectDateListType, SelectDateType } from '@/type/type'
const date = new QDate()

const newDate = new Date()

const props = defineProps({
  modelValue: {
    type: Object as PropType<DateType>
  },
  selectDateList: {
    type: Array as PropType<SelectDateListType>,
    default: () => []
  },
  disabledAfterDate: {
    type: Boolean,
    default: false
  },
  disabledBeforeDate: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'update', 'click:date'])
const showing = ref<UnwrapRef<Boolean>>(false)
const range = ref<UnwrapRef<DateType>>([null, null])

const selectedPeriod = ref<UnwrapRef<SelectDateType>>()
const optionName = ref()

const preview = computed(() => {
  const [from, to] = range.value
  if (!from) {
    return '날짜를 선택해 주세요'
  }

  const startDate = from ? date.formatDate(new Date(from), 'YYYY-MM-DD ddd') : ''
  const endDate = to ? date.formatDate(new Date(to), 'YYYY-MM-DD ddd') : ''
  return `${startDate} ~ ${endDate}`
})

// disabled
const disabledAfter = computed(() => {
  if (!props.disabledBeforeDate) return
  let ts = parseTimestamp(today())
  ts = addToDate(ts, { day: +1 })
  return ts.date
})
const disabledBefore = computed(() => {
  if (!props.disabledAfterDate) return
  let ts = parseTimestamp(today())
  ts = addToDate(ts, { day: -1 })
  return ts.date
})

// 기간설정
const settingPeriod = (item: SelectDateType): void => {
  range.value = item.date
  selectedPeriod.value = item
}

// update:modelValue, update 이벤트 실행
const setData = () => {
  const [from, to] = range.value
  if (!from) {
    alert('날짜를 선택해주세요.')
    return
  }

  optionName.value = selectedPeriod.value?.name
  emit('update:modelValue', range.value)
  emit('update', range.value)
  showing.value = false
}

// 초기값 세팅
const initDate = () => {
  const { modelValue } = props
  range.value = modelValue!
}

const clickDate = (data: { event: MouseEvent; scope: ScopeType }): void => {
  emit('click:date', date)
}

const onClose = (el: MouseEvent): void => {
  const $clickEl = el.target as HTMLElement
  if (!$clickEl.closest('.date-dialog')) {
    onHide()
  }
}

const onShow = () => {
  showing.value = true
  const $window: Window = window!
  $window.addEventListener('click', onClose)
}

const onHide = () => {
  showing.value = false
  initDate()
}

onMounted(() => {
  const today = date.formatDate(newDate, 'MMMM-MM-DD')
  const { modelValue, selectDateList } = props
  const [from, to] = modelValue!

  if (from !== today && to !== today) {
    selectedPeriod.value = selectDateList[selectDateList.length - 1]
    optionName.value = selectedPeriod.value?.name
  }
  range.value = modelValue!
})
</script>

<style lang="scss" scoped>
.search-date {
  position: relative;
  justify-content: center;
  display: inline-block;
  gap: 10px;
  align-items: center;
}

.date-dialog {
  position: absolute;
  left: 0;
  width: auto;
  --primary-color: #1867c0;
  display: inline-flex;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

.period-setting {
  background: #eee;
  padding: 5px 0;
  font-size: 14px;

  p {
    padding: 0 20px;
    line-height: 3;
    font-weight: 900;
  }

  li {
    color: #333;
    padding: 0 20px;
    width: 180px;
    line-height: 2.5;
    cursor: pointer;
  }

  li.select {
    background: #fff;
    color: var(--primary-color);
  }
}

.select-date {
  padding: 20px 15px;

  .preview {
    text-align: center;
    font-weight: bold;
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
}

input {
  padding: 4px 10px;
  border: 2px solid #1a237e;
  border-radius: 4px;
}
</style>
