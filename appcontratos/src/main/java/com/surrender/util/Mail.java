package com.surrender.util;

import java.util.Map;

public class Mail {

	private String to;
	private String subject;
	private String template;
	private Map<String, Object> model;
	
	public Mail() {}
	
	public Mail(String from, String to, String subject, String template, Map<String, Object> model) {
		this.to = to;
		this.subject = subject;
		this.template = template;
		this.model = model;
	}

	public String getTo() {
		return to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	public Map<String, Object> getModel() {
		return model;
	}

	public void setModel(Map<String, Object> model) {
		this.model = model;
	}
	
}
