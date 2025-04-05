"use client"
import { Appbar } from '@/components/Appbar';
import { BACKEND_URL } from '@/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image'


export default function Page({ params: { taskId } }: { params: { taskId: string } }) {
    const [result, setResult] = useState<Record<string, {
        count: number;
        option: { imageUrl: string }
    }>>({});
    const [taskDetails, setTaskDetails] = useState<{ title?: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get(`${BACKEND_URL}/v1/user/task?taskId=${taskId}`, {
                    headers: {
                        Authorization: token
                    }
                });

                setResult(response.data.result);
                setTaskDetails(response.data.taskDetails);
            } catch (error) {
                console.error("Failed to fetch task details:", error);
            }
        };

        fetchData();
    }, [taskId]);

    return (
        <div>
            <Appbar />
            <div className='text-2xl pt-20 flex justify-center'>
                {taskDetails.title}
            </div>
            <div className='flex justify-center pt-8'>
                {Object.keys(result || {}).map(id => (
                    <Task
                        key={id}
                        imageUrl={result[id].option.imageUrl}
                        votes={result[id].count}
                    />
                ))}
            </div>
        </div>
    );
}

function Task({ imageUrl, votes }: { imageUrl: string; votes: number }) {
    return (
        <div>
           <Image src="/image.png" alt="Description" width={500} height={300} />
            <div className='flex justify-center'>
                {votes}
            </div>
        </div>
    );
}
