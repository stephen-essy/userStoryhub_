package com.example.ush_v1.model;

public class UserStory {
    private String actor;
    private String goal;
    private String reason;
    private String description;
    private String priority;

    public UserStory() {}

    public UserStory(String actor, String goal, String reason, String description, String priority) {
        this.actor = actor;
        this.goal = goal;
        this.reason = reason;
        this.description = description;
        this.priority = priority;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getUserStory() {
        return "As a " + actor + ", I want to " + goal + " so that " + reason;
    }
}
