// 為單選按鈕添加事件監聽器
function showButtons() {
    document.getElementById("buttonWarp").style.display = "flex";
}
$(document).ready(function() {
  $('input[name="value-radio"]').change(function() {
    showButtons();
    Scale = $(this).val();
    console.log("Selected Scale:", Scale);
    updateImage(Scale);
  });
});

// 獲取按鈕元素
var button1 = document.getElementById("leftButton");
var button2 = document.getElementById("showDataButton");
var button3 = document.getElementById("rightButton");

var newSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 6h12v12H6z"/></svg>`;
var orgSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>`;
var btnstate=0;
$('#button1').click(function() {

});
// 獲取 JSON 數據的函數
/*
async function fetchData() {
  try {
    const response = await fetch('../json/practice_data.json');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error; // 把錯誤拋出以便在調用處捕獲
  }
}
$('#leftButton').click(async function() {
  try {
    const data = await fetchData(); // 獲取數據
    
    if (btnstate === 1) {
        dataglobal = data;
        dataindex = dataindex <= 0 ? 7 : dataindex - 1; // 更新 index
        playexam(data, dataindex);
        console.log(`${data} ${dataindex}`);
    }
} catch (error) {
    // 錯誤處理已在 fetchData 中進行
}
});

$('#showDataButton').click(async function() {
  try {
    const data = await fetchData(); // 獲取數據
    console.log
    dataglobal = data;
    dataindex = 0;

    if (btnstate === 0) {
        button2.innerHTML = newSvg;
        btnstate = 1;
        playexam(data, dataindex);
    } else {
        button2.innerHTML = orgSvg;
        btnstate = 0;
        stopexam();
    }
    } catch (error) {
        // 錯誤處理已在 fetchData 中進行
    }
});

$('#rightButton').click(async function() {
  try {
    const data = await fetchData(); // 獲取數據
    if (btnstate === 1) {
        dataglobal = data;
        dataindex = dataindex >= 7 ? 0 : dataindex + 1; // 更新 index
        playexam(data, dataindex);
        console.log(`${data} ${dataindex}`);
    }
    } catch (error) {
        // 錯誤處理已在 fetchData 中進行
    }
});
*/
// 按鈕一：上一個

$('#leftButton').click(async function() {
    fetch('../json/practice_data.json')
    .then(response => response.json()) 
    .then(data => {
        if (btnstate ==1){
          dataglobal = data;
          if (dataindex <=0) dataindex=7;
          else dataindex--;
          playexam(data , dataindex);
          console.log(`${data} ${dataindex}`)
      }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
// 按鈕二：播放/停止
$('#showDataButton').click(async function() {
    fetch('../json/practice_data.json')
    .then(response => response.json()) 
    .then(data => {
        dataglobal = data;
        dataindex=0;
        if (btnstate ==0) 
          {
            button2.innerHTML = newSvg;
            btnstate =1;
            playexam(data , dataindex);
          }
        else
        {
          button2.innerHTML = orgSvg;
            btnstate =0;
            stopexam();
        }
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
// 按鈕三：下一個
$('#rightButton').click(async function() {
    fetch('../json/practice_data.json')
    .then(response => response.json()) 
    .then(data => {
      if (btnstate ==1){
        dataglobal = data;
        if (dataindex >=7) dataindex=0;
        else dataindex++;
        playexam(data , dataindex);
        console.log(`${data} ${dataindex}`)
      }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

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
  nowexam=data["Descending"][index];
  };
}
function updateImage(selectedValue){
  var image = document.getElementById('Image');
  var abc =`M: 4/4\n`+`L: 1/2\n`+`K: C\n`;
  var sheetlst
  dataindex = 0
  stopexam()
  button2.innerHTML = orgSvg;
  btnstate =0;
  // 根據選擇的值更新圖片路徑
  if (selectedValue === 'Rule of Octave Ascending') {
    console.log(selectedKey)
    //image.src = `Ascending/Ascending${selectedKey}.jpg`;

    fetch('../json/sheets.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            sheetlst = result;

    lst = sheetlst["Ascending"][selectedKey];
    abc+=`"5\\n3"[${lst[0]}]"6\\n3"[${lst[1]}]|"6\\n3"[${lst[2]}]"6\\n3"[${lst[3]}]|"5\\n3"[${lst[4]}]"6\\n3"[${lst[5]}]|"6\\n3"[${lst[6]}]"5\\n3"[${lst[7]}]:|`;
    ABCJS.renderAbc("paper", abc);
    console.log(abc)
    });

    
  } else if (selectedValue === 'Rule of Octave Descending') {
    image.src = `Descending/Descending${selectedKey}.jpg`;
    fetch('../json/sheets.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            sheetlst = result;
            lst = sheetlst["Descending"][selectedKey];
            console.log(lst)
            abc+=`"5\\n3"[${lst[0]}]"6\\n3"[${lst[1]}]|"6#\\n3"[${lst[2]}]"5\\n3"[${lst[3]}]|"6\\n3"[${lst[4]}]"6\\n3"[${lst[5]}]|"6\\n3"[${lst[6]}]"5\\n3"[${lst[7]}]:|`;
            ABCJS.renderAbc("paper", abc);
            console.log(abc)
        });
  }
}