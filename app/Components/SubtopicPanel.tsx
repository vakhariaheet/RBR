import Link from 'next/link';
import { Subtopic, Topic } from '../types';
import { useState } from 'react';
import { PDFWatchInfo, VideoWatchInfo } from '@prisma/client';
const getLectureId = (
	subjectId: string,
	topicId: string,
	subtopicId?: string,
	fileId?: string,
) => {
	if (!subtopicId) {
		return `${subjectId}-${topicId}`;
	}
	if (!fileId) {
		return `${subjectId}-${topicId}-${subtopicId}`;
	}
	return `${subjectId}-${topicId}-${subtopicId}-${fileId}`;
};
interface SubTopicPanelProps {
	topic: Topic;
	subjectId: string;
	subtopicId?: string;
	fileId?: string;
	name: string;
	allViewInfo?: (VideoWatchInfo | PDFWatchInfo)[];
}

export default function SubTopicPanel({
	topic,
	subjectId,
	subtopicId,
	name,
	allViewInfo,
}: SubTopicPanelProps) {
	'use client';
	const [openedSubtopic, setOpenedSubtopic] = useState<number[]>([
		Number(subtopicId),
	]);
	const verifyId = (subtopic: Subtopic | File, fileId?: string) => {
		if (allViewInfo) {
			if ('files' in subtopic && subtopic.files.length > 0) {
				const file = subtopic.files.find(
					(file) => file.order === Number(fileId),
				);
				if (file?.mimeType === 'pdf')
					return allViewInfo.find(
						(info) =>
							'pdfId' in info &&
							info.pdfId ===
								getLectureId(
									subjectId,
									topic.order.toString(),
									subtopic.order.toString(),
									fileId,
								),
					);
				else {
					const video = allViewInfo.find(
						(info) =>
							'videoId' in info &&
							info.videoId ===
								getLectureId(
									subjectId,
									topic.order.toString(),
									subtopic.order.toString(),
									fileId,
								),
					) as VideoWatchInfo | undefined;
					return video?.hasEnded ? true : false;
				}
			} else {
				if (!('order' in subtopic)) return false;
				if ('mimeType' in subtopic && subtopic.mimeType === 'pdf')
					return allViewInfo.find(
						(info) =>
							'pdfId' in info &&
							info.pdfId ===
								getLectureId(
									subjectId,
									topic.order.toString(),
									subtopic.order.toString(),
									fileId,
								),
					);
				else {
					const video = allViewInfo.find(
						(info) =>
							'videoId' in info &&
							info.videoId ===
								getLectureId(
									subjectId,
									topic.order.toString(),
									subtopic.order.toString(),
									fileId,
								),
					) as VideoWatchInfo | undefined;
					return video?.hasEnded ? true : false;
				}
			}
		}
		return false;
	};
	return (
		<div className='flex justify-center w-1/3 max-h-[80vh] overflow-y-scroll max-xl:w-full max-xl:max-h-full '>
			{'subtopics' in topic && topic.subtopics.length > 0 && (
				<div className='topics w-full flex flex-col rounded-md '>
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
										{subtopic.name.substring(0, subtopic.name.lastIndexOf('.'))}
									</h2>
									<div className='mt-2'>
										{openedSubtopic?.includes(subtopic.order) &&
											subtopic.files.map((file) => (
												<div
													className={`file fileHover p-2  hover:tw-text-blue-500 hover:tw-bg-blue-500 hover:bg-opacity-10 ${
														name === file.name &&
														'bg-blue-500 text-blue-500 bg-opacity-10'
													} `}
													key={crypto.randomUUID()}
													style={{
														color:
															verifyId(subtopic, file.order.toString()) &&
															name !== file.name
																? 'rgb(34, 197, 94)'
																: name === file.name
																? 'rgb(59, 130, 246)'
																: '',
														background: verifyId(
															subtopic,
															file.order.toString(),
														)
															? 'rgba(34, 197, 94,.1)'
															: '',
													}}
												>
													<Link
														href={`/${subjectId}/${topic.order}/${subtopic.order}/${file.order}`}
														scroll={false}
													>
														{file.name.substring(0, file.name.lastIndexOf('.'))}
													</Link>
												</div>
											))}
									</div>
								</div>
							) : (
								<Link
									className={` fileHover hover:text-blue-500 hover:bg-blue-500 hover:bg-opacity-10  p-3  border border-b-0 border-x-0 first:border-t-0  duration-200 ease-in ${
										name === subtopic.name
											? 'bg-blue-500 bg-opacity-10'
											: 'bg-white'
									} `}
									href={`/${subjectId}/${topic.order}/${subtopic.order}`}
									scroll={false}
									style={{
										color:
											verifyId(subtopic as Subtopic | File) &&
											name !== subtopic.name
												? 'rgb(34, 197, 94)'
												: name === subtopic.name
												? 'rgb(59, 130, 246)'
												: '',
										background: verifyId(subtopic as Subtopic | File)
											? 'rgba(34, 197, 94,.1)'
											: '',
									}}
								>
									{subtopic.name.substring(0, subtopic.name.lastIndexOf('.'))}
								</Link>
							)}
						</>
					))}
				</div>
			)}
		</div>
	);
}
