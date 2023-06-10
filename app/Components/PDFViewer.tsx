import React, { useEffect } from 'react';
import ViewSDKClient from './ViewSDKClient';
enum LogType {
	VIDEO = 'VIDEO',
	VIDEO_ENDED = 'VIDEO_ENDED',
	PDF = 'PDF',
}
interface Props { 
	url: string;
	name: string;
	subtopicId?: string;
	topicId: string;
	subjectId: string;
	fileId?: string;

}
const PDFViewer = ({ url, name, subtopicId,subjectId,topicId,fileId }: Props) => {
	useEffect(() => {
		const loadPDF = () => {
			
			const viewSDKClient = new ViewSDKClient();
			viewSDKClient.ready().then(() => {
				viewSDKClient.previewFile(
					'pdf-div',
					{
						defaultViewMode: 'FIT_WIDTH',
						showAnnotationTools: true,
						showLeftHandPanel: true,
						showPageControls: true,
						showDownloadPDF: true,
                        showPrintPDF: true,
                        
					},
                    url,
                    name
				);
			});
		};
		loadPDF();
		(async () => {
			await fetch(`${window.location.origin}/api/logs`, {
				method: 'POST',
				body: JSON.stringify({
					type: LogType.PDF,
					topicId,
					subjectId,
					subtopicId,
					fileId,
				}),
			})
		})()

	}, []);

	return <div id='pdf-div' className='w-full aspect-video'></div>;
};
export default PDFViewer;
