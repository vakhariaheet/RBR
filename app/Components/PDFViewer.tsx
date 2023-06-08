"use client";
import React, { useState } from 'react';
import { Document, Page, DocumentProps } from 'react-pdf';

export default function PDFViewer() {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	function onDocumentLoadSuccess({ numPages }: any) {
		setNumPages(numPages);
	}

	return (
		<div>
			<Document file={`${process.env.NEXT_PUBLIC_S3_BUCKET}/RBR/2.+Compiler+Design/2.Parsers/practice/CD_QUESTIONS+(1).PDF`} onLoadSuccess={onDocumentLoadSuccess}>
				<Page pageNumber={pageNumber} />
			</Document>
			<p>
				Page {pageNumber} of {numPages}
			</p>
		</div>
	);
}
