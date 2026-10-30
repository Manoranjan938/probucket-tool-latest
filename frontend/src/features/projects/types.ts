import type { Dispatch, SetStateAction } from "react";

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
  projectTemplate: string;
  projectType: string;
  projectName: string;
  projectDescription: string;
  projectTemplateId: number;
  projectTypeId: number;
}

/** Props every step of the create-project wizard receives */
export interface WizardStepProps {
  title: string;
  details: ProjectDraft;
  setDetails: Dispatch<SetStateAction<ProjectDraft>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export interface TemplateOption {
  templateId: number;
  title: string;
  image: string;
  description: string;
  type: string;
}

export interface TypeOption {
  typeId: number;
  image: string;
  title: string;
  description: string;
  type: string;
}

/** What the Template card renders – a template or a type option */
export type TemplateCard = Omit<TemplateOption, "templateId"> & {
  templateId?: number;
};
