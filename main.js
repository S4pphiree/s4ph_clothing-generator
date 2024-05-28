var generatedName = "";

function toggleForm() {
    const select = document.getElementById('itemSelect');

    const handsForm = document.getElementById('handsForm');
    const accessoriesForm = document.getElementById('accessoriesForm');
    const topsForm = document.getElementById('topsForm');
    
    handsForm.classList.toggle('hidden', select.value !== 'hands');
    accessoriesForm.classList.toggle('hidden', select.value !== 'accessories');
    topsForm.classList.toggle('hidden', select.value !== 'tops');
}

function toggleVariant() {
    const select = document.getElementById('variantBoolSelect');

    const variantContainer = document.getElementById('variantContainer');
    
    variantContainer.classList.toggle('hidden', select.value !== 'true');
}

function copyJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    const range = document.createRange();
    
    range.selectNode(jsonOutput);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');

    window.getSelection().removeAllRanges();

    document.getElementById('copyButton').textContent = "JSON Copiato!";7
    document.getElementById('copyButton').style.backgroundColor = 'green';

    setTimeout(() => {
        document.getElementById('copyButton').textContent = "Copia JSON";
        document.getElementById('copyButton').style.backgroundColor = '#007bff';

    }, 2000);
        
}

function generateJSON() {
    const item = document.getElementById('itemSelect').value;
    const model = document.getElementById('itemModel').value;
    const label = document.getElementById('itemLabel').value;

    let jsonOutput = {};
    let outputName = '[\'' + generateName().toLowerCase().replace(/ /g, '') + '\']'
    
    jsonOutput[outputName] = {
        label: label,
        model: model,
        colours: GetNumberedObject('colours'),
    };

    switch(item) {
        case 'hands': {
            jsonOutput[outputName].torsoTypes = GetSelectBoxObject('torsoTypes', 'model');
            break;
        }
        case 'accessories': {
            jsonOutput[outputName].accessoryTypes = GetSelectBoxObject('accessoryTypes', 'model');
            break;
        }
        case 'tops': {
            jsonOutput[outputName].canBeUndershirt = document.getElementById('undershirtBoolSelect').value;
            jsonOutput[outputName].undershirtWhitelist = GetTextBoxObject('undershirtWhitelist', 'torsotype')

            jsonOutput[outputName].accessoryLengthWhitelist = document.getElementById('accessoryLengthSelect').value;
            jsonOutput[outputName].hasVariant = document.getElementById('variantBoolSelect').value;
            if (jsonOutput[outputName].hasVariant == true)
                {
                    jsonOutput[outputName].variantModel = document.getElementById('variantModelText').value;
                    jsonOutput[outputName].variantAccessoryLengthWhitelist = document.getElementById('variantAccessoryLengthSelect').value;
                }
            break;
        }
    }

    var jsonResult = JSON.stringify(jsonOutput, null, 4);
    jsonResult = jsonResult.replace(/:/g, " =")
    document.getElementById('jsonOutput').innerText = jsonResult.replace(/"/g, ""); // Rimuovi i doppi apici
    document.getElementById('copyButton').style.backgroundColor = '#007bff';
}

function generateName() {
    const gender = document.getElementById('gender').value;
    const item = document.getElementById('itemSelect').value;
    const label = document.getElementById('itemName').value || document.getElementById('itemLabel').value.toLowerCase().replace(/ /g, '');
    generatedName = `${gender}_${item}_`;
    
    document.getElementById('itemInfoName').value = generatedName;
    document.getElementById('itemName').value = label;

    return generatedName + label;
}

function GetNumberedObject(name) {
    const arrayItems = document.querySelectorAll('#' + name + '-item input[type="text"]');
    let items = {};
    arrayItems.forEach((numberInput, index) => {
        if (numberInput.value.trim() !== '') {
            items[`[${index}]`] = "'" + numberInput.value.trim() + "'";
        }
    });

    return items;
}

function GetTextBoxObject(name, childName) {
    const arrayItems = document.querySelectorAll('#' + name + '-item input[type="text"]');
    let items = {};
    
    arrayItems.forEach((array) => {
        if (array.value.trim() !== '') {
            const arrayItem = array.value.trim();
            const arrayNumberInput = array.nextElementSibling; // Ottieni l'input del numero del modello
            const arrayModel = parseInt(arrayNumberInput.value); // Converti il valore in un numero intero
            
            items[`['${arrayItem}']`] = {
                [childName]: arrayModel
            };
        }
    });

    return items;
}

function GetSelectBoxObject(name, childName) {
    const selectBoxItems = document.querySelectorAll('#' + name + '-item select');
    let selectBox = {};
    
    selectBoxItems.forEach((select) => {
        if (select.value.trim() !== '') {
            const selectItem = select.value.trim();
            const selectNumberInput = select.nextElementSibling; // Ottieni l'input del numero del modello
            const selectModel = parseInt(selectNumberInput.value); // Converti il valore in un numero intero
            
            selectBox[`['${selectItem}']`] = {
                [childName]: selectModel
            };
        }
    });

    return selectBox;
}

function CreateObjectArray(container, name, type, options) {
    const objectContainer = document.getElementById(container);

    const objectArrayItem = document.createElement('div');
    objectArrayItem.classList.add('item');
    objectArrayItem.setAttribute('id', `${name}-item`);

    switch (type) {
        case('select'): {
            const objectArraySelect = document.createElement('select');
            objectArraySelect.name = name;

            const objectArraySelectOptions = options;

            Object.entries(objectArraySelectOptions).forEach(([label, value]) => {
                const optionElement = document.createElement('option');
                optionElement.value = value;
                optionElement.textContent = `${label}-${value}`;
                objectArraySelect.appendChild(optionElement);
            });

            const objectArrayInput = document.createElement('input');
            objectArrayInput.type = 'number';
            objectArrayInput.value = 0;
            objectArrayInput.title = `ID ${name}`;
            objectArrayInput.style.width = '60px';

            objectArrayItem.appendChild(objectArraySelect);
            objectArrayItem.appendChild(objectArrayInput);
            
            break;
        }     
        case('number'): {
            const objectArrayInput = document.createElement('input');
            objectArrayInput.type = 'text';
            objectArrayInput.placeholder = `Inserisci ${name}`;
            objectArrayInput.title = `Nome ${name}`;
            objectArrayInput.required = true;

            const objectArrayChildInput = document.createElement('input');
            objectArrayChildInput.type = 'number';
            objectArrayChildInput.min = 0;
            objectArrayChildInput.value = 0;
            objectArrayChildInput.title = "ID Child"
            objectArrayChildInput.style.width = '60px';

            objectArrayItem.appendChild(objectArrayInput);
            objectArrayItem.appendChild(objectArrayChildInput);

            break;
        }
        case('text'): {
            const objectArrayInput = document.createElement('input');
            objectArrayInput.type = 'text';
            objectArrayInput.value = `${document.getElementById('gender').value}_${document.getElementById('itemSelect').value}_`;
            objectArrayInput.title = `Nome Oggetto ${name}`;
            objectArrayInput.required = true;
        
            const objectArrayChildInput = document.createElement('input');
            objectArrayChildInput.type = 'number';
            objectArrayChildInput.min = 0;
            objectArrayChildInput.value = 0;
            objectArrayChildInput.title = "ID Child"
            objectArrayChildInput.style.width = '60px';

            objectArrayItem.appendChild(objectArrayInput);
            objectArrayItem.appendChild(objectArrayChildInput);

            break;
        }
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

function ClearForm() {
    document.querySelectorAll('[id$="-item"]').forEach(e => e.remove());

    document.getElementById('itemSelect').value = 'hats';

    document.getElementById('jsonOutput').innerText = '';
    
    toggleForm();
}



