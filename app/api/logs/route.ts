
import { NextRequest, NextResponse } from 'next/server';
import { getLectureId } from '@/app/utils/utils';
import { prisma } from '@/app/lib/prisma';
import { cookies } from 'next/headers';
import * as jose from 'jose';
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
	const userToken = cookies().get('token')?.value;
	 
	if (!userToken)
		return NextResponse.json(
			{
				isSuccess: false,
				data: {
					error: 'User not found',
				},
			},
			{
				status: 404,
			},
		);
	const { payload } = await jose.jwtVerify(userToken, new TextEncoder().encode(process.env.NEXT_JWT as string)) 
	const user = payload as {
		username: string;
		id: string;
		iat: number;
	}
	if (!user)
		return NextResponse.json(
			{
				isSuccess: false,
				data: {
					error: 'User not found',
				},
			},
			{
				status: 404,
			},
		);

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
					videoId: getLectureId(subjectId, topicId, subtopicId, fileId),
					userId: user.id || '',
				},
			});
			if (!video) {
				await prisma.videoWatchInfo.create({
					data: {
						hasEnded: false,
						timeWatched: timestamp,
						userId: user.id || '',
						videoId: getLectureId(subjectId,topicId, subtopicId, fileId),
					},
				});
			} else {
				await prisma.videoWatchInfo.updateMany({
					where: {
						videoId: getLectureId(subjectId, topicId, subtopicId, fileId),
						userId: user.id || '',
					},
					data: {
						timeWatched: timestamp,
						hasEnded: false,
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
					videoId: getLectureId(subjectId, topicId, subtopicId, fileId),
					userId: user.id || '',
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
					videoId: getLectureId(subjectId, topicId, subtopicId, fileId),
					userId: user.id || '',
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
					pdfId: getLectureId(subjectId, topicId, subtopicId, fileId),
					userId: user.id || '',
				},
			});
			if (!pdf) {
				await prisma.pDFWatchInfo.create({
					data: {
						userId: user.id || '',
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


