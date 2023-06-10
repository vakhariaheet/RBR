'use client';

import { CSSProperties, Dispatch, MutableRefObject, Ref, SetStateAction, useEffect, useRef } from 'react';
import {
	MediaController,
	MediaControlBar,
	MediaTimeRange,
	MediaTimeDisplay,
	MediaVolumeRange,
	MediaPlayButton,
	MediaSeekBackwardButton,
	MediaSeekForwardButton,
	MediaMuteButton,
	MediaAirplayButton,
	MediaFullscreenButton,
	MediaPlaybackRateButton,
	
} from 'media-chrome/dist/react';
interface VideoPlayerProps {
	video: {
		uri: string;
		mimeType: string;
	};
	style: CSSProperties;
	setRef?: Dispatch<SetStateAction<HTMLVideoElement | null>>;
}

export default function VideoPlayer({ video, style,setRef }: VideoPlayerProps) {
	

	return (
		<MediaController style={{
			...style,
			aspectRatio: '16/9',
		}}>
			<video
				slot='media'
				src={`${process.env.NEXT_PUBLIC_S3_BUCKET}${video.uri}`}
				preload='auto'
				crossOrigin=''
				ref={(videoRef) => {
					
					if(!setRef) return;
					setRef(videoRef);
				 }}
			/>
			<MediaControlBar>
				<MediaPlayButton></MediaPlayButton>
				<MediaSeekBackwardButton seekoffset="10" ></MediaSeekBackwardButton>
				<MediaSeekForwardButton seekoffset="10"></MediaSeekForwardButton>
				<MediaTimeRange></MediaTimeRange>
				<MediaTimeDisplay showDuration></MediaTimeDisplay>
				<MediaMuteButton></MediaMuteButton>
				<MediaVolumeRange></MediaVolumeRange>
				<MediaAirplayButton></MediaAirplayButton>
				<MediaFullscreenButton></MediaFullscreenButton>
				<MediaPlaybackRateButton rates={[0.5, 1, 1.5, 2]}></MediaPlaybackRateButton>
			</MediaControlBar>
		</MediaController>
	);
}
