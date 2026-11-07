package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.BadRequestException;
import com.tool.ProjectTool.exception.ProjectNotFoundException;
import com.tool.ProjectTool.model.request.ProjectRequest;
import com.tool.ProjectTool.model.request.UpdateProjectRequest;
import com.tool.ProjectTool.model.request.UpdateProjectTemplateRequest;
import com.tool.ProjectTool.repo.ProjectRepository;
import com.tool.ProjectTool.repo.UserRepository;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

	@Mock
	private ProjectRepository projectRepo;

	@Mock
	private UserRepository userRepo;

	@Mock
	private ProjectPurgeService purgeService;

	@InjectMocks
	private ProjectService service;

	@BeforeEach
	void user() {
		lenient().when(userRepo.findByUserId("me")).thenReturn(new Users());
	}

	@AfterEach
	void clearLogin() {
		SecurityContextHolder.clearContext();
	}

	private static Users person(String userId) {
		Users user = new Users();
		user.setUserId(userId);
		user.setName(userId);
		return user;
	}

	private void loggedInAs(String userId) {
		SecurityContextHolder.getContext()
				.setAuthentication(new UsernamePasswordAuthenticationToken(person(userId), null, List.of()));
	}

	// A project led by "lead"
	private ProjectEntity existing() {
		ProjectEntity project = new ProjectEntity();
		project.setProjectId("p1");
		project.setProjectName("Old name");
		project.setProjectTemplateType("project");
		project.setStatus(1);
		project.setUser(person("lead"));
		when(projectRepo.findByProjectId("p1")).thenReturn(project);
		return project;
	}

	private static UpdateProjectRequest rename(String name) {
		UpdateProjectRequest request = new UpdateProjectRequest();
		request.setProjectId("p1");
		request.setProjectName(name);
		return request;
	}

	private static UpdateProjectTemplateRequest template(String template) {
		UpdateProjectTemplateRequest request = new UpdateProjectTemplateRequest();
		request.setProjectId("p1");
		request.setProjectTemplate(template);
		return request;
	}

	@Test
	void theLeadRenamesTheProjectTrimmed() {
		ProjectEntity project = existing();
		loggedInAs("lead");

		service.updateProject(rename("  New name "));

		assertEquals("New name", project.getProjectName());
		verify(projectRepo).save(project);
	}

	@Test
	void someoneElseCantRename() {
		ProjectEntity project = existing();
		loggedInAs("member");

		BadRequestException error = assertThrows(BadRequestException.class, () -> service.updateProject(rename("Mine")));

		assertEquals("Only the project lead can rename this project", error.getMessage());
		assertEquals("Old name", project.getProjectName());
		verify(projectRepo, never()).save(any());
	}

	@Test
	void withoutALoginNothingChanges() {
		existing();

		assertThrows(BadRequestException.class, () -> service.updateProject(rename("Mine")));
		verify(projectRepo, never()).save(any());
	}

	@Test
	void theLeadChangesTheTemplate() {
		ProjectEntity project = existing();
		loggedInAs("lead");

		service.updateProjectTemplate(template("project and bug"));

		assertEquals("project and bug", project.getProjectTemplateType());
		verify(projectRepo).save(project);
	}

	@Test
	void someoneElseCantChangeTheTemplate() {
		ProjectEntity project = existing();
		loggedInAs("member");

		assertThrows(BadRequestException.class, () -> service.updateProjectTemplate(template("bug")));
		assertEquals("project", project.getProjectTemplateType());
	}

	@Test
	void anUnknownTemplateIsRejected() {
		loggedInAs("lead");

		BadRequestException error = assertThrows(BadRequestException.class,
				() -> service.updateProjectTemplate(template("scrum")));

		assertEquals("Unknown project template", error.getMessage());
		verify(projectRepo, never()).save(any());
	}

	@Test
	void someoneElseCantDelete() {
		ProjectEntity project = existing();
		loggedInAs("member");

		assertThrows(BadRequestException.class, () -> service.deleteProject("p1", "member"));
		assertEquals(1, project.getStatus());
		verify(projectRepo, never()).save(any());
	}

	private ProjectEntity deleted() {
		ProjectEntity project = existing();
		project.setStatus(ProjectEntity.DELETED);
		project.setDeletedBy("lead");
		project.setDeletedDate(new Date());
		return project;
	}

	@Test
	void aDeletedProjectCantBeOpened() {
		deleted();
		loggedInAs("lead");

		assertThrows(ProjectNotFoundException.class, () -> service.getProjectById("p1"));
	}

	@Test
	void aDeletedProjectCantBeChanged() {
		deleted();
		loggedInAs("lead");

		assertThrows(ProjectNotFoundException.class, () -> service.updateProject(rename("New")));
		assertThrows(ProjectNotFoundException.class, () -> service.updateProjectTemplate(template("bug")));
		assertThrows(ProjectNotFoundException.class, () -> service.deleteProject("p1", "lead"));
		verify(projectRepo, never()).save(any());
	}

	@Test
	void theLeadRestores() {
		ProjectEntity project = deleted();
		loggedInAs("lead");

		service.restoreProject("p1");

		assertEquals(ProjectEntity.ACTIVE, project.getStatus());
		assertEquals(null, project.getDeletedDate());
		assertEquals(null, project.getDeletedBy());
		verify(projectRepo).save(project);
	}

	@Test
	void someoneElseCantRestore() {
		ProjectEntity project = deleted();
		loggedInAs("member");

		assertThrows(BadRequestException.class, () -> service.restoreProject("p1"));
		assertEquals(ProjectEntity.DELETED, project.getStatus());
	}

	// Delete forever was asked for: it is gone for everyone, and can't come back or be removed a second time
	private ProjectEntity beingRemoved() {
		ProjectEntity project = deleted();
		project.setStatus(ProjectEntity.REMOVING);
		return project;
	}

	@Test
	void aProjectBeingRemovedCantBeOpened() {
		beingRemoved();

		assertThrows(ProjectNotFoundException.class, () -> service.getProjectById("p1"));
	}

	@Test
	void aProjectBeingRemovedCantBeRestored() {
		ProjectEntity project = beingRemoved();
		loggedInAs("lead");

		assertThrows(ProjectNotFoundException.class, () -> service.restoreProject("p1"));
		assertEquals(ProjectEntity.REMOVING, project.getStatus());
		verify(projectRepo, never()).save(any());
	}

	@Test
	void aProjectBeingRemovedCantBeChangedOrDeletedForeverAgain() {
		beingRemoved();
		loggedInAs("lead");

		assertThrows(ProjectNotFoundException.class, () -> service.updateProject(rename("New")));
		assertThrows(ProjectNotFoundException.class, () -> service.deleteProjectForever("p1"));
		verify(purgeService, never()).queuePurge(any());
	}

	@Test
	void aProjectThatIsntDeletedCantBeRestored() {
		existing();
		loggedInAs("lead");

		assertThrows(ProjectNotFoundException.class, () -> service.restoreProject("p1"));
		verify(projectRepo, never()).save(any());
	}

	@Test
	void deletedProjectsSayWhenTheyGoForGood() {
		ProjectEntity project = new ProjectEntity();
		project.setStatus(ProjectEntity.DELETED);
		project.setDeletedDate(new Date(1_000_000_000_000L));
		Users lead = person("lead");
		lead.setId(7L);
		when(userRepo.findByUserId("lead")).thenReturn(lead);
		when(projectRepo.getDeletedProjectsByUserId(7L)).thenReturn(List.of(project));

		var list = service.getDeletedProjects("lead");

		assertEquals(1, list.size());
		assertEquals(1_000_000_000_000L + 30L * 24 * 60 * 60 * 1000, list.get(0).deleteForeverOn().getTime());
	}

	@Test
	void theLeadDeletesADeletedProjectForever() {
		ProjectEntity project = deleted();
		loggedInAs("lead");

		service.deleteProjectForever("p1");

		verify(purgeService).queuePurge(project);
	}

	@Test
	void onlyADeletedProjectCanBeDeletedForever() {
		existing();
		loggedInAs("lead");

		assertThrows(ProjectNotFoundException.class, () -> service.deleteProjectForever("p1"));
		verify(purgeService, never()).queuePurge(any());
	}

	@Test
	void someoneElseCantDeleteForever() {
		deleted();
		loggedInAs("member");

		assertThrows(BadRequestException.class, () -> service.deleteProjectForever("p1"));
		verify(purgeService, never()).queuePurge(any());
	}

	@Test
	void theLeadDeletes() {
		ProjectEntity project = existing();
		loggedInAs("lead");
		when(userRepo.findByUserId("lead")).thenReturn(person("lead"));

		service.deleteProject("p1", "lead");

		assertEquals(ProjectEntity.DELETED, project.getStatus());
		assertEquals("lead", project.getDeletedBy());
		verify(projectRepo).save(project);
	}

	private ProjectEntity create(String name, String... taken) {
		lenient().when(projectRepo.existsByProjectIdentifier(anyString()))
				.thenAnswer(call -> Set.of(taken).contains(call.getArgument(0)));

		ProjectRequest request = new ProjectRequest();
		request.setProjectName(name);
		request.setProjectTemplate("scrum");
		request.setProjectType("team");
		request.setUserId("me");
		service.saveProject(request);

		ArgumentCaptor<ProjectEntity> saved = ArgumentCaptor.forClass(ProjectEntity.class);
		verify(projectRepo).save(saved.capture());
		return saved.getValue();
	}

	@Test
	void freeInitialsAreUsedAsTheyAre() {
		assertEquals("SP", create("Sub Project").getProjectIdentifier());
	}

	@Test
	void takenInitialsGetTheNextFreeNumber() {
		assertEquals("SP2", create("Some Plan", "SP").getProjectIdentifier());
	}

	@Test
	void numbersSkipOnesAlreadyTaken() {
		assertEquals("SP4", create("Second Pass", "SP", "SP2", "SP3").getProjectIdentifier());
	}

	@Test
	void backlogUsesTheSameIdentifier() {
		ProjectEntity project = create("Some Plan", "SP");

		assertEquals("SP2", project.getBacklog().getProjectIdentifier());
	}

	@Test
	void symbolsAreSkippedInInitials() {
		assertEquals("1T", create("#1 Team").getProjectIdentifier());
		assertEquals("RD", ProjectService.firstLetterWord("&R &D").toUpperCase());
	}

	@Test
	void nameWithoutLettersOrDigitsFallsBack() {
		assertEquals("P", create("### !!!").getProjectIdentifier());
	}

	@Test
	void fallbackIsNumberedToo() {
		assertEquals("P2", create("   ", "P").getProjectIdentifier());
	}

	@Test
	void initialsAreUpperCased() {
		assertEquals("SP", create("sub project").getProjectIdentifier());
	}

	@Test
	void lettersOutsideEnglishAreKept() {
		assertEquals("टप", create("टीम प्रोजेक्ट").getProjectIdentifier());
	}

}
