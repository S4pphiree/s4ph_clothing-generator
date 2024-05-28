var generatedName = "";

function generateName() {
    const gender = document.getElementById('gender').value;
    const item = document.getElementById('itemSelect').value;
    const label = document.getElementById('itemName').value || document.getElementById('itemLabel').value.toLowerCase().replace(/ /g, '');
    generatedName = `${gender}_${item}_`;
    
    document.getElementById('itemInfoName').value = generatedName;
    document.getElementById('itemName').value = label;

    return generatedName + label;
}

function GetObjectInfo(type, name, childName) {
    const array = {};

    const getItemValue = (item) => item.value.trim();

    const arrayItems = document.querySelectorAll(`#${name}-item`);

    arrayItems.forEach((item) => {
        const inputText = item.querySelector('input[type="text"]');
        if (inputText)
            var inputValue = getItemValue(inputText);

        const inputNumber = item.querySelector('input[type="number"]');
        if (inputNumber)
            var inputNumberParsedValue = parseInt(inputNumber.value);

        if (inputValue !== '') {
            let key;
            let value;

            switch (type) {
                case 'select':
                    var selectValue = item.querySelector('select').value.trim();
                    key = `['${selectValue}']`;
                    value = { [childName]: inputNumberParsedValue };
                    break;
                case 'text':
                    key = `['${inputValue}']`;
                    value = { [childName]: inputNumberParsedValue };
                    break;
                case 'number':
                    key = `[${inputNumberParsedValue}]`;
                    value = inputValue;
                    break;
                case 'textSelect':
                    var selectValue = item.querySelector('select').value.trim();
                    key = `['${inputValue}']`;
                    value = { [childName]: `'${selectValue}'` };
                    break;
            }

            array[key] = value;
        }
    });

    return array;
}

function CreateObjectArray(container, name, type, options) {
    const objectContainer = document.getElementById(container);
    const objectArrayItem = document.createElement('div');
    objectArrayItem.classList.add('item');
    objectArrayItem.setAttribute('id', `${name}-item`);

    switch (type) {
        case 'select':
            createSelectElement(objectArrayItem, name, options);
            createNumberInput(objectArrayItem, name);
            break;
        case 'number':
            createTextInput(objectArrayItem, name, true);
            createNumberInput(objectArrayItem, name);
            break;
        case 'text':
            createTextInput(objectArrayItem, name, false);
            createNumberInput(objectArrayItem, name);
            break;
        case 'textSelect':
            const presetValue = `${document.getElementById('gender').value}_${document.getElementById('itemSelect').value}_`;
            createTextInput(objectArrayItem, name, true, true, presetValue);
            createSelectElement(objectArrayItem, name, options);
            break;
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.classList.add('remove-item-btn');
    removeBtn.onclick = function() {
        objectContainer.removeChild(objectArrayItem);
    };

    objectArrayItem.appendChild(removeBtn);
    objectContainer.appendChild(objectArrayItem);
}

function createSelectElement(parent, name, options) {
    const objectArraySelect = document.createElement('select');
    objectArraySelect.name = name;

    Object.entries(options).forEach(([label, value]) => {
        const optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.textContent = `${label} - ${value}`;
        objectArraySelect.appendChild(optionElement);
    });

    parent.appendChild(objectArraySelect);
}

function createTextInput(parent, name, required = false, wide = false, presetValue = "") {
    const objectArrayInput = document.createElement('input');
    objectArrayInput.type = 'text';
    objectArrayInput.placeholder = `Inserisci ${name}`;
    objectArrayInput.title = `Nome ${name}`;
    objectArrayInput.value = presetValue;
    if (required) {
        objectArrayInput.required = true;
    }
    if (wide) {
        objectArrayInput.style.width = '300px';
    }
    parent.appendChild(objectArrayInput);
}

function createNumberInput(parent, name) {
    const objectArrayChildInput = document.createElement('input');
    objectArrayChildInput.type = 'number';
    objectArrayChildInput.min = 0;
    objectArrayChildInput.value = 0;
    objectArrayChildInput.title = "ID Child"
    objectArrayChildInput.style.width = '60px';
    parent.appendChild(objectArrayChildInput);
}





