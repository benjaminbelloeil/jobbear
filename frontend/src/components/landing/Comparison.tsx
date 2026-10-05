import type { CSSProperties } from 'react'

import { useInView } from '../../hooks/useInView'
import BearMark from '../BearMark'
import Icon, { type IconName } from '../Icon'

// Generic categories, not named products: what a job board and a spreadsheet tracker
// typically do at each moment of a search, next to what JobBear does.
const ROWS: [icon: IconName, moment: string, board: string, sheet: string, bear: string][] = [
  [
    'briefcase',
    'What it’s for',
    'Finding roles and sending applications',
    'Whatever list you build and keep up yourself',
    'Following every application after you send it',
  ],
  [
    'mail',
    'A recruiter emails you',
    'The reply goes to your inbox; the board never sees it',
    'You read it, then edit the row by hand',
    'It reads the email and updates the status for you',
  ],
  [
    'clock',
    'Seeing what happened',
    'Usually just “Applied”, with little after that',
    'Only the latest value, unless you log every change',
    'Every status change, with the email that caused it',
  ],
  [
    'chart',
    'Knowing what works',
    'No view of which channels get replies',
    'Possible, if you build the formulas and pivot tables',
    'Reply and interview rates per source, built in',
  ],
  [
    'shield',
    'Where your data lives',
    'On the job board’s servers',
    'In whichever file or drive you keep it',
    'On your own machine, and the code is open source',
  ],
]

const delay = (index: number) => ({ '--d': `${index * 90}ms` }) as CSSProperties

/** A muted "no" mark for the other two columns. */
function Nope() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-birch-200 text-bark-400">
      <Icon name="x" size={12} />
    </span>
  )
}

/** A honey "yes" mark for JobBear's column. */
function Yes() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-honey text-bark">
      <Icon name="check" size={12} />
    </span>
  )
}

/**
 * Positioning, in one table: JobBear isn't where you find jobs, and it isn't a sheet you
 * maintain. It starts after you apply and keeps itself up to date. JobBear's column is a
 * raised bark panel; rows reveal on scroll.
 */
export default function Comparison({ repoUrl }: { repoUrl: string }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.15, once: true })

  return (
    <div ref={ref} className={inView ? 'revealed' : 'reveal-armed'}>
      {/* Tablet and up: a real comparison table */}
      {/* A framed card: the comparison sits on white inside a soft border, and JobBear's
          column is a raised bark panel inset from the frame. It arrives as one block; only
          the grey comparison text fades in row by row, so the bark column stays whole. */}
      <div className="reveal-item hidden rounded-[2rem] border border-birch-300 bg-white p-3 shadow-[0_1px_2px_rgba(42,31,25,0.05),0_40px_70px_-45px_rgba(42,31,25,0.45)] md:block">
        <table className="w-full table-fixed border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            Job boards, spreadsheet trackers and JobBear compared
          </caption>
          <colgroup>
            <col className="w-[24%]" />
            <col />
            <col />
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="align-bottom">
              <th scope="col" className="pb-5 pl-5">
                <span className="sr-only">Moment</span>
              </th>
              <th scope="col" className="px-5 pb-5">
                <span className="flex items-center gap-2.5 font-display text-lg font-bold text-bark-500">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-birch-200">
                    <Icon name="list" size={18} />
                  </span>
                  Job boards
                </span>
              </th>
              <th scope="col" className="px-5 pb-5">
                <span className="flex items-center gap-2.5 font-display text-lg font-bold text-bark-500">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-birch-200">
                    <Icon name="dashboard" size={18} />
                  </span>
                  Spreadsheets
                </span>
              </th>
              <th scope="col" className="rounded-t-[1.25rem] bg-bark px-6 pb-5 pt-6 text-birch-50">
                <span className="flex items-center gap-3 font-display text-xl font-bold">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-birch">
                    <BearMark size={30} />
                  </span>
                  JobBear
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([icon, moment, board, sheet, bear], index) => (
              <tr key={moment} className="group">
                <th
                  scope="row"
                  className="reveal-fade rounded-l-2xl border-t border-birch-200 py-5 pl-5 pr-5 align-top transition-colors duration-200 group-hover:border-transparent group-hover:bg-birch-200/50"
                  style={delay(index)}
                >
                  <span className="flex items-center gap-3 font-display font-semibold">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-control bg-birch text-bark-700 ring-1 ring-birch-300">
                      <Icon name={icon} size={17} />
                    </span>
                    {moment}
                  </span>
                </th>
                <td
                  className="reveal-fade border-t border-birch-200 px-5 py-5 align-top text-bark-500 transition-colors duration-200 group-hover:border-transparent group-hover:bg-birch-200/50"
                  style={delay(index)}
                >
                  <span className="flex items-start gap-2.5">
                    <Nope />
                    {board}
                  </span>
                </td>
                <td
                  className="reveal-fade border-t border-birch-200 px-5 py-5 align-top text-bark-500 transition-colors duration-200 group-hover:border-transparent group-hover:bg-birch-200/50"
                  style={delay(index)}
                >
                  <span className="flex items-start gap-2.5">
                    <Nope />
                    {sheet}
                  </span>
                </td>
                <td className="border-t border-birch/10 bg-bark px-6 py-5 align-top font-medium text-birch-50 transition-colors duration-200 group-hover:bg-[#33271f]">
                  <span className="flex items-start gap-2.5">
                    <Yes />
                    {bear}
                  </span>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} />
              <td className="rounded-b-[1.25rem] bg-bark px-6 pb-6 pt-3">
                <a href={repoUrl} className="btn-honey btn-lift w-full py-3 font-semibold">
                  <Icon name="github" size={18} />
                  Get the code
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Phones: one block per moment, JobBear's answer first and loudest */}
      <ul className="space-y-4 md:hidden">
        {ROWS.map(([icon, moment, board, sheet, bear], index) => (
          <li
            key={moment}
            className="reveal-item overflow-hidden rounded-panel border border-birch-300 bg-birch-50"
            style={delay(index)}
          >
            <p className="flex items-center gap-2.5 px-5 pt-4 font-display font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-control bg-birch text-bark-700 ring-1 ring-birch-300">
                <Icon name={icon} size={16} />
              </span>
              {moment}
            </p>
            <p className="mx-3 mt-3 flex items-start gap-2.5 rounded-control bg-bark px-4 py-3 font-medium text-birch-50">
              <Yes />
              {bear}
            </p>
            <dl className="space-y-2 px-5 pb-4 pt-3 text-sm text-bark-500">
              <div className="flex items-start gap-2">
                <Nope />
                <dt className="sr-only">Job boards</dt>
                <dd>
                  <span aria-hidden className="font-medium text-bark-700">
                    Job boards:
                  </span>{' '}
                  {board}
                </dd>
              </div>
              <div className="flex items-start gap-2">
                <Nope />
                <dt className="sr-only">Spreadsheets</dt>
                <dd>
                  <span aria-hidden className="font-medium text-bark-700">
                    Spreadsheets:
                  </span>{' '}
                  {sheet}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}
