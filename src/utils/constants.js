export const MESSAGES = {
    SUCCESS: {
        UPDATE: {
            COMPETITIONS: "La liste des compétitions a été mise à jour.",
            CHANGE_PASSWORD: "Le mot de passe a été changé avec succès.",
            TRANSACTION: "Les modifications ont été enregistrées.",
            UPDATE: "Les modifications ont été sauvegardées.",
            COMPETITION: "La compétition a été mise à jour.",
            PLAYER_COMMENT: "Le message a été mis à jour.",
            TOKEN: "Le token a été changé avec succès.",
            MATCHES: "Les matchs ont été mis à jour.",
            PAYMENT: "Le paiement a été enregistré.",
            RESULT: "Le résultat a été mis à jour.",
            ROLES: "Les rôles ont été mis à jour.",
            ROLE: "Le rôle a été modifié.",
        },
        ADMIN_CONNECTION: "Connexion admin réussie.",
        CONNECTION: "Connexion réussie.",
        COUNT: "Le compte est bon !!"
    },
    ERROR: {
        GET: {
            PLAYERS_COMMENT: "Une erreur est survenue lors de la récupération des commentaires.",
            TRANSACTION: "Une erreur est survenue lors de la récupération des transactions.",
            USERS: "Une erreur est survenue lors de la récupération des utilisateurs.",
            DATA: "Une erreur est survenue lors de la récupération des données.",
        },
        UPDATE: {
            COMPETITIONS: "Une erreur est survenue lors de la mise à jour de la liste des compétitions.",
            AVAILABILITY: "Une erreur est survenue lors de la mise à jour de la disponibilité.",
            COMPETITION: "Une erreur est survenue lors de la mise à jour de la compétition.",
            TRANSACTION: "Une erreur est survenue lors de la mise à jour des transactions.",
            PLAYER_COMMENT: "Une erreur est survenue lors de la mise à jour du message.",
            UPDATE: "Une erreur est survenue lors de la mise à jour des modifications.",
            PAYMENT: "Une erreur est survenue lors de la mise à jour du paiement.",
            RESULT: "Une erreur est survenue lors de la mise à jour du résultat.",
            MATCHES: "Une erreur est survenue lors de la mise à jour des matchs.",
            DATA: "Une erreur est survenue lors de la mise à jour des données.",
            ROLE: "Une erreur est survenue lors de la modification du rôle.",
        },
        SAME_PASSWORD: "Le mot de passe actuel et le nouveau mot de passe sont identiques.",
        REDUCTION_ALREADY_EXISTS: "Une réduction avec ce motif existe déjà.",
        MIN_PASSWORD: "Le mot de passe doit contenir au moins 6 caractères.",
        CHANGE_TOKEN: "Une erreur est survenue lors du changement du token.",
        INVALID: "Le nom d'utilisateur ou le mot de passe est incorrect.",
        USERNAME_ALREADY_EXISTS: "Le nom d'utilisateur est déjà utilisé.",
        NO_ACTUAL_PASSWORD: "Merci de rentrer votre mot de passe actuel.",
        NO_PASSWORD2: "Merci de confirmer votre nouveau mot de passe.",
        PASSWORD_NOT_MATCH: "Les mots de passe ne correspondent pas.",
        NO_PASSWORD: "Merci de rentrer votre nouveau mot de passe.",
        NO_ADMIN_PASSWORD: "Merci de rentrer un mot de passe admin.",
        CONNECTION: "Une erreur est survenue lors de la connexion.",
        ACTUAL_PASSWORD: "Le mot de passe actuel est incorrect.",
        PUT_USERNAME: "Veuillez rentrer un nom d'utilisateur.",
        ADMIN_PASSWORD: "Le mot de passe admin est incorrect.",
        PUT_PASSWORD: "Veuillez rentrer un mot de passe.",
        BAD: "Désolé, quelque chose s'est mal passé.",
        TOKEN: "Merci de rentrer votre nouveau token.",
        NOT_FOUND: "Désolé, cette page n'existe pas.",
        GLOBAL: "Une erreur est survenue.",
        INVALID_FORMAT: "Format incorrect",
        INVALID_SCORE: "Score incohérent",
    }
}

export const CONSOLE = {
    FETCH: {
        PLAYERS_AVAILABILITIES: "Error fetching players availabilities:",
        PLAYERS_COMMENT: "Error fetching players comments:",
        AVAILABILITIES: "Error fetching availabilities:",
        INITIALIZE_ALL: "Error initializing all data:",
        TRANSACTION: "Error fetching transactions:",
        ACCOUNT: "Error fetching account data:",
        USERS: "Error fetching users data:",
        PLAYERS: "Error fetching players:",
        MATCHES: "Error fetching matches:",
        DATA: "Error fetching data:",
        DATE: "Error fetching date:",
    },
    UPDATE: {
        PLAYERS_COMMENT: "Error updating player comment:",
        PLAYER_COMMENT: "Error updating player comment:",
        AVAILABILITY: "Error updating availability:",
        TRANSACTION: "Error updating transactions:",
        COMPETITION: "Error updating competition:",
        PAYMENT: "Error updating payment:",
        ROLE: "Error updating roles:"
    },
    CONNECTION: "Failed to connect user",
    FORMAT_DAY: "Error formatting day:",
    PARSE_DATE: "Error parsing date:"
}

export const DATA = {
    SELECT_PLAYERS: "Sélectionnez au moins un joueur pour afficher ses disponibilités",
    AVAILABILITY_MANAGEMENT: "Gestion de la disponibilité des joueurs",
    STAFF_ONLY: "Seuls les membres du staff ont accès à cet onglet",
    ADMIN_ONLY: "Seuls les administrateurs ont accès à cet onglet",
    NO_PLAYERS: "Aucun joueur ne correspond aux filtres",
    COMPETITION_SELECTION: "Sélection de la compétition",
    SELECT_COMPETITION: "Sélectionnez une compétition",
    PLAYER_COMMENT_UPDATE: "Voir/Modifier le message",
    ACTIVATION_CALENDAR: "Synchroniser le calendrier",
    TRANSACTION_MANAGEMENT: "Gérer les transactions",
    ACCESS_REQUEST: "Demande d’accès en cours...",
    REDUCTION_SETTINGS: "Gestion des réductions",
    PLAYER_COMMENT_ADD2: "Ajouter un message...",
    REMAINING_AMOUNT: "Montant restant à payer",
    REDUCTION_AMOUNT: "Montant de la réduction",
    NO_REDUCTION: "Aucune réduction spécifique",
    SELECT_WINNER: "Sélectionnez un vainqueur",
    MANAGEMENT: "Gestion des dépôts/retraits",
    ACTIVATION_BATCH: "Activation des batchs",
    PLAYER_COMMENT_ADD: "Ajouter un message",
    AMOUNT_IN_CASH: "Montant dans la caisse",
    PAYMENT_DETAIL: "Détail du paiement de",
    PRICE_SETTINGS: "Paramétrage des prix",
    NO_MATCHES: "Aucun match programmé le",
    NO_USERS: "Aucun utilisateur recensé",
    NO_TRANSACTION: "Aucune transaction",
    ACTIVATION_MOJA: "Synchroniser MOJA",
    PAYMENT_PARTIAL: "Paiement partiel",
    REDUCTION: "Modif de la réduction",
    INITIAL_AMOUNT: "Montant initial",
    DATE_PAYMENT: "Date du paiement",
    PAYMENT_FINAL: "Paiement final",
    NEW_PAYMENT: "Nouveau paiement",
    PLAYERS: "Gestion des joueurs",
    CREATE_ACCOUNT: "Créez-en un.",
    PLANNING: "Planning du --/--",
    PRICE_SIMPLE: "Prix Simple :",
    PRICE_DOUBLE: "Prix Double :",
    USERNAME: "Nom d'utilisateur",
    FINAL_AMOUNT: "Montant final",
    NO_ACCOUNT: "Pas de compte ?",
    NO_PAYMENT: "Aucun paiement",
    PASSWORD: "Mot de passe",
    AFTERNOON: "Après-midi",
    SETTING: "Paramétrage",
    WITHDRAWAL: "retrait",
    PAYMENTS: "Paiements",
    PLAYER_1: "Joueur 1",
    PLAYER_2: "Joueur 2",
    SECOND_HOUR: "19h30",
    PAYMENT: "Paiement",
    RESULT: "Résultat",
    VOID_DATE: "--/--",
    AMOUNT: "Montant",
    FIRST_HOUR: "18h",
    THIRD_HOUR: "21h",
    HOURS: "Horaire",
    DEPOSIT: "depot", 
    MORNING: "Matin",
    NIGHT: "Soirée",
    REASON: "Motif",
    BENEFIT: "Bénéfice",
    WITHDRAWN: "Retiré",
    VS: "VS",
    NC: "NC"
}

export const MODAL = {
    CONFIRM: {
        TITLE: "Confirmation",
        DISCONNECTION_TITLE: "Confirmation de déconnexion",
        CLOSE_1: "Êtes-vous sûr de vouloir fermer ?",
        CLOSE_2: "Toutes les modifications seront perdues.",
        NEGATIVE_1: "Êtes-vous sûr de vouloir confirmer ?",
        NEGATIVE_2: "Le montant restant à payer sera négatif.",
        SETTINGS_1: "Êtes-vous sûr de vouloir mettre à jour les paramètres ?",
        SETTINGS_2: "Toutes les données propre à la compétition active seront perdues.",
        DISCONNECTION: "Êtes-vous sûr de vouloir vous déconnecter ?"
    },
    RESULT: {
        TITLE: "Renseigner un résultat",
        PLACEHOLDER: "Entrez le score",
    },
    ADMIN_CONNECTION: {
        TITLE: "Connexion admin",
        PLACEHOLDER: "Mot de passe admin",
        BUTTON: "Connexion"
    },
    CHANGE_PASSWORD: {
        TITLE: "Changer le mot de passe",
        PLACEHOLDER: "Mot de passe actuel",
        PLACEHOLDER2: "Nouveau mot de passe",
        PLACEHOLDER3: "Confirmer le nouveau mot de passe",
        BUTTON: "Changer le mot de passe"
    },
    TOKEN: {
        TITLE: "Changer le token",
        PLACEHOLDER: "Token",
        BUTTON: "Changer le token"
    },
    USERS: {
        TITLE: "Gestion des utilisateurs",
        CANCEL_BUTTON: "Annuler",
        SAVE_BUTTON:"Sauvegarder"
    },
}

export const LOADER = {
    MATCHES: "La mise à jour des matchs a démarrée (cette opération peut prendre plusieurs minutes).",
    COMPETITIONS: "La mise à jour des compétitions a démarrée.",
    CHANGE_PASSWORD: "Changement de mot de passe en cours...",
    SETTINGS_UPDATE: "Sauvegarde des paramètres...",
    ADMIN_CONNECTION: "Connexion admin en cours...",
    CHANGE_TOKEN: "Changement du token en cours...",
    TRANSACTION: "Chargement des transactions...",
    SETTINGS: "Chargement des paramètres...",
    USERS: "Chargement des utilisateurs...",
    PLANNING: "Chargement du planning du",
    FILTERS: "Chargement des filtres...",
    ACCOUNT: "Chargement des données...",
    PLAYERS: "Chargement des joueurs...",
    SAVE: "Sauvegarde des données...",
    LOADING: "Chargement en cours...",
    PROFIL: "Chargement du profil...",
    ROLE: "Sauvegarde du rôle..."
}

export const TABLE = {
    PAYMENT_DATE_TITLE: "Date du paiement",
    CATEGORY_TITLE: "Catégories",
    RANKING_TITLE: "Classement",
    PAYMENT_TITLE: "Paiement",
    DETAILS_TITLE: "Détails",
    AMOUNT_TITLE: "Montant",
    PLAYER_TITLE: "Joueur",
    PAID_TITLE: "Payé",
    ROLE_TITLE: "Rôle",
    NAME_TITLE: "Nom"
}

export const FILTER = {
    TITLE: "Filtres",
    PAYMENT: "Statut de paiement",
    CATEGORY: "Catégories",
    RANKING: "Classements",
    LABEL: {
        PARTIALLY_PAID: "Partiellement payé",
        UNPAID: "Non payé",
        PAID: "Payé",
        ALL: "Tous",
    },
    VALUE: {
        PARTIALLY_PAID: "partiallyPaid",
        UNPAID: "unpaid",
        PAID: "paid",
        ALL: "all",
    }
}

export const COMPETITION = {
    COMPETITON_ACTIVE: "Activation de la compétition (1/8)...",
    DELETE_DATA: "Suppression de toutes les données (2/8)...",
    UPDATE_COURTS: "Mise à jour des courts (3/8)...",
    UPDATE_CATEGORIES: "Mise à jour des catégories (4/8)...",
    UPDATE_RANKINGS: "Mise à jour des classements (5/8)...",
    UPDATE_GRIDS: "Mise à jour des découpages (6/8)...",
    UPDATE_PLAYERS: "Mise à jour des joueurs et des équipes (7/8)...",
    UPDATE_MATCHES: "Mise à jour des matchs (8/8)..."
}

export const COUNT = {
    LOADING: "Chargement des données du jour...",
    AMOUNT_DAY_BEFORE: "Montant de la veille",
    DISPLAY_PAYMENTS: "Afficher les paiements",
    OTHER_AMOUNT: "Montant autre pièces : ",
    CHEQUE_AMOUNT: "Montant des chèques : ",
    TWENTY_EURO_BILLS: "Billets de 20€ : ",
    PAYMENT_LIST: "Liste des paiements : ",
    FIFTY_EURO_BILLS: "Billets de 50€ : ",
    TEN_EURO_BILLS: "Billets de 10€ : ",
    FIVE_EURO_BILLS: "Billets de 5€ : ",
    TWO_EURO_COINS: "Pièces de 2€ : ",
    ONE_EURO_COINS: "Pièces de 1€ : ",
    COUNT_CASH: "Compter la caisse",
    NO_PAYMENT: "Aucun paiement le",
    AMOUNT_DAY: "Montant du soir",
    WITHDRAWAL: "Retraits",
    PROFIT: "Bénéfice",
    TOTAL: "Total : ",
    AMOUNT: "Montant",
    PLAYER: "Joueur"
}

export const BUTTON = {
    UPDATE_COMPETITIONS: "Mettre à jour la liste des compétitions",
    UPDATE_COMPETITION: "Mettre à jour la compétition",
    CHANGE_TOKEN: "Changer le token de connexion",
    SAVE_SETTINGS: "Enregistrer les paramètres",
    REQUEST_ACCESS: "Faire une demande d'accès",
    UPDATE_MATCHES: "Mettre à jour les matchs",
    MANAGE_USERS: "Gérer les utilisateurs",
    BACK: "Retour à la page d'accueil",
    DELETE: "Supprimer",
    VALIDATE: "Valider",
    SAVE: "Enregistrer",
    RETRY: "Réessayer",
    CANCEL: "Annuler",
    CLOSE: "Fermer",
    ADD: "Ajouter",
}

export const ADMIN = 2;
export const STAFF = 1;
export const VISITOR = 0;