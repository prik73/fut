const DAY_HEADERS = ['MON','TUE','WED','THU','FRI','SAT','SUN']

function isSameDay(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
}

function isInRange(date, start, end) {
  if (!start || !end) return false
  const t = date.getTime()
  return t > start.getTime() && t < end.getTime()
}

function toMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export default function CalendarGrid({ year, month, rangeStart, rangeEnd, onDateClick }) {
  const today = toMidnight(new Date())
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7

  const days = Array.from({ length: 42 }, (_, i) =>
    new Date(year, month, 1 - startOffset + i)
  )

  function getCellClasses(date) {
    const isCurrent = date.getMonth() === month
    const dayOfWeek = (date.getDay() + 6) % 7
    const isWeekend = dayOfWeek >= 5

    const d  = toMidnight(date)
    const rs = rangeStart ? toMidnight(rangeStart) : null
    const re = rangeEnd   ? toMidnight(rangeEnd)   : null

    const isStart  = isSameDay(d, rs)
    const isEnd    = isSameDay(d, re)
    const inRange  = isInRange(d, rs, re)
    const isToday  = isSameDay(d, today)

    let base = 'relative flex flex-col items-center justify-center aspect-square text-[13px] transition-all duration-150 cursor-pointer p-0 min-w-0 rounded-[6px]'

    if (!isCurrent) return base + ' cursor-default'

    // Range end caps
    if (isStart || isEnd) {
      return base + ' bg-blue-light ' + (isStart ? 'rounded-l-[6px] rounded-r-none' : 'rounded-r-[6px] rounded-l-none')
    }

    // In-range band
    if (inRange) return base + ' bg-blue-light rounded-none'

    // Hover (applied via group, handled below per cell)
    let cls = base
    if (isWeekend) cls += ' text-blue'
    if (isToday) cls += ' font-semibold'
    return cls
  }

  function getNumClasses(date) {
    const d  = toMidnight(date)
    const rs = rangeStart ? toMidnight(rangeStart) : null
    const re = rangeEnd   ? toMidnight(rangeEnd)   : null

    const isCurrent = date.getMonth() === month
    if (!isCurrent)       return 'text-[#adb5c4]'
    if (isSameDay(d, rs) || isSameDay(d, re)) return 'text-white font-semibold relative z-10'
    const dayOfWeek = (date.getDay() + 6) % 7
    if (dayOfWeek >= 5)   return 'text-blue'
    return 'text-[#1a2235]'
  }

  return (
    <div className="flex-1 flex flex-col px-6 pb-6 pt-5 min-w-0">
      {/* Hint — always rendered, toggled via visibility to prevent layout shift */}
      <div
        className="text-[11px] font-medium text-blue text-center tracking-wide mb-1 h-4"
        style={{ visibility: rangeStart && !rangeEnd ? 'visible' : 'hidden' }}
      >
        Select an end date
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAY_HEADERS.map((h, i) => (
          <div
            key={h}
            className={`text-[10px] font-semibold tracking-[0.8px] text-center py-1 uppercase ${i >= 5 ? 'text-blue' : 'text-gray-500'}`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((date, i) => {
          const isCurrent = date.getMonth() === month
          const d  = toMidnight(date)
          const rs = rangeStart ? toMidnight(rangeStart) : null
          const re = rangeEnd   ? toMidnight(rangeEnd)   : null
          const isStart  = isSameDay(d, rs)
          const isEnd    = isSameDay(d, re)
          const inRange  = isInRange(d, rs, re)
          const isToday  = isSameDay(d, today)
          const dayOfWeek = (date.getDay() + 6) % 7
          const isWeekend = dayOfWeek >= 5

          // Build classes
          let cellCls = 'relative flex flex-col items-center justify-center aspect-square text-[13px] p-0 min-w-0 transition-all duration-150'

          if (!isCurrent) {
            cellCls += ' cursor-default'
          } else if (isStart) {
            cellCls += ' bg-blue-light rounded-l-[6px] rounded-r-none cursor-pointer'
          } else if (isEnd) {
            cellCls += ' bg-blue-light rounded-r-[6px] rounded-l-none cursor-pointer'
          } else if (inRange) {
            cellCls += ' bg-blue-light rounded-none cursor-pointer'
          } else {
            cellCls += ' rounded-[6px] cursor-pointer hover:bg-gray-100 hover:rounded-full hover:scale-105'
          }

          let numCls = 'leading-none relative z-10 '
          if (!isCurrent) numCls += 'text-[#adb5c4]'
          else if (isStart || isEnd) numCls += 'text-white font-semibold'
          else if (isWeekend) numCls += 'text-blue'
          else numCls += 'text-[#1a2235]'

          return (
            <button
              key={i}
              className={cellCls}
              onClick={() => isCurrent && onDateClick(toMidnight(date))}
              disabled={!isCurrent}
              tabIndex={isCurrent ? 0 : -1}
              aria-label={date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            >
              {/* Blue circle behind start/end number */}
              {(isStart || isEnd) && (
                <span className="absolute inset-[3px] rounded-full bg-blue z-0" aria-hidden="true" />
              )}

              <span className={numCls}>{date.getDate()}</span>

              {/* Today dot */}
              {isToday && (
                <span
                  className={`block w-1 h-1 rounded-full mt-0.5 relative z-10 ${isStart || isEnd ? 'bg-white/70' : 'bg-blue'}`}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
