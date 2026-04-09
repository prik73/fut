import { useState, useRef } from 'react'
import HeroImage from './components/HeroImage'
import CalendarGrid from './components/CalendarGrid'
import Notes from './components/Notes'
import './index.css'

function toMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function CalendarPage({ year, month, image, rangeStart, rangeEnd, notes,
                        onDateClick, onNotesChange, onPrev, onNext }) {
  return (
    <>
      <HeroImage month={month} year={year} image={image} onPrev={onPrev} onNext={onNext} />
      <div className="flex flex-col lg:flex-row pt-16">
        <Notes notes={notes} onChange={onNotesChange} rangeStart={rangeStart} rangeEnd={rangeEnd} />
        <CalendarGrid year={year} month={month} rangeStart={rangeStart} rangeEnd={rangeEnd} onDateClick={onDateClick} />
      </div>
    </>
  )
}

function nextMonth({ year, month }, delta) {
  let m = month + delta, y = year
  if (m < 0)  { y--; m = 11 }
  if (m > 11) { y++; m = 0  }
  return { year: y, month: m }
}

const PROJECTS = [
  {
    url: 'https://stream.prik.dev',
    name: 'stream.prik.dev',
    tag: 'WebRTC · mediasoup',
    desc: 'Real-time video streaming with selective forwarding unit architecture.',
  },
  {
    url: 'https://heat.prik.dev',
    name: 'heat.prik.dev',
    tag: 'The laptop heater',
    desc: `Intentionally burns CPU cycles, to fight delhi's weather.`,
  },
  {
    url: 'https://clic.prik.dev',
    name: 'clic.prik.dev',
    tag: 'Doomscrolling for clicks',
    desc: "The most pointless thing you'll click today. Repeat.",
  },
]

export default function App() {
  const today = toMidnight(new Date())

  const [current,  setCurrent]  = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [incoming, setIncoming] = useState(null)
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd,   setRangeEnd]   = useState(null)
  const [notes, setNotes] = useState('')

  const animating = useRef(false)

  function handleMonthChange(delta) {
    if (animating.current) return
    animating.current = true
    setCurrent(prev => {
      setIncoming({ ...nextMonth(prev, delta), direction: delta })
      return prev
    })
  }

  function handleAnimationEnd() {
    setCurrent({ year: incoming.year, month: incoming.month })
    setRangeStart(null)
    setRangeEnd(null)
    setIncoming(null)
    animating.current = false
  }

  function handleDateClick(date) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date); setRangeEnd(null); return
    }
    if (date.getTime() === rangeStart.getTime()) { setRangeStart(null); return }
    if (date < rangeStart) setRangeStart(date)
    else setRangeEnd(date)
  }

  const outClass = incoming ? (incoming.direction > 0 ? 'slide-out-left' : 'slide-out-right') : ''
  const inClass  = incoming ? (incoming.direction > 0 ? 'slide-in-right' : 'slide-in-left')  : ''

  return (
    <div className="flex flex-col items-center w-full gap-8 py-10 px-4 min-h-screen bg-off-white">
      <p className="font-heading text-[13px] font-bold tracking-[3px] uppercase text-gray-500">
        Wall Calendar
      </p>

      {/* Outer row: calendar card + projects sidebar */}
      <div className="flex flex-col xl:flex-row items-start gap-6 w-full max-w-[520px] xl:max-w-none xl:w-fit xl:mx-auto">

        {/* ── Calendar card ── */}
        <div className="relative w-full xl:w-[860px] shrink-0 bg-paper rounded-[20px] shadow-xl [overflow:clip]">
          <div className="relative overflow-hidden">

            {/* Current page — slides out */}
            <div className={outClass}>
              <CalendarPage
                year={current.year} month={current.month} image="/image.jpg"
                rangeStart={rangeStart} rangeEnd={rangeEnd} notes={notes}
                onDateClick={handleDateClick} onNotesChange={setNotes}
                onPrev={() => handleMonthChange(-1)}
                onNext={() => handleMonthChange(1)}
              />
            </div>

            {/* Incoming page — slides in */}
            {incoming && (
              <div className={`absolute inset-0 bg-paper ${inClass}`} onAnimationEnd={handleAnimationEnd}>
                <CalendarPage
                  year={incoming.year} month={incoming.month} image="/image.jpg"
                  rangeStart={null} rangeEnd={null} notes=""
                  onDateClick={() => {}} onNotesChange={() => {}}
                  onPrev={() => handleMonthChange(-1)}
                  onNext={() => handleMonthChange(1)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Projects sidebar ── */}
        <aside className="w-full xl:w-[220px] shrink-0 flex flex-col gap-3">
          <p className="text-[10px] font-semibold tracking-[2px] uppercase text-gray-400 mb-1">
            Also by me
          </p>
          {PROJECTS.map(p => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group block bg-paper rounded-[14px] p-4
                shadow-sm border border-gray-200
                hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200
              "
            >
              <span className="block text-[11px] font-semibold text-blue tracking-wide mb-0.5 group-hover:underline">
                {p.name}
              </span>
              <span className="block text-[10px] text-gray-400 font-medium mb-1.5">
                {p.tag}
              </span>
              <span className="block text-[12px] text-gray-500 leading-snug">
                {p.desc}
              </span>
            </a>
          ))}
        </aside>

      </div>
    </div>
  )
}
