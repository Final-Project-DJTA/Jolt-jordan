import { JobType } from '@/type';
import { notFound } from 'next/navigation';
import Image from 'next/image';

async function getJob(slug: string): Promise<JobType | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${slug}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const job = await getJob(params.slug);
  
  if (!job) {
    return {
      title: 'Job Not Found',
    };
  }
  
  return {
    title: `${job.name} at ${job.company.name} | Jolt Careers`,
    description: job.excerpt,
  };
}

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = await getJob(params.slug);
  
  if (!job) {
    notFound();
  }
  
  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 relative mr-4">
              <Image 
                src={job.company.logo} 
                alt={job.company.name}
                layout="fill" 
                objectFit="contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.name}</h1>
              <p className="text-xl text-gray-600">{job.company.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700">Location</h3>
              <p>{job.location}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700">Category</h3>
              <p>{job.category}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700">Salary</h3>
              <p>{job.salary}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-700">{job.description}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Responsibilities</h2>
            <ul className="list-disc pl-5">
              {job.detail.responsibilities.map((item, index) => (
                <li key={index} className="mb-2 text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <ul className="list-disc pl-5">
              {job.detail.requirements.map((item, index) => (
                <li key={index} className="mb-2 text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
            <ul className="list-disc pl-5">
              {job.detail.benefits.map((item, index) => (
                <li key={index} className="mb-2 text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">About {job.company.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Industry</p>
                <p className="text-gray-700">{job.company.industry}</p>
              </div>
              <div>
                <p className="font-medium">Company Size</p>
                <p className="text-gray-700">{job.company.size}</p>
              </div>
              <div>
                <p className="font-medium">Headquarters</p>
                <p className="text-gray-700">{job.company.headquarters}</p>
              </div>
              <div>
                <p className="font-medium">Website</p>
                <a href={job.company.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">{job.company.website}</a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a href="#apply" className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
              Apply for this position
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}