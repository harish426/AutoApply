'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { fetchUserFromFirestore } from './lib/auth';
import { useUserStore } from './store/userStore';
import Header from './components/header';

interface Job {
  id: string;
  title: string;
  company: string;
}

// Dummy function: check if user exists
async function mockCheckUser(uid: string): Promise<boolean> {
  // simulate API delay
  await new Promise((r) => setTimeout(r, 300));
  return uid.length % 2 === 1; // for demo: fake exist if UID is even length
}

// Dummy function: fetch jobs
async function mockFetchJobs(uid: string): Promise<Job[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: 'job1', title: 'Frontend Engineer', company: 'TechCorp' },
    { id: 'job2', title: 'Smart Contract Dev', company: 'ChainHub' },
    { id: 'job3', title: 'Backend Node.js Engineer', company: 'DataWare' },
  ];
}

export default function HomePage() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
        return;
      }

      // const profile = await fetchUserFromFirestore(firebaseUser.uid);
      setUser({ ...firebaseUser });

      // ✅ Dummy API to check if user exists
      // const exists = false;
      const exists = await mockCheckUser(firebaseUser.uid);
      setUserExists(exists);

      // ✅ If exists, fetch jobs
      if (exists) {
        // const jobsData = [{title:"Protocol Engineer", company:"Chainlink", id:"cjah2"}, {title:"Smart contract Developer", company:"JP Morgan & chase", id:"vjinw"}];
        const jobsData = await mockFetchJobs(firebaseUser.uid);
        setJobs(jobsData);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (userExists === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.displayName}</h1>
        <button
          onClick={() => router.push('/profile')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Setup your profile
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 border rounded shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-600">{job.company}</p>
              </div>
              <button
                onClick={() => router.push(`/apply/${job.id}`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
