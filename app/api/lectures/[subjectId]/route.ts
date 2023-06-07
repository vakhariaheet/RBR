
import { NextResponse } from 'next/server';
import subjects from '@/app/data.json';

export async function GET(
	request: Request,
	{ params }: { params: { subjectId: string } },
) {

	const subjectIndex = subjects.findIndex(
		(subject) => subject.order === Number(params.subjectId),
	);
	const subject = subjects[subjectIndex ];
	const prevIndex = subjectIndex === 0 ? null : subjectIndex - 1;
	const nextIndex =
		subjectIndex === subjects.length - 1 ? null : subjectIndex + 1;
	if (!subject) {
		return NextResponse.json({
			isSuccess: false,
			data: {
				message: 'Subject not found',
			},
		});
	}

	return NextResponse.json({
		isSuccess: true,
		data: {
			result: {
				id: subject.order,
				name: subject.name,
				topics: subject.topics.map((topic) => ({
					...topic,
					id: topic.order,
					name: topic.name,
					isFolder: topic.subtopics?.length > 0,
					subtopics: [],
				})),
			},
			next: nextIndex
				? {
						id: nextIndex ? subjects[nextIndex].order : null,
						name: nextIndex ? subjects[nextIndex].name : null,
				  }
				: null,
			prev: prevIndex
				? {
						id: prevIndex ? subjects[prevIndex].order : null,
						name: prevIndex ? subjects[prevIndex].name : null,
				  }
				: null,
		},
	});
}
