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

class NDate {
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

  formatDate(timeStamp: number | Date, format: string) {
    const getDate = new Date(timeStamp)

    const fullYear = getDate.getFullYear()
    const date = getDate.getDate()
    const month = getDate.getMonth()
    const hours24 = getDate.getHours()
    const hours12 = getDate.getHours() >= 12 ? getDate.getHours() - 12 : getDate.getHours()
    const minutes = getDate.getMinutes()
    const seconds = getDate.getSeconds()

    const day = getDate.getDay()

    return format
      .replace('YYYY', fullYear.toString())
      .replace('MMMM', MONTHS[month - 1])
      .replace('MMM', MONTHS_SHORT[month - 1])
      .replace('MM', this.prependZero(month))
      .replace('DD', this.prependZero(date))
      .replace('dddd', DAYS[day])
      .replace('ddd', DAYS_SHORT[day])
      .replace('dd', this.prependZero(day))
      .replace('d', day.toString())
      .replace('HH', hours24.toString())
      .replace('hh', hours12.toString())
      .replace('mm', minutes.toString())
      .replace('ss', seconds.toString())
  }
}

export default NDate
