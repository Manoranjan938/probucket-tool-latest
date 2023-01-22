package com.tool.ProjectTool.model.response;

import java.math.BigInteger;

public class NoteList {
	
	private BigInteger id;
	
	private String title;
	
	private String description;

	public BigInteger getId() {
		return id;
	}

	public void setId(BigInteger id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
