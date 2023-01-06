window.onload = () => {
    function createStar(elParent, id, config) {
        const STAR_GRADIENT_ID = 'starGradient',
            HALO_GRADIENT_ID = 'haloGradient';
        const elSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        const elDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        elSvg.appendChild(elDefs);

        const elStarGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        elStarGradient.id = STAR_GRADIENT_ID;
        config.starColourStops.forEach(stop => {
            const elStop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            elStop.setAttribute('offset', `${stop.offset}%`);
            elStop.setAttribute('stop-color', `hsla(${config.hue}, 100%, ${stop.luminance}%, ${stop.alpha === undefined ? 1 : stop.alpha})`);
            elStarGradient.appendChild(elStop)
        });
        elDefs.appendChild(elStarGradient);

        const elHaloGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        elHaloGradient.id = HALO_GRADIENT_ID;
        config.haloColourStops.forEach(stop => {
            const elStop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            elStop.setAttribute('offset', `${stop.offset}%`);
            elStop.setAttribute('stop-color', `hsla(${config.hue}, 100%, ${stop.luminance}%, ${stop.alpha === undefined ? 1 : stop.alpha})`);
            elHaloGradient.appendChild(elStop)
        });
        elDefs.appendChild(elHaloGradient);

        elSvg.setAttribute('style', `background-color: ${config.backgroundColor}`);
        elSvg.setAttribute('width', config.width);
        elSvg.setAttribute('height', config.height);
        elSvg.id = id;

        const elHalo = document.createElementNS("http://www.w3.org/2000/svg", "circle"),
            haloRadius = config.haloSize * Math.min(config.width, config.height) / 2;

        elHalo.setAttribute('cx', "" + config.width/2);
        elHalo.setAttribute('cy', "" + config.height/2);
        elHalo.setAttribute('r', "" + haloRadius);
        elHalo.setAttribute('fill', `url(#${HALO_GRADIENT_ID})`);
        elSvg.appendChild(elHalo);

        const elStar = document.createElementNS("http://www.w3.org/2000/svg", "circle"),
            circleRadius = config.starSize * Math.min(config.width, config.height) / 2;

        elStar.setAttribute('cx', "" + config.width/2);
        elStar.setAttribute('cy', "" + config.height/2);
        elStar.setAttribute('r', "" + circleRadius);
        elStar.setAttribute('fill', `url(#${STAR_GRADIENT_ID})`);

        if (config.diffractionSpikes) {
            let i = 0;
            const angleBetween = 360 / config.diffractionSpikes.count;
            while (i < config.diffractionSpikes.count) {
                const gradientId = `diffSpikeGradient_${i}`,
                    elGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"),
                    elLine = document.createElementNS("http://www.w3.org/2000/svg", "line"),
                    angleRadians = (config.diffractionSpikes.offsetAngle + i * angleBetween) * Math.PI * 2 / 360,
                    x1 = config.width / 2,
                    y1 = config.height / 2,
                    x2 = x1 + (config.width / 2) * config.diffractionSpikes.size * Math.sin(angleRadians),
                    y2 = y1 + (config.height / 2) * config.diffractionSpikes.size * Math.cos(angleRadians),
                    gradientX1 = x1 > x2 ? 1 : 0,
                    gradientY1 = y1 > y2 ? 1 : 0,
                    gradientX2 = x1 > x2 ? 0 : 1,
                    gradientY2 = y1 > y2 ? 0 : 1;

                console.log(gradientX1, gradientY1, gradientX2, gradientY2)

                elGradient.id = gradientId;
                elGradient.setAttribute('x1',  '' + gradientX1);
                elGradient.setAttribute('y1',  '' + gradientY1);
                elGradient.setAttribute('x2',  '' + gradientX2);
                elGradient.setAttribute('y2',  '' + gradientY2);

                config.diffractionSpikes.colourStops.forEach(stop => {
                    const elStop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                    elStop.setAttribute('offset', `${stop.offset}%`);
                    elStop.setAttribute('stop-color', `hsla(${stop.hue || config.hue}, 100%, ${stop.luminance}%, ${stop.alpha === undefined ? 1 : stop.alpha})`);
                    elGradient.appendChild(elStop)
                });

                elLine.setAttribute('x1', '' + x1);
                elLine.setAttribute('y1', '' + y1);
                elLine.setAttribute('x2', '' + x2);
                elLine.setAttribute('y2', '' + y2);
                elLine.setAttribute('stroke-width', '' + config.diffractionSpikes.width);
                elLine.setAttribute('stroke', `url(#${gradientId})`);

                elDefs.appendChild(elGradient);
                elSvg.appendChild(elLine);
                i++;
            }
        }

        let ri=0;
        while (ri < config.textureSpikes.count) {
            const angle = Math.random() * Math.PI * 2,
                length = Math.random() * (config.textureSpikes.maxLength - config.textureSpikes.minLength) + config.textureSpikes.minLength,
                el = document.createElementNS("http://www.w3.org/2000/svg", "line"),
                x1 = config.width / 2,
                y1 = config.height / 2,
                x2 = x1 + (config.width / 2) * length * Math.sin(angle),
                y2 = y1 + (config.height / 2) * length * Math.cos(angle);

            el.setAttribute('x1',  '' + x1);
            el.setAttribute('y1',  '' + y1);
            el.setAttribute('x2',  '' + x2);
            el.setAttribute('y2',  '' + y2);
            el.setAttribute('stroke',  `hsla(${config.hue}, 100%, ${config.textureSpikes.luminance}%, ${config.textureSpikes.alpha}`);
            elSvg.appendChild(el);
            ri++;
        }
        elSvg.appendChild(elStar);

        elParent.appendChild(elSvg);
        return elSvg;
    }

    createStar(document.body, 'svg1', {
        'width': 400,
        'height': 400,
        'backgroundColor': 'black',
        'starSize': 0.1,
        'haloSize': 0.4,
        'hue': 200,
        'diffractionSpikes': {
            'count': 4,
            'offsetAngle': 45,
            'size': 0.8,
            'width': 2,
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
            {'offset': 100, 'luminance': 90}
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
            'minLength': 0.3,
            'maxLength': 0.4,
            'luminance': 100,
            'alpha': 0.03
        }
    })

};