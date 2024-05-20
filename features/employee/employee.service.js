export const formateEmployee = (empoloyee) => {
  const team = empoloyee.team ?? empoloyee.leadingTeam ?? null;

  return {
    ...empoloyee,
    teamId: team?.id ?? null,
    team,
    leadingTeam: undefined,
  };
};
