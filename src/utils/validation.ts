export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Le nom est requis";
  if (name.length < 2) return "Le nom doit contenir au moins 2 caractères";
  if (name.length > 50) return "Le nom ne peut pas dépasser 50 caractères";
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name))
    return "Le nom contient des caractères non autorisés";
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "L'email est requis";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Format d'email invalide";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return null; // Le mot de passe est optionnel lors de la mise à jour
  if (password.length < 8)
    return "Le mot de passe doit contenir au moins 8 caractères";
  if (!/[A-Z]/.test(password))
    return "Le mot de passe doit contenir au moins une majuscule";
  if (!/[a-z]/.test(password))
    return "Le mot de passe doit contenir au moins une minuscule";
  if (!/[0-9]/.test(password))
    return "Le mot de passe doit contenir au moins un chiffre";
  if (!/[!@#$%^&*]/.test(password))
    return "Le mot de passe doit contenir au moins un caractère spécial";
  return null;
};
