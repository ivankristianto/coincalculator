/**
 * Sets up a frames per second panel on the top-left of the window
 */
export function setupFPS(stats) {
  const statsEl = document.getElementById('stats');
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  statsEl.appendChild(stats.dom);
}

export function setupInfo() {
  const info = document.getElementById('info');
  info.style.display = 'block';
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

async function getVideoInputs() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('enumerateDevices() not supported.');
    return [];
  }

  const devices = await navigator.mediaDevices.enumerateDevices();

  return devices.filter((device) => device.kind === 'videoinput');
}

export function getBackCamera(cameras) {
  return cameras.filter((camera) => camera.label.toLowerCase().includes('back'));
}

export async function getDeviceIdForLabel(cameraLabel) {
  const videoInputs = await getVideoInputs();

  for (let i = 0; i < videoInputs.length; i++) {
    const videoInput = videoInputs[i];
    if (videoInput.label === cameraLabel) {
      return videoInput.deviceId;
    }
  }

  return null;
}

function stopExistingVideoCapture(state) {
  if (state.video && state.video.srcObject) {
    state.video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    state.video.srcObject = null;
  }
}

async function getConstraints(cameraLabel) {
  let deviceId;
  let facingMode;

  if (cameraLabel) {
    deviceId = await getDeviceIdForLabel(cameraLabel);
    // on mobile, use the back mode based on the camera.
    facingMode = isMobile() ? 'environment' : null;
  }
  return {deviceId, facingMode};
}

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera(cameraLabel, state) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const videoElement = document.getElementById('video');

  stopExistingVideoCapture(state);

  const videoConstraints = await getConstraints(cameraLabel, state);
  console.log('videoConstraints', videoConstraints);

  videoElement.srcObject = await navigator.mediaDevices.getUserMedia(
      {'audio': false, 'video': videoConstraints});

  return new Promise((resolve) => {
    videoElement.onloadedmetadata = () => {
      videoElement.width = videoElement.videoWidth;
      videoElement.height = videoElement.videoHeight;
      resolve(videoElement);
    };
  });
}

export async function loadVideo(state) {
  try {
    let defaultCamera = null;
    let cameras = await getVideoInputs();
    console.log(cameras);

    const backCameras = getBackCamera(cameras);
    if (backCameras.length>0) {
      defaultCamera = backCameras[0];
    } else {
      // fallback
      defaultCamera=cameras[0];
    }

    state.video = await setupCamera(defaultCamera.label, state);
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
        'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }

  console.log('state.video', state.video);

  state.video.play();
}
