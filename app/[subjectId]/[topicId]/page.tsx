import { SubtopicResp, TopicResp } from '@/app/types';
import Player from '@/app/Components/Player';
import { Metadata, ResolvingMetadata } from 'next';
import {
	authenticateUser,
	getLectureId,
	getSubtopic,
	getTopic,
} from '@/app/utils/utils';
import { prisma } from '@/app/lib/prisma';
import { PDFWatchInfo, VideoWatchInfo } from '@prisma/client';

type Props = {
	params: { subjectId: string; topicId: string };
	searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Topic({
	params,
}: {
	params: { subjectId: string; topicId: string };
}) {
	const user = await authenticateUser();
	const getTopicResp = getTopic(params.subjectId, params.topicId) as TopicResp;
	const { subjectId, topicId } = params;
	let fileId: string | undefined = undefined;
	let subtopicId: string | undefined = undefined;
	if (!getTopicResp.data.result) {
		return <h1>Topic not found</h1>;
	}
	if (
		!('subtopics' in getTopicResp.data.result) ||
		getTopicResp.data.result.subtopics.length === 0
	) {
		subtopicId = getTopicResp.data.result.order.toString();
	} else if ('files' in getTopicResp.data.result.subtopics[0]) {
		subtopicId = getTopicResp.data.result.subtopics[0].order.toString();
		fileId = getTopicResp.data.result.subtopics[0].files[0].order.toString();
	} else {
		subtopicId = getTopicResp.data.result.subtopics[0].order.toString();
	}

	const getLectureResp = getSubtopic(
		subjectId,
		topicId,
		subtopicId,
	) as SubtopicResp   ;
		
	if (!getLectureResp.isSuccess) {
		return <h1>Topic not found</h1>;
	}

	let currentLecture: any = {};
	if ("mimeType" in getTopicResp.data.result) { 
		
		currentLecture = getTopicResp.data.result;
	}else if (!fileId || !('files' in getLectureResp.data.result)) {
		currentLecture = getLectureResp.data.result;
	} else {
		currentLecture = getLectureResp.data.result.files.find(
			(file) => file.order === Number(fileId),
		);
	}
	if (!getLectureResp.isSuccess) {
		return <h1>Topic not found</h1>;
	}
	let viewInfo;
	const allViewInfo: (VideoWatchInfo | PDFWatchInfo)[] =
		await prisma.videoWatchInfo.findMany({
			where: {
				videoId: {
					startsWith: `${subjectId}-${topicId}-`,
				},
				userId: user.id,
			},
		});
	const allPDFViewInfo: PDFWatchInfo[] = await prisma.pDFWatchInfo.findMany({
		where: {
			pdfId: {
				startsWith: `${subjectId}-${topicId}-`,
			},
			userId: user.id,
		},
	});
	allViewInfo.push(...allPDFViewInfo);
	if (currentLecture) {
		if (currentLecture.mimeType === 'video/mp4') {
			viewInfo = allViewInfo.find(
				(info) =>
					'videoId' in info &&
					info.videoId === getLectureId(subjectId, topicId, subtopicId, fileId),
			);
		} else {
			viewInfo = allViewInfo.find(
				(info) => "pdfId" in info && info.pdfId === getLectureId(subjectId, topicId, subtopicId),
			);
		}
	}
	return (
		<div>
			<Player
				file={{
					name: currentLecture.name,
					mimeType: currentLecture.mimeType,
					uri: currentLecture.uri,
				}}
				getTopicResp={getTopicResp}
				topic={getTopicResp.data.result}
				subjectId={subjectId}
				fileId={fileId}
				subtopicId={subtopicId}
				viewInfo={viewInfo as VideoWatchInfo}
				allViewInfo={allViewInfo}
			/>
		</div>
	);
}

export const generateMetadata = (
	{ params }: Props,
	parent: ResolvingMetadata,
): Metadata => {
	const getTopicResp = getTopic(params.subjectId, params.topicId);
	if (!getTopicResp.isSuccess) {
		return {
			title: 'Topic not found',
			description: 'Topic not found',
		};
	}
	const topic = getTopicResp.data.result;
	if (!topic) {
		return {
			title: 'Topic not found',
			description: 'Topic not found',
		};
	}

	return {
		title: topic.name,
		description: topic.name,
	};
};
