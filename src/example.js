function compress(str) {
    var cur, old, next, count;
    cur = old = "";
    count = 1;
    for (var i = 0, len = str.length; i < len; i++) {
        next = str.charAt(i);
        if (next === old) {
            count++;
        } else {
            cur += (old + count)
            count = 1;
        }
        old = next;
    }
}

module.exports = compress;
