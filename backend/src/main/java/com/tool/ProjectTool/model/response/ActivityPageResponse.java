package com.tool.ProjectTool.model.response;

import java.util.List;

/** One page of a project's activity log, newest first. hasMore says whether older entries match too. */
public record ActivityPageResponse(List<ActivityResponse> items, boolean hasMore) {

}
