import Stats from 'stats.js';

const stats = new Stats();
const state = {
  video: null,
  stream: null,
  net: null,
};

import {getVideoInputs, loadVideo} from './helpers';
import {loadModel, executeInRealTime} from './model/coco-ssd';

/**
 * Sets up a frames per second panel on the top-left of the window
 */
function setupFPS() {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
}


/**
 * Kicks off the demo.
 */
export async function bindPage() {
  await loadModel(state);

  let cameras = await getVideoInputs();
  console.log(cameras);

  await loadVideo(cameras[0].label, state);

  document.getElementById('loading').style.display = 'none';
  document.getElementById('main').style.display = 'inline-block';

  setupFPS();

  executeInRealTime(state, stats);
}

console.log('START');
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo
bindPage();
