import { Play } from './Play';
import { Clock } from './Clock';
import { Delay } from './Delay';
import { Counter } from './Counter';
import { Switch } from './Switch';
import { Or } from './Or';
import { And } from './And';
import { MidiOut } from './MidiOut';
import { BlockDescriptor } from '../../data/BlockDescriptor';

const blocks: { [blockName: string]: BlockDescriptor } = {
    Play,
    Delay,
    Clock,
    Counter,
    Switch,
    And,
    Or,
    MidiOut,
};

export default blocks;