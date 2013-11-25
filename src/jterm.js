// The entry

$.fn.runTerm = function(term_name, config) {
    if(! term_name || typeof term_name != "string")
        return;

    if(! config)
        config = {};

    if($(this).length > 1) {
        throw "Can only apply one block a time!"
    }

    target = $(this)[0];

    term = Terminal(term_name, config);
    term.attachTo(target);
}

$.getTerm = function(term_name) {
    return Terminal.get(term_name);
}

$.removeTerm = function(term_name) {
    return Terminal.remove(term_name);
}

$.getTerminalSurface = function(term_name, surf_type) {
    return BaseSurface(Terminal.get(term_name));
}
