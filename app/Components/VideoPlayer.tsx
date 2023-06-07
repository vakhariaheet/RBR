'use client';
import 'plyr-react/plyr.css';
import { CSSProperties, useEffect, useRef } from 'react';
import { Plyr } from './Plyr';
import { APITypes } from 'plyr-react';

interface VideoPlayerProps {
	video: {
		uri: string;
		mimeType: string;
	};
	style: CSSProperties;
}

export default function VideoPlayer({ video, style }: VideoPlayerProps) {
	const ref = useRef<APITypes>(null);
	
	return (
		<Plyr
			plyr={{
				source: {
					type: 'video',
					sources: [
						{
							src: `${process.env.NEXT_PUBLIC_S3_BUCKET}${video.uri}`,
							type: 'video/mp4',
						},
					],
				},
			}}
			height={style.height}
			ref={ref}
		/>
	);
}
