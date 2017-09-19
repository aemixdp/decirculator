export const START_SIMULATION = 'START_SIMULATION';
export const PAUSE_SIMULATION = 'PAUSE_SIMULATION';
export const STOP_SIMULATION = 'STOP_SIMULATION';

export type SimulationAction
    = StartSimulation
    | PauseSimulation
    | StopSimulation;

export type StartSimulation = { type: typeof START_SIMULATION };
export type PauseSimulation = { type: typeof PAUSE_SIMULATION };
export type StopSimulation = { type: typeof STOP_SIMULATION };

export const start: StartSimulation = { type: START_SIMULATION };
export const pause: PauseSimulation = { type: PAUSE_SIMULATION };
export const stop: StopSimulation = { type: STOP_SIMULATION };