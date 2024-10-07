// 處理鍵盤相關

var soundEnabled = true;
var ismousedown = false;
$(document).ready(function() {
    //產生琴鍵
    var kbs = '';
    var m = [40, 80, 40, 40, 80];
    var mar = 30;
    var c = 0;
    
    
    for (var i = minkeynum; i <= maxkeynum; i++) {
      if (i % 12 == 1 || i % 12 == 3 || i % 12 == 6 || i % 12 == 8 || i % 12 == 10) {
          kbs += `<div id="key${i}" class="black_key keyBtn" style="margin-left:${mar}px"></div>`
              mar+= m[c]
              c=(c+1)%m.length
      } else {
          kbs+=`<div id="key${i}" class="white_key keyBtn"></div>`
      }
      
  }
  
    $('#keyboardContainer').html(kbs);

    $('.keyBtn').mousedown(function() {
        playNote(this);
        
    });

    $('.keyBtn').mouseup(function() {
        stopNote(this);
    });
});

function mute(){
    soundEnabled = !soundEnabled; // 切换声音状态
    var soundIcon = document.getElementById('mute');
    if (soundEnabled) {
        soundIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    } else {
        soundIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
    }
}

function fadeOutAudio(audio, duration) {
    const fadeSteps = 50; // 将淡出分为100步
    const fadeInterval = duration / fadeSteps; // 每步间隔时间
    const fadeStep = audio.volume / fadeSteps; // 每步减少的音量

    let currentStep = 0;

    const fadeOut = setInterval(() => {
        if (currentStep < fadeSteps) {
            audio.volume = Math.max(0, audio.volume - fadeStep);
            currentStep++;
        } else {
            clearInterval(fadeOut); // 清除定时器
            audio.pause(); // 暂停音频
            audio.currentTime = 0; // 重置播放时间
        }
    }, fadeInterval);
}

function playNote(senderDiv) {
    ismousedown = true;
    var key = parseInt(senderDiv.id.substring(3));
    if (soundEnabled){
    if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            currentAudio = new Audio(`../88-keys/${key}.wav`);
            currentAudio.volume = 0.6;
            currentAudio.play();
    }
    document.getElementById(senderDiv.id).style.backgroundColor = "blue";
    if (Scale == "Rule of Octave Ascending") keys.push(key);
    else if (Scale == "Rule of Octave Descending") keys.push(key);
    try{
        var noteOnMsg = [0x90, key, 96];
        currentOutput.send(noteOnMsg);
    }
    catch (error){
        console.log("Cannot read MIDI Output.");
    }
    
    console.log(keys)
}

function stopNote(senderDiv) { 
    ismousedown = false;
    //senderDiv  = key{num}
    var key = parseInt(senderDiv.id.substring(3));
    
    
    if (currentAudio) {
            fadeOutAudio(currentAudio, 100)
        }
    if (isblackkey(key)) $(`#${senderDiv.id}`).css('background-color' , 'black');
    else $(`#${senderDiv.id}`).css('background-color' , 'ivory');
    for (element in keys){
        if (isblackkey(key)) $(`#${senderDiv.id}`).css('background-color' , 'black');
        else  $(`#${senderDiv.id}`).css('background-color' , 'ivory');
    }
    try {
        var noteOffMsg = [0x80, key, 0];
        currentOutput.send(noteOffMsg);
        
        for (let i=0;i<keys.length;i++){
            let note = keys[i];
            var noteOnMsg = [0x90, note, 96];
            currentOutput.send(noteOnMsg);
        }
    } catch{
    }
    
    keys=[]
}
function playNoteMIDI(notenum) {
    var key = parseInt(notenum);
    keys.push(key);
    document.getElementById(`key${key}`).style.backgroundColor = "blue";
    var noteOnMsg = [0x90, key, 96];
    currentOutput.send(noteOnMsg);
    console.log(keys);
  }

  function stopNoteMIDI(notenum) { 
    try{
    if (twoarray()) {
      if (dataindex <7) dataindex++;
      else dataindex=0;
      playexam(dataglobal , dataindex);
      console.log(dataglobal,dataindex);
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
    /*if (isblackkey(key)) document.getElementById(`key${key}`).style.backgroundColor = "black";
    else document.getElementById(`key${key}`).style.backgroundColor = "ivory";*/
    /*for (let i=0;i<keys.length;i++){
      //let note = keys[i];
      if (isblackkey(keys[i])){
        document.getElementById(keys[i]).style.backgroundColor = "black";
        document.getElementById(keys[i]).querySelector('.number_b').textContent = '';
      }
      else
      {
        document.getElementById(keys[i]).style.backgroundColor = "ivory";
        document.getElementById(keys[i]).querySelector('.number').textContent = '';
      }
    }*/
    const index = keys.indexOf(notenum);
    if (index > -1) { // only splice array when item is found
      keys.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log(keys);
  }