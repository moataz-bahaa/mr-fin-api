export const formateEmployee = (empoloyee) => {
  const team = empoloyee.team ?? empoloyee.leadingTeam ?? null;

  if (team) {
    team.roleInTeam = empoloyee.team ? 'member' : 'leader';
  }

  return {
    ...empoloyee,
    teamId: empoloyee.teamId ?? empoloyee.leadingTeam?.id ?? null,
    team: empoloyee.team ?? empoloyee.leadingTeam ?? null,
    leadingTeam: undefined,
  };
};
