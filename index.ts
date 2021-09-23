let S, A, B, Cn, M, F, X, Y, AeqB, Cnp4
S = new Array<number>(4)
A = new Array<number>(4)
B = new Array<number>(4)
F = new Array<HTMLInputElement>(4)

let isActiveLow = false

// event listener
const inputs = document.querySelectorAll(".input-button")
for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("click", function() {
        onChanged()
    })
}

// substitution
for (let n = 0; n < 4; n++)
    F[n] = document.getElementById(`F${n}`) as HTMLInputElement

X    = document.getElementById("X")    as HTMLInputElement
Y    = document.getElementById("Y")    as HTMLInputElement
AeqB = document.getElementById("AeqB") as HTMLInputElement
Cnp4 = document.getElementById("Cnp4") as HTMLInputElement

const activeLowNegatives = [
    "lA0", "lA1", "lA2", "lA3",
    "lB0", "lB1", "lB2", "lB3",
    "lF0", "lF1", "lF2", "lF3",
    "lX" , "lY" ] // X=P / Y=G
const activeHighNegatives = [
    "lCn", "lCnp4" ]

// initialize
onChanged()

function onChanged() {
    for (let i = 0; i < 4; i++) {
        S[i] = (<HTMLInputElement>document.getElementById(`S${i}`)).checked ? 1 : 0
        A[i] = (<HTMLInputElement>document.getElementById(`A${i}`)).checked ? 1 : 0
        B[i] = (<HTMLInputElement>document.getElementById(`B${i}`)).checked ? 1 : 0
    }
    // M: 回路図中にて直接 NOT が挟まれているため反転
    M  = (<HTMLInputElement>document.getElementById("M")).checked  ? 0 : 1
    Cn = (<HTMLInputElement>document.getElementById("Cn")).checked ? 1 : 0

    F[0].checked = XOR(
        TX(0),
        NAND(M, Cn))
    F[1].checked = XOR(
        TX(1),
        NOR(
            TU(0) && M,
            TV(0) && M && Cn ))
    F[2].checked = XOR(
        TX(2),
        NOR(
            TU(1) && M,
            TU(0) && TV(1) && M,
            TV(0) && TV(1) && M && Cn ))
    F[3].checked = XOR(
        TX(3),
        NOR(
            TU(2) && M,
            TU(1) && TV(2) && M,
            TU(0) && TV(1) && TV(2) && M,
            TV(0) && TV(1) && TV(2) && M && Cn ))
    X.checked = NAND( TV(0), TV(1), TV(2), TV(3))
    Y.checked = !TY()
    AeqB.checked = AND(
        F[0].checked,
        F[1].checked,
        F[2].checked,
        F[3].checked)
    Cnp4.checked = OR(
        TY(),
        AND( TV(0), TV(1), TV(2), TV(3), Cn ))
    console.log("changed")
}

// temporaries
function TU(n): boolean {
    return NOR(
        A[n],
        B[n]  && S[0],
        !B[n] && S[1])
}

function TV(n): boolean {
    return NOR(
        A[n] && !B[n] && S[2],
        A[n] &&  B[n] && S[3]
    )
}

function TY(): boolean {
    return OR(
        TU(0) && TV(1) && TV(2) && TV(3),
        TU(1) && TV(2) && TV(3),
        TU(2) && TV(3),
        TU(3)
    )
}

function TX(n): boolean {
    return XOR( TU(n), TV(n) )
}

// switch active-(L|H)
function toggleActiveLH() {
    if (isActiveLow)
        toActiveHigh()
    else
        toActiveLow()
    isActiveLow = !isActiveLow

}

function toActiveLow() {
    for (const ahn of activeHighNegatives)
        document.getElementById(ahn).classList.remove("negative")
    for (const aln of activeLowNegatives)
        document.getElementById(aln).classList.add("negative")

    document.getElementById("lX").innerText = "P"
    document.getElementById("lY").innerText = "G"
    document.getElementById("ActiveLH").innerText
    = document.getElementById("ActiveLH").innerText
        .replace("High", "Low")
}

function toActiveHigh() {
    for (const aln of activeLowNegatives)
        document.getElementById(aln).classList.remove("negative")
    for (const ahn of activeHighNegatives)
        document.getElementById(ahn).classList.add("negative")

    document.getElementById("lX").innerText = "X"
    document.getElementById("lY").innerText = "Y"
    document.getElementById("ActiveLH").innerText
    = document.getElementById("ActiveLH").innerText
        .replace("Low", "High")
}

// Plus / Minus 1
function IncDec(op: string) {
    const operand   = op.substr(0, 1)
    const operation = op.substr(1, 1)
    let num = getNumOperand(operand)

    // increase / decrease
    if (operation == '+')
        num += 1
    else
        num -= 1

    // check
    if (num == 16)
        num = 0
    else if (num == -1)
        num = 15

    deployNumToOperand(operand, num)
}

function getNumOperand(operand: string): number { // A or B
    let num = 0
    for (let i = 0; i < 4; i++) {
        if ((<HTMLInputElement>document.getElementById(`${operand}${i}`)).checked) {
            num += Math.pow(2, i)
        }
    }
    console.log(num)
    return num
}

function deployNumToOperand(operand: string, num: number) {
    for (let i = 3; i >= 0; i--) {
        console.log(Math.pow(2, i).toString(2));
        console.log(( (num & Math.pow(2, i)) == 1 ));
        (<HTMLInputElement>document.getElementById(`${operand}${i}`)).checked
        = ( (num & Math.pow(2, i)) > 0 )
    }
    onChanged()
}

// boolean operators
function AND(...bool: boolean[]): boolean {
    // and: false が含まれたら false
    for (let i = 0; i < bool.length; i++) {
        if (!bool[i]) return false
    }
    return true
}

function OR(...bool: boolean[]): boolean {
    // or: true が含まれたら true
    for (let i = 0; i < bool.length; i++) {
        if (bool[i]) return true
    }
    return false
}

function XOR(...bool: boolean[]): boolean {
    // xor: 奇数か判定
    return bool.filter(
        function (b) {return b == true} )
        .length % 2 == 1
}

function NAND(...bool: boolean[]): boolean {
    return !AND(...bool)
}

function NOR(...bool: boolean[]): boolean {
    return !OR(...bool)
}

// resets
function resetAll() {
    const inputs = document.querySelectorAll(".input-button")
    for (let i = 0; i < inputs.length; i++) {
        (<HTMLInputElement>inputs[i]).checked = false
    }
    resetResult()
}

function resetSCnM() {
    const opcodes = document.querySelectorAll(".opcode")
    for (let i=0; i<opcodes.length; i++) {
        (<HTMLInputElement>opcodes[i]).checked = false
    }
    resetResult()
}

function resetAB() {
    const operands = document.querySelectorAll(".operand")
    for (let i=0; i<operands.length; i++) {
        (<HTMLInputElement>operands[i]).checked = false
    }
    resetResult()
}

function resetCnM() {
    (<HTMLInputElement>document.getElementById("Cn")).checked = false;
    (<HTMLInputElement>document.getElementById("M")).checked = false
    resetResult()
}

function resetChar4(char) {
    for (let i = 0; i < 4; i++) {
        const Ai = document.getElementById(`${char}${i}`) as HTMLInputElement
        Ai.checked = false
    }
    resetResult()
}

function resetResult() {
    for (let i = 0; i < 4; i++) {
        const Ai = document.getElementById(`F${i}`) as HTMLInputElement
        Ai.checked = false
    }
    (<HTMLInputElement>document.getElementById("X")).checked = false;
    (<HTMLInputElement>document.getElementById("Y")).checked = false;
    (<HTMLInputElement>document.getElementById("AeqB")).checked = false;
    (<HTMLInputElement>document.getElementById("Cnp4")).checked = false
    onChanged()
}
