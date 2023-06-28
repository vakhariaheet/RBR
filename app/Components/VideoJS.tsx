"use client";
import * as React from 'react';
import videojs from 'video.js';

// Styles
import 'video.js/dist/video-js.css';

interface IVideoPlayerProps {
	options: any;
}

const initialOptions: any = {
	controls: true,
	fluid: true,
	controlBar: {
		volumePanel: {
			inline: false,
		},
	},
};

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ options }) => {
	const videoNode = React.useRef<HTMLVideoElement>(null);
	const player = React.useRef<any>();

	React.useEffect(() => {
		if (!videoNode.current) return;
		player.current = videojs(videoNode.current, {
			...initialOptions,
			...options,
		}).ready(function () {
			// console.log('onPlayerReady', this);
		});
		return () => {
			if (player.current) {
				player.current.dispose();
			}
		};
	}, [options]);

	return <video ref={videoNode} className='video-js' />;
};

export default VideoPlayer;
