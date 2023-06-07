import { SubtopicResp, TopicResp } from '@/app/types';
import { useEffect, useState } from 'react';
import VideoPlayer from '@/app/Components/VideoPlayer';
import Player from '@/app/Components/Player';
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';

interface Props {
	params: { subjectId: string; topicId: string; subtopicId: string };
}

export default async function Topic({
	params,
}: {
	params: { subjectId: string; topicId: string; subtopicId: string };
}) {
	const getTopicResp = await getTopic(params.subjectId, params.topicId);
	const { subjectId, topicId, subtopicId } = params;
	let fileId: string | undefined = undefined;

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
		return <h1>SubTopic not found</h1>;
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
    const pathname = headers().get("x-url");
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
	const res = await fetch(
		`//${process.env.NEXT_PUBLIC_API_URL}lectures/${subjectId}/${topicId}/${subtopicId}`,
	);
	return res.json();
};

export const generateMetadata = async (
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const getSubjectResp = await getLecture(
		params.subjectId,
		params.topicId,
		params.subtopicId,
	);
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
