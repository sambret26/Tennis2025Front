async function showTab(tabUrl) {
    try {
        const url = `src/components/${tabUrl}.jsx`; // Chemin vers le composant React
        const response = await import(url); // Charger dynamiquement le composant

        // Injecter le contenu dans le DOM
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = ''; // Vider le contenu précédent
        tabContent.appendChild(response.default()); // Ajouter le nouveau contenu
    } catch (error) {
        console.error('Erreur lors du chargement du fichier:', error);
    }
}

// Charger l'onglet d'accueil par défaut au démarrage
document.addEventListener('DOMContentLoaded', function() {
    showTab('Home/Home'); // Onglet d'accueil par défaut
});