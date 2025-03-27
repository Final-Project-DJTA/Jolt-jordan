import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the job you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/jobs" 
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          View All Jobs
        </Link>
      </div>
    </div>
  );
}