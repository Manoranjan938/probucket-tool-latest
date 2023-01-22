package com.tool.ProjectTool.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
