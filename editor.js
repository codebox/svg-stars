const params = {
   size: 50,
   hue: 20,
   lightness: 70,
   diffractionSpikeCount:4,
   diffractionSpikeLength: 6,
   diffractionSpikeWidth: 2,
   rotationPeriod: 100,
};

const elSvg = document.getElementById('svg');

['size', 'hue', 'lightness', 'diffractionSpikeCount', 'diffractionSpikeLength', 'diffractionSpikeWidth', 'rotationPeriod'].forEach(name => {
   const input = document.getElementById(name);
   input.value = params[name];
   input.addEventListener('change', e => {
      params[name] = Number(e.target.value);
      createStarSimple(elSvg, params);
   });
});

document.getElementById('download').addEventListener('click', () => {
   const svgData = document.getElementById('svg').outerHTML,
       prolog = '<?xml version="1.0" standalone="no"?>',
       blob = new Blob([prolog, svgData], {type: 'image/svg+xml;charset=utf-8'}),
       blobAsUrl = URL.createObjectURL(blob),
       downloadLink = document.createElement('a');
   downloadLink.href = blobAsUrl;
   downloadLink.download = `star_${params.size}_${params.hue}_${params.lightness}_${params.diffractionSpikeCount}_${params.diffractionSpikeLength}_${params.diffractionSpikeWidth}_${params.rotationPeriod}.svg`;
   downloadLink.click();
});

createStarSimple(elSvg, params);