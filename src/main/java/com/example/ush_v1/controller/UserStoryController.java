package com.example.ush_v1.controller;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ush_v1.model.UserStory;
import com.example.ush_v1.service.UserStoryPdfService;
import com.example.ush_v1.service.UserStoryService;

@RestController
@RequestMapping("/analyze")
@CrossOrigin(origins = "*")
public class UserStoryController {

    @Autowired
    private UserStoryService userStoryService;

    @Autowired
    private UserStoryPdfService userStoryPdfService;

    // Endpoint for prioritizing stories
    @PostMapping
    public ResponseEntity<List<String>> analyzeStories(@RequestBody List<UserStory> stories) {
        if (stories.size() < 2) {
            return ResponseEntity.badRequest().body(null); // At least 2 stories required
        }

        // Process and prioritize the stories
        List<UserStory> prioritizedStories = userStoryService.prioritizeStories(stories);

        // Convert to readable string format
        List<String> prioritizedFeatures = prioritizedStories.stream()
                .map((UserStory story) -> "Feature: " + story.getUserStory() + " | Priority: " + story.getPriority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(prioritizedFeatures); // Return prioritized list
    }

    // New endpoint for generating and downloading a PDF
    @PostMapping("/download-pdf")
    public ResponseEntity<InputStreamResource> downloadPdf(@RequestBody List<UserStory> stories) {
        if (stories.isEmpty()) {
            return ResponseEntity.badRequest().build(); // No stories to process
        }

        // Generate the PDF as a ByteArrayInputStream
        ByteArrayInputStream pdfStream = userStoryPdfService.generatePdf(stories);

        // Set up response headers for the PDF file
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=user_stories.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfStream));
    }
}
