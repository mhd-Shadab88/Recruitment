export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8 text-center text-xs text-[var(--color-muted)]">
      <p>
        Built with Claude Code as a personal profile intelligence demo. Data provenance and identity-confidence
        details are on every source — see the{' '}
        <a href="/presence" className="underline underline-offset-2">
          Online Presence
        </a>{' '}
        and{' '}
        <a href="/admin" className="underline underline-offset-2">
          Admin
        </a>{' '}
        pages.
      </p>
    </footer>
  )
}
