import subjects from '@/app/data.json';
import { Topic } from '../types';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
export const getAllSubjects = () => {
	return subjects.map((subject) => ({
		id: subject.order,
		name: subject.name,
	}));
};
export const getSubject = (subjectId: string) => {
	const subjectIndex = subjects.findIndex(
		(subject) => subject.order === Number(subjectId),
	);
	const subject = subjects[subjectIndex];
	const prevIndex = subjectIndex === 0 ? null : subjectIndex - 1;
	const nextIndex =
		subjectIndex === subjects.length - 1 ? null : subjectIndex + 1;
	return {
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
	};
};
export const getTopic = (subjectId: string, topicId: string) => {
	const subject = subjects.find(
		(subject) => subject.order === Number(subjectId),
	);

	if (!subject) {
		return {
			isSuccess: false,
			data: {
				message: 'Subject not found',
			},
		};
	}

	const topicIndex = subject.topics.findIndex(
		(topic) => topic.order === Number(topicId),
	);
	const topic = subject.topics[topicIndex] as Topic;

	const prevIndex = topicIndex === 0 ? null : topicIndex - 1;
	const nextIndex =
		topicIndex === subject.topics.length - 1 ? null : topicIndex + 1;

	if (!topic) {
		return {
			isSuccess: false,
			data: {
				message: 'Topic not found',
			},
		};
	}

	return {
		isSuccess: true,
		data: {
			result: {
				...topic,
				id: topic.order,
				name: topic.name,
				order: topic.order,
				
				subtopics: topic.subtopics.map((subtopic) => ({
					...subtopic,
					id: subtopic.order,
					isFolder: 'files' in subtopic ? subtopic.files.length > 0 : false,
				})),
			},
			next:
				nextIndex !== null
					? {
							id: nextIndex !== null ? subject.topics[nextIndex].order : null,
							name: nextIndex !== null ? subject.topics[nextIndex].name : null,
					  }
					: null,
			prev:
				prevIndex !== null
					? {
							id: prevIndex !== null ? subject.topics[prevIndex].order : null,
							name: prevIndex !== null ? subject.topics[prevIndex].name : null,
					  }
					: null,
		},
	};
};

export const getSubtopic = (
	subjectId: string,
	topicId: string,
	subtopicId: string,
) => {
	const subject = subjects.find(
		(subject) => subject.order === Number(subjectId),
	);
	if (!subject) {
		return {
			isSuccess: false,
			data: {
				message: 'Subject not found',
			},
		};
	}
	const topicIndex = subject.topics.findIndex(
		(topic) => topic.order === Number(topicId),
	);
	const topic = subject.topics[topicIndex];
	if (!topic) {
		return {
			isSuccess: false,
			data: {
				message: 'Topic not found',
			},
		};
	}
	const subtopicIndex = topic.subtopics.findIndex(
		(subtopic) => subtopic.order === Number(subtopicId),
	);
	
	const subtopic = topic.subtopics[subtopicIndex];
	const prevIndex = subtopicIndex === 0 ? null : subtopicIndex - 1;
	const nextIndex =
		subtopicIndex === topic.subtopics.length - 1 ? null : subtopicIndex + 1;
	return {
		isSuccess: true,
		data: {
			result: subtopic,
			next:
				nextIndex !== null
					? {
							id: nextIndex !== null ? topic.subtopics[nextIndex]?.order : null,
							name: nextIndex !== null ? topic.subtopics[nextIndex]?.name : null,
					  }
					: null,
			prev:
				prevIndex !== null
					? {
							id: prevIndex !== null ? topic.subtopics[prevIndex]?.order : null,
							name: prevIndex !== null ? topic.subtopics[prevIndex]?.name : null,
					  }
					: null,
		},
	};
};




export const isUserAuthenticated = async () => {
	const token = (await cookies().getAll())[ 0 ];
	if (!token) return false;
	const secret = new TextEncoder().encode(
		process.env.NEXT_JWT as string,
	);
	const { payload } = await jose.jwtVerify(token.value, secret, {
		issuer: 'gate.heetvakharia.in',
	});
	if (!payload) return false;
	return true;
};

export const authenticateUser = async () => {
	const resp =await isUserAuthenticated();
	if (!resp) redirect('/login');
}
export const getLectureId = (
	subjectId: string,
	topicId: string,
	subtopicId?: string,
	fileId?: string,
) => {
	if (!subtopicId) {
		return `${subjectId}-${topicId}`;
	}
	if (!fileId) {
		return `${subjectId}-${topicId}-${subtopicId}`;
	}
	return `${subjectId}-${topicId}-${subtopicId}-${fileId}`;
};