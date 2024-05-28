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