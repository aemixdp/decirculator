# decirculator

Visual programming language for sequencing MIDI signals using delay-based circuits.

## Blocks

Block   | Description
------- | --------------------------------------------------------------------------------------------------
Play    | Emits signal to all outputs on simulation start
Delay   | Emits signal to all outputs after specified delay time after receiving signal at any of inputs
Clock   | Emits signal to all outputs at specified interval
Counter | Emits signal to all outputs after receiving specified count of input signals
Switch  | Emits signal to one output at a time clockwise straight after receiving signal at any of inputs
And     | Emits signal to all outputs when there are signals at all inputs at the same time
Or      | Emits signal to all outputs after receiving signal at any of inputs (like Delay with 0 delay time)
MidiOut | Send midi message with specified parameters after receiving signal at any of inputs

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