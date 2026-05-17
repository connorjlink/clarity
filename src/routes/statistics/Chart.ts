export function getTickScale(range: number, approxCount: number) {
    const roughStep = range / approxCount;
    const pow10 = Math.pow(10, Math.floor(Math.log10(roughStep)));
    let step = pow10;
    if (roughStep / pow10 > 5) {
        step = 10 * pow10;
    } else if (roughStep / pow10 > 2) {
        step = 5 * pow10;
    } else if (roughStep / pow10 > 1) {
        step = 2 * pow10;
    }
    return Math.max(1, Math.round(step));
}

export function desaturateHSL(hsl: string, amount: number, lightnessMult = 1) {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
    if (!match) {
        return hsl;
    }
    const h = match[1];
    const s = Math.round(Number(match[2]) * (1 - amount));
    const l = Math.round(Number(match[3]) * lightnessMult);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function darkenColor(hsl: string, amount: number = 20) {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) {
        return hsl;
    }
    const h = Number(match[1]);
    const s = Number(match[2]);
    let l = Math.max(0, Number(match[3]) - amount);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function getColor(index: number, total: number, multiHue: boolean = false) {
    if (multiHue) {
        const hue = (index * 360) / Math.max(1, total);
        return `hsl(${hue}, 70%, 65%)`;
    }
    const start = [200, 70, 60];
    const end = [160, 80, 40];
    const t = total <= 1 ? 0 : index / (total - 1);
    const h = start[0] + (end[0] - start[0]) * t;
    const s = start[1] + (end[1] - start[1]) * t;
    const l = start[2] + (end[2] - start[2]) * t;
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function computeMajorTicks(yRange: number, minY: number, maxY: number, minorStep: number, majorStep: number) {
    const ticks: number[] = [];
    if (yRange > 0 && minorStep > 0 && majorStep > 0) {
        let start = Math.ceil((minY + 1e-6) / minorStep) * minorStep;
        let end = Math.floor((maxY - 1e-6) / minorStep) * minorStep;
        for (let y = start; y < end + 1e-6; y += Number(minorStep)) {
            if (y <= minY + 1e-6 || Math.abs(y) < 1e-6) {
                continue;
            }
            if (Math.abs(y % majorStep) < 1e-6) {
                ticks.push(y);
            }
        }
    }
    return ticks;
}

export function computeMinorTicks(yRange: number, minY: number, maxY: number, minorStep: number, majorStep: number) {
    const ticks: number[] = [];
    if (yRange > 0 && minorStep > 0 && majorStep > 0) {
        let start = Math.ceil((minY + 1e-6) / minorStep) * minorStep;
        let end = Math.floor((maxY - 1e-6) / minorStep) * minorStep;
        for (let y = start; y < end + 1e-6; y += Number(minorStep)) {
            if (y <= minY + 1e-6 || Math.abs(y) < 1e-6) {
                continue;
            }
            if (Math.abs(y % majorStep) >= 1e-6) {
                ticks.push(y);
            }
        }
    }
    return ticks;
}

export function scaleX(x: number | string, i: number, width: number, margin: number, minX: number, maxX: number, isCategorical: boolean, sortedData: { x: number | string }[]) {
    if (!isCategorical) {
        if (maxX === minX) {
            return width / 2;
        }
        return margin + ((Number(x) - minX) / (maxX - minX)) * (width - 2 * margin);
    } else {
        const n = sortedData.length;
        if (n <= 1) {
            return width / 2;
        }
        return margin + (i / (n - 1)) * (width - 2 * margin);
    }
}

export function scaleY(y: number, height: number, margin: number, minY: number, maxY: number) {
    if (maxY === minY) {
        return height / 2;
    }
    return height - margin - ((y - minY) / (maxY - minY)) * (height - 2 * margin);
}

export function getActiveColor(index: number, total: number, hovered: number | null, amount = 0.7) {
    const base = getColor(index, total);
    if (hovered === null || index === hovered) {
        return base;
    }
    return desaturateHSL(base, amount);
}
