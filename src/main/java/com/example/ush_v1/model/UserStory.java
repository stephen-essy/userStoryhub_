package com.example.ush_v1.model;

public class UserStory {
    private String userStory;
    private String description;
    private String priority;

    public UserStory() {}

    public UserStory(String userStory, String description, String priority) {
        this.userStory = userStory;
        this.description = description;
        this.priority = priority;
    }
    public String getUserStory() {
        return userStory;
    }

    public void setUserStory(String userStory) {
        this.userStory = userStory;
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
}
