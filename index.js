const runApp = () => {

    let clickCounter = localStorage.getItem('CLICKS');

    const colorChanger = document.getElementById('color');
    const mainButton = document.querySelector('.btn-main');

    const counterField = document.createElement('span');
    counterField.classList.add('clicker__footer_info-counter');
    counterField.textContent = clickCounter;

    const counterAdder = document.getElementById('counter');

    setDefaultColor();
    addColorChangerListener();
    addCounterAdderListener();
    addResetButtonListener();
    addMainButtonListener();

    //Обработка выбора цвета кнопки
    function addColorChangerListener() {
        colorChanger.addEventListener('change', () => {
            const selectedColor = document.getElementById('color').value;
            setButtonColor(selectedColor);
            localStorage.setItem('COLOR', selectedColor);
        })
    }

    //Обработка чекбокса с добавление счетчика
    function addCounterAdderListener() {
        const footerField = document.querySelector('.clicker__footer_info');
        counterAdder.addEventListener('change', () => {
            if (counterAdder.checked) {
                if (!footerField.contains(counterField)) {
                    footerField.append(counterField);
                }
            } else {
                if (footerField.contains(counterField)) {
                    counterField.parentNode.removeChild(counterField);
                }
            }
        })
    }

    //Обработка нажатия кнопки сброса счетчика
    function addResetButtonListener() {
        const resetButton = document.querySelector('.btn-header');
        resetButton.addEventListener('click', () => {
            sendClicksToServer(clickCounter);
            clickCounter = 0;
            counterField.textContent = 0;
            localStorage.setItem('CLICKS', 0);
        })
    }

    //Обработка нажатия главной кнопки
    function addMainButtonListener() {
        const clickPromise = new Promise((resolve, reject) => {
            mainButton.addEventListener('click', () => {
                if (!counterAdder.checked) {
                    reject("Error: counter is switched off!");
                } else {
                    resolve("Success");
                }
            })
        })

        clickPromise
            .then(() => {
                counterField.textContent = (++clickCounter).toString();
                localStorage.setItem('CLICKS', clickCounter);
            })
            .catch((err) => alert(err))
            .finally(() => {
                addMainButtonListener()
            });
    }

    //Установка цвета кнопки из LocalStorage
    function setDefaultColor() {
        colorChanger.value = localStorage.getItem('COLOR');
        let defaultColor = colorChanger.value;
        setButtonColor(defaultColor);
    }

    //Установка цвета кнопки
    function setButtonColor(color) {
        if (color === "red") {
            mainButton.classList.remove(...mainButton.classList);
            mainButton.classList.add('btn-main', 'btn-main--red');
        } else if (color === "yellow") {
            mainButton.classList.remove(...mainButton.classList);
            mainButton.classList.add('btn-main', 'btn-main--yellow');
        } else if (color === "green") {
            mainButton.classList.remove(...mainButton.classList);
            mainButton.classList.add('btn-main', 'btn-main--green');
        }
    }

    //Отправка запроса на сервер (текущее количество кликов)
    function sendClicksToServer(clicksValue) {

        const objectContainsClicks = {
            clicks : clicksValue
        };

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objectContainsClicks)
        })
            .then((response) => {
                if (response.ok) {
                    alert(`Cleared ${clicksValue} clicks!`);
                } else {
                    throw new Error('Something is wrong');
                }
            })
            .catch((error) => {
                console.log(`Error: ${error}`)
            })
    }
}

export default runApp;