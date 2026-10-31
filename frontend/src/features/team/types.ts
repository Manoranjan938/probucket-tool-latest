/** model/response/TeamMembersList.java */
export interface TeamMember {
  email: string;
  name: string;
  userid: number;
  /** null (or the string "null") until a role is set */
  role: string | null;
  addedDate: string;
  /** 0 = active, 1 = inactive */
  status: number;
}

/** model/request/RequestTeamMember.java */
export interface AddTeamMemberRequest {
  email: string;
  name: string;
  projectId: string;
}

/** model/request/UpdateTeamRequest.java */
export interface UpdateTeamRequest {
  userid: number;
  role: string;
  /** "active" or "inactive" – anything else leaves the status unchanged */
  status: string;
}

export interface TeamState {
  allTeamMember: TeamMember[];
  selectedMember: Partial<TeamMember>;
}
