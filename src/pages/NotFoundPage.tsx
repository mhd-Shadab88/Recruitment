import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Page not found</h1>
      <p className="mt-3 text-[var(--color-muted)]">
        That page doesn&apos;t exist.{' '}
        <Link to="/" className="text-[var(--color-accent)] underline underline-offset-2">
          Back to home
        </Link>
        .
      </p>
    </div>
  )
}
