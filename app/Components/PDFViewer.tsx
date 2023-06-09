import React, { useEffect } from 'react';
import ViewSDKClient from './ViewSDKClient';
const PDFViewer = ({ url }: { url: string }) => {
	useEffect(() => {
		const loadPDF = () => {
			console.log('loadPDF');
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
				);
			});
		};
		loadPDF();
	}, []);

	return <div id='pdf-div' className='w-full aspect-video'></div>;
};
export default PDFViewer;
