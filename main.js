var generatedName = "";

function toggleForm() {
    const select = document.getElementById('itemSelect');

    const handsForm = document.getElementById('handsForm');
    const accessoriesForm = document.getElementById('accessoriesForm');
    const topsForm = document.getElementById('topsForm');
    
    handsForm.classList.toggle('hidden', select.value !== 'hands');
    accessoriesForm.classList.toggle('hidden', select.value !== 'accessories');
    topsForm.classList.toggle('hidden', select.value !== 'tops');

    // Aggiungi eventuali altri form qui
}

function toggleVariant() {
    const select = document.getElementById('variantBoolSelect');

    const variantContainer = document.getElementById('variantContainer');
    
    variantContainer.classList.toggle('hidden', select.value !== 'true');

    // Aggiungi eventuali altri form qui
}

function copyJSON() {
    // Seleziona il contenuto del div jsonOutput
    const jsonOutput = document.getElementById('jsonOutput');
    const range = document.createRange();
    range.selectNode(jsonOutput);
    window.getSelection().removeAllRanges(); // Pulisce la selezione precedente
    window.getSelection().addRange(range);

    // Copia il testo selezionato negli appunti
    document.execCommand('copy');

    // Deseleziona il testo
    window.getSelection().removeAllRanges();

    // Visualizza un messaggio di conferma
    document.getElementById('copyButton').style.backgroundColor = 'green';
    //alert('JSON copiato negli appunti!');
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

function CreateSelectBoxObject(container, name, options) {
    const selectBoxContainer = document.getElementById(container);

    const selectBoxItem = document.createElement('div');
    selectBoxItem.classList.add('item');
    selectBoxItem.setAttribute('id', name +'-item');

    const selectBoxSelect = document.createElement('select');
    selectBoxSelect.name = name;

    const selectBoxOptions = options

    Object.entries(selectBoxOptions).forEach(([label, value]) => {
        const optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.textContent = label + ' - ' + value;
        selectBoxSelect.appendChild(optionElement);
    });

    const selectBoxInput = document.createElement('input');
    selectBoxInput.type = 'number';
    selectBoxInput.value = 0;
    selectBoxInput.title = `ID Modello`;
    selectBoxInput.style.width = '60px';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.classList.add('remove-item-btn');
    removeBtn.onclick = function() {
        selectBoxContainer.removeChild(selectBoxItem);
    };

    selectBoxItem.appendChild(selectBoxSelect);
    selectBoxItem.appendChild(selectBoxInput);
    selectBoxItem.appendChild(removeBtn);
    selectBoxContainer.appendChild(selectBoxItem);
}

function CreateNumberedObject(container, name) {
    const variantsContainer = document.getElementById(container);

    const variantItem = document.createElement('div');
    variantItem.classList.add('item');
    variantItem.setAttribute('id', name +'-item');

    const numberInput = document.createElement('input');
    numberInput.type = 'text';
    numberInput.placeholder = 'Inserisci ' + name;
    numberInput.title = `ID ${name}`;
    numberInput.required = true;

    const variantNumberInput = document.createElement('input');
    variantNumberInput.type = 'number';
    variantNumberInput.min = 0;
    variantNumberInput.value = 0;
    variantNumberInput.style.width = '60px';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.classList.add('remove-item-btn');
    removeBtn.onclick = function() {
        variantsContainer.removeChild(variantItem);
    };

    variantItem.appendChild(numberInput);
    variantItem.appendChild(variantNumberInput);
    variantItem.appendChild(removeBtn);
    variantsContainer.appendChild(variantItem);
}

function CreateTextBoxObject(container, name) {
    const variantsContainer = document.getElementById(container);

    const variantItem = document.createElement('div');
    variantItem.classList.add('item');
    variantItem.setAttribute('id', name +'-item');

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = `${document.getElementById('gender').value}_${document.getElementById('itemSelect').value}_`;
    textInput.title = "Nome Item";
    textInput.required = true;

    const childInput = document.createElement('input');
    childInput.type = 'number';
    childInput.min = 0;
    childInput.value = 0;
    childInput.title = "ID Tipo di Torso"
    childInput.style.width = '60px';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.classList.add('remove-item-btn');
    removeBtn.onclick = function() {
        variantsContainer.removeChild(variantItem);
    };

    
    variantItem.appendChild(textInput);
    variantItem.appendChild(childInput);
    variantItem.appendChild(removeBtn);
    variantsContainer.appendChild(variantItem);
}

function ClearForm() {
    document.querySelectorAll('[id$="-item"]').forEach(e => e.remove());

    document.getElementById('itemSelect').value = 'hats';

    document.getElementById('jsonOutput').innerText = '';
    
    toggleForm();
}

