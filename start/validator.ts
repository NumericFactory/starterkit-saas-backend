import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    // Applicable for all fields
    'required': 'Le champ est requis',
    'string': 'doit être une chaîne de caractères',
    'email': 'Veuillez saisir une adresse email valide',

    // Error message for the user fields
    'username.required': 'Le nom d\'utilisateur est requis',
    'firstname.required': 'Le prénom est requis',
    'firstname.minLength': 'min 2 caractères',
    'firstname.maxLength': 'min 20 caractères',
    'lastname.required': 'Le nom est requis',
    'lastname.minLength': 'min 2 caractères',
    'lastname.maxLength': 'min 20 caractères',
    'email.required': 'adresse email equise',
    'password.required': 'mot de passe requis',
    'password.minLength': 'min 8 caractères',
    'password.maxLength': 'max 20 caractères',

})