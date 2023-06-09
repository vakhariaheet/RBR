import { SubtopicResp, TopicResp } from '@/app/types';
import { useEffect, useState } from 'react';
import VideoPlayer from '@/app/Components/VideoPlayer';
import Player from '@/app/Components/Player';
import { Metadata, ResolvingMetadata } from 'next';
import { authenticateUser, getSubtopic, getTopic } from '@/app/utils/utils';

interface Props {
	params: {
		subjectId: string;
		topicId: string;
		subtopicId: string;
		fileId: string;
	};
}

export default async function File({
	params,
}: {
	params: {
		subjectId: string;
		topicId: string;
		subtopicId: string;
		fileId: string;
	};
}) {
	await authenticateUser();
	const getTopicResp = getTopic(params.subjectId, params.topicId) as TopicResp;
	const { subjectId, topicId, subtopicId, fileId } = params;

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
		return <h1>File not found</h1>;
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
	)) as TopicResp | SubtopicResp;
	const fileId = params.fileId;

	if (!getSubjectResp.isSuccess) {
		return {
			title: 'Subtopic not found',
			description: 'Subtopic not found',
		};
	}
	if ('files' in getSubjectResp.data.result) {
		const currentLecture = getSubjectResp.data.result.files.find(
			(file) => file.order === Number(fileId),
		);
		if (!currentLecture) {
			return {
				title: 'File not found',
				description: 'File not found',
			};
		}
		return {
			title: currentLecture.name,
			description: currentLecture.name,
		};
	}
	return {
		title: getSubjectResp.data.result.name,
		description: getSubjectResp.data.result.name,
	};
};
