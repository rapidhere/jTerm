// Terminal Control Command

TermCtrl = NewClass();

TermCtrl.addStatic({
    "_term_ctrl_list": {},
    "register": function(cmd, par_list) {
    }, // register
    "parse": function(json_buf) {
    }, // parse
});

TermCtrl.addNonStatic({
    "cmd": null,
    "par_list": null,
    "getCtrl": function() {
    }, //getCtrl
    "getParAt": function(index) {
    }, //getParAt
});

TermCtrl = TermCtrl.getClass();

// Terminal Response Command

TermResp = NewClass();

TermResp.addStatic({
    "_term_resp_list": {},
    "register": function(cmd, par_list) {
    }, // register
});

// par : (cmd, par_list)
TermResp.setConstructor(function(obj, pars) {
});

TermResp.addNonStatic({
    "dump": function() {
    }, // function
});

TermResp = TermResp.getClass();
