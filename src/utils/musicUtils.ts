export function noteToMs(beats: number, noteFraction: number, bpm: number): number {
    return ((60000 / (bpm / 4)) / noteFraction) * beats;
}
