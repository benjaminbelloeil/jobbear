import Select from '../../components/form/Select'
import Slider from '../../components/form/Slider'
import ToggleRow from '../../components/form/ToggleRow'
import Icon from '../../components/Icon'
import Panel from '../../components/Panel'
import { sampleGoalHistory, sampleGoals } from '../../sample/data'

const weekOf = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

// Goals people often keep during a search, offered as one-click additions.
const IDEAS = ['Coffee chats', 'Tailored resumes', 'Practice problems', 'Portfolio updates']

export default function GoalSettings() {
  // TODO(me): goals are sample UI. Store them per user (label + weekly target);
  //   applications and follow-ups count themselves from status_events. The history is
  //   one row per goal per week (met or not), written when the week closes.
  const history = sampleGoalHistory

  return (
    <div className="space-y-6">
      <Panel
        title="Weekly goals"
        icon="target"
        description="Shown in the sidebar and counted each week. Keep a few you'll actually hit."
        actions={
          <button type="button" className="btn-soft">
            <Icon name="plus" size={15} />
            Add a goal
          </button>
        }
      >
        <ul className="divide-y divide-birch-200">
          {sampleGoals.map((goal) => (
            <li
              key={goal.id}
              className="grid items-end gap-4 py-5 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto]"
            >
              <label className="block">
                <span className="label">Goal</span>
                <input
                  name={`goal-${goal.id}-label`}
                  defaultValue={goal.label}
                  className="field mt-1.5"
                />
              </label>
              <Slider
                label="Each week"
                name={`goal-${goal.id}-target`}
                min={1}
                max={goal.id === 'applications' ? 40 : 10}
                defaultValue={goal.target}
              />
              <button
                type="button"
                aria-label={`Remove ${goal.label}`}
                className="btn-ghost justify-self-start px-2.5 hover:bg-berry-50 hover:text-berry md:justify-self-end"
              >
                <Icon name="x" size={16} />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-birch-200 pt-5">
          <p className="label">Ideas</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {IDEAS.map((idea) => (
              <li key={idea}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-bark-400 px-3 py-1.5 text-sm font-medium text-bark-700 transition-colors hover:border-bark hover:bg-white hover:text-bark"
                >
                  <Icon name="plus" size={13} />
                  {idea}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel
          title="The last four weeks"
          icon="calendar"
          description="Which goals you met, week by week."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[22rem] text-sm">
              <thead>
                <tr className="text-left text-xs text-bark-500">
                  <th scope="col" className="pb-3 font-medium">
                    Goal
                  </th>
                  {history.weeks.map((week) => (
                    <th key={week} scope="col" className="pb-3 text-center font-medium">
                      {weekOf.format(new Date(week))}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-birch-200">
                {sampleGoals.map((goal) => {
                  const weeks = history.met[goal.id] ?? []
                  return (
                    <tr key={goal.id}>
                      <th scope="row" className="py-3 pr-4 text-left font-semibold">
                        {goal.label}
                        <span className="block text-xs font-normal text-bark-500">
                          {weeks.filter(Boolean).length} of {weeks.length} weeks
                        </span>
                      </th>
                      {weeks.map((met, i) => (
                        <td key={history.weeks[i]} className="py-3 text-center">
                          <span
                            className={`inline-grid h-8 w-8 place-items-center rounded-full ${
                              met
                                ? 'bg-honey text-bark'
                                : 'border border-dashed border-bark-400 text-bark-400'
                            }`}
                          >
                            <Icon name={met ? 'check' : 'x'} size={14} />
                            <span className="sr-only">{met ? 'Met' : 'Missed'}</span>
                          </span>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Week and nudges" icon="clock" description="When a week starts and ends.">
          <div className="space-y-5">
            <Select
              label="Weeks start on"
              icon="calendar"
              defaultValue="monday"
              options={[
                { value: 'monday', label: 'Monday' },
                { value: 'sunday', label: 'Sunday' },
              ]}
            />
            <div className="divide-y divide-birch-200 border-t border-birch-200 pt-4">
              <ToggleRow
                name="nudge_friday"
                label="Friday nudge"
                description="If you're behind on a goal, the dashboard says so on Friday."
                defaultChecked
              />
              <ToggleRow
                name="show_sidebar"
                label="Show goals in the sidebar"
                description="Turn off to keep them here only."
                defaultChecked
              />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
