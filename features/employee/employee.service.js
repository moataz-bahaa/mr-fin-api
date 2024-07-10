export const formateEmployee = (empoloyee) => {
  if (!empoloyee) return null;
  const team = empoloyee.team ?? empoloyee.leadingTeam ?? null;

  return {
    ...empoloyee,
    teamId: team?.id ?? null,
    team,
    leadingTeam: undefined,
  };
};
