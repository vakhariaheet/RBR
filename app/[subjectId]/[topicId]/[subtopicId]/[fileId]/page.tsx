import { SubtopicResp, TopicResp } from '@/app/types';
import { useEffect, useState } from 'react';
import VideoPlayer from '@/app/Components/VideoPlayer';
import Player from '@/app/Components/Player';
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';

interface Props {
	params: { subjectId: string; topicId: string; subtopicId: string , fileId: string};
}

export default async function File({
	params,
}: {
	params: { subjectId: string; topicId: string; subtopicId: string, fileId: string };
}) {
	const getTopicResp = await getTopic(params.subjectId, params.topicId);
	const { subjectId, topicId, subtopicId,fileId } = params;

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
    const pathname = headers().get("x-url");
	const res = await fetch(
		`${pathname}api/lectures/${subjectId}/${topicId}/${subtopicId}`,
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
    const fileId = params.fileId;
    
	if (!getSubjectResp.isSuccess) {
		return {
			title: 'Subtopic not found',
			description: 'Subtopic not found',
		};
    }
    if ("files" in getSubjectResp.data.result) { 
        const currentLecture = getSubjectResp.data.result.files.find(
            (file) => file.order === Number(fileId),
        );
        if (!currentLecture) {
            return {
                title: 'File not found',
                description: 'File not found',
            }
        
        }
        return {
            title: currentLecture.name,
            description: currentLecture.name,
        }
    }
	return {
		title: getSubjectResp.data.result.name,
		description: getSubjectResp.data.result.name,
	};
};
