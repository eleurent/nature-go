import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-background min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-old-standard mb-3">404</h1>
      <p className="font-old-standard text-nature-brown/70 mb-6 max-w-sm">
        This page could not be found in your naturalist journal.
      </p>
      <Link href="/home" className="btn-primary px-6 py-2">
        Return Home
      </Link>
    </div>
  );
}
