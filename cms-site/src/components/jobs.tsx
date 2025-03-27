'use client'

import { JobType } from "@/type";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// interface ApiResponse {
//     jobs: JobType[];
//     total: number;
// }

const JobList = () => {
    const [jobs, setJobs] = useState<JobType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchJobs = async (pageNum: number = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/jobs?page=${pageNum}&limit=6`);
            console.log(response,'ini response fetch jobs<<<<');
            
            if (!response.ok) throw new Error('Failed to fetch jobs');
            
            const data: JobType[] = await response.json();
            setJobs(data)
            console.log(data,'<<<<< data');
            

            // console.log("Data structure:", {
            //     hasJobsProperty: 'jobs' in data,
            //     jobsType: data.jobs ? typeof data.jobs : 'undefined',
            //     isJobsArray: Array.isArray(data.jobs),
            //     hasTotalProperty: 'total' in data,
            //     totalValue: data.total,
            //     fullData: data
            // });
            
            
            if (pageNum === 1) {
                // setJobs(data.jobs || []);
                // console.log(data?.jobs,'<<<<');
                
                // setHasMore((data.jobs?.length || 0) > 0 && (data.jobs?.length || 0) < (data.total || 0))
            } else {
                // setJobs(prevJobs => {
                //     const newJobList = [...prevJobs, ...data.jobs || []]
                //     setHasMore((data.jobs?.length || 0) > 0 && newJobList.length < (data.total || 0))
                //     return newJobList
                // })
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchJobs(nextPage);
    };

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Error: {error}</p>
                <button 
                    onClick={() => fetchJobs()} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Available Positions</h2>
            
            {jobs.length === 0 && !loading ? (
                <p className="text-center py-10">No jobs found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-16 h-16 relative flex-shrink-0">
                                        <Image 
                                            src={job.company.logo} 
                                            alt={job.company.name}
                                            layout="fill" 
                                            objectFit="contain"
                                        />
                                    </div>
                                    <div className="flex flex-col ml-3">
                                        <h3 className="text-lg font-semibold text-gray-800">{job.name}</h3>
                                        <p className="text-sm text-gray-600">{job.company.name}</p>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span className="text-sm text-gray-600">{job.location}</span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                        </svg>
                                        <span className="text-sm text-gray-600">{job.category}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span className="text-sm text-gray-600">{job.salary}</span>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{job.excerpt}</p>
                                
                                <Link href={`/jobs/${job.slug}`} className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {loading && (
                <div className="flex justify-center mt-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            )}
            
            {hasMore && !loading && (
                <div className="text-center mt-8">
                    <button 
                        onClick={loadMore}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobList;