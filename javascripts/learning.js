let currentQuestionIndex = 0;
let correctAnswers = 0;

$('input[name="value-radio"]').change(function() {
    console.log($(this).val() );
    if ($(this).val() == 'Documents') {
        $('#teaching-text').show();
        $('#quiz-area').hide();
    } else {
        $('#teaching-text').hide();
        $('#quiz-area').show();
        reloadquiz();
    }
});

function reloadquiz(){
    currentQuestionIndex = 0;
    correctAnswers = 0;
    updateProgress();
    loadQuestion();
}
function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
}
// 初始化一些問題
let questions = [
    {
        img: 'M: 4/4\nL: 1/2\nK: G\n"6\\n3"[C]|',
        question: "What notes is this chord?",
        options: ["D E G", "C E G", "C E A", "C D G"],
        answer: "C E A"
    },
    {
        img: 'M: 4/4\nL: 1/2\nK: Bb\n"6#\\n3"[G]|',
        question: "What notes is this chord?",
        options: ["G B D", "G Bb E", "G B D", "G Bb Eb"],
        answer: "G Bb E"
    },
    {
        img: 'M: 4/4\nL: 1/2\nK: E\nV:RH\n[GBe]|\nV:LH clef=bass\nG,',
        question: 'Which number notation is correct?',
        options: ["8 3 5", "3 6 8", "8 3 6", "3 5 8"],
        answer: "8 3 6"
    }
];

$('#submit-answer').on('click', function() {
    let selectedAnswer = $('.option-button.active').data('answer'); // 獲取選擇的答案
    if (selectedAnswer) {
        if (selectedAnswer === questions[currentQuestionIndex].answer) {
            correctAnswers++;
            Swal.fire({
                icon: 'success',
                title: '正確!',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '錯誤!',
                text: '正確答案是 ' + questions[currentQuestionIndex].answer,
                showConfirmButton: true
            });
        }
    // 更新進度
        currentQuestionIndex++;
        updateProgress();

        // 加載下一個問題
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            Swal.fire({
                title: '恭喜！',
                text: `你已完成 ${questions.length} 道題目，答對了 ${correctAnswers} 題！`,
                icon: 'success',
                confirmButtonText: '完成'
            });
        }

        // 清空輸入框
        $('.option-button').removeClass('active');
        //$('#user-answer').val('');
    }
});

// 啟動時顯示第一個問題
$(document).ready(function() {
    loadQuestion();
    $('#quiz-area').hide();
    $('#teaching-text').hide();
});

// 加載當前問題
function loadQuestion() {
    ABCJS.renderAbc("quiz-img", questions[currentQuestionIndex].img);
    $('#question-area').text(questions[currentQuestionIndex].question);
    $('#answer-area').empty(); // 清空答案區域

        // 動態生成選項按鈕
        questions[currentQuestionIndex].options.forEach(option => {
            $('#answer-area').append(`
                <button class="btn btn-secondary option-button text-center" data-answer="${option}">${option}</button><br/><br/>
            `);
        });

        // 設置按鈕點擊事件
        $('.option-button').on('click', function() {
            const selectedAnswer = $(this).data('answer'); // 獲取選擇的答案
            if (selectedAnswer) {
                if (selectedAnswer === questions[currentQuestionIndex].answer) {
                    correctAnswers++;
                    Swal.fire({
                        icon: 'success',
                        title: 'Correct!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Wrong!',
                        text: 'Correct answer is ' + questions[currentQuestionIndex].answer,
                        showConfirmButton: true
                    });
                }
        
                // 更新進度
                currentQuestionIndex++;
                updateProgress();
        
                // 加載下一個問題
                if (currentQuestionIndex < questions.length) {
                    loadQuestion();
                } else {
                    $('#answer-area').empty();
                    $('#quiz-img').empty();
                    $('#question-area').text(`你已完成 ${questions.length} 道題目，答對了 ${correctAnswers} 題！`);
                    $('#answer-area').append(`
                        <button class="btn btn-secondary option-button text-center" onClick="reloadquiz()">重新測驗</button><br/><br/>
                    `);
                    /*
                    Swal.fire({
                        title: '恭喜！',
                        text: `你已完成 ${questions.length} 道題目，答對了 ${correctAnswers} 題！`,
                        icon: 'success',
                        confirmButtonText: '完成'
                    });*/
                }
        
                // 清除選擇
                $('.option-button').removeClass('active');
            }
        });

        $('#quiz-area').show(); // 顯示題目區域
}

// 更新進度條
function updateProgress() {
    let progress = (currentQuestionIndex / questions.length) * 100;
    $('#progress-bar').css('width', progress + '%');
}