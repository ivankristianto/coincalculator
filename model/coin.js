import * as autoMl from '@tensorflow/tfjs-automl';

export async function loadModel(state) {
    const modelUrl = 'https://storage.googleapis.com/coin-saved-model/v2/model.json'; // URL to the model.json file.
    state.net = await autoMl.loadObjectDetection(modelUrl);
}

export async function executeInRealTime(state, stats) {
    const canvas = document.getElementById('output');
    const info = document.getElementById('info');

    canvas.width = state.video.width;
    canvas.height = state.video.height;

    const context = canvas.getContext('2d');
    context.font = '12px Arial';

    async function predictSegmentationFrame() {
        // Begin monitoring code for frames per second
        stats.begin();

        const result = await state.net.detect(state.video);
        context.drawImage(state.video, 0, 0);

        info.innerText = `Number of detections: ${result.length}`;

        for (let i = 0; i < result.length; i++) {
            context.beginPath();
            context.rect(result[i].box.left, result[i].box.top, result[i].box.width, result[i].box.height);
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.fillStyle = 'black';
            context.stroke();
            context.fillText(
                result[i].score.toFixed(3) + ' ' + result[i].label, result[i].box.left,
                result[i].box.top - 10
            );
        }

        // End monitoring code for frames per second
        stats.end();

        requestAnimationFrame(predictSegmentationFrame);
    }

    await predictSegmentationFrame();
}
