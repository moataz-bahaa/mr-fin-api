export const GERMAN_MESSAGES = {
  UPDATED: 'Erfolgreich aktualisiert',
  DELETED: 'Erfolgreich gelöscht',
  CREATED: 'Erfolgreich erstellt',
  UNAUTHENTICATED: 'Sie haben keine Berechtigung',
  NOT_FOUND: 'Nicht gefunden',
  BAD_REQUEST: 'Bitte geben Sie alle erforderlichen Daten an',
  REGISTER: 'Erfolgreich angemeldet',
  WRONG_EMAIL_OR_PASS: 'Falsche E-Mail oder Passwort',
  WRONG_PASSWORD: 'Falsches Passwort',
  EMAIL_EXISTS: 'Benutzername oder E-Mail existieren bereits',
  INVALID_TOKEN: 'Ungültiges Token',
  IMAGE_DELETED: 'Bild erfolgreich gelöscht',
  ORDER_ACTIVATED: 'Bestellung angenommen',
  ORDER_CANCELLED: 'Bestellung storniert',
  EMPLOYEE_CAN_NOT_BE_MANGER:
    'Mitarbeiter gehört zu einer anderen Filiale und kann nicht Manager der aktuellen Filiale sein',
  ROLE_MUST_BE_BRANCH_MANAGER: 'Mitarbeiterrolle muss Filialleiter sein',
  INVALID_CREDENTIALS: 'Ungültige Anmeldedaten',
  USER_IS_ARCHIVED_AND_CAN_NOT_LOGIN:
    'Sie sind archiviert und können sich nicht anmelden, bitte kontaktieren Sie die Administratoren',
  USER_NOT_FOUND: 'Benutzer nicht gefunden',
  INVALID_OLD_PASSWORD: 'Ungültiges altes Passwort',
  PASSWORD_CHANGED_SUCCESSFULLY: 'Passwort erfolgreich geändert',
  BRANCH_ID_MUST_BE_SENT:
    'Für Administratoren und Filialleiter muss die Filial-ID gesendet werden',
  ONLY_EMPLOYEE_CAN_WRITE_REPORTS: 'Nur Mitarbeiter können Berichte schreiben',
  NO_FILE_ATTACHED: 'Keine Datei angehängt',
  FILE_SAVED: 'Datei gespeichert',
  employeeIsATeamLeaderInAnotherTeam: (employeeId) =>
    `Mitarbeiter #${employeeId} ist Teamleiter in einem anderen Team`,
  INVALID_API_KEY:
    'Ungültiger API-Schlüssel, bitte kontaktieren Sie den Backend-Entwickler, um einen gültigen API-Schlüssel zu erhalten',
  INCORRECT_NUMBER: 'Falsche Nummer',
  NEW_CONTACT_US_MESSAGE: 'neue Nachricht erhalten',
};

export const ENGLISH_MESSAGES = {
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  CREATED: 'Successfully created',
  UNAUTHENTICATED: 'You do not have permission',
  NOT_FOUND: 'Not found',
  BAD_REQUEST: 'Please provide all required data',
  REGISTER: 'Successfully registered',
  WRONG_EMAIL_OR_PASS: 'Incorrect email or password',
  WRONG_PASSWORD: 'Incorrect password',
  EMAIL_EXISTS: 'Username or email already exists',
  INVALID_TOKEN: 'Invalid token',
  IMAGE_DELETED: 'Image successfully deleted',
  ORDER_ACTIVATED: 'Order accepted',
  ORDER_CANCELLED: 'Order cancelled',
  EMPLOYEE_CAN_NOT_BE_MANGER:
    'Employee belongs to a different branch and cannot be a manager of the current branch',
  ROLE_MUST_BE_BRANCH_MANAGER: 'Employee role must be branch manager',
  INVALID_CREDENTIALS: 'Invalid login credentials',
  USER_IS_ARCHIVED_AND_CAN_NOT_LOGIN:
    'You are archived and cannot log in, please contact the administrators',
  USER_NOT_FOUND: 'User not found',
  INVALID_OLD_PASSWORD: 'Invalid old password',
  PASSWORD_CHANGED_SUCCESSFULLY: 'Password successfully changed',
  BRANCH_ID_MUST_BE_SENT:
    'For administrators and branch managers, the branch ID must be sent',
  ONLY_EMPLOYEE_CAN_WRITE_REPORTS: 'Only employees can write reports',
  NO_FILE_ATTACHED: 'No file attached',
  FILE_SAVED: 'File saved',
  employeeIsATeamLeaderInAnotherTeam: (employeeId) =>
    `Employee #${employeeId} is a team leader in another team`,
  INVALID_API_KEY:
    'Invalid API key, please contact the backend developer to obtain a valid API key',
  INCORRECT_NUMBER: 'Incorrect number',
  NEW_CONTACT_US_MESSAGE: 'New message received',
};

export const MESSAGES =
  process.env.ENVIRONMENT === 'development'
    ? ENGLISH_MESSAGES
    : GERMAN_MESSAGES;
