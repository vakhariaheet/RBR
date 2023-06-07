import { GetStaticProps, Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { SubjectResp } from '../types';
import Link from 'next/link';


type Props = {
	params: { subjectId: string };
	searchParams: { [key: string]: string | string[] | undefined };
  };

export default async function Subject({
	params,
}: {
	params: { subjectId: string };
}) {
	const getSubjectResp = await getSubject(params.subjectId);
	if (!getSubjectResp.isSuccess) {
		return <h1>Subject not found</h1>;
	}
	const subject = getSubjectResp.data.result;

	return (
		<div className='p-3 bg-slate-50'>
			<div className={`subject-header h-[40vh] bg-cover bg-center text-white rounded-md flex items-center justify-center`} style={{
				backgroundImage: `url("/subjects/${subject.id}.jpeg")`,
			}}>
				<h1 className='text-3xl '>{subject.name}</h1>
			</div>
			<Link href="/" className='block px-16 py-4 mt-4 border rounded-md hover:border-blue-400 hover:text-blue-400 bg-white w-max'>
				Back
			</Link>

			<div className='topics flex flex-col mt-4 rounded-md overflow-hidden  border '>
				{subject.topics.map((topic) => {
					return (
						<Link className='p-2 bg-white border border-b-0 border-x-0 first:border-t-0 hover:bg-slate-100' href={`/${params.subjectId}/${topic.id}`} key={topic.name}>
							{topic.name}
						</Link>
					);
				})}
			</div>
		</div>
	);
}

const getSubject = async (subjectId: String): Promise<SubjectResp> => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}lectures/${subjectId}`);
	return res.json();
};

export const generateMetadata = async  ({params}:Props,parent:ResolvingMetadata):Promise<Metadata> => { 
	const getSubjectResp = await getSubject(params.subjectId);
	if (!getSubjectResp.isSuccess) { 
		return {
			title: 'Subject not found',
			description: 'Subject not found',
		};
	}
	const subject = getSubjectResp.data.result;
	return {
		title: subject.name,
		description: subject.name,
	};

	
}