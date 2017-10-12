export function snakeToCamel(s: string): string {
    return s.replace(/(-.)/g, (m) => m[1].toUpperCase());
}

export function textOffset(n: number, ...offsets: number[]): number {
    return offsets[Math.max(`${n}`.length - 1, 0)] || offsets[offsets.length - 1];
}

export function mangle(s: string): string {
    const words = [];
    let word = '';
    for (let i = 0; i < s.length; ++i) {
        if (s[i] === s[i].toUpperCase()) {
            if (word.length > 0) words.push(word);
            word = s[i].toLowerCase();
        } else {
            word += s[i];
        }
    }
    if (word.length > 0) words.push(word);
    return words.join('-');
}

export function fontAwesomeOnLoad(callback: () => any) {
    let c = document.createElement('canvas');
    let cctx: any = c.getContext('2d');
    let ccw: any;
    let cch: any;
    let fontsize = 36;
    let testCharacter = '\uF047';
    ccw = c.width = fontsize * 1.5;
    cch = c.height = fontsize * 1.5;
    cctx.font = fontsize + 'px fontawesome';
    cctx.textAlign = 'center';
    cctx.textBaseline = 'middle';
    let startCount = pixcount();
    let t1 = performance.now();
    let failtime = t1 + 5000;
    //
    requestAnimationFrame(fontOnload);
    //
    function fontOnload(time: number) {
        let currentCount = pixcount();
        if (time > failtime) {
            alert('Font Awsome failed to load after ' + 5000 + 'ms.');
        } else if (currentCount === startCount) {
            requestAnimationFrame(fontOnload);
        } else {
            callback();
        }
    }
    //
    function pixcount() {
        cctx.clearRect(0, 0, ccw, cch);
        cctx.fillText(testCharacter, ccw / 2, cch / 2);
        let data = cctx.getImageData(0, 0, ccw, cch).data;
        let count = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 10) { count++; }
        }
        return (count);
    }
}
