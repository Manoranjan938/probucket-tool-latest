package com.tool.ProjectTool.model.response;

public class StatisticsResponse {

	private int completed;
	
	private int inprogress;
	
	private int pending;

	public int getCompleted() {
		return completed;
	}

	public void setCompleted(int completed) {
		this.completed = completed;
	}

	public int getInprogress() {
		return inprogress;
	}

	public void setInprogress(int inprogress) {
		this.inprogress = inprogress;
	}

	public int getPending() {
		return pending;
	}

	public void setPending(int pending) {
		this.pending = pending;
	}
	
}
