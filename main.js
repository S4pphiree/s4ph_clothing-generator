var generatedName = "";
var colorCounter = 0;

function toggleForm() {
    const select = document.getElementById('itemSelect');
    const handsForm = document.getElementById('handsForm');
    handsForm.classList.toggle('hidden', select.value !== 'hands');
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

function updateColorOrder() {
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach((item, index) => {
        const colorInput = item.querySelector('input[type="text"]');
        colorInput.name = `color_${index}`;
        const colorLabel = item.querySelector('label');
        colorLabel.textContent = `Colore ${index + 1}:`;
    });
}

function generateJSON() {
    const gender = document.getElementById('gender').value;
    const item = document.getElementById('itemSelect').value;
    const label = document.getElementById('itemLabel').value;

    const colorItems = document.querySelectorAll('.color-item input[type="text"]');
    let colours = {};
    colorItems.forEach((colorInput, index) => {
        if (colorInput.value.trim() !== '') {
            colours[`[${index}]`] = "'" + colorInput.value.trim() + "'";
        }
    });

    const torsoTypeItems = document.querySelectorAll('.torso-type-item select');
    let torsoTypes = {};
    torsoTypeItems.forEach((torsoTypeSelect) => {
        if (torsoTypeSelect.value.trim() !== '') {
            const torsoType = torsoTypeSelect.value.trim();
            const torsoNumberInput = torsoTypeSelect.nextElementSibling; // Ottieni l'input del numero del modello
            const torsoTypeModel = parseInt(torsoNumberInput.value); // Converti il valore in un numero intero
            torsoTypes[`['${torsoType}']`] = {
                model: torsoTypeModel
            };
        }
    });

    let jsonOutput = {};
    jsonOutput['[\'' + generateName().toLowerCase().replace(/ /g, '') + '\']'] = {
        label: label,
        colours: colours,
        torsoTypes: torsoTypes
    };

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

function addTorsoType() {
    const torsoTypesContainer = document.getElementById('torsoTypesContainer');

    const torsoTypeItem = document.createElement('div');
    torsoTypeItem.classList.add('torso-type-item');

    //const torsoTypeLabel = document.createElement('label');
    //torsoTypeLabel.textContent = 'Torsotype:';

    const torsoTypeSelect = document.createElement('select');
    torsoTypeSelect.name = 'torsoTypes';

    const torsoTypeOptions = {
        'Mezze Braccia': 'halfarms',
        'Mani e Mezzo Collo': 'handsonlyhalfneck',
        'Braccia Complete': 'fullarms',
        'Nessuno': 'none',
        'Solo Mani': 'handsonly',
        'Braccia Complete fino al Torso': 'fullarmstoptorso',
        'Solo Mani e Collo Inter': 'handsonlyfullneck',
        'Avambracci': 'forearms',
        'Avambracci e Collo': 'forearmsbitneck',
        'Mani e Collo': 'handsbitneck',
        'Torso e Mani': 'torsohandsonly',
        'Corpo Intero': 'fullbody'
    };

    Object.entries(torsoTypeOptions).forEach(([label, value]) => {
        const optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.textContent = label + ' - ' + value;
        torsoTypeSelect.appendChild(optionElement);
    });

    const torsoNumberInput = document.createElement('input');
    torsoNumberInput.type = 'number';
    torsoNumberInput.value = 0;
    torsoNumberInput.style.width = '60px';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '❌';
    removeBtn.classList.add('remove-item-btn');
    removeBtn.onclick = function() {
        torsoTypesContainer.removeChild(torsoTypeItem);
    };

    //torsoTypeItem.appendChild(torsoTypeLabel);
    torsoTypeItem.appendChild(torsoTypeSelect);
    //torsoTypeItem.appendChild(document.createTextNode(' Numero: '));
    torsoTypeItem.appendChild(torsoNumberInput);
    torsoTypeItem.appendChild(removeBtn);
    torsoTypesContainer.appendChild(torsoTypeItem);
}

function addColor() {
    const colorVariantsContainer = document.getElementById('colorVariantsContainer');

    const colorItem = document.createElement('div');
    colorItem.classList.add('color-item');

    //const colorLabel = document.createElement('label');
    //colorLabel.textContent = 'Colore:';

    const colorInput = document.createElement('input');
    colorInput.type = 'text';
    colorInput.placeholder = 'Inserisci il colore...';
    colorInput.required = true;

    const colorNumberInput = document.createElement('input');
    colorNumberInput.type = 'number';
    colorNumberInput.min = 0;
    colorNumberInput.value = colorCounter;
    colorNumberInput.style.width = '60px';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '❌';
    removeBtn.classList.add('remove-item-btn');
    removeBtn.onclick = function() {
        colorVariantsContainer.removeChild(colorItem);
    };

    //colorItem.appendChild(colorLabel);
    colorItem.appendChild(colorInput);
    //colorItem.appendChild(document.createTextNode(' Numero: '));
    colorItem.appendChild(colorNumberInput);
    colorItem.appendChild(removeBtn);
    colorVariantsContainer.appendChild(colorItem);

    colorCounter++;
}
