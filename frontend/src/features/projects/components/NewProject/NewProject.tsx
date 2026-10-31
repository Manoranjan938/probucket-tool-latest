import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { useSnackbar, type OptionsObject } from "notistack";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import * as project from "features/projects/styles/projectClasses";

import ProjectsTopBar from "features/projects/components/ProjectsTopBar/ProjectsTopBar";
import WizardStepper from "features/projects/components/WizardStepper/WizardStepper";
import ChooseTemplate from "features/projects/components/ChooseTemplate/ChooseTemplate";
import ChooseType from "features/projects/components/ChooseType/ChooseType";
import ProjectDetails from "features/projects/components/ProjectDetails/ProjectDetails";
import useCreateNewProject from "features/projects/hooks/useCreateNewProject";
import type { RootState } from "app/store";
import type { ProjectDraft } from "features/projects/types";
import type { ApiError } from "shared/types";

const steps = ["Template", "Managed by", "Details"];
const lastStep = steps.length - 1;

// Same corner as the Snackbars on the other pages
const toastOptions: OptionsObject = { anchorOrigin: { vertical: "bottom", horizontal: "right" } };

// The backend answers with a field -> message map; show its first message
const getErrorMessage = (err: ApiError) => {
  const message = Object.values(err.response?.data ?? {})[0];
  return typeof message === "string" ? message : "Couldn't create the project. Please try again.";
};

const NewProject = ({ currentUser }: Props) => {
  const [page, setPage] = useState(0);
  const [details, setDetails] = useState<ProjectDraft>({
    projectTemplate: "",
    projectType: "",
    projectName: "",
    projectDescription: "",
  });
  const [nameError, setNameError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createNewProject] = useCreateNewProject();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const canContinue =
    (page === 0 && !!details.projectTemplate) || (page === 1 && !!details.projectType) || page === lastStep;

  const updateDetails = (changes: Partial<ProjectDraft>) => {
    setDetails({ ...details, ...changes });
    if (changes.projectName !== undefined) {
      setNameError("");
    }
  };

  // Enter in any step submits the form: Continue on steps 1–2, Create project on the last one
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canContinue || creating) {
      return;
    }
    if (page < lastStep) {
      setPage(page + 1);
      return;
    }

    const projectName = details.projectName.trim();
    if (!projectName) {
      setNameError("Please enter a project name");
      return;
    }

    setCreating(true);
    try {
      await createNewProject({
        projectName,
        projectDesc: details.projectDescription.trim(),
        projectTemplate: details.projectTemplate,
        projectType: details.projectType,
        userId: currentUser.id!,
      });
      enqueueSnackbar("Project created successfully", { ...toastOptions, variant: "success" });
      navigate("/projects");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err as ApiError), { ...toastOptions, variant: "error" });
      setCreating(false);
    }
  };

  return (
    <div className={project.page}>
      <ProjectsTopBar />

      <main className={project.wizardContainer}>
        <div className={project.wizardHeader}>
          <div>
            <h1 className={project.title}>Create a project</h1>
            <p className={project.subtitle}>Set up a new project in three quick steps.</p>
          </div>
          <Link to="/projects" className={project.btnGhost}>Cancel</Link>
        </div>

        <WizardStepper steps={steps} current={page} onStepClick={setPage} />

        <form className={project.wizardCard} onSubmit={handleSubmit} noValidate>
          {page === 0 ? (
            <ChooseTemplate value={details.projectTemplate} onChange={(value) => updateDetails({ projectTemplate: value })} />
          ) : page === 1 ? (
            <ChooseType value={details.projectType} onChange={(value) => updateDetails({ projectType: value })} />
          ) : (
            <ProjectDetails details={details} nameError={nameError} onChange={updateDetails} onChangeStep={setPage} />
          )}

          <div className={project.wizardActions}>
            {page > 0 ? (
              <button type="button" className={project.btnGhost} onClick={() => setPage(page - 1)}>
                <FaArrowLeft />
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className={project.btnPrimary} disabled={!canContinue || creating}>
              {page < lastStep ? (
                <>
                  Continue
                  <FaArrowRight />
                </>
              ) : creating ? (
                "Creating…"
              ) : (
                "Create project"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NewProject);
