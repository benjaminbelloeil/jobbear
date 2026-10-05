import Icon from './Icon'

interface KeywordMatchProps {
  /** Skills from the posting that appear in the resume. */
  matched: string[]
  /** Skills from the posting the resume never mentions. */
  missing: string[]
  resumeName: string
}

/**
 * How much of a posting's wording a resume covers, with the evidence next to the number.
 * Deliberately not called an "ATS score": it checks words, not experience, and says so.
 */
export default function KeywordMatch({ matched, missing, resumeName }: KeywordMatchProps) {
  const total = matched.length + missing.length
  const share = total === 0 ? 0 : matched.length / total

  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="font-display text-5xl font-extrabold tabular-nums tracking-tight">
          {Math.round(share * 100)}%
        </span>
        <span className="text-sm text-bark-500">
          {matched.length} of {total} skills
        </span>
      </p>
      <span aria-hidden className="mt-3 block h-2 overflow-hidden rounded-full bg-birch-200">
        <span
          className="fill-in block h-full rounded-full bg-gradient-to-r from-bark to-bark-700"
          style={{ width: `${share * 100}%` }}
        />
      </span>
      <p className="mt-2 text-sm text-bark-500">
        Skills from the posting found in <span className="font-medium text-bark">{resumeName}</span>
        .
      </p>

      <h3 className="mt-6 text-sm font-semibold text-bark-700">In your resume</h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {matched.map((skill) => (
          <li
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-birch-200/70 py-1 pl-2 pr-2.5 text-sm text-bark ring-1 ring-inset ring-birch-300"
          >
            <Icon name="check" size={14} className="text-pine" />
            {skill}
          </li>
        ))}
      </ul>

      {missing.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-semibold text-bark-700">Not in your resume</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {missing.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-dashed border-bark-400 px-2.5 py-1 text-sm text-bark-700"
              >
                {skill}
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6 border-t border-birch-200 pt-4 text-sm leading-relaxed text-bark-500">
        This only compares wording, not experience. Add a missing skill only if you really have it.
      </p>
    </div>
  )
}
