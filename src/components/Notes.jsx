const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(date) {
  if (!date) return null
  return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`
}

export default function Notes({ notes, onChange, rangeStart, rangeEnd }) {
  const rangeLabel = rangeStart
    ? rangeEnd
      ? `${formatDate(rangeStart)} – ${formatDate(rangeEnd)}`
      : formatDate(rangeStart)
    : null

  return (
    <div className="
      flex flex-col gap-2.5 px-5 py-5
      border-r border-gray-200
      lg:w-[210px] lg:shrink-0 lg:px-6 lg:py-6
      max-lg:border-r-0 max-lg:border-t max-lg:border-gray-200 max-lg:order-2
    ">
      {/* Header */}
      <div className="flex items-center gap-2 min-h-[20px]">
        <span className="text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500">
          Notes
        </span>
        {rangeLabel && (
          <span className="text-[10px] font-medium text-blue bg-blue-light rounded-full px-2 py-0.5 whitespace-nowrap">
            {rangeLabel}
          </span>
        )}
      </div>

      {/* Ruled textarea */}
      <div className="relative flex-1">
        <textarea
          className="
            w-full min-h-[196px] resize-none border-none outline-none
            bg-transparent text-[13px] text-[#1a2235] leading-7 p-0
            caret-blue placeholder:text-[#adb5c4] placeholder:italic
          "
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, #e2e8f0 27px, #e2e8f0 28px)',
            backgroundPosition: '0 27px',
          }}
          value={notes}
          onChange={e => onChange(e.target.value)}
          placeholder="Add a note…"
          spellCheck={false}
          aria-label="Monthly notes"
        />
        {notes.length > 0 && (
          <button
            className="
              absolute top-0.5 right-0 w-5 h-5 rounded-full
              bg-gray-200 text-gray-500 text-[15px]
              flex items-center justify-center
              transition-colors duration-150
              hover:bg-gray-300 hover:text-gray-700
            "
            onClick={() => onChange('')}
            aria-label="Clear notes"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
