package com.example.ush_v1.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.ush_v1.model.UserStory;

@Service
public class UserStoryService {
    public List<String> prioritizeStories(List<UserStory> stories) {
    // Assign scores to priorities
    Map<String, Integer> priorityScores = Map.of(
            "High", 3,
            "Medium", 2,
            "Low", 1
    );

    // Define keyword weights
    Map<String, Integer> keywordWeights = Map.of(
            "secure", 5,
            "authentication", 4,
            "encryption", 4,
            "fast", 3,
            "efficient", 3,
            "optimize", 3,
            "critical", 5,
            "urgent", 5,
            "immediate", 5
    );

    // Process and prioritize stories
    return stories.stream()
            .sorted((story1, story2) -> {
                int score1 = calculateStoryScore(story1, priorityScores, keywordWeights);
                int score2 = calculateStoryScore(story2, priorityScores, keywordWeights);

                // Higher score first
                return Integer.compare(score2, score1);
            })
            .map(story -> "Feature: " + story.getUserStory() +
                    " | Priority: " + story.getPriority() +
                    " | Description: " + story.getDescription())
            .collect(Collectors.toList());
}

private int calculateStoryScore(UserStory story, Map<String, Integer> priorityScores, Map<String, Integer> keywordWeights) {
    // Base score from priority
    int score = priorityScores.getOrDefault(story.getPriority(), 0);

    // Keyword bonus
    for (String keyword : keywordWeights.keySet()) {
        if (story.getDescription().toLowerCase().contains(keyword)) {
            score += keywordWeights.get(keyword);
        }
    }

    // Description length bonus (e.g., longer descriptions add up to 2 extra points)
    score += Math.min(story.getDescription().length() / 50, 2);

    return score;
}


}
