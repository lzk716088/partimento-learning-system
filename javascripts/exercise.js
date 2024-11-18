//9312 = ①
//9320 = ⑨
//9450 = ⓪
//⓪①②③④⑤⑥⑦⑧⑨

/* 
npx http-server
http://localhost:8080
*/

//初始化
var midi = null;
var currentOutput = null;
var keys =[]
var selectedInput = null;
var maxkeynum = 84
var minkeynum = 36 
var Scale = null
//選擇的學習模組
var dataindex=0
var exnote_lst=[]
var exnotes=[]
var selectedKey = "C"
var selectedE = "exercise1" 
var currentAudio=null;
const showAlert = (i,t,txt) => {
            Swal.fire({
                icon: i,
                title: t,
                text: txt,
            })
        }
 
function selectKeyfunc(){
  const selectKey = document.getElementById("selectkey");
  selectKey.addEventListener("change", function() {
    selectedKey = selectKey.value;
    console.log("Key：" + selectedKey);
    updateImage(Scale)
});
}
//判斷該鍵是否為黑鍵
function isblackkey(key){
  if (key % 12 == 1 || key % 12 == 3 || key % 12 == 6 || key % 12 == 8 || key % 12 == 10) return true;
  else return false;
}

function twoarray(){
  try {
    for (var i = 0; i < nowexam.length; i++) {
      if (!keys.includes(nowexam[i])) {
        // 如果有任何一個元素不在 keys 中，返回 False
        return false;
      }
    }
    // 所有元素都在 keys 中，返回 True
    return true;
  }catch{}
}

//啟動MIDI
function startMIDI() {
  if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } 
  else {
    document.getElementById("div_keyboard").style.display = "none";
    document.getElementById("div_options").style.display = "none";
    showAlert("error","Error","Your browser does not support the Web MIDI API!")
    document.getElementById("log_string").innerHTML = "Your browser does not support the Web MIDI API!";
  }
}
//若讀取MIDI成功，開始程式
function onMIDISuccess(midiAccess) {
  showAlert("success","Success","MIDI is ready!")
  document.getElementById("log_string").innerHTML = "MIDI is ready!";
  midi = midiAccess;
  getcurrentOutput();
  getInput(midiAccess);
  changeProgram(0);
}
//讀取MIDI失敗，顯示錯誤訊息
function onMIDIFailure(msg) {
  showAlert("warning","Warning","No access to MIDI resources. Please check your device or use the mouse directly.")
  document.getElementById("log_string").innerHTML = "No access to MIDI resources. Error message: " + msg;
}

//改變output
function changeOutput(outputId) {
  currentOutput.send([176, 123, 0]);
  currentOutput = midi.outputs.get(outputId);
}

//取得MIDI input
function getInput(midiAccess){
  midiAccess.inputs.forEach((port, key) => {
    const opt = document.createElement("option");
    opt.text = port.name;
    $("#midi-inputs").add(opt);
    document.getElementById("midi-inputs").add(opt);
  });
  $("#midi-inputs").change(changeInput(midiAccess))
  document.getElementById("midi-inputs").addEventListener("change", changeInput(midiAccess));
}

function changeInput(midiAccess){
  const inputSelector = document.getElementById("midi-inputs");
  const inputId = inputSelector.value;
  let selectedInput = null;

  midiAccess.inputs.forEach(function(port) {
    port.onmidimessage = function(event) {
      if (event.target.name == inputSelector.value && event.data[0]==144 && event.data[1]>=minkeynum && event.data[1] <= maxkeynum){
        playNoteMIDI(event.data[1])
      }
      else if (event.target.name == inputSelector.value && event.data[0] == 128 && event.data[1]>=minkeynum && event.data[1] <= maxkeynum){
        stopNoteMIDI(event.data[1])
      }
      //console.log(`① = ${event.data[0]} ③ = ${event.data[1]} ⑤ = ${event.data[2]}`);
      //console.log(event.data[0],event.data[1])
    };
  });
}
function updateExercise(name){
  var abc =`M: 4/4\n`;
  switch (name){
    case "exercise1":
      abc+=`L: 1/4\nK: F\nV: LH clef=bass\nF,F,E,F,|B,B,CC,|F,=B,,C,B,,|C,E,F,G,|C,CA,=B,|E,G,^F,E,|^D,E,A,=B,|\nE,E/D/CA,|^G,A,D,E,|A,A,^F,G,|CCDD,|G,_B,A,G,|F,D,G,A,|D,D=B,C|\nF,F,G,G,,|C,CA,G,|^F,G,DD,|G,_B,A,D,|G,G,A,A,,|\nD,D=B,C/_B,/|A,E,F,A,|B,B,CC,|F,A,B,=B,|C4|F2!fermata!z2|]`;
      break;
    case "exercise2":
      abc+=`L: 1/4\nK: C\nV: LH clef=bass\nF,F,A,A,|G,G,_B,_B,|A,A,CC|_B,/A,/G,/F,/E,E,|A,/G,/F,/E,/D,D,|G,/F,/E,/D,/C,C,|F,/G,/A,/F,/G,G,,|\nC,C,E,E,|D,D,F,F,|E,E,G,G,|F,F,A,A,|G,/=B,/C/F,/G,G,,|C,z/E,/ F,/F,,/z/ ^F,/|G,/G,,/z/ ^G,/ A,/A,,/ z/ A,/|\n^G,/E,/ z/ G,/ A,/A,,/ z/ G,/|A,/A,,/ z/ C,/ D,/E,/F,/D,/|E,E,,A,,z/A,/|^F,z/D,/G,z/G,/|E,z/C,/F,F,|A,A,G,G,|_B,B,A,A,|\nCC_B,B,|DDC/_B,/A,/B,/|CC,F,/F,,/z/ F,/|E,/C,/ z/E,/ F,/F,,/z/ F,/|E,/C,/z/ E,/ F,/G,/A,/_B,/|CC,!fermata!F,2|]`
      break;
  }
  console.log(abc);
  ABCJS.renderAbc("paper", abc, {
    staffwidth: 1000,scale: 0.7});
}

$(document).ready(function() {
  let currentExercise = 1;
  updateExercise(`exercise${currentExercise}`);
  
});

function openHint(){
  var selectedEercise = $('#exerciseSelect').val();
    console.log(selectedEercise);
    switch(selectedEercise){
      case "exercise1":
        var abc =`M: 4/4\n`;
        abc+=`L: 1/4\nK: F\nV: RH clef=treble\n[cA][cA][cG][cA]|[Gd][Fd][Fc][Ec]|[Ac][Gd][Ge][Gf]|[Ge][Gc][Dc][F=B]|[Ec][ce][^Fe][F^d]|[Ge][=Be][A^d][Ge]|[^f=B][Ge][^Fe][A^d]|\nV: LH clef=bass\nF,F,E,F,|B,B,CC,|F,=B,,C,B,,|C,E,F,G,|C,CA,=B,|E,G,^F,E,|^D,E,A,=B,|\nV: RH clef=treble\n[Ge][^G=B][EA][Ec]|[Ed][Ec][A=B][^GB]|[Ac][Ec][Dc][G=B]|[Ec][GA][G=B][^FA]|[=B,G][D^G][^CA][CA]|[DA][DF][DE][^CE]|[DF][FA][FG][EG]|\nV: LH clef=bass\nE,E/D/CA,|^G,A,D,E,|A,A,^F,G,|CCDD,|G,_B,A,G,|F,D,G,A,|D,D=B,C|\nV: RH clef=treble\n[FA][Dc][Ec][D=B]|[Ec][Ec][^Fc][G=B]|[Dc][D=B][GA][^FA]|[=B,G][D^G][^CA][DF]|[DE][DE][DF][^CE]|\nV: LH clef=bass\nF,F,G,G,,|C,CA,G,|^F,G,DD,|G,_B,A,D,|G,G,A,A,,|\nV: RH clef=treble\n[DF][FA][FG][EG]|[FA][Gc][Ac][FA]|[FG][FG][FA][EG]|[FA][Fc][FG][FG]|[EG][FA][G][E]|[A,F]2!fermata!z2|]\nV: LH clef=bass\nD,D=B,C/_B,/|A,E,F,A,|B,B,CC,|F,A,B,=B,|C4|F,2!fermata!z2|]`; 
        ABCJS.renderAbc("hint1", abc, {
          staffwidth: 400,scale: 0.4});
        break;
      case "exercise2":
        var abc = `M: 4/4\n`;
        abc+=`L: 1/8\nK: C\nV: RH clef=treble\nz4zcdc|c2_B2zded|d2c2zefe|dc_BA GGg2||\nV: LH clef=bass\nL:1/4\nF,F,A,A,|G,G,_B,_B,|A,A,CC|_B,/A,/G,/F,/E,E,||`;
        ABCJS.renderAbc("hint1", abc, {
          staffwidth: 400,scale: 0.4});
        break;
    }
}

function getcurrentOutput() {
  var outputsToString = "";
  midi.outputs.forEach(function (output, key) {
    if (outputsToString == "") {
      outputsToString += "<option selected='selected' value='" + key + "'>" + output.name + "</option>"; 
      currentOutput = output;
    } 
    else {
      outputsToString += "<option value='" + output.id + "'>" + output.name + "</option>";
    }
  });
  $('#chooseOutput').html(outputsToString);
}

function changeProgram(patch) {
  var allNotesOffMsg = [176, 123, 0];  // 176 corrisponde a 0xB0 (Control Change, channel 1, All Notes Off)
  var programChangeMsg = [192, patch]; // 192 corrisponde a 0xC0 (Program Change, channel 1, Program Change)
  try{
    currentOutput.send(allNotesOffMsg);
    currentOutput.send(programChangeMsg);
  }catch{}
  
}

