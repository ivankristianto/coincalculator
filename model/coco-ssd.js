import * as cocoSsd from '@tensorflow-models/coco-ssd';

export async function loadModel(state, baseModel = 'lite_mobilenet_v2') {
  state.net = await cocoSsd.load({
      base: baseModel,
  });
}

export function executeInRealTime(state, stats) {
  const canvas = document.getElementById('output');

  canvas.width = state.video.width;
  canvas.height = state.video.height;

  const context = canvas.getContext('2d');
  context.font = '12px Arial';

  async function predictSegmentationFrame() {
    // Begin monitoring code for frames per second
    stats.begin();

    const result = await state.net.detect(state.video);
    context.drawImage(state.video, 0, 0);

    console.log('number of detections: ', result.length);
    console.log('Results ', result);
    for (let i = 0; i < result.length; i++) {
    context.beginPath();
    context.rect(...result[i].bbox);
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.fillStyle = 'black';
    context.stroke();
    context.fillText(
      result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
      result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10
    );
  }


    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(predictSegmentationFrame);
  }

  predictSegmentationFrame();
}
