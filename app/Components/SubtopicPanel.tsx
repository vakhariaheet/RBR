import Link from 'next/link';
import { Topic } from '../types';
import { useState } from 'react';

interface SubTopicPanelProps {
	topic: Topic;
	subjectId: string;
	subtopicId?: string;
	fileId?: string;
	name?: string;
}

export default function SubTopicPanel({
	topic,
	subjectId,
	fileId,
	subtopicId,
}: SubTopicPanelProps) {
	'use client';
	const [openedSubtopic, setOpenedSubtopic] = useState<number[]>([]);
	return (
		<div className='flex justify-center '>
			{'subtopics' in topic && topic.subtopics.length > 0 && (
				<div className='topics w-[70%] flex flex-col rounded-md overflow-hidden '>
					{topic.subtopics.map((subtopic) => (
						<>
							{'files' in subtopic && subtopic.files.length > 0 ? (
								<div
									className='files p-3 bg-white border border-b-0 border-x-0 first:border-t-0 '
									key={crypto.randomUUID()}
								>
									<h2
										key={crypto.randomUUID()}
										className='cursor-pointer'
										onClick={() => {
											if (openedSubtopic?.includes(subtopic.order)) {
												setOpenedSubtopic(
													openedSubtopic?.filter((id) => id !== subtopic.order),
												);
											} else {
												setOpenedSubtopic([...openedSubtopic, subtopic.order]);
											}
										}}
									>
										<svg
											viewBox='0 0 492.004 492.004'
											className='inline-block w-4 h-4 mr-2'
											style={{
												transform: openedSubtopic?.includes(subtopic.order)
													? 'rotate(90deg)'
													: 'rotate(270deg)',
											}}
										>
											<g>
												<path
													d='M382.678 226.804 163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z'
													fill='#000000'
													data-original='#000000'
												/>
											</g>
										</svg>
										{subtopic.name}
									</h2>
									<div className='mt-2'>
										{openedSubtopic?.includes(subtopic.order) &&
											subtopic.files.map((file) => (
												<div
													className='file p-2  hover:text-blue-500 hover:bg-slate-100  '
													key={crypto.randomUUID()}
												>
													<Link
														href={`/${subjectId}/${topic.order}/${subtopic.order}/${file.order}`}
													>
														{file.name}
													</Link>
												</div>
											))}
									</div>
								</div>
							) : (
								<Link
									className='hover:text-blue-500 hover:bg-slate-100  p-3 bg-white border border-b-0 border-x-0 first:border-t-0  duration-200 ease-in'
									href={`/${subjectId}/${topic.order}/${subtopic.order}`}
								>
									{subtopic.name}
								</Link>
							)}
						</>
					))}
				</div>
			)}
		</div>
	);
}
