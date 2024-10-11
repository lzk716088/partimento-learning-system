
$('#toggleSwitch').on('change', function() {
    if ($(this).is(':checked')) {
        $('#teaching-text').show();
        $('#quiz-area').hide();
    } else {
        $('#teaching-text').hide();
        $('#quiz-area').show();
    }
});
$('input[name="value-radio"]').change(function() {
    console.log($(this).val() );
    if ($(this).val() == 'Documents') {
        $('#teaching-text').show();
        $('#quiz-area').hide();
    } else {
        $('#teaching-text').hide();
        $('#quiz-area').show();
    }
});

// 初始化一些問題
let questions = [
    {
        question: "C大調的主和弦是什麼？",
        answer: "C"
    },
    {
        question: "F大調的屬和弦是什麼？",
        answer: "C"
    },
    {
        question: "G大調的下屬和弦是什麼？",
        answer: "C"
    }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;

// 啟動時顯示第一個問題
$(document).ready(function() {
    loadQuestion();

    $('#submit-answer').on('click', function() {
        let userAnswer = $('#user-answer').val().trim();

        if (userAnswer === questions[currentQuestionIndex].answer) {
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
        $('#user-answer').val('');
    });
});

// 加載當前問題
function loadQuestion() {
    $('#question-area').text(questions[currentQuestionIndex].question);
}

// 更新進度條
function updateProgress() {
    let progress = (currentQuestionIndex / questions.length) * 100;
    $('#progress-bar').css('width', progress + '%');
}