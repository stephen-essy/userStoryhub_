package com.example.ush_v1.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ush_v1.model.UserStory;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Table;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class UserStoryPdfService {

    public ByteArrayInputStream generatePdf(List<UserStory> stories) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Add a title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("User Stories Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // Add an empty line for spacing

            // Add a table
            Table table = new Table(5); // 5 columns: Actor, Goal, Reason, Description, Priority
            table.addCell("Actor");
            table.addCell("Goal");
            table.addCell("Reason");
            table.addCell("Description");
            table.addCell("Priority");

            // Add rows to the table
            for (UserStory story : stories) {
                table.addCell(story.getActor());
                table.addCell(story.getGoal());
                table.addCell(story.getReason());
                table.addCell(story.getDescription());
                table.addCell(story.getPriority());
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
            return null; // Handle exception and return null
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
