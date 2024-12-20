package com.surrender.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.security.GeneralSecurityException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;

@Component
public class DriveUtil {

	@Value("${drive.google.contratos.folder-id}")
	private String folderId;

	@Value("${drive.google.credentials}")
	private String pathCredentials;
	
	private final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
	
	public String uploadFile(File file, String mimeType) throws FileNotFoundException, IOException, GeneralSecurityException {
		Drive service = createDriveService();
		
		com.google.api.services.drive.model.File fileMetadata = new com.google.api.services.drive.model.File();
		fileMetadata.setName(file.getName());
		fileMetadata.setParents(Collections.singletonList(folderId));
				
		FileContent mediaContent = new FileContent(mimeType, file);
		
		com.google.api.services.drive.model.File uploadedFile = service.files().create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();	
		
		return uploadedFile.getId();
	}
		
	public String convertWordToGoogleDoc(String wordId) throws FileNotFoundException, IOException, GeneralSecurityException {
		Drive service = createDriveService();
		
		com.google.api.services.drive.model.File convertedFile = service.files().copy(wordId, new com.google.api.services.drive.model.File().setMimeType(GlobalVariables.DOC_DRIVE_MIME_TYPE))
        		.setFields("id")
        		.execute();
		
		return convertedFile.getId();
	}
	
	public boolean deleteFile(String fileId) {
		try {
			Drive service = createDriveService();
			service.files().delete(fileId).execute();
			return true;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return false;
		}
	}
	
	public File converGoogleDocToPDF(String wordId, String pdfName) throws FileNotFoundException, IOException, GeneralSecurityException {
		 Drive service = createDriveService();
	        
		 com.google.api.services.drive.model.File fileMetadata = new com.google.api.services.drive.model.File();
		 fileMetadata.setName(pdfName);
		 fileMetadata.setParents(Collections.singletonList(folderId));
		 
		 try (OutputStream outputStream = new FileOutputStream(pdfName)) {
			 service.files().export(wordId, GlobalVariables.PDF_MIME_TYPE)
                    .executeMediaAndDownloadTo(outputStream);
		 }
        
		 File pdfFile = new File(pdfName);
		 
		 return pdfFile;
	}
	
	public Drive createDriveService() throws FileNotFoundException, IOException, GeneralSecurityException {
		GoogleCredentials credential = GoogleCredentials.fromStream(new FileInputStream(pathCredentials))
				.createScoped(Collections.singleton(DriveScopes.DRIVE));
		
		return new Drive.Builder(
				GoogleNetHttpTransport.newTrustedTransport(), 
				JSON_FACTORY, 
				new HttpCredentialsAdapter(credential)).setApplicationName("ContratosAPP").build();
	}
}
