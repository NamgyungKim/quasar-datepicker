const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  MONTHS_SHORT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

class QDate {
  private days: string[]
  private daysShort: string[]
  private months: string[]
  private monthsShort: string[]
  constructor(formatString?: {
    days?: string[]
    daysShort?: string[]
    months?: string[]
    monthsShort?: string[]
  }) {
    this.days = formatString?.days ?? DAYS
    this.daysShort = formatString?.daysShort ?? DAYS_SHORT
    this.months = formatString?.months ?? MONTHS
    this.monthsShort = formatString?.monthsShort ?? MONTHS_SHORT
  }

  private prependZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString()
  }

  private baseFormatTemp = 'YYYY-MM-DD'
  private millisecondsInADay = 1000 * 60 * 60 * 24

  formatDate(timeStamp: number | Date | string, format: string) {
    const getDate = new Date(timeStamp)

    const fullYear = getDate.getFullYear()
    const date = getDate.getDate()
    const month = getDate.getMonth()
    const hours24 = getDate.getHours()
    const hours12 = getDate.getHours() >= 12 ? getDate.getHours() - 12 : getDate.getHours()
    const minutes = getDate.getMinutes()
    const seconds = getDate.getSeconds()
    const day = getDate.getDay()

    const MONTHS_Key = 'Q@@@@'
    const MONTHS_SHORT_Key = 'Q@@@'
    const DAYS_Key = 'Q!!!!'
    const DAYS_SHORT_Key = 'Q!!!'

    return format
      .replace('YYYY', fullYear.toString())
      .replace('MMMM', MONTHS_Key)
      .replace('MMM', MONTHS_SHORT_Key)
      .replace('MM', this.prependZero(month + 1))
      .replace('DD', this.prependZero(date))
      .replace('dddd', DAYS_Key)
      .replace('ddd', DAYS_SHORT_Key)
      .replace('dd', this.prependZero(day))
      .replace('d', day.toString())
      .replace('HH', hours24.toString())
      .replace('hh', hours12.toString())
      .replace('mm', minutes.toString())
      .replace('ss', seconds.toString())
      .replace(MONTHS_Key, MONTHS[month - 1])
      .replace(MONTHS_SHORT_Key, MONTHS_SHORT[month - 1])
      .replace(DAYS_Key, DAYS[day])
      .replace(DAYS_SHORT_Key, DAYS_SHORT[day])
  }

  addDate(timeStamp: number | Date | string, numberOfDaysToAdd: number) {
    const getDate = new Date(timeStamp)
    const time = getDate.getTime()

    const subtractedTime = time + numberOfDaysToAdd * this.millisecondsInADay
    return this.formatDate(subtractedTime, this.baseFormatTemp)
  }

  subtractDate(timeStamp: number | Date | string, numberOfDaysToAdd: number) {
    const getDate = new Date(timeStamp)
    const time = getDate.getTime()

    const subtractedTime = time - numberOfDaysToAdd * this.millisecondsInADay
    return this.formatDate(subtractedTime, this.baseFormatTemp)
  }

  getDateOfWeek(timeStamp: number | Date | string, targetDay: 0 | 1 | 2 | 3 | 4 | 5 | 6): string {
    const date = new Date(timeStamp)
    const day = date.getDay()
    const targetDate = new Date(date)
    targetDate.setDate(date.getDate() - day + targetDay)

    return this.formatDate(targetDate, this.baseFormatTemp)
  }
}

const date = new QDate()

const newDate = new Date()
const today = date.formatDate(newDate, 'YYYY-MM-DD')

export { today }
export default QDate
