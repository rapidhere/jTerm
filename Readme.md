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

					var surf = $.createSurface('rapid', 'cli');
					surf.setParser(function() {
					});
					surf.initCLI();
                });
            </script>

            ...
        </head>

Build From Source
-----------------
this project is managed with Grunt, and Grunt is relay on Node.js.So please make sure that you have Node.JS on your computer first

enter the project directory, run `npm install` to install required libraries

then run `grunt build`, the distributions will put in dist/ directory

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

### $.getTerminalSurface(term_name, term_type)
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

Indicate the backgournd color of terminal with #RGB style.

default value: #00000

#### font-family

The font of terminal. Suggest use monospaced font, or the terminal maybe work abnormally.

default value: consolas

#### font-size
The size of terminal font. Can use any css font-size style.

default value: 14px

#### font-color
The color of terminal font with #RGB style.

default value: #e7e7e7

#### width
The width of the terminal. When width is in px, this indicate the certain width of the terminal. You can also use percentage, and that indicate the width should be the percent of it's father.

default value: 100%

#### height
The height of terminal. Height's value is same as width.

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

### BaseSurface

### CLISurface

Development
-----------

License
-------

Examples
--------

Contact me
----------
email: rapidhere@gmail.com

