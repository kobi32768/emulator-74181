var S, A, B, Cn, M, F, X, Y, AeqB, Cnp4;
S = new Array(4);
A = new Array(4);
B = new Array(4);
F = new Array(4);
var isActiveLow = false;
// event listener
var inputs = document.querySelectorAll(".input-button");
for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("click", function () {
        onChanged();
    });
}
// substitution
for (var n = 0; n < 4; n++)
    F[n] = document.getElementById("F" + n);
X = document.getElementById("X");
Y = document.getElementById("Y");
AeqB = document.getElementById("AeqB");
Cnp4 = document.getElementById("Cnp4");
var activeLowNegatives = [
    "lA0", "lA1", "lA2", "lA3",
    "lB0", "lB1", "lB2", "lB3",
    "lF0", "lF1", "lF2", "lF3",
    "lX", "lY"
]; // X=P / Y=G
var activeHighNegatives = [
    "lCn", "lCnp4"
];
// initialize
onChanged();
function onChanged() {
    for (var i = 0; i < 4; i++) {
        S[i] = document.getElementById("S" + i).checked ? 1 : 0;
        A[i] = document.getElementById("A" + i).checked ? 1 : 0;
        B[i] = document.getElementById("B" + i).checked ? 1 : 0;
    }
    // M: 回路図中にて直接 NOT が挟まれているため反転
    M = document.getElementById("M").checked ? 0 : 1;
    Cn = document.getElementById("Cn").checked ? 1 : 0;
    F[0].checked = XOR(TX(0), NAND(M, Cn));
    F[1].checked = XOR(TX(1), NOR(TU(0) && M, TV(0) && M && Cn));
    F[2].checked = XOR(TX(2), NOR(TU(1) && M, TU(0) && TV(1) && M, TV(0) && TV(1) && M && Cn));
    F[3].checked = XOR(TX(3), NOR(TU(2) && M, TU(1) && TV(2) && M, TU(0) && TV(1) && TV(2) && M, TV(0) && TV(1) && TV(2) && M, Cn));
    X.checked = NAND(TV(0), TV(1), TV(2), TV(3));
    Y.checked = !TY();
    AeqB.checked = AND(F[0].checked, F[1].checked, F[2].checked, F[3].checked);
    Cnp4.checked = OR(TY(), AND(TV(0), TV(1), TV(2), TV(3), Cn));
    console.log("changed");
}
// temporaries
function TU(n) {
    return NOR(A[n], B[n] && S[0], !B[n] && S[1]);
}
function TV(n) {
    return NOR(A[n] && !B[n] && S[2], A[n] && B[n] && S[3]);
}
function TY() {
    return OR(TU(0) && TV(1) && TV(2) && TV(3), TU(1) && TV(2) && TV(3), TU(2) && TV(3), TU(3));
}
function TX(n) {
    return XOR(TU(n), TV(n));
}
// switch active-(L|H)
function toggleActiveLH() {
    if (isActiveLow)
        toActiveHigh();
    else
        toActiveLow();
    isActiveLow = !isActiveLow;
}
function toActiveLow() {
    for (var _i = 0, activeHighNegatives_1 = activeHighNegatives; _i < activeHighNegatives_1.length; _i++) {
        var ahn = activeHighNegatives_1[_i];
        document.getElementById(ahn).classList.remove("negative");
    }
    for (var _a = 0, activeLowNegatives_1 = activeLowNegatives; _a < activeLowNegatives_1.length; _a++) {
        var aln = activeLowNegatives_1[_a];
        document.getElementById(aln).classList.add("negative");
    }
    document.getElementById("lX").innerText = "P";
    document.getElementById("lY").innerText = "G";
    document.getElementById("ActiveLH").innerText
        = document.getElementById("ActiveLH").innerText
            .replace("High", "Low");
}
function toActiveHigh() {
    for (var _i = 0, activeLowNegatives_2 = activeLowNegatives; _i < activeLowNegatives_2.length; _i++) {
        var aln = activeLowNegatives_2[_i];
        document.getElementById(aln).classList.remove("negative");
    }
    for (var _a = 0, activeHighNegatives_2 = activeHighNegatives; _a < activeHighNegatives_2.length; _a++) {
        var ahn = activeHighNegatives_2[_a];
        document.getElementById(ahn).classList.add("negative");
    }
    document.getElementById("lX").innerText = "X";
    document.getElementById("lY").innerText = "Y";
    document.getElementById("ActiveLH").innerText
        = document.getElementById("ActiveLH").innerText
            .replace("Low", "High");
}
// Plus / Minus 1
function IncDec(op) {
    var operand = op.substr(0, 1);
    var operation = op.substr(1, 1);
    var num = getNumOperand(operand);
    // increase / decrease
    if (operation == '+')
        num += 1;
    else
        num -= 1;
    // check
    if (num == 16)
        num = 0;
    else if (num == -1)
        num = 15;
    deployNumToOperand(operand, num);
}
function getNumOperand(operand) {
    var num = 0;
    for (var i = 0; i < 4; i++) {
        if (document.getElementById("" + operand + i).checked) {
            num += Math.pow(2, i);
        }
    }
    console.log(num);
    return num;
}
function deployNumToOperand(operand, num) {
    for (var i = 3; i >= 0; i--) {
        console.log(Math.pow(2, i).toString(2));
        console.log(((num & Math.pow(2, i)) == 1));
        document.getElementById("" + operand + i).checked
            = ((num & Math.pow(2, i)) > 0);
    }
    onChanged();
}
// boolean operators
function AND() {
    var bool = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        bool[_i] = arguments[_i];
    }
    // and: false が含まれたら false
    for (var i = 0; i < bool.length; i++) {
        if (!bool[i])
            return false;
    }
    return true;
}
function OR() {
    var bool = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        bool[_i] = arguments[_i];
    }
    // or: true が含まれたら true
    for (var i = 0; i < bool.length; i++) {
        if (bool[i])
            return true;
    }
    return false;
}
function XOR() {
    var bool = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        bool[_i] = arguments[_i];
    }
    // xor: 奇数か判定
    return bool.filter(function (b) { return b == true; })
        .length % 2 == 1;
}
function NAND() {
    var bool = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        bool[_i] = arguments[_i];
    }
    return !AND.apply(void 0, bool);
}
function NOR() {
    var bool = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        bool[_i] = arguments[_i];
    }
    return !OR.apply(void 0, bool);
}
// resets
function resetAll() {
    var inputs = document.querySelectorAll(".input-button");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
    }
    resetResult();
}
function resetSCnM() {
    var opcodes = document.querySelectorAll(".opcode");
    for (var i = 0; i < opcodes.length; i++) {
        opcodes[i].checked = false;
    }
    resetResult();
}
function resetAB() {
    var operands = document.querySelectorAll(".operand");
    for (var i = 0; i < operands.length; i++) {
        operands[i].checked = false;
    }
    resetResult();
}
function resetCnM() {
    document.getElementById("Cn").checked = false;
    document.getElementById("M").checked = false;
    resetResult();
}
function resetChar4(char) {
    for (var i = 0; i < 4; i++) {
        var Ai = document.getElementById("" + char + i);
        Ai.checked = false;
    }
    resetResult();
}
function resetResult() {
    for (var i = 0; i < 4; i++) {
        var Ai = document.getElementById("F" + i);
        Ai.checked = false;
    }
    document.getElementById("X").checked = false;
    document.getElementById("Y").checked = false;
    document.getElementById("AeqB").checked = false;
    document.getElementById("Cnp4").checked = false;
    onChanged();
}
