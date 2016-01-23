
/*
* StringFormat
*/
window.StringFormat = function() {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
        var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm');

        str = str.replace(reg, arguments[i]);
    }

    return str;
}