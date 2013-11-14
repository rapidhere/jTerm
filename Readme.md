jTerm ver 0.1
=============

Description
-----------

jTerm is a simple jQuery plugin which used to draw a Terminal like block in html.

You can draw as many terminals as you like in different block, or in one block.

You should note that, the terminal jTerm supported is not something like bash or ksh.
jTerm just supports some methods to draw on the 'terminal'.In other words, this is a
curses like plugin, not a commad-line-interface.

How to use?
-----------
Simply, you can start a Terminal like this:

1. include jQuery and jTerm lib in your header

        <head>
            ...

            <script src="./jquery.min.js" type="text/javascript"></script>
            <script src="./jterm.jquery.js" type="text/javascript"></script>

            ...
        </head>

2. then define a div block

        <body>
            ...

            <div id="Terminal_Frame"></div>

            ...
        </body>

3. finally add a boot script in your html header

        <head>
            ...

            // After jterm.jquery.js
            <script>
                $(document).ready(function() {
                    $("#Terminal_Frame").runTerm("exmpale");
                });
            </script>

            ...
        </head>

Build From Source
-----------------
run `make` or `make std` for full version

run `make min` or compressed version

run `make debug` for debugingversion.Under debug version, there is no jQuery closure, and every function and class can access directly.

Interfaces
----------
### $.fn.runTerm(term_name, config)
`runTerm' is the function used on a jQuery object.It create a new terminal in the scope of the specified jQuery object.In detail, runTerm append a Terminal in the specified objcect.

term_name is the terminal name of the new terminal you want.This arugment is required, and the name of each terminal must be different, beacause term_name is the only way you retrieve the terminal object from jTerm lib.

config is a dictionary that indicate the private configurations of new terminal. See [Config](#Config) section for more details.


### $.getTerminal(term_name)
return a Terminal object specified by term_name.

Terminal object is a low layer object.You shouldn't use this object if you just want to draw strings and handle keyboard input or move cursor on the terminal.Use $.getTerminalSurface instead.

### $.removeTerminal(term_name)
remove a terminal object specified by term_name.

this terminal will be removed from your html and you have no way to take it back.

### $.getTerminalSurface(term_name)
return a Terminal Surface of specified terminal.

Terminal Surface is a high layer Object used to draw string on the terminal, handle keyboard input, move curses, etc.See [TerminalSurface](#TerminalSurface) section for more details.

Config
------
You can set up your terminal covinient in jTerm.

### Config Scope
There're 3 types of configuration: Private Config, Global Config and Default Config.

Default Config is build inside the jTerm lib.

Global Config is defiend at the very beginning of the jTerm. 

Private Config should indicate with the $.fn.runTerm function's second argument.

When a terminal is find a specified config, it will first look up the its own Pirvate Config.If not found, it will then look up the Global Config, and finally the Default Config.

### Configuration List
#### bgcolor

Indicate the backgournd color of terminal. bgcolor can take any css color style.

default value: black

#### font-family

The font of terminal. Suggest use monospaced font, or the terminal maybe work abnormally.

default value: consolas

#### font-size
The size of terminal font. Can use any css font-size style.

default value: 14px

#### font-color
The color of terminal font. Can use any css font-color style.

default value: #e7e7e7

#### width
The width of the terminal. When width is in px, this indicate the certain width of the terminal. You can also use percentage, and that indicate the width should be the percent of it's father.

default value: 100%

#### height
The height of terminal. Height's value is same as width

default value: 100%

#### cursor-color
The color of the cursor.The cursor must be a rgba value that write in a 4-length array.

default value: [200, 200, 200, 0.8]

#### cursor-style
The style of the cursor. Can use 'block' cursor, 'underline' curosr, or 'none'

default value: block

How to communicate with terminal
--------------------------------
This section define the recommended way to communicate with terminal.If you want to
use low layer APIs, see [Development](#Development) section for more details

### Handle Keyboard Input
You can use a callback function to retrieve the input from the terminal. About how to add a callback function into terminal please refer to TerminalSurface.

The callback function should take four arguments -- keyCode, ctrlKey, shiftKey and altKey.

keyCode is the value of keyboard input.jTerm has convert the jQuery keyCode into a easy mode.If the keyCode is printable, that is letters, numbers or some signs, then the keyCode is a one letter String.If the keyCode is not printable, that is a control code, then it's a number less than zero.You can find specified Control Code in KeyMap
Class.

KeyMap Class define the Control Code of jTerm. You can get the KeyMap through a TerminalSurface.More infomation about TerminalSurface please refer to next chapter.

ctrlKey, shiftKey and altKey are three boolean variables that indicate the ctrl/shift/alt key is pressed.You can use this to make combo key strokes.

### TerminalSurface
TerminalSurface is a very high layer tool used to control the Terminal.

TerminalSurface wrapped many details of Terminal so it's much easier to use than the original Terminal Class.But if you want to handle more details, you should use Terminal directly.

And there should be many layers of TerminalSurface, but currently, why only got one Surface called BaseSurface.Further development will come out with more covinient surface.

You shouldn't create a Surface directly. Use $.getTerminalSurface instead.

### BaseSurface

#### getKeyMap()
return a KeyMap Class

#### setTerminal(terminal)
set The Surface to work on a new terminal. terminal is a Terminal object. You can retrive a Terminal
through $.getTerm

#### putch(ch)
put a char at the cursor's place.

#### mvputch(x, y, ch)
move the cursor to (x, y) and put a char.

#### puts(str)
put a string at the cursor's place.If the rest of the line cannot hold the whole string, then the rest will be placed in the next line.If the rest of Terminal cannot hold the whole string, then the rest of string will be trunked.Finally the cursor will be placed at the next position of last char in the string.But if the last char is the last place in the Terminal, then the cursor will be in the same place with the last char.

#### mvputs(x, y, str)
move the cursor to (x, y) and put a string.

#### move(x, y)
move the cursor with delta(x, y). the cursor will try to move to the new place but if it's out of boundary, the cursor will be placed at the nearest place.

#### moveTo(x, y)
move the cursor to (x, y).If the place is out of boundary, the cursor will be placed at the nearest place.

#### refresh()
In fact, all the operation Surface take is operate on the buffer hold by a inner system.If you want
to flush the buffer to the terminal, you must refresh the Surface.

#### clear()
Clear the whole Terminal.

#### erase()
Erase the char at the cursor's place.

#### mverase(x, y)
Move the cursor and erase the char

#### get()
Return the char at the cursor's place. If there is no char, then return null.

#### mvget(x, y)
Move the cursor and get the char.

#### getX()
Get the X position of cursor.That is the current row index of cursor, start with 0.

#### getY()
Get the Y position of cursor.That is the current column index of cursor, start with 0.

#### getHeight()
Get the max lines the terminal can hold.

#### getWidth()
Get the max chars one line can hold.

#### addcb(cb)
Add a callback function to listen to the keyboard. The callback function is described before.This function will return a id to indicate the callback function.

#### rmcb(id)
Remove the specified callback function. The id is indicated by addcb function.

#### attach(o)
Attach the Terminal to a jQuery Object. Must a terminal attach to a Html DOM, can a terminal work.

#### detach()
Detach the Terminal from current HTML DOM. This will cause the Terminal disappear and stop working.

#### getName()
Get the name of the terminal that Surface working with.

#### getTerm()
Get the Terminal Object that Surface working with.

#### getCurses()
Get the jCurses that Surface working with. 

jCurses is a low layer Object used to communicate with Terminal.For more infomation, please refer to [Development](#Development) section.

Development
-----------

License
-------

Examples
--------

Contact me
----------
email: rapidhere@gmail.com

