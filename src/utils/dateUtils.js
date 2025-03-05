const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    timeZone: 'Europe/Paris' // Changer selon ta zone
};

const getLocaleDate = (date) => {
    const formattedDate = date.toLocaleDateString('fr-FR', options);
    return  formattedDate.split('/').reverse().join('-'); // Change le format de "dd/MM/yyyy" à "yyyy-MM-dd"
};

export { getLocaleDate };