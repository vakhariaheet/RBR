import { SubtopicResp, TopicResp } from '@/app/types';
import { useEffect, useState } from 'react';
import VideoPlayer from '../../Components/VideoPlayer';
import Player from '@/app/Components/Player';
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';

type Props = {
	params: { subjectId: string; topicId: string };
	searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Topic({
	params,
}: {
	params: { subjectId: string; topicId: string };
}) {
	const getTopicResp = await getTopic(params.subjectId, params.topicId);
	const { subjectId, topicId } = params;
	let fileId: string | undefined = undefined;
	let subtopicId = undefined;
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

	const getLectureResp = await getLecture(subjectId, topicId, subtopicId);

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
		return <h1>Topic not found</h1>;
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
			/>
		</div>
	);
}

const getTopic = async (
	subjectId: String,
	topicId: string,
): Promise<TopicResp> => {
    const pathname = headers().get('x-url');
	const res = await fetch(
		`${pathname}api/lectures/${subjectId}/${topicId}`,
	);
	return res.json();
};
const getLecture = async (
	subjectId: string,
	topicId: string,
	subtopicId: string,
): Promise<TopicResp | SubtopicResp> => {
    const pathname = headers().get('x-url');
	const res = await fetch(
		`${pathname}api/lectures/${subjectId}/${topicId}/${subtopicId}`,
	);
	return res.json();
};

export const generateMetadata = async (
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const getTopicResp = await getTopic(params.subjectId, params.topicId);
	if (!getTopicResp.isSuccess) {
		return {
			title: 'Topic not found',
			description: 'Topic not found',
		};
	}
	const topic = getTopicResp.data.result;
	return {
		title: topic.name,
		description: topic.name,
	};
};
