'use client';

import { CSSProperties, Dispatch, SetStateAction } from 'react';
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
	MediaPosterImage,
	MediaLoadingIndicator,
} from 'media-chrome/dist/react';
import { useResizeObserver } from '../hooks/useResize';
interface VideoPlayerProps {
	video: {
		uri: string;
		mimeType: string;
	};
	style: CSSProperties;
	setRef?: Dispatch<SetStateAction<HTMLVideoElement | null>>;
}

export default function VideoPlayer({
	video,
	style,
	setRef,
}: VideoPlayerProps) {
	const [ref, rect] = useResizeObserver();
	return (
		<div ref={ref}>
			<MediaController
				style={{
					...style,
					aspectRatio: '16/9',
				}}
				autohide='2'
				defaultstreamtype='on-demand'
			>
				<video
					slot='media'
					preload='auto'
					crossOrigin=''
					ref={(videoRef) => {
						if (!setRef) return;
						setRef(videoRef);
					}}
				>
					<source
						src={`${process.env.NEXT_PUBLIC_S3_BUCKET}${video.uri}`}
						type={video.mimeType}
					/>
					{/* <source
						src={`${process.env.NEXT_PUBLIC_S3_BUCKET}${video.uri.replace(
							/\.[^.]*$/,
							'.mp4',
						)}`}
						type='video/mp4'
					/> */}
				</video>
				{/* <MediaPosterImage src={`${process.env.NEXT_PUBLIC_S3_BUCKET}${video.uri.replace('RBR/','RBR/thumbnails/').replace(/\.[^.]*$/,'.png')}`} /> */}
				<MediaControlBar>
					<MediaLoadingIndicator slot='centered-chrome'></MediaLoadingIndicator>
					<MediaPlayButton></MediaPlayButton>
					{rect.width > 600 && (
						<>
							<MediaSeekBackwardButton seekoffset='10'></MediaSeekBackwardButton>
							<MediaSeekForwardButton seekoffset='10'></MediaSeekForwardButton>
						</>
					)}
					<MediaTimeRange></MediaTimeRange>
					<MediaTimeDisplay showDuration={rect.width > 600}></MediaTimeDisplay>
					{rect.width > 600 && (
						<>
							{' '}
							<MediaMuteButton></MediaMuteButton>
							<MediaVolumeRange></MediaVolumeRange>
						</>
					)}

					<MediaFullscreenButton></MediaFullscreenButton>
					<MediaPlaybackRateButton
						rates={[0.5, 1, 1.5, 2]}
					></MediaPlaybackRateButton>
				</MediaControlBar>
			</MediaController>
		</div>
	);
}
