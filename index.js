import Stats from 'stats.js';

const stats = new Stats();
const state = {
  video: null,
  stream: null,
  net: null,
};

import {setupFPS, setupInfo, loadVideo} from './helpers';
// import {loadModel, executeInRealTime} from './model/coco-ssd';
import {loadModel, executeInRealTime} from './model/coin';

/**
 * Kicks off the demo.
 */
export async function bindPage() {
  await loadModel(state);

  // Start video stream
  await loadVideo(state);

  document.getElementById('loading').style.display = 'none';
  document.getElementById('main').style.display = 'inline-block';

  setupFPS(stats);
  setupInfo();

  await executeInRealTime(state, stats);
}

console.log('START');
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo
bindPage();
