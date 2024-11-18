// 設置按鈕
function updateImage(selectedValue){
  var image = document.getElementById('Image');
  var abc =`M: 4/4\n`+`L: 1/2\n`+`K: C\n`;
  var sheetlst
  dataindex = 0
  stopexam()
  $('#showDataButton').html(orgSvg);
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

function showButtons() {
    $('#buttonWarp').css('display','flex');
    //document.getElementById("buttonWarp").style.display = "flex";
}
$(document).ready(function() {
  $('input[name="value-radio"]').change(function() {
    showButtons();
    Scale = $(this).val();
    console.log("Selected Scale:", Scale);
    updateImage(Scale);
  });
});

var newSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 6h12v12H6z"/></svg>`;
var orgSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>`;
var btnstate=0;

// 選擇調性的按鈕
$('#selectkey').change(function(){
  selectedKey = selectKey.value;
    console.log("Key：" + selectedKey);
    updateImage(Scale);
    stopexam();
});
// 按鈕一：上一個

$('#leftButton').click(async function() {
  $('.abcjs-note_selected').removeClass('abcjs-note_selected');
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
  $('.abcjs-note_selected').removeClass('abcjs-note_selected');
    fetch('../json/practice_data.json')
    .then(response => response.json()) 
    .then(data => {
        dataglobal = data;
        dataindex=0;
        if (btnstate ==0) 
          {
            $('#showDataButton').html(newSvg);
            btnstate =1;
            playexam(data , dataindex);
          }
        else
        {
          $('#showDataButton').html(orgSvg);
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
  $('.abcjs-note_selected').removeClass('abcjs-note_selected');
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

