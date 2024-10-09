function showAlert() {
    alert("Por favor arrastra todos los objetos a la Tier List\npara terminar");
}

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
    { name: 'JavaScript', logo: 'https://img.icons8.com/color/48/000000/javascript--v1.png' },
    { name: 'Python', logo: 'https://img.icons8.com/color/48/000000/python.png' },
    { name: 'Java', logo: 'https://img.icons8.com/color/48/000000/java-coffee-cup-logo.png' },
    { name: 'C++', logo: 'https://img.icons8.com/color/48/000000/c-plus-plus-logo.png' },
    { name: 'Ruby', logo: 'https://img.icons8.com/?size=100&id=22189&format=png&color=000000' },
    { name: 'PHP', logo: 'https://img.icons8.com/?size=100&id=YrKoPXb4jv9l&format=png&color=000000' },
    { name: 'Swift', logo: 'https://img.icons8.com/color/48/000000/swift.png' },
    { name: 'Go', logo: 'https://img.icons8.com/color/48/000000/golang.png' },
    { name: 'Rust', logo: 'https://img.icons8.com/?size=100&id=meGB5Ip7aLFG&format=png&color=000000' },
    { name: 'TypeScript', logo: 'https://img.icons8.com/color/48/000000/typescript.png' },
    { name: 'C', logo: 'https://img.icons8.com/color/48/000000/c-programming.png' },
    { name: 'Vue', logo: 'https://img.icons8.com/color/48/000000/vue-js.png' },
    { name: 'Node.js', logo: 'https://img.icons8.com/color/48/000000/nodejs.png' },
    { name: 'Dart', logo: 'https://img.icons8.com/color/48/000000/dart.png' },
    { name: 'Kotlin', logo: 'https://img.icons8.com/color/48/000000/kotlin.png' },
    { name: 'Scala', logo: 'https://img.icons8.com/?size=100&id=FIdVBOahSJu0&format=png&color=000000' },
    { name: 'Perl', logo: 'https://img.icons8.com/color/48/000000/perl.png' },
    { name: 'Haskell', logo: 'https://img.icons8.com/color/48/000000/haskell.png' },
    { name: 'Lua', logo: 'https://img.icons8.com/?size=100&id=42bqS7y7Ga9o&format=png&color=000000' },
    { name: 'C#', logo: 'https://img.icons8.com/?size=100&id=55251&format=png&color=000000' },
    { name: 'Shell', logo: 'https://img.icons8.com/?size=100&id=9MJf0ngDwS8z&format=png&color=000000' },
    { name: 'CoffeeScript', logo: 'https://img.icons8.com/?size=100&id=CdAI8bUKMhTO&format=png&color=000000' },
    { name: 'MATLAB', logo: 'https://img.icons8.com/?size=100&id=r5Y16PcDkoWI&format=png&color=000000' },
    { name: 'R', logo: 'https://img.icons8.com/?size=100&id=21cojJTVtdmQ&format=png&color=000000' },
    { name: 'HTML', logo: 'https://img.icons8.com/color/48/000000/html-5.png' }, // HTML
    { name: 'CSS', logo: 'https://img.icons8.com/color/48/000000/css3.png' } // CSS
];




const languagePool = document.getElementById('language-pool');
const finishButton = document.getElementById('finish-button');


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

let currentTier = null;

function openColorPicker(tier) {
    currentTier = tier;
    const modal = document.getElementById('color-picker-modal');
    modal.style.display = 'block';
}

function applyColor() {
    const color = document.getElementById('color-picker').value;
    const tierLabelElement = document.querySelector(`.tier[data-tier="${currentTier}"] .tier-label`);
        closeModal('color-picker-modal');
    // Cambiar el color de fondo
    tierLabelElement.style.backgroundColor = color;
    
    closeModal('color-picker-modal');
}


function applyName(){
    const tierLabelElement = document.querySelector(`.tier[data-tier="${currentTier}"] .tier-label`);
    
    // Cambiar el texto de la etiqueta si hay un nuevo texto ingresado
    const newLabelText = document.getElementById('tier-label-input').value.trim();
    if (newLabelText) {
        tierLabelElement.textContent = newLabelText;
    }
    
    closeModal('color-picker-modal');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}


// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Initialize the finish button state
updateFinishButton();


const createYourOwnTierButton = document.getElementById('create-your-own-tier-button');

createYourOwnTierButton.addEventListener('click', () => {
    // Borrar todos los lenguajes del language pool
    languagePool.innerHTML = ''; // Elimina todos los elementos dentro del contenedor de lenguajes

    // Aquí también se podrían eliminar los lenguajes de los tiers, si es necesario
    const tiers = document.querySelectorAll('.tier-content'); // Suponiendo que cada tier tiene una clase 'tier-content'
    tiers.forEach(tier => {
        tier.innerHTML = ''; // Esto elimina todos los lenguajes de cada tier
    });
    
    document.getElementById("tier-list-title").innerText = "Tu Tier List";
    document.getElementById("tier-list-subtitle").innerText = "Tu Tier List";
    document.getElementById("tier-list-title-add").innerText = "Agregar nuevo objeto";
    document.getElementById("add-language-button").innerText = "Agregar nuevo objeto";
    document.getElementById("new-language-name-title").innerText = "Nombre del objeto:";
    document.getElementById("new-language-name").placeholder = "Nombre del objeto"; // Cambiar placeholder
    // Opcional: Puedes deshabilitar el botón de finalizar si es necesario
    finishButton.disabled = true; // Deshabilitar el botón de finalizar si quieres que no se pueda finalizar hasta que se agreguen nuevos lenguajes
});

const downloadTierListButton = document.getElementById('download-tierlist');
downloadTierListButton.addEventListener('click', () => {
    const tierList = document.getElementById('tier-list');

    // Capturar la tier list usando html2canvas
    html2canvas(tierList, {
        useCORS: true, // Habilitar CORS para imágenes externas
        allowTaint: false, // No permitir imágenes tainted
        logging: true, // Activar logging para depurar
        scale: 2, // Mejorar la resolución de la imagen generada
        backgroundColor: null // Asegura que el fondo sea transparente si es necesario
    }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'tier-list.png'; // Nombre del archivo descargado
        link.click(); // Simula el click para descargar la imagen
    }).catch(err => {
        console.error("Error capturing the tier list: ", err);
    });
});


