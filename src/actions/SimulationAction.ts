export type SimulationAction = StartSimulation | PauseSimulation | StopSimulation;

export type StartSimulation = { type: 'START_SIMULATION' };
export type PauseSimulation = { type: 'PAUSE_SIMULATION' };
export type StopSimulation = { type: 'STOP_SIMULATION' };

export const startSimulation: StartSimulation = { type: 'START_SIMULATION' };
export const pauseSimulation: PauseSimulation = { type: 'PAUSE_SIMULATION' };
export const stopSimulation: StopSimulation = { type: 'STOP_SIMULATION' };