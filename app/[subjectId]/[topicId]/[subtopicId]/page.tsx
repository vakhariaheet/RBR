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
// import { headers } from 'next/headers';

interface Props {
	params: { subjectId: string; topicId: string; subtopicId: string };
}

export default async function Topic({
	params,
}: {
	params: { subjectId: string; topicId: string; subtopicId: string };
}) {
	const user = await authenticateUser();
	const getTopicResp = getTopic(params.subjectId, params.topicId) as TopicResp;
	const { subjectId, topicId, subtopicId } = params;
	let fileId: string | undefined = undefined;

	const getLectureResp = getSubtopic(
		subjectId,
		topicId,
		subtopicId,
	) as SubtopicResp;
	if (!getLectureResp.isSuccess) {
		return <h1>Topic not found</h1>;
	}

	let currentLecture: any = {};

	if (!fileId || !('files' in getLectureResp.data.result)) {
		currentLecture = getLectureResp.data.result;
	} else {
		currentLecture = getLectureResp.data.result.files.find(
			(file) => file.order === Number(fileId),
		);
	}
	if (!getLectureResp.isSuccess) {
		return <h1>SubTopic not found</h1>;
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
			userId:user.id
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
				(info) =>
					'pdfId' in info &&
					info.pdfId === getLectureId(subjectId, topicId, subtopicId),
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
				subtopicId={subtopicId}
				fileId={fileId}
				viewInfo={viewInfo as VideoWatchInfo}
				allViewInfo={allViewInfo}
			/>
		</div>
	);
}

export const generateMetadata = async (
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const getSubjectResp = (await getSubtopic(
		params.subjectId,
		params.topicId,
		params.subtopicId,
	)) as SubtopicResp;
	if (!getSubjectResp.isSuccess) {
		return {
			title: 'Subtopic not found',
			description: 'Subtopic not found',
		};
	}
	return {
		title: getSubjectResp.data.result.name,
		description: getSubjectResp.data.result.name,
	};
};
