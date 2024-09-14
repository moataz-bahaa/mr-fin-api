export const MESSAGES = {
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
};
