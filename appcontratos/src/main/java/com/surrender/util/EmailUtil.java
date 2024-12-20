package com.surrender.util;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailUtil {

	@Autowired
	private JavaMailSender emailSender;

	@Autowired
	private SpringTemplateEngine templateEngine;
	
	public void enviarMail(Mail mail) throws MessagingException, IOException {
		MimeMessage message = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
		
		Context context = new Context();
		context.setVariables(mail.getModel());
		
		String html = templateEngine.process(mail.getTemplate(), context);
		helper.setTo(mail.getTo());
		helper.setText(html, true);
		helper.setSubject(mail.getSubject());
		
		if(mail.getCc() != null && mail.getCc().size() > 0) {
			helper.setCc(mail.getCc().stream().toArray(String[]::new));
		}
		
		if(mail.getFileToAttach() != null) {
			String fileName = mail.getFileToAttach().getName();
			byte[] fileBytes = Files.readAllBytes(mail.getFileToAttach().toPath());
			helper.addAttachment(fileName, new ByteArrayResource(fileBytes));
		}
		
		emailSender.send(message);
	}
}
