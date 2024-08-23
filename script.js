let participants = [];    // name array
let displayNames = [];    // name array (without reprtition)

// upload the file
document.getElementById('upload-button').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const fileContent = event.target.result;
                texts = fileContent.split('\n').map(name => name.trim()).filter(name => name.length > 0);
                texts.forEach(text => {
                    const item = {
                        'name': text.split(" ")[0],
                        'comment': text.split(" ").slice(1).join(" ")
                    };

                    const pattern = /@\w+/g;
                    const matches = item.comment.match(pattern);
                    const atLeastTwoMentions = matches && matches.length >= 2;

                    if (atLeastTwoMentions) {
                        participants.push(item);
                    }
                });

                const names = participants.map(item => item.name);
                displayNames = Array.from(new Set(names));    // get the unique name list
                updateNameList();                             // update the name list
                alert('名單已成功上傳');
            } catch (error) {
                alert('讀取文件時出錯');
            }
        };
        
        reader.onerror = function() {
            alert('文件讀取失敗');
        };
        
        reader.readAsText(file);
    } else {
        alert('請選擇一個文件');
    }
});

// start the lucky draw
document.getElementById('spin-button').addEventListener('click', () => {
    if (participants.length === 0) {
        alert('名單為空，請上傳參加者名單');
        return;
    }
    
    let numWinners = parseInt(document.getElementById('num-winners').value, 10);

    if (isNaN(numWinners) || numWinners < 1) {
        numWinners = 1;
    }
    
    if (numWinners > participants.length) {
        alert('抽獎人數不能大於參加者人數');
        return;
    }
    
    const slot = document.getElementById('slot');
    const resultDiv = document.getElementById('result');
    
    // get winner(s)
    let winners = [];
    
    function getWinners() {
        winners = [];
        while (winners.length < numWinners) {
            const randomIndex = Math.floor(Math.random() * participants.length);
            const winner = participants[randomIndex];
            if (!winners.some(item => item.name === winner.name)) {
                winners.push(winner);
            }
        }
    }

    getWinners();

    const maxCount = 50;    // times for randomly display names
    const interval = 30;    // interval between every displays (in ms)
    resultDiv.textContent = '';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function changeName() {
        for (let currentWinnerIndex = 0; currentWinnerIndex < numWinners; currentWinnerIndex++) {
            // randomly show participants
            for (let count = 0; count < maxCount; count++) {
                const randomIndex = Math.floor(Math.random() * displayNames.length);
                slot.textContent = displayNames[randomIndex];
                await sleep(interval);
            }

            // show the winner's name
            const winner = winners[currentWinnerIndex];
            if (winner) {
                slot.textContent = winner.name;
                const showText = winner.name + " " + winner.comment;
                resultDiv.textContent = resultDiv.textContent + "\n" + `第 ${currentWinnerIndex + 1} 位中獎者: ${showText}`;
                resultDiv.classList.remove('hidden');
            } else {
                alert('抽獎結果出錯，無法顯示中獎者。');
            }

            await sleep(2000);
        }
    }

    changeName();     // start lucky draw
});

// update the participants list
function updateNameList() {
    const nameList = document.getElementById('name-list');
    nameList.innerHTML = '';    // clear the name list
    
    participants.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name + "\n" + item.comment;
        nameList.appendChild(li);
    });
}
