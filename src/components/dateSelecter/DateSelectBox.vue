<template>
  <div class="search-date">
    <div class="slot" @click.stop="onShow">
      <slot :from="sendDate.from" :to="sendDate.to" :option="sendDate.option" :preview="preview" />
    </div>
    <div v-if="showing" @before-hide="initDate" class="date-dialog">
      <div class="period-setting">
        <p>기간 설정</p>
        <ul>
          <li
            v-for="(item, i) in predoList"
            :key="i"
            :class="selectedPeriod.name === item.name ? 'select' : null"
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
          <!--            <q-btn outline style="color: #333" variant="outlined" label="취소" @click="onHide" />-->
          <!--            <q-btn unelevated color="primary" label="적용" @click="getData" />-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { addToDate, parseTimestamp, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import MultiMonthSelection from '@/components/dateSelecter/MultiMonthSelection.vue'
import NDate from '@/plugins/date.js'
const date = new NDate()

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']
const newDate = new Date()
const props = defineProps({
  modelValue: {
    type: Object
  },
  predoList: {
    type: Array,
    default: () => [
      {
        name: '오늘',
        from: new Date(),
        to: new Date()
      }
    ]
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
const emit = defineEmits(['update:modelValue', 'update'])
const showing = ref(false)
const range = ref({
  from: newDate,
  to: newDate
})
const sendDate = ref({
  from: props.modelValue.from,
  to: props.modelValue.to,
  option: props.predoList[0]
})
const selectedPeriod = ref(props.predoList[0])

const preview = computed(() => {
  const { from, to } = range.value
  if (!from) {
    return '날짜를 선택해 주세요'
  }

  const startDate = from ? date.formatDate(from, 'YYYY-MM-DD') : ''
  const startDated = from ? date.formatDate(from, 'd') : ''
  const endDate = to ? date.formatDate(to, 'YYYY-MM-DD') : ''
  const endDated = to ? date.formatDate(to, 'd') : ''
  return `${startDate} ${WEEKDAY[Number(startDated)]} ~ ${endDate} ${WEEKDAY[Number(endDated)]}`
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
const settingPeriod = (date) => {
  selectedPeriod.value = date
  range.value = date
}

// update:modelValue, update 이벤트 실행
const getData = () => {
  const { from, to } = range.value
  if (!from) {
    alert('날짜를 선택해주세요.')
    return
  }
  sendDate.value = { ...range.value, option: selectedPeriod.value }
  emit('update:modelValue', {
    from,
    to,
    option: selectedPeriod.value
  })
  emit('update', {
    from,
    to,
    option: selectedPeriod.value
  })
  showing.value = false
}

// 초기값 세팅
const initDate = () => {
  const { to, from, option } = sendDate.value
  range.value = { to, from }
  selectedPeriod.value = option
}

const clickDate = () => {
  const { predoList } = props
  if (selectedPeriod.value.name !== '직접 입력') {
    selectedPeriod.value = predoList[predoList.length - 1]
  }
}

const resetData = () => {
  selectedPeriod.value = props.predoList[props.predoList.length - 1]
  sendDate.value = {
    from: undefined,
    to: undefined,
    option: selectedPeriod.value
  }
  range.value = {
    from: undefined,
    to: undefined,
    option: props.predoList[0]
  }
}

const onClose = (el: MouseEvent): void => {
  const $clickEl: EventTarget = el.target!
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
  // TODO : 닫을 경우 상태값 다시 받아오기
  showing.value = false
  initDate()
}

watch(props, () => {
  const { modelValue, predoList } = props
  if (modelValue.from) {
    range.value = {
      from: modelValue.from,
      to: modelValue.to
    }
    for (const item of predoList) {
      const { from, to } = item
      if (modelValue.from === from && modelValue.to === to) {
        selectedPeriod.value = item
      }
    }
    sendDate.value = { ...range.value, option: selectedPeriod.value }
  }
  if (!modelValue.from) {
    resetData()
  }
})

onMounted(() => {
  const today = date.formatDate(newDate, 'MMMM-MM-DD')
  const { modelValue, predoList } = props
  const { from, to } = modelValue

  if (from !== today && to !== today) {
    selectedPeriod.value = predoList[predoList.length - 1]
  }
  range.value = { from, to }
  sendDate.value = { from, to, option: selectedPeriod.value }
})
</script>

<style lang="scss" scoped>
.date-dialog {
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
  .search-date {
    position: relative;
    justify-content: center;
    display: inline-block;
    gap: 10px;
    align-items: center;
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
