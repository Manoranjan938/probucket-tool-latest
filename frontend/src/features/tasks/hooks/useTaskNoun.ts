import useCurrentProject from "features/projects/hooks/useCurrentProject";

// What a project's work items are called on its buttons: "bug" on projects that only track bugs, else "task"
const useTaskNoun = () => {
  const { currentData: project } = useCurrentProject();

  return project?.projectTemplate === "bug" ? "bug" : "task";
};

export default useTaskNoun;
