
Keys = {
	ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, DEL: 46,
	PLUS: 107, MINUS: 109,
};
for (let c = 65; c <= 90; ++c) {
	Keys[String.fromCharCode(c)] = c;
}
for (let c = 48; c <= 57; ++c) {
	Keys['NUM'+String.fromCharCode(c)] = c;
}
for (let c = 1; c <= 12; ++c) {
	Keys['F'+c] = c + 111;
}

Mouse = {
	LEFT: 1, MIDDLE: 2, RIGHT: 3,
};
