import { headers } from 'next/headers';
import { AllSubjectResp } from './types';
import Link from 'next/link';
import { getAllSubjects } from './utils/utils';
import CheckUserAuth from './Components/CheckUserAuth';

export default async function Home({ children }: any) {
	const subjects = getSubjects() as AllSubjectResp;

	return (
		<main className='flex justify-center flex-col items-center p-4 gap-4'>
			<CheckUserAuth/>
			<div
				className={`subject-header h-[40vh] w-full bg-hero-pattern bg-cover bg-center text-white rounded-md flex items-center justify-center`}
			>
				<h1 className='text-3xl '>RBR GATE course</h1>
			</div>
			<div
				className='grid  gap-4 w-[80%]'
				style={{
					gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
				}}
			>
				{subjects.map((subject) => (
					<Link
						href={`/${subject.id}`}
						className='card border border-slate-100 shadow-md rounded-md overflow-hidden'
						key={crypto.randomUUID()}
					>
						<div
							className='image-card aspect-video bg-cover bg-center w-full'
							style={{
								backgroundImage: `url("/subjects/${subject.id}.jpeg")`,
							}}
							key={crypto.randomUUID()}
						></div>
						<div className='text-card p-3' key={crypto.randomUUID()}>
							<h1>{subject.name}</h1>
						</div>
					</Link>
				))}
			</div>
			{/* <PDFViewer/> */}
		</main>
	);
}
const getSubjects = (): AllSubjectResp => {
	return getAllSubjects();
};
