import type { Project } from "features/projects/types";
import useCurrentProject from "features/projects/hooks/useCurrentProject";
import { useGetTeamMembersQuery } from "features/team/api/teamApi";

export interface AssigneeOption {
  name: string;
  email: string;
}

// Who a task of the current project can be assigned to: its team members, plus the project lead,
// who isn't a team member but can be assigned too. A personal project only has the lead.
const useAssigneeOptions = () => {
  const currentProject: Partial<Project> = useCurrentProject().currentData ?? {};
  const isTeam = currentProject.projectType?.toLowerCase() === "team";
  // Shared with the team board's toolbar
  const { data: members = [] } = useGetTeamMembersQuery(currentProject.projectId, { skip: !isTeam });
  const team = isTeam ? members : [];
  const { leadEmail, leadBy } = currentProject;

  const options: AssigneeOption[] = [
    ...(leadEmail && !team.some((member) => member.email === leadEmail)
      ? [{ name: `${leadBy} (Lead)`, email: leadEmail }]
      : []),
    ...team.map(({ name, email }) => ({ name, email })),
  ];

  return { options, isTeam };
};

export default useAssigneeOptions;
