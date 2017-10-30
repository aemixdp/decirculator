# decirculator

Visual programming language for sequencing MIDI signals using delay-based circuits.

## Blocks

| Block   | Parameter   | Example       | Description
|:-------:|:-----------:|:-------------:| ---------------------------------------------------------------------------------
| Play    |             |               | Emits signal to all outputs on simulation start or after specified number of bars
|         | skip-bars   | 0             | number of bars to skip
|         | signature   | 4/4           | signature of bars to skip
| Delay   |             |               | Emits signal to all outputs after specified delay time after receiving signal at any of inputs
|         | intervals   | 1/2,1/4       | intervals to use for delay (used one after another, ie first signal is delayed for 1/2, next for 1/4 and so on)
| Clock   |             |               | Emits signal to all outputs at specified intervals
|         | ticking     | true          | true if clock is running, toggles to opposite every time clock receives signal at any of inputs
|         | skip-init   | false         | if this option is false clock sends initial signal to all outputs straight after simulation start
|         | intervals   | 3/8,2/8,3/8   | intervals to use for delay (used one after another, ie first signal comes at start, next after 3/8, second after 2/8 and so on)
| Counter |             |               | Emits signal to all outputs after receiving specified number of input signals
|         | steps       | 4             | number of input signals to receive before sending signal to outputs
|         | one-shot    | false         | true if signals should be sent to outputs only once (per simulation)
|         | inverse     | false         | if true counter will emit output signal after every input signal except of every n-th where n = steps
| Switch  |             |               | Emits signal to one output at a time clockwise straight after receiving signal at any of inputs
|         | side        | 1             | side of output port to send next output signal to (0 = up, 1 = right, 2 = down, 3 = left)
| And     |             |               | Emits signal to all outputs when there are signals at all inputs at the same time
| Or      |             |               | Emits signal to all outputs after receiving signal at any of inputs (like Delay with 0 delay time)
| MidiOut |             |               | Send midi message with specified parameters after receiving signal at any of inputs
|         | cc-mode     | true          | true if midi out should send cc signals instead of note on
|         | channel     | 1             | number of channel to send midi messages to
|         | notes       | A3,C4,E4,A4   | list of notes/signals to send in midi note/cc messages (one at a time, one after another)
|         | velocities  | 100,96,127    | list of velocities/values to send in midi note/cc messages
|         | durations   | 1/16,1/16,1/4 | durations of midi notes

## Controls

Action                   | How To
------------------------ | -------------------------------------------------------------------------------------------------
Place Block              | Drag block from toolbar to viewport while holding [Left Mouse Button]
Connect Blocks with Wire | Draw wire between ports on sides of objects while holding [Left Mouse Button]
Select Object(s)         | Click on object with [Left Mouse Button] or draw rectangular area around objects while holding it
Edit Object Properties   | Select object, properties bar will appear
Copy                     | Select something, then press [Ctrl-C]
Paste                    | Click some empty place on viewport with [Left Mouse Button], then press [Ctrl-V]
Undo                     | Press [Ctrl-Z]
Redo                     | Press [Ctrl-Y]
Delete                   | Select something, then press [Delete]
Drag Selection           | Select something, hover any block from selection, then hold [Left Mouse Button] and move mouse
Drag Viewport            | Hold [Ctrl], hover some empty place on viewport, then hold [Left Mouse Button] and move mouse