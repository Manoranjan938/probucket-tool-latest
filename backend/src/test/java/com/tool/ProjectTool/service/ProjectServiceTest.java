package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.model.request.ProjectRequest;
import com.tool.ProjectTool.repo.ProjectRepository;
import com.tool.ProjectTool.repo.UserRepository;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

	@Mock
	private ProjectRepository projectRepo;

	@Mock
	private UserRepository userRepo;

	@InjectMocks
	private ProjectService service;

	@BeforeEach
	void user() {
		when(userRepo.findByUserId("me")).thenReturn(new Users());
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
