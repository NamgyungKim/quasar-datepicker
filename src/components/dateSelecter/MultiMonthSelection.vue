<template>
  <div class="multi-month-selection">
    <div class="btn-wrap">
      <button @click="onPrev">
        <IconChevronLeft />
      </button>
      <button @click="onNext">
        <IconChevronRight />
      </button>
    </div>
    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
      <div class="calender-wrap">
        <div>
          <p class="text-center">{{ selectedDate1.slice(0, 7).replace('-', '. ') }}</p>
          <q-calendar-month
            ref="calendar1"
            v-model="selectedDate1"
            mini-mode
            no-active-date
            :hover="canHover"
            :selected-start-end-dates="startEndDates"
            :min-weeks="6"
            animated
            :disabled-before="disabledBefore"
            :disabled-after="disabledAfter"
            no-outside-days
            @mousedown-day="onMouseDownDay"
            @mouseup-day="onMouseUpDay"
            @mousemove-day="onMouseMoveDay"
            @change="onChange"
            @moved="onMoved"
            @click-day="onClickDay"
            @click-workweek="onClickWorkweek"
            @click-head-workweek="onClickHeadWorkweek"
            @click-head-day="onClickHeadDay"
          >
            <template #head-day="{ scope }">
              {{ WEEKDAY[scope.weekday] }}
            </template>
          </q-calendar-month>
        </div>
        <div>
          <p class="text-center">{{ selectedDate2.slice(0, 7).replace('-', '. ') }}</p>
          <QCalendarMonth
            ref="calendar2"
            v-model="selectedDate2"
            mini-mode
            no-active-date
            :hover="canHover"
            :selected-start-end-dates="startEndDates"
            :min-weeks="6"
            animated
            no-outside-days
            :disabled-before="disabledBefore"
            :disabled-after="disabledAfter"
            @mousedown-day="onMouseDownDay"
            @mouseup-day="onMouseUpDay"
            @mousemove-day="onMouseMoveDay"
            @change="onChange"
            @moved="onMoved"
            @click-date="onClickDate"
            @click-day="onClickDay"
            @click-workweek="onClickWorkweek"
            @click-head-workweek="onClickHeadWorkweek"
            @click-head-day="onClickHeadDay"
          >
            <template #head-day="{ scope }">
              {{ WEEKDAY[scope.weekday] }}
            </template>
          </QCalendarMonth>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarMonth,
  addToDate,
  getDayIdentifier,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
import { ref, computed, watch, onMounted, onBeforeMount, type PropType } from 'vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import type { DateType } from '@/type/type'

type ScopeTimestamp = {
  current: Boolean
  date: String
  day: Number
  disabled: Boolean
  doy: Number
  future: Boolean
  hasDay: Boolean
  hasTime: Boolean
  hour: Number
  minute: Number
  month: Number
  past: Boolean
  time: String
  weekday: Number
  workweek: Number
  year: Number
}

type ScopeType = {
  activeDate: Boolean
  disabled: Boolean
  droppable: Boolean
  hasMonth: Boolean
  miniMode: Boolean
  outside: Boolean
  timestamp: ScopeTimestamp
}

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']
const emit = defineEmits(['update:modelValue', 'click-date'])

const props = defineProps({
  modelValue: {
    type: Object as PropType<DateType>
  },
  disabledBefore: {
    type: String,
    default: undefined
  },
  disabledAfter: {
    type: String,
    default: undefined
  }
})

const selectedDate1 = ref<String>(today()),
  selectedDate2 = ref<String>(today()),
  calendar1 = ref<InstanceType<typeof QCalendarMonth>>(null),
  calendar2 = ref<InstanceType<typeof QCalendarMonth>>(null),
  anchorTimestamp = ref<ScopeTimestamp | null>(null),
  otherTimestamp = ref<ScopeTimestamp | null>(null),
  mouseDown = ref<Boolean>(false),
  mobile = ref<Boolean>(true),
  hover = ref<Boolean>(false)

const canHover = computed(() => {
  return hover.value === true && mouseDown.value === true
})

const startEndDates = computed(() => {
  const dates = []
  if (anchorDayIdentifier.value !== false && otherDayIdentifier.value !== false) {
    if (anchorDayIdentifier.value <= otherDayIdentifier.value) {
      dates.push(anchorTimestamp.value?.date, otherTimestamp.value?.date)
    } else {
      dates.push(otherTimestamp.value?.date, anchorTimestamp.value?.date)
    }
  }
  return dates
})

const anchorDayIdentifier = computed(() => {
  if (anchorTimestamp.value !== null) {
    return getDayIdentifier(anchorTimestamp.value)
  }
  return false
})

const otherDayIdentifier = computed(() => {
  if (otherTimestamp.value !== null) {
    return getDayIdentifier(otherTimestamp.value)
  }
  return false
})

function leftClick(e: MouseEvent) {
  return e.button === 0
}

function onMouseDownDay({ scope, event }: { scope: ScopeType; event: MouseEvent }) {
  if (leftClick(event)) {
    if (
      mobile.value === true &&
      anchorTimestamp.value !== null &&
      otherTimestamp.value !== null &&
      anchorTimestamp.value.date === otherTimestamp.value.date
    ) {
      otherTimestamp.value = scope.timestamp
      mouseDown.value = false
      return
    }
    // mouse is down, start selection and capture current
    mouseDown.value = true
    anchorTimestamp.value = scope.timestamp
    otherTimestamp.value = scope.timestamp
  }
}

function onMouseUpDay({ scope, event }: { scope: ScopeType; event: MouseEvent }) {
  if (leftClick(event)) {
    // mouse is up, capture last and cancel selection
    otherTimestamp.value = scope.timestamp
    mouseDown.value = false
  }
}

function onMouseMoveDay({ scope, event }: { scope: ScopeType; event: MouseEvent }) {
  if (mouseDown.value === true && scope.outside !== true) {
    otherTimestamp.value = scope.timestamp
  }
}

const setTimeStamp = () => {
  if (props.modelValue?.length !== 2) return
  const [from, to] = props.modelValue
  anchorTimestamp.value = from ? parseTimestamp(from) : null
  otherTimestamp.value = to ? parseTimestamp(to) : null
}

function onToday() {
  selectedDate1.value = today()
  let tm = parseTimestamp(selectedDate1.value)
  tm = addToDate(tm, { month: 1 })
  selectedDate2.value = tm.date
}
function onPrev() {
  calendar1.value.prev()
  calendar2.value.prev()
}
function onNext() {
  calendar1.value.next()
  calendar2.value.next()
}
function onMoved(data: ScopeTimestamp) {
  // console.log('onMoved', data);
}
function onChange(data: ScopeTimestamp) {
  // console.log('onChange', data);
}
function onClickDate(data: ScopeTimestamp) {
  const { value } = startEndDates
  emit('click-date', data)
  emit('update:modelValue', value)
}
function onClickDay(data: ScopeTimestamp) {
  // console.log('onClickDay', data);
}
function onClickWorkweek(data: ScopeTimestamp) {
  // console.log('onClickWorkweek', data);
}
function onClickHeadDay(data: ScopeTimestamp) {
  // console.log('onClickHeadDay', data);
}
function onClickHeadWorkweek(data: ScopeTimestamp) {
  // console.log('onClickHeadWorkweek', data);
}

watch(props, () => {
  setTimeStamp()
})

onBeforeMount(() => {
  selectedDate1.value = today()
  let tm = parseTimestamp(selectedDate1.value)
  tm = addToDate(tm, { month: 1 })
  selectedDate2.value = tm.date
})

onMounted(() => {
  const { disabledBefore, disabledAfter } = props
  if (!disabledBefore && !!disabledAfter) {
    onPrev()
  }
  setTimeStamp()
})
</script>
<style lang="scss" scoped>
.text-center {
  text-align: center;
}
.multi-month-selection {
  position: relative;
  .calender-wrap {
    display: flex;
    gap: 20px;
    width: 450px;
    margin-top: 10px;
    p {
      margin-bottom: 30px;
      font-weight: bold;
    }
  }
  .btn-wrap {
    position: absolute;
    display: flex;
    width: 100%;
    top: 2px;
    justify-content: space-between;
    button {
      border: none;
      background: transparent;
      cursor: pointer;
      width: 32px;
      height: 32px;
      padding: 0;
      border-radius: 50%;
      transition: 0.3s;
      &:hover {
        background: #ddd;
      }
    }
  }
}
::v-deep .q-calendar {
  $btn-width: 30px;
  $btn-height: 30px;
  font-weight: bold;
  //요일
  .q-calendar-month__head--wrapper .q-calendar-month__head--weekdays div {
    font-size: 14px;
    color: #999;
  }
  .q-calendar-mini {
    color: #333;
  }
  .q-calendar-mini
    .q-calendar-month__day.q-range-first
    .q-calendar-month__day--label__wrapper
    .q-calendar__button,
  .q-calendar-mini
    .q-calendar-month__day.q-range-last
    .q-calendar-month__day--label__wrapper
    .q-calendar__button {
    border-radius: 0;
  }
  .q-calendar__button--round {
    border-radius: 0;
  }
  &.q-calendar__bordered {
    border: none;
  }
  .q-calendar-month__week--days {
    margin-bottom: 5px;
  }
  .q-calendar-mini .q-calendar-month__day {
    max-width: $btn-width !important;
    width: $btn-width !important;
    height: $btn-height !important;
  }
  // 오늘날짜
  .q-calendar-mini .q-calendar-month__day.q-current-day button {
    border: none !important;
    background: #333;
    color: #fff;
  }
  button {
    width: $btn-width !important;
    max-width: $btn-width !important;
    min-width: $btn-width !important;
    height: $btn-height !important;
  }
  .q-range.disabled .q-calendar-month__day--label__wrapper {
    min-height: 0;
    max-height: 0;
    height: 0;
  }
}
</style>
