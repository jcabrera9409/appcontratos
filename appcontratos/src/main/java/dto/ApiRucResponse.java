package dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiRucResponse {

	private boolean success;
	private ApiRucData data;
	
	public boolean isSuccess() {
		return success;
	}
	public ApiRucData getData() {
		return data;
	}
	
	
}
