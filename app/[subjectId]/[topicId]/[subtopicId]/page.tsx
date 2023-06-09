import { SubtopicResp, TopicResp } from '@/app/types';
import Player from '@/app/Components/Player';
import { Metadata, ResolvingMetadata } from 'next';
import { authenticateUser, getSubtopic, getTopic } from '@/app/utils/utils';
// import { headers } from 'next/headers';

interface Props {
	params: { subjectId: string; topicId: string; subtopicId: string };
}

export default async function Topic({
	params,
}: {
	params: { subjectId: string; topicId: string; subtopicId: string };
	}) {
		await authenticateUser();
	const getTopicResp = getTopic(params.subjectId, params.topicId) as TopicResp;
	const { subjectId, topicId, subtopicId } = params;
	let fileId: string | undefined = undefined;

	const getLectureResp = getSubtopic(subjectId, topicId, subtopicId) as SubtopicResp;
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
	const getSubjectResp = await getSubtopic(
		params.subjectId,
		params.topicId,
		params.subtopicId,
	) as SubtopicResp;
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
