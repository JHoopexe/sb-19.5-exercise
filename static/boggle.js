
let score = 0;
let plays = 0;
let highscore = document.querySelector("#highscore").innerText;
let words = []

$('form').on('submit', async function(e){
    e.preventDefault();

    const checkWord = $('input').val();
    if(words.includes(checkWord)){
        let form = document.querySelector("form");
        let result = document.createElement("p");
        result.setAttribute("id", "result");
        result.innerText = "already-used";
        form.append(result);
        $('input').val('');

        let resultTimer = setInterval(function(){
            let counter = 1;
            counter -= 1;
            
            if(counter == 0){
                clearInterval(resultTimer);
                $("#result").remove();
            }
        }, 1000);
    }
    else{
        words.push(checkWord);
        const word = {"word": checkWord.toLowerCase()}
        const response = await axios.post("/check_word", {"word": word});
        const result = response.data.result;
        
        if(result == "ok"){
            score += checkWord.length;
            $('#score').text(`${score}`);
            boggle_result(result);
            let resultTimer = setInterval(function(){
                let counter = 1;
                counter -= 1;
                
                if(counter == 0){
                    clearInterval(resultTimer);
                    $("#result").remove();
                }
            }, 1000);
        }
        else if(result == "not-on-board"){
            boggle_result(result);
            let resultTimer = setInterval(function(){
                let counter = 1;
                counter -= 1;
                
                if(counter == 0){
                    clearInterval(resultTimer);
                    $("#result").remove();
                }
            }, 1000);
        }
        else{
            boggle_result(result);
            let resultTimer = setInterval(function(){
                let counter = 1;
                counter -= 1;
                
                if(counter == 0){
                    clearInterval(resultTimer);
                    $("#result").remove();
                }
            }, 1000);
        }
        
        plays += 1;

        $('input').val('');
    }
});

let count = 60;
let timer = setInterval(function(){
    count -= 1;
    let p = $("#plays").text();

    $('#seconds').text(`${count}`);

    if(count < 1){
        clearInterval(timer);
        $('input').prop('disabled', true);

        if(score > highscore){
            newHighscore();
        }
        else if(score == highscore && plays < p){
            newHighscore();
        }
    }
}, 1000);

function boggle_result(r){
    let form = document.querySelector("form");
    let result = document.createElement("p");
    result.setAttribute("id", "result");
    result.innerText = r;
    form.append(result);
}

async function newHighscore(){
    const finalScore = {"score": score, "plays": plays}
    const response = await axios.post("/highscore", {"finalScore": finalScore});
    const result = response.data.highscore;
    $("#highscore").text(result.score);
    $("#plays").text(result.plays);
}
