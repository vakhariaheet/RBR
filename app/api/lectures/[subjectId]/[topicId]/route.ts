import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import subjects from '@/app/data.json';
import { Topic } from '@/app/types';

export async function GET(
	request: Request,
	{ params }: { params: { subjectId: string; topicId: string } },
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
	const topic = subject.topics[ topicIndex ] as Topic;
	
	const prevIndex = topicIndex === 0 ? null : topicIndex - 1;
	const nextIndex =
		topicIndex === subject.topics.length - 1 ? null : topicIndex + 1;

	if (!topic) {
		return NextResponse.json({
			isSuccess: false,
			data: {
				message: 'Topic not found',
			},
		});
	}

	return NextResponse.json({
		isSuccess: true,
		data: {
			result: {
				id: topic.order,

				name: topic.name,
				order:topic.order,
				subtopics: topic.subtopics.map((subtopic) => ({
					...subtopic,
					id: subtopic.order,
					isFolder: 'files' in subtopic ? subtopic.files.length > 0 : false,
					
				})),
			},
			next: nextIndex !== null
				? {
						id: nextIndex !==null ? subject.topics[nextIndex].order : null,
						name: nextIndex !==null ? subject.topics[nextIndex].name : null,
				  }
				: null,
			prev: prevIndex !== null
				? {
						id: prevIndex !==null ? subject.topics[prevIndex].order : null,
						name: prevIndex !==null ? subject.topics[prevIndex].name : null,
				  }
				: null,
		},
	});
}
