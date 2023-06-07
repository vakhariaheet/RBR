import { NextResponse } from 'next/server';
import subjects from '@/app/data.json';
import { Topic, Subtopic } from '@/app/types';

export async function GET(
	request: Request,
	{
		params,
	}: { params: { subjectId: string; topicId: string; subtopicId: string } },
) {
	const subject = subjects.find(
		(subject) => subject.order === Number(params.subjectId),
	);

	if (!subject) {
		return NextResponse.json({
			isSuccess: false,
			data: {
				message: 'Subject not found',
			},
		});
	}

	const topicIndex = subject.topics.findIndex(
		(topic) => topic.order === Number(params.topicId),
	);
	const topic = subject.topics[topicIndex ] as Topic;

	if (!topic) {
		return NextResponse.json({
			isSuccess: false,
			data: {
				message: 'Topic not found',
			},
		});
	}

	const subtopicIndex = topic.subtopics.findIndex(
		(subtopic) => subtopic.order === Number(params.subtopicId),
	);
	const subtopic = topic.subtopics[subtopicIndex ] as Subtopic;
	const prevIndex = subtopicIndex === 0 ? null : subtopicIndex - 1;
	const nextIndex =
		subtopicIndex === topic.subtopics.length - 1 ? null : subtopicIndex + 1;

	if (!subtopic) {
		return NextResponse.json({
			isSuccess: false,
			data: {
				message: 'Subtopic not found',
			},
		});
	}

	return NextResponse.json({
		isSuccess: true,
		data: {
			result: subtopic,
		},
		nextIndex: nextIndex
			? {
					id: nextIndex ? topic.subtopics[nextIndex].order : null,
					name: nextIndex ? topic.subtopics[nextIndex].name : null,
			  }
			: null,
		prevIndex: prevIndex
			? {
					id: prevIndex ? topic.subtopics[prevIndex].order : null,
					name: prevIndex ? topic.subtopics[prevIndex].name : null,
			  }
			: null,
	});
}
