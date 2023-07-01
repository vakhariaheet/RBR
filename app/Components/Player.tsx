'use client';
import { SubtopicResp, TopicResp, Topic } from '@/app/types';
import { useEffect, useRef, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import Link from 'next/link';
import SubTopicPanel from './SubtopicPanel';

import PDFViewer from './PDFViewer';
import { PDFWatchInfo, VideoWatchInfo } from '@prisma/client';
import Image from 'next/image';
import { useResizeObserver } from '../hooks/useResize';
enum LogType {
	VIDEO = 'VIDEO',
	VIDEO_ENDED = 'VIDEO_ENDED',
	PDF = 'PDF',
}
export interface TopicProps {
	file: {
		name: string;
		mimeType: string;
		uri: string;
	};
	topic: Topic;
	subjectId: string;
	getTopicResp: TopicResp;
	fileId?: string;
	subtopicId?: string;
	viewInfo?: {
		id: string;
		videoId: string;
		timeWatched: number;
		hasEnded: boolean;
		userId: string;
	};
	allViewInfo?: (VideoWatchInfo | PDFWatchInfo)[];
}

export default function Player({
	file,
	topic,
	subjectId,
	fileId,
	getTopicResp,
	subtopicId,
	viewInfo,
	allViewInfo,
}: TopicProps) {
	const { next, prev } = getTopicResp.data;
	const [ ref, setRef ] = useState<HTMLVideoElement | null>(null);
	const [ contRef, rect ] = useResizeObserver();
	useEffect(() => {
		if (!ref) return;
		let interval: NodeJS.Timeout;

		const onPlay = async () => {
			interval = setInterval(() => {
				fetch(`${window.location.origin}/api/logs`, {
					method: 'POST',
					body: JSON.stringify({
						type: LogType.VIDEO,
						topicId: topic.order,
						subjectId: subjectId,
						subtopicId,
						fileId,
						timestamp: ref?.currentTime,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}, 3000);
		};
		const onEnd = async () => {
			await fetch(`${window.location.origin}/api/logs`, {
				method: 'POST',
				body: JSON.stringify({
					type: LogType.VIDEO_ENDED,
					topicId: topic.order,
					subjectId: subjectId,
					subtopicId,
					fileId,
					timestamp: ref?.currentTime,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		};
		ref.addEventListener('play', onPlay);
		ref.addEventListener('pause', () => {
			clearInterval(interval);
		});
		ref.addEventListener('loadedmetadata', () => {
	
			if (!viewInfo) return;
			ref.currentTime = viewInfo.timeWatched;
		});
		ref.addEventListener('ended', onEnd);
		return () => {
			ref?.removeEventListener('play', onPlay);
			ref?.removeEventListener('pause', () => {
				clearInterval(interval);
			});
			ref?.removeEventListener('ended', onEnd);
			ref.removeEventListener('loadedmetadata', () => {
				if (!viewInfo) return;
				ref.currentTime = viewInfo.timeWatched;
			});
			clearInterval(interval);
		};
	}, [ref]);
	return (
		<div className=' bg-slate-50' ref={contRef}>
			<div className='bg-slate-100 p-4 shadow-md text-xl flex justify-between max-md:p-2 items-center'>
				{prev ? (
					<Link
						className='opacity-70 hover:opacity-100 max-md:text-xs text-lg'
						href={`/${subjectId}/${prev.id}`}
					>
						{rect.width > 600?'Previous Subtopic':'👈'}
					</Link>
				) : (
					<p></p>
				)}
				<h3 className='text-lg max-md:text-xs'>{topic.name}</h3>

				{next ? (
					<Link
						className='opacity-70 hover:opacity-100 max-md:text-xs text-lg'
						href={`/${subjectId}/${next.id}`}
					>
						{rect.width > 600?'Next Subtopic':'👉'}
					</Link>
				) : (
					<p></p>
				)}
			</div>
			<Link
				href={'/'}
				className='home-link block absolute left-4 rounded-md p-4 bottom-8 aspect-square w-max max-md:mt-1 max-md:ml-1 bg-white max-md:static max-md:p-2'
			>
				<svg viewBox='0 0 511 511.999' className='w-8 h-8 max-md:w-4 max-md:h-4 '>
					<g>
						<path
							d='M498.7 222.695c-.016-.011-.028-.027-.04-.039L289.805 13.81C280.902 4.902 269.066 0 256.477 0c-12.59 0-24.426 4.902-33.332 13.809L14.398 222.55c-.07.07-.144.144-.21.215-18.282 18.386-18.25 48.218.09 66.558 8.378 8.383 19.44 13.235 31.273 13.746.484.047.969.07 1.457.07h8.32v153.696c0 30.418 24.75 55.164 55.168 55.164h81.711c8.285 0 15-6.719 15-15V376.5c0-13.879 11.293-25.168 25.172-25.168h48.195c13.88 0 25.168 11.29 25.168 25.168V497c0 8.281 6.715 15 15 15h81.711c30.422 0 55.168-24.746 55.168-55.164V303.14h7.719c12.586 0 24.422-4.903 33.332-13.813 18.36-18.367 18.367-48.254.027-66.633zm-21.243 45.422a17.03 17.03 0 0 1-12.117 5.024H442.62c-8.285 0-15 6.714-15 15v168.695c0 13.875-11.289 25.164-25.168 25.164h-66.71V376.5c0-30.418-24.747-55.168-55.169-55.168H232.38c-30.422 0-55.172 24.75-55.172 55.168V482h-66.71c-13.876 0-25.169-11.29-25.169-25.164V288.14c0-8.286-6.715-15-15-15H48a13.9 13.9 0 0 0-.703-.032c-4.469-.078-8.66-1.851-11.8-4.996-6.68-6.68-6.68-17.55 0-24.234.003 0 .003-.004.007-.008l.012-.012L244.363 35.02A17.003 17.003 0 0 1 256.477 30c4.574 0 8.875 1.781 12.113 5.02l208.8 208.796.098.094c6.645 6.692 6.633 17.54-.031 24.207zm0 0'
							fill='#000000'
							data-original='#000000'
						/>
					</g>
				</svg>
			</Link>
			<div className='flex p-4 gap-4 max-md:gap-0 max-md:pt-0 max-xl:flex-col'>
				<div className='w-2/3 max-xl:w-full'>
					<div className=' flex justify-center pb-0 w-full'>
						{file.mimeType.includes('video') ? (
							<div className='rounded-md overflow-hidden w-full aspect-video '>
								<VideoPlayer
									video={{
										uri: file.uri,
										mimeType: file.mimeType,
									}}
									style={{
										width: '100%',
									}}
									setRef={setRef}
								/>
							</div>
						) : file.mimeType.includes('pdf') ? (
							<PDFViewer
								url={`${process.env.NEXT_PUBLIC_S3_BUCKET}${file.uri}`}
								name={file.name}
								subjectId={subjectId}
								subtopicId={subtopicId}
								fileId={fileId}
								topicId={topic.order.toString()}
							/>
						) : file.mimeType.includes('image') ? (
							<div className='rounded-md overflow-hidden w-full aspect-video relative '>
								<Image
									src={`${process.env.NEXT_PUBLIC_S3_BUCKET}${file.uri}`}
									alt={file.name}
									fill
								/>
							</div>
						) : file.mimeType.includes('zip') ? (
							<div className='rounded-md overflow-hidden w-full aspect-video relative flex justify-center items-center'>
								<div className='flex flex-col items-center gap-2'>
									<svg className='h-16 w-16' viewBox='0 0 682.667 682.667'>
										<g>
											<defs>
												<clipPath id='a' clipPathUnits='userSpaceOnUse'>
													<path
														d='M0 512h512V0H0Z'
														fill='#000000'
														data-original='#000000'
													/>
												</clipPath>
											</defs>
											<path
												d='M0 0v-90'
												style={{
													strokeWidth: 20,
													strokeLinecap: 'round',
													strokeLinejoin: 'round',
													strokeMiterlimit: '22.926',
													strokeDasharray: 'none',
													strokeOpacity: 1,
												}}
												transform='matrix(1.33333 0 0 -1.33333 341.333 454.666)'
												fill='none'
												stroke='#000000'
												strokeWidth={20}
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeMiterlimit='22.926'
												strokeDasharray='none'
												data-original='#000000'
											/>
											<g
												clipPath='url(#a)'
												transform='matrix(1.33333 0 0 -1.33333 0 682.667)'
											>
												<path
													d='M0 0h17.5C29.875 0 40 10.125 40 22.5v0C40 34.875 29.875 45 17.5 45H-5v-90'
													style={{
														strokeWidth: 20,
														strokeLinecap: 'round',
														strokeLinejoin: 'round',
														strokeMiterlimit: '22.926',
														strokeDasharray: 'none',
														strokeOpacity: 1,
													}}
													transform='translate(301 126)'
													fill='none'
													stroke='#000000'
													strokeWidth={20}
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeMiterlimit='22.926'
													strokeDasharray='none'
													data-original='#000000'
												/>
												<path
													d='M0 0h45L0-90h45'
													style={{
														strokeWidth: 20,
														strokeLinecap: 'round',
														strokeLinejoin: 'round',
														strokeMiterlimit: '22.926',
														strokeDasharray: 'none',
														strokeOpacity: 1,
													}}
													transform='translate(171 171)'
													fill='none'
													stroke='#000000'
													strokeWidth={20}
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeMiterlimit='22.926'
													strokeDasharray='none'
													data-original='#000000'
												/>
												<path
													d='M0 0h220.001C231.001 0 240-9 240-20v-140c0-11-8.999-20-19.999-20H0c-11 0-20 9-20 20v140C-20-9-11 0 0 0z'
													style={{
														strokeWidth: 20,
														strokeLinecap: 'round',
														strokeLinejoin: 'round',
														strokeMiterlimit: '22.926',
														strokeDasharray: 'none',
														strokeOpacity: 1,
													}}
													transform='translate(146 216)'
													fill='none'
													stroke='#000000'
													strokeWidth={20}
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeMiterlimit='22.926'
													strokeDasharray='none'
													data-original='#000000'
												/>
												<path
													d='M0 0h-87.677C-100.498 0-111 10.495-111 23.322v313.356C-111 349.505-100.505 360-87.677 360H42.055c15.244 0 25.014-9.574 28.594-23.322l11.715-44.983h275.313c12.828 0 23.323-10.506 23.323-23.322V23.322C381 10.495 370.501 0 357.678 0H270'
													style={{
														strokeWidth: 20,
														strokeLinecap: 'round',
														strokeLinejoin: 'round',
														strokeMiterlimit: '22.926',
														strokeDasharray: 'none',
														strokeOpacity: 1,
													}}
													transform='translate(121 116)'
													fill='none'
													stroke='#000000'
													strokeWidth={20}
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeMiterlimit='22.926'
													strokeDasharray='none'
													data-original='#000000'
												/>
												<path
													d='M0 0h267.851c10.999 0 19.999-9.002 19.999-20v-20.68'
													style={{
														strokeWidth: 20,
														strokeLinecap: 'round',
														strokeLinejoin: 'round',
														strokeMiterlimit: '22.926',
														strokeDasharray: 'none',
														strokeOpacity: 1,
													}}
													transform='translate(194.15 452.678)'
													fill='none'
													stroke='#000000'
													strokeWidth={20}
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeMiterlimit='22.926'
													strokeDasharray='none'
													data-original='#000000'
												/>
											</g>
										</g>
									</svg>
												<h4 className='text-center'>{file.name.substring(0, file.name.lastIndexOf('.'))}</h4>
												<a href={`${process.env.NEXT_PUBLIC_S3_BUCKET}${file.uri}`} className='py-3 border px-12 text-xl rounded-md border-blue-300 duration-75 ease-in hover:text-blue-500 hover:border-blue-500'>
													Download
												</a>
								</div>
							</div>
						) : (
							<iframe
								src={`https://view.officeapps.live.com/op/embed.aspx?src=${process.env.NEXT_PUBLIC_S3_BUCKET}${file.uri}`}
								className='w-full aspect-video'
							/>
						)}
					</div>
					<div className='flex justify-center w-full'>
						<div className='flex justify-center w-full '>
							<h3 className=' text-xl p-5 bg-white mb-3 w-full max-md:text-sm max-md:p-2'>
								{file.name.substring(0, file.name.lastIndexOf('.'))}
							</h3>
						</div>
					</div>
				</div>
				<SubTopicPanel
					topic={topic}
					subjectId={subjectId}
					subtopicId={subtopicId}
					fileId={fileId}
					name={file.name}
					allViewInfo={allViewInfo}
				/>
			</div>
		</div>
	);
}
