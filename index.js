'use strict';
const PImage = require('pureimage');
const fs = require('fs');
const path = require('path');
const imgURL = process.argv[2];
const filter = process.argv[3];

function fallback() {
    console.log('Sorry your terminal does not support load images');
}

PImage.decodeJPEGFromStream(fs.createReadStream(imgURL)).then((img) => {

    const img2 = PImage.make(img.width, img.height);
    const ctx = img2.getContext('2d');
    const data = img.data;

    function createImg(msg) {

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        const pth = path.join('/Users/adrielzarate/Desktop/pruebas/js/npm/out', 'npmgram_new.jpg');

        PImage.encodeJPEGToStream(img2, fs.createWriteStream(pth)).then(() => {
            console.log(`               __    /
          (___()'\`;   -     ${msg}
          /____ /\`   \\
         /\/\  /\/\

    `);
        });
    }

    switch (filter) {
        case 'invert':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            createImg('Your invert image is done!');
            break;
        case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
            }
            createImg('Your grayscale image is done!');
            break;
        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = Math.min(255, (0.393 * data[i]) + (0.769 * data[i + 1]) + (0.189 * data[i + 2]));
                const g = Math.min(255, (0.349 * data[i]) + (0.686 * data[i + 1]) + (0.168 * data[i + 2]));
                const b = Math.min(255, (0.272 * data[i]) + (0.534 * data[i + 1]) + (0.131 * data[i + 2]));
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
            }
            createImg('Your grayscale image is done!');
            break;
        case 'solarize':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i] > 127 ? 255 - data[i] : data[i];
                data[i + 1] = data[i + 1] > 127 ? 255 - data[i + 1] : data[i + 1];
                data[i + 2] = data[i + 2] > 127 ? 255 - data[i + 2] : data[i + 2];
            }
            createImg('Your grayscale image is done!');
            break;
        case 'illustration':
            const threshold = 50;
            const high = 255;
            const low = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const v = (0.299 * r + 0.587 * g + 0.114 * b >= threshold) ? high : low;
                data[i] = data[i + 1] = data[i + 2] = v;
            }
            createImg('Your grayscale image is done!');
            break;
        default:
            createImg('Hey! Your second parameter must to be a filter name!');
            break;
    }

});