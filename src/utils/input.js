
let Keys = {
	ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, DEL: 46,
};
for (let c = 65; c <= 90; ++c) {
	Keys[String.fromCharCode(c)] = c;
}
for (let c = 1; c <= 12; ++c) {
	Keys['F'+c] = c + 111;
}

let Mouse = {
	LEFT: 1, MIDDLE: 2, RIGHT: 3,
};
