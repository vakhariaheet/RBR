import { type } from "os";

export interface Subject {
	order: number;
	name: string;
	topics: Topic[];
}

export interface Topic {
	order: number;
	name: string;
	subtopics: (Subtopic | File)[];
	mimeType?: string;
	uri?: string;
	path?: string;
}

export interface Subtopic {
	order: number;
	name: string;
	files: File[];
}

export interface File {
	order: number;
	name: string;
	mimeType: string;
	uri: string;
	path: string;
}

export interface Response<T> {
	isSuccess: boolean;
	data: {
		result: T;
		next: {
			id: number;
			name: string;
		} | null;
		prev: {
			id: number;
			name: string;
		} | null;
	};
}

export type TopicResp = Response<Topic>;

export type SubjectResp = Response<{
	id: number;
	name: string;
	topics: {
		id: number;
		name: string;
		mimeType?: string;
		uri?: string;
		path?: string;
	}[];
}>;

export type SubtopicResp = Response<Subtopic>

export type AllSubjectResp ={ 
	id: number;
	name: string;
}[]
export enum LogType {
	VIDEO = 'VIDEO',
	VIDEO_ENDED = 'VIDEO_ENDED',
	PDF = 'PDF',
}