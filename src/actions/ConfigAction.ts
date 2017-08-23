export type ConfigAction = SetBpm;

export type SetBpm = {
    type: 'SET_BPM';
    bpm: number;
};

export function setBpm(bpm: number): SetBpm {
    return {
        type: 'SET_BPM',
        bpm,
    };
}