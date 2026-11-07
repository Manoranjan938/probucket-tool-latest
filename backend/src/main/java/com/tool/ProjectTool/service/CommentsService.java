package com.tool.ProjectTool.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tool.ProjectTool.cache.CacheClearer;
import com.tool.ProjectTool.cache.CacheNames;
import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.Comment;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.DataNotFoundException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.exception.UserNotFoundException;
import com.tool.ProjectTool.model.request.CommentRequest;
import com.tool.ProjectTool.model.response.CommentsList;
import com.tool.ProjectTool.repo.CommentsRepository;
import com.tool.ProjectTool.repo.ProjectTaskRepository;
import com.tool.ProjectTool.repo.UserRepository;

@Service
public class CommentsService {

	@Autowired
	private CacheClearer cacheClearer;

	@Autowired
	private CommentsRepository commentRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private ProjectTaskRepository taskRepo;

	@Autowired
	private ActivityService activityService;

	@Transactional
	public String addComment(CommentRequest commentReq) {

		Comment comment = new Comment();
		Users user = userRepo.findByUserId(commentReq.getUserId());
		ProjectTask task = taskRepo.findByProjectSequence(commentReq.getTaskId());
		if (user != null) {
			if (task != null) {
				comment.setComment(commentReq.getComment());
				comment.setCommentBy(user.getId());
				comment.setUsername(user.getName());
				comment.setCommentedOnType(task.getId());

				commentRepo.save(comment);
				cacheClearer.commentAdded(task.getProjectSequence());
				activityService.recordTaskActivity(ActivityType.COMMENT_ADDED, task, null, null);
				return "Comment added successfully";
			}
			throw new TaskIdNotFoundException("Task Id not found");
		}

		throw new UserNotFoundException("User not found");
	}
	
	@Cacheable(cacheNames = CacheNames.COMMENTS, key = "#taskSeq")
	public List<CommentsList> getCommetLists(String taskSeq){
		
		List<Object> comments = commentRepo.findCommentsByTaskId(taskSeq);
		if(comments.size() > 0) {
			
			Iterator itr = comments.iterator();
			List<CommentsList> commentList = new ArrayList<>();
			while(itr.hasNext()) {
				
				Object[] row = (Object[]) itr.next();
				CommentsList comment = new CommentsList();
				comment.setName(String.valueOf(row[0]));
				comment.setId((Long) row[1]);
				comment.setComment(String.valueOf(row[2]));
				comment.setCommentDate(String.valueOf(row[3]));
				
				commentList.add(comment);
				
			}
			
			return commentList;
			
		}
		throw new DataNotFoundException("Data Not found with this task id");
	}

}
