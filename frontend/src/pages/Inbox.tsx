import EmailReviewCard from '../components/EmailReviewCard'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { sampleEmails } from '../sample/data'

export default function Inbox() {
  // TODO(me): replace sampleEmails with your review-queue query (docs/replica/diff.md, B).
  //   "Sync now" = useMutation → POST /emails/sync, then show the EmailSyncResult counts.
  //   "Apply" and "Dismiss" need the endpoints proposed in diff.md (C).
  return (
    <>
      <PageHeader
        title="Inbox"
        description="Recruiter emails JobBear couldn't match, or wasn't sure about. Nothing changes until you decide."
        actions={
          <button type="button" className="btn-primary">
            <Icon name="refresh" size={16} />
            Sync now
          </button>
        }
      />

      <p className="mb-4 text-sm text-bark-500">
        {sampleEmails.length} emails need a decision. Last synced 12 minutes ago.
      </p>

      <Panel className="p-0 sm:p-0">
        <div className="list-in divide-y divide-birch-200">
          {sampleEmails.map((email, index) => (
            <div key={email.id} style={{ '--i': index } as React.CSSProperties}>
              <EmailReviewCard
                email={email}
                actions={
                  <>
                    <button type="button" className="btn-primary">
                      <Icon name="check" size={16} />
                      Apply to application
                    </button>
                    <button type="button" className="btn-ghost">
                      Dismiss
                    </button>
                  </>
                }
              />
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}
