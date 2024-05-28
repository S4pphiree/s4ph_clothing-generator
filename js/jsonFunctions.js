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

    let outputName = `['${generateName().toLowerCase().replace(/ /g, '')}']`;

    jsonOutput[outputName] = {
        label: label,
        model: model,
        colours: GetObjectInfo('number', 'colours'),
    };

    switch(item) {
        case 'hands':
            jsonOutput[outputName].torsoTypes = GetObjectInfo('select', 'torsoTypes', 'model');
            break;
        case 'accessories':
            jsonOutput[outputName].accessoryTypes = GetObjectInfo('select', 'accessoryTypes', 'model');
            break;
        case 'tops':
            jsonOutput[outputName] = handleTops(jsonOutput[outputName]);
            break;
        case 'armors':
            jsonOutput[outputName] = handleArmors(jsonOutput[outputName]);
            break;
    }

    var jsonResult = JSON.stringify(jsonOutput, null, 4);
    jsonResult = jsonResult.replace(/:/g, " =");
    jsonResult = jsonResult.substring(6, jsonResult.length-1)
    jsonResult = jsonResult.replace( /^\s.*/, '   ' );

    document.getElementById('jsonOutput').innerText = jsonResult.replace(/"/g, ""); // Rimuovi i doppi apici
    document.getElementById('copyButton').style.backgroundColor = '#007bff';
}

function handleTops(output) {
    output.canBeUndershirt = document.getElementById('undershirtBoolSelect').value;
    output.undershirtWhitelist = GetObjectInfo('textSelect', 'undershirtWhitelist', 'torsotype');
    output.accessoryLengthWhitelist = document.getElementById('accessoryLengthSelect').value;
    output.hasVariant = document.getElementById('variantBoolSelect').value;
    
    if (output.hasVariant === 'true') {
        output.variantModel = document.getElementById('variantModelText').value;
        output.variantAccessoryLengthWhitelist = document.getElementById('variantAccessoryLengthSelect').value;
    }

    return output;
}

function handleArmors(output) {
    output.armorLevel = document.getElementById('armorLevelText').value;
    
    if (output.armorLevel < 0) {
        output.armorLevel = 0;
    } else if (output.armorLevel > 4) {
        output.armorLevel = 4;
    }

    return output;
}