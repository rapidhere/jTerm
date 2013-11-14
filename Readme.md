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

TerminalSurface
---------------

Development
-----------

License
-------

Contact me
----------
email: rapidhere@gmail.com

