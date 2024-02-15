export type DateType = [string, string] | [null, null]

export type SelectDateType = {
  name: String
  date: DateType
}

export type SelectDateListType = SelectDateType[]

export type ScopeTimestamp = {
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

export type ScopeType = {
  activeDate: Boolean
  disabled: Boolean
  droppable: Boolean
  hasMonth: Boolean
  miniMode: Boolean
  outside: Boolean
  timestamp: ScopeTimestamp
}
