import './HeroImage.css'

const MONTHS = [
  'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
]

const BINDING_RINGS = 13

export default function HeroImage({ month, year, image, onPrev, onNext }) {
  return (
    /*
      Outer wrapper — overflow:visible so the overlay can bleed down
      into the calendar body. z-index:10 paints it above the body.
    */
    <div className="relative w-full z-10">

      {/* ── Spiral binding rings ── */}
      <div className="flex justify-center gap-5 py-1.5 bg-paper relative z-10">
        {Array.from({ length: BINDING_RINGS }, (_, i) => (
          <span
            key={i}
            className="
              block w-[18px] h-[18px] rounded-full
              border-[3px] border-gray-300 bg-off-white
              shadow-[inset_0_1px_2px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]
              relative after:content-[''] after:absolute after:-bottom-[5px]
              after:left-1/2 after:-translate-x-1/2
              after:w-[3px] after:h-[6px]
              after:bg-gray-300 after:rounded-b-sm
            "
          />
        ))}
      </div>

      {/* ── Photo — full rectangle, overlay reveals gap via its own clip ── */}
      <div className="relative w-full h-[400px] lg:h-[520px] z-[1] overflow-hidden">
        <img
          src={image}
          alt={`${MONTHS[month]} ${year}`}
          className="w-full h-full object-cover object-[center_30%] block select-none"
          draggable={false}
        />
      </div>

      {/*
        ── Single blue overlay (friend's approach) ──
        ONE full-width div positioned at the bottom of the hero zone.
        Its clip-path carves the W into its top edge — the rest is solid blue.
        This replaces the previous two-chevron approach; no alignment juggling.

        - height: how tall the blue region is (including the part that bleeds
          below the photo and into the calendar body)
        - bottom: how far it bleeds below the photo bottom
        - z-index: must be above photo (z-[1]) but allow the text/buttons (z-[5])
      */}
      <div
        className="absolute left-0 w-full bg-blue z-[3] clip-hero-overlay"
        style={{ height: '200px', bottom: '-56px' }}
        aria-hidden="true"
      />

      {/* ── Month / year label — right side of the overlay ── */}
      <div
        className="absolute right-6 flex flex-col items-end leading-none z-[5] pointer-events-none"
        style={{ bottom: '64px' }}
      >
        <span className="font-body text-[18px] font-light text-white tracking-widest">
          {year}
        </span>
        <span className="font-heading text-[28px] lg:text-[34px] font-black text-white uppercase tracking-wide">
          {MONTHS[month]}
        </span>
      </div>

      {/* ── Navigation buttons — left side of the overlay ── */}
      <button
        className="
          absolute left-5 z-[5] w-[34px] h-[34px] rounded-full
          bg-white/20 border border-white/45 text-white text-[22px]
          flex items-center justify-center
          transition-all duration-200
          hover:bg-white/35 hover:scale-105 active:scale-95
        "
        style={{ bottom: '62px' }}
        onClick={onPrev}
        aria-label="Previous month"
      >
        ‹
      </button>
      <button
        className="
          absolute left-[62px] z-[5] w-[34px] h-[34px] rounded-full
          bg-white/20 border border-white/45 text-white text-[22px]
          flex items-center justify-center
          transition-all duration-200
          hover:bg-white/35 hover:scale-105 active:scale-95
        "
        style={{ bottom: '62px' }}
        onClick={onNext}
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  )
}
