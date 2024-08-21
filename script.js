// script.js
let names = []; // 存儲參加者名字的陣列

// 處理文件上傳
document.getElementById('upload-button').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const fileContent = event.target.result;
            names = fileContent.split('\n').map(name => name.trim()).filter(name => name.length > 0);
            updateNameList(); // 更新顯示的參加者名單
            alert('名單已成功上傳');
        };
        
        reader.readAsText(file);
    } else {
        alert('請選擇一個文件');
    }
});

// 開始抽獎
document.getElementById('spin-button').addEventListener('click', () => {
    if (names.length === 0) {
        alert('名單為空，請上傳參加者名單');
        return;
    }
    
    const slot = document.getElementById('slot');
    const resultDiv = document.getElementById('result');
    
    const finalIndex = Math.floor(Math.random() * names.length); // 隨機選擇最終中獎者
    const finalName = names[finalIndex];
    
    let count = 0;
    const maxCount = 30; // 隨機變更的次數
    const interval = 50; // 每次變更的間隔時間，單位為毫秒
    
    function changeName() {
        // 隨機選擇一個名字並顯示
        const randomIndex = Math.floor(Math.random() * names.length);
        slot.textContent = names[randomIndex];
        
        if (count < maxCount) {
            count++;
            setTimeout(changeName, interval); // 每 `interval` 毫秒變更一次
        } else {
            // 最終顯示中獎者
            slot.textContent = finalName;
            resultDiv.textContent = `中獎者是: ${finalName}`;
            resultDiv.classList.remove('hidden');
        }
    }

    changeName(); // 開始變更名字
});

// 更新參加者名單
function updateNameList() {
    const nameList = document.getElementById('name-list');
    nameList.innerHTML = ''; // 清空名單
    
    names.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        nameList.appendChild(li);
    });
}
