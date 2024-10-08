const addLanguageButton = document.getElementById('add-language-button');

addLanguageButton.addEventListener('click', () => {
    const languageNameInput = document.getElementById('new-language-name');
    const languageLogoInput = document.getElementById('new-language-logo');
    
    const languageName = languageNameInput.value.trim();
    const languageLogoFile = languageLogoInput.files[0];

    if (!languageName || !languageLogoFile) {
        alert("Please provide both a name and a logo for the language.");
        return;
    }

    // Create a new FileReader to read the uploaded image
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.alt = languageName;
        img.title = languageName;
        img.className = 'language-logo';
        img.draggable = true;
        img.id = `lang-${languageName.toLowerCase().replace(/\s+/g, '-')}`;
        img.addEventListener('dragstart', drag);
        
        // Add the new language to the language pool
        languagePool.appendChild(img);
        
        // Clear the input fields
        languageNameInput.value = '';
        languageLogoInput.value = '';
        
        updateFinishButton();
    };

    // Read the image file
    reader.readAsDataURL(languageLogoFile);
});


const languages = [
    { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'C++', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'Ruby', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
    { name: 'PHP', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { name: 'Swift', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
    { name: 'Go', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    { name: 'Rust', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg' },
    { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' }
];


const languagePool = document.getElementById('language-pool');
const finishButton = document.getElementById('finish-button');
let currentTier = null;

languages.forEach(language => {
    const img = document.createElement('img');
    img.src = language.logo;
    img.alt = language.name;
    img.title = language.name;
    img.className = 'language-logo';
    img.draggable = true;
    img.id = `lang-${language.name.toLowerCase()}`;
    img.addEventListener('dragstart', drag);
    languagePool.appendChild(img);
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropZone = ev.target.closest('.tier-content') || languagePool;
    dropZone.appendChild(draggedElement);
    updateFinishButton();
}

function updateFinishButton() {
    // Verificar si todos los lenguajes han sido arrastrados fuera del 'language-pool'
    const unplacedLanguages = document.querySelectorAll('#language-pool .language-logo');
    
    // Habilitar o deshabilitar el botón según el estado
    finishButton.disabled = unplacedLanguages.length > 0;
}

function finishTierList() {
    // Verificar si todos los lenguajes están en algún tier
    const unplacedLanguages = document.querySelectorAll('#language-pool .language-logo');
    if (unplacedLanguages.length > 0) {
        return; // Salir si aún hay lenguajes sin colocar
    }

    // Mostrar el contenido del modal con los lenguajes clasificados
    const modal = document.getElementById('share-modal');
    const tierListText = document.getElementById('tier-list-text');
    tierListText.innerHTML = '';

    const tiers = document.querySelectorAll('.tier');
    tiers.forEach(tier => {
        const tierLabel = tier.querySelector('.tier-label').textContent;
        const languages = tier.querySelectorAll('.language-logo');
        if (languages.length > 0) {
            const tierContent = `<p><strong>Tier ${tierLabel}:</strong> ${Array.from(languages).map(lang => lang.title).join(', ')}</p>`;
            tierListText.innerHTML += tierContent;
        }
    });

    modal.style.display = 'block'; // Mostrar el modal
}

// Asignar el evento de clic al botón 'Finish'
finishButton.addEventListener('click', finishTierList);


function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function shareToSocialMedia(platform) {
    const tierListText = document.getElementById('tier-list-text').innerText;
    const encodedText = encodeURIComponent(`Check out my Programming Language Tier List:\n\n${tierListText}`);
    let url;

    switch (platform) {
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodedText}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`;
            break;
        case 'linkedin':
            url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=My Programming Language Tier List&summary=${encodedText}`;
            break;
    }

    window.open(url, '_blank');
}

function openColorPicker(tier) {
    currentTier = tier;
    const modal = document.getElementById('color-picker-modal');
    modal.style.display = 'block';
}

function applyColor() {
    const color = document.getElementById('color-picker').value;
    const tierLabelElement = document.querySelector(`.tier[data-tier="${currentTier}"] .tier-label`);
    tierLabelElement.style.backgroundColor = color;
    closeModal('color-picker-modal');
}


// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Initialize the finish button state
updateFinishButton();
