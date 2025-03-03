package dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiDniResponse {

	private boolean success;
	private ApiDniData data;
	
	public boolean isSuccess() {
		return this.success;
	}
	
	public ApiDniData getData() {
		return this.data;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public void setData(ApiDniData data) {
		this.data = data;
	}
}
