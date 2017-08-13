export interface AnyCircuitObject {
    kind: 'block' | 'wire';
    id: number;
    active: boolean;
}