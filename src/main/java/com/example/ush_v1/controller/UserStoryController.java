package com.example.ush_v1.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ush_v1.model.UserStory;
import com.example.ush_v1.service.UserStoryService;
@RestController
@RequestMapping("/analyze")
@CrossOrigin(origins = "*")
public class UserStoryController {
    @Autowired
    private UserStoryService userStoryService;

    @PostMapping
    public ResponseEntity<List<String>> analyzeStories(@RequestBody List<UserStory> stories) {
        if (stories.size() < 2) {
            return ResponseEntity.badRequest().body(null); // At least 2 stories required
        }

        // Process and prioritize the stories
        List<String> prioritizedFeatures = userStoryService.prioritizeStories(stories);

        return ResponseEntity.ok(prioritizedFeatures); // Return prioritized list
    }



}
