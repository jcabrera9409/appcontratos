package com.surrender.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.surrender.model.Cliente;
import com.surrender.util.ClienteMapper;

import dto.ApiDniResponse;
import dto.ApiRucResponse;

@Service
public class ApiPeruService {

	@Value("${api.peru.api-token}")
	private String BEARER_TOKEN;
	
	private final String API_URL = "https://apiperu.dev/api/";
	private final String API_URL_DNI = API_URL + "dni";
	private final String API_URL_RUC = API_URL + "ruc";
	private final RestTemplate restTemplate =  new RestTemplate();
	
	public Cliente obtenerClientePorDNI(String dni) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "Bearer " + BEARER_TOKEN);
			headers.setContentType(MediaType.APPLICATION_JSON);
			
			HttpEntity<Map<String, String>> request = new HttpEntity<>(Map.of("dni", dni), headers);
			
			ResponseEntity<ApiDniResponse> response = restTemplate.exchange(API_URL_DNI, HttpMethod.POST, request, ApiDniResponse.class);
			
			return response.getBody() != null && response.getBody().isSuccess() ? ClienteMapper.mapDesdeDni(response.getBody().getData(), dni) : null;
			
		} catch (Exception e) {
			System.out.println("Error al llamar a la API: " + e.getMessage());
			return null;
		}
	}
	
	public Cliente obtenerClientePorRUC(String ruc) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "Bearer " + BEARER_TOKEN);
			headers.setContentType(MediaType.APPLICATION_JSON);
			
			HttpEntity<Map<String, String>> request = new HttpEntity<>(Map.of("ruc", ruc), headers);

			ResponseEntity<ApiRucResponse> response = restTemplate.exchange(API_URL_RUC, HttpMethod.POST, request, ApiRucResponse.class);
		
			return response.getBody() != null && response.getBody().isSuccess() ? ClienteMapper.mapDesdeRuc(response.getBody().getData(), ruc) : null;
			
		} catch (Exception e) {
			System.out.println("Error al llamar a la API: " + e.getMessage());
			return null;
		}
	}
		
}
