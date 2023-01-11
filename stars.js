window.onload = () => {
    function createStar(elSvg, id, config) {
        function adjustLightness(lightness) {
            const range = (100 - config.lightness) * 2;
            return (100 - range) + range * lightness / 100;
        }
        const STAR_GRADIENT_ID = `starGradient_${id}`,
            HALO_GRADIENT_ID = `haloGradient_${id}`;
        const elDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        elSvg.appendChild(elDefs);

        const elStarGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        elStarGradient.id = STAR_GRADIENT_ID;
        config.starColourStops.forEach(stop => {
            const elStop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            elStop.setAttribute('offset', `${stop.offset}%`);
            elStop.setAttribute('stop-color', `hsla(${config.hue}, 100%, ${adjustLightness(stop.luminance)}%, ${stop.alpha === undefined ? 1 : stop.alpha})`);
            elStarGradient.appendChild(elStop)
        });
        elDefs.appendChild(elStarGradient);

        const elHaloGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        elHaloGradient.id = HALO_GRADIENT_ID;
        config.haloColourStops.forEach(stop => {
            const elStop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            elStop.setAttribute('offset', `${stop.offset}%`);
            elStop.setAttribute('stop-color', `hsla(${config.hue}, 100%, ${adjustLightness(stop.luminance)}%, ${stop.alpha === undefined ? 1 : stop.alpha})`);
            elHaloGradient.appendChild(elStop)
        });
        elDefs.appendChild(elHaloGradient);

        const elHalo = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        elHalo.setAttribute('cx', "" + config.x);
        elHalo.setAttribute('cy', "" + config.y);
        elHalo.setAttribute('r', "" + config.haloSize);
        elHalo.setAttribute('fill', `url(#${HALO_GRADIENT_ID})`);
        elSvg.appendChild(elHalo);

        const elStar = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        elStar.setAttribute('cx', "" + config.x);
        elStar.setAttribute('cy', "" + config.y);
        elStar.setAttribute('r', "" + config.starSize);
        elStar.setAttribute('fill', `url(#${STAR_GRADIENT_ID})`);

        if (config.diffractionSpikes) {
            const gradientId = `diffSpikeGradient_${id}`,
                elGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");

            elGradient.id = gradientId;
            elGradient.setAttribute('x1',  '0');
            elGradient.setAttribute('y1',  '0');
            elGradient.setAttribute('x2',  '0');
            elGradient.setAttribute('y2',  '1');

            config.diffractionSpikes.colourStops.forEach(stop => {
                const elStop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                elStop.setAttribute('offset', `${stop.offset}%`);
                elStop.setAttribute('stop-color', `hsla(${stop.hue || config.hue}, 100%, ${stop.luminance}%, ${stop.alpha === undefined ? 1 : stop.alpha})`);
                elGradient.appendChild(elStop)
            });
            elDefs.appendChild(elGradient);

            let i = 0;
            const angleBetween = 360 / config.diffractionSpikes.count;
            while (i < config.diffractionSpikes.count) {
                const elLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                let angleDegrees = (config.diffractionSpikes.offsetAngle + i * angleBetween);
                const x1 = config.x,
                    y1 = config.y,
                    x2 = x1 + 0.001,
                    y2 = y1 + config.diffractionSpikes.size;

                elLine.setAttribute('x1', '' + x1);
                elLine.setAttribute('y1', '' + y1);
                elLine.setAttribute('x2', '' + x2);
                elLine.setAttribute('y2', '' + y2);
                elLine.setAttribute('stroke-width', '' + config.diffractionSpikes.width);
                elLine.setAttribute('stroke', `url(#${gradientId})`);
                elLine.setAttribute('transform', `rotate(${angleDegrees} ${x1} ${y1})`);

                if (config.diffractionSpikes.rotationPeriod) {
                    const elAnimate = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
                    elAnimate.setAttribute('attributeName', 'transform');
                    elAnimate.setAttribute('attributeType', 'XML');
                    elAnimate.setAttribute('type', 'rotate');
                    elAnimate.setAttribute('from', `${angleDegrees} ${x1} ${y1}`);
                    elAnimate.setAttribute('to', `${angleDegrees + 360} ${x1} ${y1}`);
                    elAnimate.setAttribute('dur', `${config.diffractionSpikes.rotationPeriod}s`);
                    elAnimate.setAttribute('repeatCount', 'indefinite');
                    elLine.appendChild(elAnimate);
                }
                elSvg.appendChild(elLine);
                i++;
            }
        }

        let ri=0;
        while (ri < config.textureSpikes.count) {
            const angle = Math.random() * 360,
                el = document.createElementNS("http://www.w3.org/2000/svg", "line"),
                x1 = config.x,
                y1 = config.y,
                x2 = x1,
                y2 = y1 + config.textureSpikes.minLength;

            el.setAttribute('x1',  '' + x1);
            el.setAttribute('y1',  '' + y1);
            el.setAttribute('x2',  '' + x2);
            el.setAttribute('y2',  '' + y2);
            el.setAttribute('stroke',  `hsl(${config.hue}, 100%, ${adjustLightness(config.textureSpikes.luminance)}%`);
            el.setAttribute('stroke-opacity',  `${config.textureSpikes.alpha}`);
            el.setAttribute('transform', `rotate(${angle}, ${x1}, ${y1})`);
            if (config.textureSpikes.rotationPeriod) {
                const elAnimateTransform = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
                elAnimateTransform.setAttribute('attributeName', 'transform');
                elAnimateTransform.setAttribute('attributeType', 'XML');
                elAnimateTransform.setAttribute('type', 'rotate');
                elAnimateTransform.setAttribute('from', `${angle + 360} ${x1} ${y1}`);
                elAnimateTransform.setAttribute('to', `${angle} ${x1} ${y1}`);
                elAnimateTransform.setAttribute('dur', `${config.textureSpikes.rotationPeriod}s`);
                elAnimateTransform.setAttribute('repeatCount', 'indefinite');
                el.appendChild(elAnimateTransform);

                const elAnimateAlpha = document.createElementNS("http://www.w3.org/2000/svg", "animate");
                elAnimateAlpha.setAttribute('attributeName', 'stroke-opacity');
                elAnimateAlpha.setAttribute('values', `${config.textureSpikes.minAlpha};${config.textureSpikes.maxAlpha};${config.textureSpikes.minAlpha}`);
                elAnimateAlpha.setAttribute('dur', `${config.textureSpikes.alphaCyclePeriod}s`);
                elAnimateAlpha.setAttribute('repeatCount', 'indefinite');
                elAnimateAlpha.setAttribute('begin', `${-Math.random() * config.textureSpikes.alphaCyclePeriod}s`);
                el.appendChild(elAnimateAlpha);

                const elAnimateLength = document.createElementNS("http://www.w3.org/2000/svg", "animate");
                elAnimateLength.setAttribute('attributeName', 'y2');
                elAnimateLength.setAttribute('values', `${y1 + config.textureSpikes.minLength};${y1 + config.textureSpikes.maxLength};${y1 + config.textureSpikes.minLength}`);
                elAnimateLength.setAttribute('dur', `${config.textureSpikes.lengthCyclePeriod}s`);
                elAnimateLength.setAttribute('repeatCount', 'indefinite');
                elAnimateLength.setAttribute('begin', `${-Math.random() * config.textureSpikes.lengthCyclePeriod}s`);
                el.appendChild(elAnimateLength);
            }

            elSvg.appendChild(el);
            ri++;
        }
        elSvg.appendChild(elStar);
    }

    const svg = document.getElementById('svg')
    function createStarSimple(id, size, hue, lightness, x, y) {
        createStar(svg, id, {
            'x': x,
            'y': y,
            'starSize': size,
            'haloSize': size * 4,
            'hue': hue,
            'lightness': lightness,
            'diffractionSpikes': {
                'count': 4,
                'offsetAngle': 45,
                'size': size * 8,
                'width': 1,
                'rotationPeriod': 200,
                'colourStops': [
                    {'offset': 0, 'luminance': 100, alpha: 1},
                    {'offset': 20, 'luminance': 90, alpha: 1},
                    {'offset': 24, 'luminance': 80, alpha: 1, hue: 360},
                    {'offset': 28, 'luminance': 80, alpha: 0.9, hue: 120},
                    {'offset': 32, 'luminance': 80, alpha: 0.8, hue: 360},
                    {'offset': 36, 'luminance': 80, alpha: 0.7, hue: 120},
                    {'offset': 40, 'luminance': 80, alpha: 0.6, hue: 360},
                    {'offset': 44, 'luminance': 80, alpha: 0.5, hue: 120},
                    {'offset': 48, 'luminance': 100, alpha: 0.5},
                    {'offset': 100, 'luminance': 60, alpha: 0}
                ]
            },
            'starColourStops': [
                {'offset': 0, 'luminance': 100},
                {'offset': 100, 'luminance': 75}
            ],
            'haloColourStops': [
                {'offset': 0, 'luminance': 100, alpha: 0},
                {'offset': 24, 'luminance': 100, alpha: 0},
                {'offset': 25, 'luminance': 100, alpha: 1},

                {'offset': 30, 'luminance': 50, alpha: 0.9},
                {'offset': 40, 'luminance': 50, alpha: 0},

                {'offset': 65, 'luminance': 50, alpha: 0.2},
                {'offset': 100, 'luminance': 50, alpha: 0},
            ],
            'textureSpikes': {
                'count': 100,
                'minLength': size*3,
                'maxLength': size*4,
                'luminance': 100,
                'minAlpha': 0.02,
                'maxAlpha': 0.04,
                'rotationPeriod': 200,
                'alphaCyclePeriod': 5,
                'lengthCyclePeriod': 3
            }
        });
    }
    // for (let i=0; i<20; i++) {
    //     createStarSimple('' + i, Math.random() * 10 + 10, Math.round(Math.random() * 360), Math.random() * 400, Math.random() * 400);
    // }

    // for (let h =0; h<360; h+=10) {
    //     createStarSimple('' + h, 10    , h, 50, 100 + (h % 60) * 10, 100 + Math.floor(h / 60) * 100);
    // }

    for (let l =0; l <= 50; l+=2) {
        createStarSimple('' + l, 10    , 200, l+50, 100 + (l % 10) * 50, 100 + Math.floor(l / 10) * 100);
    }
};