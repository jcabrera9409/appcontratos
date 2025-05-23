package com.surrender.util;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

public class UtilMethods {

	public static String capitalizeWords(String text) {
		if(text == null || text.isEmpty()) {
			return text;
		}
		
		String[] words = text.toLowerCase().trim().split(" ");
		StringBuilder capitalizedText = new StringBuilder();
		
		for(String word : words ) {
			if(!word.isEmpty()) {
				capitalizedText.append(Character.toUpperCase(word.charAt(0)))
							   .append(word.substring(1))
							   .append(" ");
			}
		}
		
		text = capitalizedText.toString();
		words = text.trim().split("\\.");
		capitalizedText = new StringBuilder();
		
		for(String word : words ) {
			
			if(!word.isEmpty()) {
				capitalizedText.append(Character.toUpperCase(word.charAt(0)))
							   .append(word.substring(1))
							   .append(".");
			}
		}
		
		if (capitalizedText.length() > 0 && capitalizedText.charAt(capitalizedText.length() - 1) == '.') {
	        capitalizedText.setLength(capitalizedText.length() - 1);
	    }
		
		return capitalizedText.toString().trim();
	}
	
	public static boolean esDni(String dni) {
		Pattern dniPattern = Pattern.compile("^\\d{8}$");
		return dni != null && dniPattern.matcher(dni).matches();
	}
	
	public static boolean esRuc(String ruc) {
		Pattern rucPattern = Pattern.compile("^\\d{11}$");
		return ruc != null && rucPattern.matcher(ruc).matches();
	}
	
	public static String generarSlugUnico(String nombre, List<String> slugsExistentes) {
		if(nombre == null) return null;
		
		String slugBase = nombre.toLowerCase();
		
		slugBase = Normalizer.normalize(slugBase, Normalizer.Form.NFD);
		slugBase = slugBase.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
		
		slugBase = slugBase.replaceAll("[^a-z0-9\\s-]", "");
		
		slugBase = slugBase.trim().replaceAll("\\s+", "-");
		
		if(slugsExistentes == null) return slugBase;
		
		if(!slugsExistentes.contains(slugBase)) return slugBase;
		
		int contador = 1;
		
		while(slugsExistentes.contains(slugBase + "-" + contador)) contador++;
		
		return slugBase + "-" + contador;
	}
}
