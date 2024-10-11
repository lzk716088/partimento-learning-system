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

const showAlert = (i,t,txt) => {
            Swal.fire({
                icon: i,
                title: t,
                text: txt,
            })
        }
//showAlert("error","Oops...","Your browser does not support the Web MIDI API!")
//showAlert("success","Sucess","MIDI is ready!")
//showAlert("warning","Warning","No access to MIDI resources. Please check your device or use the mouse directly.")
        
function toggleContent(){
  var modeselect = document.getElementsByName("mode");
  console.log(modeselect)
  modeselect.forEach(function(mode) {
    mode.addEventListener("change", function() {
      if (mode.checked) {
        if (mode.value === 'example') {
        document.getElementById('examplemode').style.display = 'block';
        document.getElementById('exercisemode').style.display = 'none';
      } else if (mode.value === 'exercise') {
        var image = document.getElementById('Image');
        document.getElementById('examplemode').style.display = 'none';
        document.getElementById('exercisemode').style.display = 'block';
      }
      }
    });
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

//播放data.json

//啟動MIDI
function startMIDI() {
  if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } 
  else {
    document.getElementById("div_keyboard").style.display = "none";
    document.getElementById("div_options").style.display = "none";
    showAlert("error","Error","Your browser does not support the Web MIDI API!")
    $('#log_string').html("Your browser does not support the Web MIDI API!");
  }
  toggleContent();
  selectKeyfunc();
}
//若讀取MIDI成功，開始程式
function onMIDISuccess(midiAccess) {
  showAlert("success","Sucess","MIDI is ready!")
  $('#log_string').html("MIDI is ready!");
  midi = midiAccess;
  getcurrentOutput();
  getInput(midiAccess);
  changeProgram(0);
}
//讀取MIDI失敗，顯示錯誤訊息
function onMIDIFailure(msg) {
  showAlert("warning","Warning","No access to MIDI resources. Please check your device or use the mouse directly.")
  $('#log_string').html("No access to MIDI resources. Error message: " + msg);
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
  });
  $("#midi-inputs").change(changeInput(midiAccess))
  //document.getElementById("midi-inputs").addEventListener("change", changeInput(midiAccess));
}

function changeInput(midiAccess){
  //const inputSelector = document.getElementById("midi-inputs");
  //const inputId = inputSelector.value;

  midiAccess.inputs.forEach(function(port) {
    port.onmidimessage = function(event) {
      if (event.target.name == $("#midi-inputs").val() && event.data[0]==144 && event.data[1]>=minkeynum && event.data[1] <= maxkeynum){
        playNoteMIDI(event.data[1])
      }
      else if (event.target.name == $("#midi-inputs").val() && event.data[0] == 128 && event.data[1]>=minkeynum && event.data[1] <= maxkeynum){
        stopNoteMIDI(event.data[1])
      }
      //console.log(`① = ${event.data[0]} ③ = ${event.data[1]} ⑤ = ${event.data[2]}`);
      //console.log(event.data[0],event.data[1])
    };
  });
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

function pushascending(key){
  var k=[]
  k.push(key);
  if (key%12 == 2){
    key2 = key+3;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+9;
    if (key3 >maxkeynum) key3-=12;
  }
  else if (key%12 == 4 || key%12 == 9){
    key2 = key+3;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+8;
    if (key3 >maxkeynum) key3-=12;
  }
  else if (key%12 == 5){
    key2 = key+4;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+9;
    if (key3 >maxkeynum) key3-=12;
  }
  else if (key%12 == 11){
    key2 = key+3;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+6;
    if (key3 >maxkeynum) key3-=12;
  }
  else{
    key2 = key+4;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+7;
    if (key3 >maxkeynum) key3-=12;
  }
  k.push(key2);
  k.push(key3);
  if (key%12 ==0 ||key%12==7) var sig =["①","③","⑤"];
  else sig=["①","③","⑥"];
  
  keys.push(`key${key}`);
  keys.push(`key${key2}`);
  keys.push(`key${key3}`);
  console.log(keys)
  for (i=0;i<keys.length;i++){
    if (isblackkey(k[i])){
    //document.getElementById(keys[i]).style.backgroundColor = "blue";
    document.getElementById(keys[i]).querySelector('.number_b').textContent = sig[i];
    }
  else{
    //document.getElementById(keys[i]).style.backgroundColor = "blue";
    document.getElementById(keys[i]).querySelector('.number').textContent = sig[i];
    }
  }
  console.log(keys)
} 

function pushdescending(key){
  var k=[]
  k.push(key);
  if (key%12 == 2){
    key2 = key+3;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+5;
    if (key3 >maxkeynum) key3-=12;
    key4 = key+9;
    if (key4 >maxkeynum) key4-=12;
  }
  else if (key%12 == 4){
    key2 = key+3;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+8;
    if (key3 >maxkeynum) key3-=12;
  }
  else if (key%12 == 5){
    key2 = key+4;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+9;
    if (key3 >maxkeynum) key3-=12;
  }
  else if (key%12 == 9){
    key2 = key+3;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+5;
    if (key3 >maxkeynum) key3-=12;
    key4 = key+10;
    if (key4 >maxkeynum) key4-=12;
  }
  else if (key%12 == 11){
    key2 = key+3;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+6;
    if (key3 >maxkeynum) key3-=12;
  }
  else{
    key2 = key+4;
    if (key2 >maxkeynum) key2-=12;
    key3 = key+7;
    if (key3 >maxkeynum) key3-=12;
  }
  k.push(key2);
  k.push(key3);
  if (key%12 ==0 ||key%12==7) var sig =["①","③","⑤"];
  else sig=["①","③","⑥"];
  
  keys.push(`key${key}`);
  keys.push(`key${key2}`);
  keys.push(`key${key3}`);
  if (key%12 ==2 ||key%12==9) {
    keys.push(`key${key4}`);
    sig =["①","③","④","⑥"]
  }
  console.log(keys)
  for (i=0;i<keys.length;i++){
    if (isblackkey(k[i])){
      var noteOnMsg = [0x90, k[i], 96];
      currentOutput.send(noteOnMsg);
    //document.getElementById(keys[i]).style.backgroundColor = "blue";
    document.getElementById(keys[i]).querySelector('.number_b').textContent = sig[i];
    }
  else{
    //document.getElementById(keys[i]).style.backgroundColor = "blue";
    document.getElementById(keys[i]).querySelector('.number').textContent = sig[i];
    }
  }
  console.log(keys);
} 
var currentAudio=null;


function stopNoteMIDI(notenum) { 
  try{
  if (twoarray()) {
    if (dataindex <7) dataindex++;
    else dataindex=0;
    playexam(dataglobal , dataindex);
  }
  }catch{}

  var key = notenum;
  var noteOffMsg = [0x80, key, 0];
  currentOutput.send(noteOffMsg);

  try{
      if (!twoarray()&& nowexam.includes(key)) {
      document.getElementById(`key${key}`).style.backgroundColor = "red";
    } 
    else if (isblackkey(key)) {
        document.getElementById(`key${key}`).style.backgroundColor = "black";
    } else {
        document.getElementById(`key${key}`).style.backgroundColor = "ivory";
    }
  }catch(error){
    if (isblackkey(key)) {
        document.getElementById(`key${key}`).style.backgroundColor = "black";
    } else {
        document.getElementById(`key${key}`).style.backgroundColor = "ivory";
    }

  }
  const index = keys.indexOf(notenum);
  if (index > -1) { // only splice array when item is found
    keys.splice(index, 1); // 2nd parameter means remove one item only
  }
  console.log(keys);
}

function modulation(){
  m = 0
  console.log(`modulation's Key: ${selectedKey}`)
  if (selectedKey == "C")  m=0;
  if (selectedKey == "^C")  m=1;
  if (selectedKey == "D")  m=2;
  if (selectedKey == "_E")  m=3;
  if (selectedKey == "E")  m=4;
  if (selectedKey == "F")  m=5;
  if (selectedKey == "^F")  m=6;
  if (selectedKey == "G")  m=7;
  if (selectedKey == "_A")  m=8;
  if (selectedKey == "A")  m=9;
  if (selectedKey == "_B")  m=10;
  if (selectedKey == "B")  m=11;
  return m;
}


function changeProgram(patch) {
  var allNotesOffMsg = [176, 123, 0];  // 176 corrisponde a 0xB0 (Control Change, channel 1, All Notes Off)
  var programChangeMsg = [192, patch]; // 192 corrisponde a 0xC0 (Program Change, channel 1, Program Change)
  currentOutput.send(allNotesOffMsg);
  currentOutput.send(programChangeMsg);
}

function stopexam(){
  for(let s=0;s<exnotes.length;s++){
      if (isblackkey(exnotes[s].substring(3))) {
        document.getElementById(`${exnotes[s]}`).style.backgroundColor = "black";}
      else document.getElementById(`${exnotes[s]}`).style.backgroundColor = "ivory";
  };
}
function playexam(data,index){
  if (exnotes.length>=1){
    for(let s=0;s<exnotes.length;s++){
      if (isblackkey(exnotes[s].substring(3))) {
        document.getElementById(`${exnotes[s]}`).style.backgroundColor = "black";}
      else document.getElementById(`${exnotes[s]}`).style.backgroundColor = "ivory";
  };}
  if (Scale == "Rule of Octave Ascending"){
    exnote_lst= data["Ascending"][index];
    exnotes=[];

    for(let j=0;j<exnote_lst.length;j++){
      exnote = data["Ascending"][index][j];
      exnote += modulation();
      if (exnote > maxkeynum) exnote -=12;
      exnotes.push(`key${exnote}`);
      document.getElementById(`key${exnote}`).style.backgroundColor = "red";
      if (soundEnabled){
            currentAudio = new Audio(`../88-keys/${exnote}.wav`);
            currentAudio.volume = 0.2;
            currentAudio.play();
      }
    };
    var noteElement = $(`[data-index="${index}"]`);  // 使用 jQuery 查找音符
      if (noteElement.length) {
        noteElement.addClass("abcjs-note_selected");  // 添加選中樣式
      }
    nowexam=data["Ascending"][index];
  };
  if (Scale == "Rule of Octave Descending"){
    exnote_lst= data["Descending"][index];
    exnotes=[];
    for(let j=0;j<exnote_lst.length;j++){
      exnote = data["Descending"][index][j];
      exnote += modulation();
      if (exnote > maxkeynum) exnote -=12;
      exnotes.push(`key${exnote}`);

      document.getElementById(`key${exnote}`).style.backgroundColor = "red";
      if (soundEnabled){
          currentAudio = new Audio(`../88-keys/${exnote}.wav`);
          currentAudio.volume = 0.2;
          currentAudio.play();
      }
    };
    var noteElement = $(`[data-index="${index}"]`);  // 使用 jQuery 查找音符
      if (noteElement.length) {
        noteElement.addClass("abcjs-note_selected");  // 添加選中樣式
      }
  nowexam=data["Descending"][index];
  };
}
