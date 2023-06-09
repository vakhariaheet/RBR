
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
interface LogsBody {
	type: LogType;
	timestamp?: number;
	topicId: string;
	subtopicId?: string;
	fileId?: string;
	subjectId: string;
}
enum LogType {
	VIDEO = 'VIDEO',
	VIDEO_ENDED = 'VIDEO_ENDED',
	PDF = 'PDF',
}
 



export const POST = async (req: Request) => {
   const prisma = new PrismaClient();
	const data = (await req.json()) as LogsBody;
	switch (data.type) {
		case LogType.VIDEO: {
			if (!data.timestamp)
				return NextResponse.json(
					{
						body: {
							error: 'Timestamp is required',
						},
					},
					{
						status: 400,
					},
				);
			const {subjectId, timestamp, topicId, subtopicId, fileId } = data;
			const video = await prisma.videoWatchInfo.findFirst({
				where: {
					videoId: getLectureId(subjectId,topicId, subtopicId, fileId),
				},
			});
			if (!video) {
				await prisma.videoWatchInfo.create({
					data: {
						hasEnded: false,
						timeWatched: timestamp,
						userId: 'demo',
						videoId: getLectureId(subjectId,topicId, subtopicId, fileId),
					},
				});
			} else {
				await prisma.videoWatchInfo.updateMany({
					where: {
						videoId: getLectureId(subjectId,topicId, subtopicId, fileId),
					},
					data: {
						timeWatched: timestamp,
					},
				});
			}
			return NextResponse.json(
				{
					body: {
						message: 'Video logged',
					},
				},
				{
					status: 200,
				},
			);
		}
		case LogType.VIDEO_ENDED: {
			const { topicId, subtopicId, fileId,subjectId,timestamp } = data;
			const video = await prisma.videoWatchInfo.findFirst({
				where: {
					videoId: getLectureId(subjectId,topicId, subtopicId, fileId),
				},
			});
			if (!video) {
				return NextResponse.json(
					{
						body: {
							error: 'Video not found',
						},
					},
					{
						status: 404,
					},
				);
			}
			await prisma.videoWatchInfo.updateMany({
				where: {
					videoId: getLectureId(subjectId,topicId, subtopicId, fileId),
				},
				data: {
               hasEnded: true,
               timeWatched:timestamp,
				},
			});
			return NextResponse.json(
				{
					body: {
						message: 'Video logged',
					},
				},
				{
					status: 200,
				},
			);
		}
		case LogType.PDF: {
			const { topicId, subtopicId, fileId,subjectId } = data;
			const pdf = await prisma.pDFWatchInfo.findFirst({
				where: {
					pdfId: getLectureId(subjectId,topicId, subtopicId, fileId),
				},
			});
			if (!pdf) {
				await prisma.pDFWatchInfo.create({
					data: {
						userId: 'demo',
						pdfId: getLectureId(subjectId,topicId, subtopicId, fileId),
					},
				});
			}
			return NextResponse.json(
				{
					body: {
						message: 'PDF logged',
					},
				},
				{
					status: 200,
				},
			);
		}
	}
};

const getLectureId = (
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
