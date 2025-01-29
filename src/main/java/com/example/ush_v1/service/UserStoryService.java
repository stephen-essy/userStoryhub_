package com.example.ush_v1.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.ush_v1.model.UserStory;

@Service
public class UserStoryService {

    // Method to prioritize stories
    public List<UserStory> prioritizeStories(List<UserStory> stories) {
        // Priority scores
        Map<String, Integer> priorityScores = Map.of(
                "High", 3,
                "Medium", 2,
                "Low", 1
        );

        // Keyword weights for description content
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
                    // Prioritize by the base priority first (High > Medium > Low)
                    int priorityComparison = Integer.compare(priorityScores.getOrDefault(story2.getPriority(), 0),
                            priorityScores.getOrDefault(story1.getPriority(), 0));

                    // If priorities are the same, then compare based on calculated score
                    if (priorityComparison == 0) {
                        int score1 = calculateStoryScore(story1, priorityScores, keywordWeights);
                        int score2 = calculateStoryScore(story2, priorityScores, keywordWeights);
                        return Integer.compare(score2, score1); // Sort by score in descending order
                    }

                    return priorityComparison; // Higher priority first
                })
                .collect(Collectors.toList());
    }

    // Method to calculate score for each story
    private int calculateStoryScore(UserStory story, Map<String, Integer> priorityScores, Map<String, Integer> keywordWeights) {
        // Base score from priority (this is now used only for breaking ties)
        int score = priorityScores.getOrDefault(story.getPriority(), 0);

        // Add score based on description keywords
        for (String keyword : keywordWeights.keySet()) {
            if (story.getDescription().toLowerCase().contains(keyword)) {
                score += keywordWeights.get(keyword);
            }
        }

        // Add a bonus for longer descriptions (e.g., more descriptive stories get higher scores)
        score += Math.min(story.getDescription().length() / 50, 2);  // Max bonus of 2 points

        return score;
    }
}
