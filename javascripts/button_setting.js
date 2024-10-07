// 設置按鈕

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

