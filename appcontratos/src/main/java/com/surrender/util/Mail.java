package com.surrender.util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Mail {

	private String to;
	private List<String> cc;
	private String subject;
	private String template;
	private Map<String, Object> model;
	private File fileToAttach;
	
	public Mail() {}
	
	public Mail(String from, String to, String subject, String template, Map<String, Object> model, File fileToAttach, List<String> cc) {
		this.to = to;
		this.cc = cc;
		this.subject = subject;
		this.template = template;
		this.model = model;
		this.fileToAttach = fileToAttach;
	}

	public String getTo() {
		return to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public List<String> getCc() {
		return cc;
	}

	public void setCc(List<String> cc) {
		this.cc = cc;
	}
	
	public void addCc(String cc) {
		if(this.cc == null) 
			this.cc = new ArrayList<>();
		this.cc.add(cc);
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

	public File getFileToAttach() {
		return fileToAttach;
	}

	public void setFileToAttach(File fileToAttach) {
		this.fileToAttach = fileToAttach;
	}
	
}
