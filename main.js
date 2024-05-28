var generatedName = "";

function toggleForm() {
    const select = document.getElementById('itemSelect');

    const handsForm = document.getElementById('handsForm');
    const accessoriesForm = document.getElementById('accessoriesForm');
    const topsForm = document.getElementById('topsForm');
    const armorsForm = document.getElementById('armorsForm');
    
    handsForm.classList.toggle('hidden', select.value !== 'hands');
    accessoriesForm.classList.toggle('hidden', select.value !== 'accessories');
    topsForm.classList.toggle('hidden', select.value !== 'tops');
    armorsForm.classList.toggle('hidden', select.value !== 'armors');
}

function toggleVariant() {
    const select = document.getElementById('variantBoolSelect');

    const variantContainer = document.getElementById('variantContainer');
    
    variantContainer.classList.toggle('hidden', select.value !== 'true');
}

function ClearForm() {
    document.querySelectorAll('[id$="-item"]').forEach(e => e.remove());

    document.getElementById('itemSelect').value = 'hats';

    document.getElementById('jsonOutput').innerText = '';
    
    toggleForm();
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
    document.getElementById('jsonOutput').innerText = '';

    const item = document.getElementById('itemSelect').value;
    const model = document.getElementById('itemModel').value;
    const label = document.getElementById('itemLabel').value;

    let jsonOutput = {};
    let outputName = '[\'' + generateName().toLowerCase().replace(/ /g, '') + '\']'
    
    jsonOutput[outputName] = {
        label: label,
        model: model,
        colours: GetObjectInfo('number', 'colours'),
    };

    switch(item) {
        case 'hands': {
            jsonOutput[outputName].torsoTypes = GetObjectInfo('select', 'torsoTypes', 'model');
            
            break;
        }
        case 'accessories': {
            jsonOutput[outputName].accessoryTypes = GetObjectInfo('select', 'accessoryTypes', 'model');
            
            break;
        }
        case 'tops': {
            jsonOutput[outputName].canBeUndershirt = document.getElementById('undershirtBoolSelect').value;
            jsonOutput[outputName].undershirtWhitelist = GetObjectInfo('textSelect', 'undershirtWhitelist', 'torsotype')

            jsonOutput[outputName].accessoryLengthWhitelist = document.getElementById('accessoryLengthSelect').value;
            jsonOutput[outputName].hasVariant = document.getElementById('variantBoolSelect').value;
            if (jsonOutput[outputName].hasVariant == 'true')
                {
                    jsonOutput[outputName].variantModel = document.getElementById('variantModelText').value;
                    jsonOutput[outputName].variantAccessoryLengthWhitelist = document.getElementById('variantAccessoryLengthSelect').value;
                }
            
                break;
        }
        case 'armors': {
            jsonOutput[outputName].armorLevel = document.getElementById('armorLevelText').value;
            
            if (jsonOutput[outputName].armorLevel < 0)
                jsonOutput[outputName].armorLevel = 0
            else if (jsonOutput[outputName].armorLevel > 4)
                jsonOutput[outputName].armorLevel = 4
            
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

function GetObjectInfo(type, name, childName) {
    let array = {};

    switch(type) {
        case('select'): {
            const arrayItems = document.querySelectorAll(`#${name}-item select`);
            arrayItems.forEach((items) => {
                if (items.value.trim() !== '') {
                    const arrayItem = items.value.trim();
                    const arrayItemNumberInput = items.nextElementSibling; // Ottieni l'input del numero del modello
                    const arrayItemModelNumber = parseInt(arrayItemNumberInput.value); // Converti il valore in un numero intero
                    
                    array[`['${arrayItem}']`] = {
                        [childName]: arrayItemModelNumber
                    };
                }
            });
            return array;
        }
        case('number'): {
            const arrayItems = document.querySelectorAll(`#${name}-item input[type="text"]`);
            arrayItems.forEach((items) => {
                if (items.value.trim() !== '') {
                    const arrayItem = items.value.trim();
                    const arrayItemNumberInput = items.nextElementSibling; // Ottieni l'input del numero del modello
                    const arrayItemModelNumber = parseInt(arrayItemNumberInput.value); // Converti il valore in un numero intero
                    
                    array[`[${arrayItemModelNumber}]`] = arrayItem
                }
            });
            return array;
        }
        case('text'): {
            const arrayItems = document.querySelectorAll(`#${name}-item input[type="text"]`);
            arrayItems.forEach((items) => {
                if (items.value.trim() !== '') {
                    const arrayItem = items.value.trim();
                    const arrayItemNumberInput = items.nextElementSibling; // Ottieni l'input del numero del modello
                    const arrayItemModelNumber = parseInt(arrayItemNumberInput.value); // Converti il valore in un numero intero
                    
                    array[`['${arrayItem}']`] = {
                        [childName]: arrayItemModelNumber
                    };
                }
            });
            return array;
        }         
        case('textSelect'): {
            const arrayItems = document.querySelectorAll(`#${name}-item input[type="text"]`);
            arrayItems.forEach((items, index) => {
                if (items.value.trim() !== '') {
                    const arrayItem = items.value.trim();
                    const arrayItemNumberInput = items.nextElementSibling; // Ottieni l'input del numero del modello
                    const arrayItemModelNumber = parseInt(arrayItemNumberInput.value); // Converti il valore in un numero intero

                    const selectItems = document.querySelectorAll(`#${name}-item select`)
                    
                    array[`['${arrayItem}']`] = {
                        [childName]: `'${selectItems[index].value.trim()}'`
                    };
                }
            });
            return array;
        }    
    }
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
                optionElement.textContent = `${label} - ${value}`;
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
        case('textSelect'): {
            const objectArrayInput = document.createElement('input');
            objectArrayInput.type = 'text';
            objectArrayInput.value = `${document.getElementById('gender').value}_${document.getElementById('itemSelect').value}_`;
            objectArrayInput.title = `Nome Oggetto ${name}`;
            objectArrayInput.required = true;
            objectArrayInput.style.width = '300px';

            const objectArrayChildSelect = document.createElement('select');
            objectArrayChildSelect.name = name;
            objectArrayChildSelect.title = `Tipo ${name}`;
            objectArrayChildSelect.style.width = '300px';

            const objectArraySelectOptions = options;

            Object.entries(objectArraySelectOptions).forEach(([label, value]) => {
                const optionElement = document.createElement('option');
                optionElement.value = value;
                optionElement.textContent = `${label} - ${value}`;
                objectArrayChildSelect.appendChild(optionElement);
            });

            objectArrayItem.appendChild(objectArrayInput);
            objectArrayItem.appendChild(objectArrayChildSelect);

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




