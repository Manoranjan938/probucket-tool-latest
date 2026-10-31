import type { IconType } from "react-icons";

/** model/response/ProjectResponse.java */
export interface Project {
  projectName: string;
  projectId: string;
  projectIdentifier: string;
  leadBy: string;
  projectType: string;
  projectAvatar: string;
}

/** model/request/ProjectRequest.java */
export interface ProjectRequest {
  projectName: string;
  projectTemplate: string;
  projectType: string;
  projectDesc: string;
  userId: string;
}

export interface ProjectState {
  allProjects: Project[];
  /** Empty object until the project details are loaded */
  project: Partial<Project>;
}

/** Values collected by the create-project wizard */
export interface ProjectDraft {
  /** One of the template values in features/projects/data.ts */
  projectTemplate: string;
  /** One of the project type values in features/projects/data.ts */
  projectType: string;
  projectName: string;
  projectDescription: string;
}

/** A template or project type the wizard offers (features/projects/data.ts) */
export interface ProjectOption {
  value: string;
  title: string;
  description: string;
  icon: IconType;
  /** Shown but can't be picked yet */
  comingSoon?: boolean;
}
