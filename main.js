// Define constants
const cameraView = document.querySelector('#camera--view'),
	cameraOutput = document.querySelector('#camera--output'),
	cameraSensor = document.querySelector('#camera--sensor'),
	cameraTrigger = document.querySelector('#camera--trigger');

// Access the device camera and stream to cameraView
function cameraStart() {
	const constraints = { video: { facingMode: 'environment' }, audio: false };
	// Older browsers might not implement mediaDevices at all, so we set an empty object first
	if (navigator.mediaDevices === undefined) {
		navigator.mediaDevices = {};
	}
	if (navigator.mediaDevices.getUserMedia === undefined) {
		navigator.mediaDevices.getUserMedia = constraints => {
			// First get ahold of the legacy getUserMedia, if present
			console.log('constraints:', constraints);
			let getUserMedia =
				navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

			// Some browsers just don't implement it - return a rejected promise with an error
			// to keep a consistent interface
			if (!getUserMedia) {
				return Promise.reject(
					new Error('getUserMedia is not implemented in this browser')
				);
			}

			// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
			return new Promise((resolve, reject) => {
				getUserMedia.call(navigator, constraints, resolve, reject);
			});
		};
	}

	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(stream => {
			// track = stream.getTracks()[0];
			cameraView.srcObject = stream;
		})
		.catch(error => {
			console.error('Oops. Something is broken.', error);
		});
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = () => {
	cameraSensor.width = cameraView.videoWidth;
	cameraSensor.height = cameraView.videoHeight;
	cameraSensor.getContext('2d').drawImage(cameraView, 0, 0);
	cameraOutput.src = cameraSensor.toDataURL('image/webp');
	cameraOutput.classList.add('taken');
	setTimeout(() => {
		cameraOutput.classList.remove('taken');
	}, 1000);

	// cameraView.srcObject.getVideoTracks().forEach(track => track.stop());
};

// Start the video stream when the window loads
window.addEventListener('load', cameraStart, false);
