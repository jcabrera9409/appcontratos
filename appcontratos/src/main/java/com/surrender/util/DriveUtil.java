package com.surrender.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

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

	@Value("${drive.google.credentials}")
	private String pathCredentials;
	
	@Value("${path.temp.files}")
	private String pathTemp;
	
	private final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
		
	public String uploadFile(File file, String mimeType, String folderId) throws FileNotFoundException, IOException, GeneralSecurityException {
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
	
	public String uploadFileAsNewVersion(File file, String mimeType, String existingFileId) throws FileNotFoundException, IOException, GeneralSecurityException {
	    Drive service = createDriveService();

	    FileContent mediaContent = new FileContent(mimeType, file);

	    service.files()
	            .update(existingFileId, null, mediaContent)
	            .setFields("id")
	            .execute();

	    return existingFileId;
	}
		
	public String convertWordToGoogleDoc(String wordId) throws FileNotFoundException, IOException, GeneralSecurityException {
		Drive service = createDriveService();
		
		com.google.api.services.drive.model.File convertedFile = service.files()
				.copy(wordId, new com.google.api.services.drive.model.File().setMimeType(GlobalVariables.DOC_DRIVE_MIME_TYPE))
        		.setFields("id")
        		.execute();
		
		return convertedFile.getId();
	}
	
	public String convertWordToGoogleDocAsNewVersion(String wordId, String existingFileId) throws IOException, GeneralSecurityException {
	    Drive service = createDriveService();

	    com.google.api.services.drive.model.File convertedFile = service.files()
	            .copy(wordId, new com.google.api.services.drive.model.File().setMimeType(GlobalVariables.DOC_DRIVE_MIME_TYPE))
	            .setFields("id")
	            .execute();

	    String tempFileName = pathTemp + UUID.randomUUID().toString() + ".docx";

	    try (OutputStream outputStream = new FileOutputStream(tempFileName)) {
	        service.files()
	                .export(convertedFile.getId(), GlobalVariables.WORD_DOCUMENT_MIME_TYPE)
	                .executeMediaAndDownloadTo(outputStream);
	    }

	    File tempFile = new File(tempFileName);

	    FileContent mediaContent = new FileContent(GlobalVariables.WORD_DOCUMENT_MIME_TYPE, tempFile);
	    service.files().update(existingFileId, null, mediaContent).execute();

	    tempFile.delete();
	    deleteFile(convertedFile.getId());

	    return existingFileId;
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
		 pdfName = pathTemp + pdfName;		 
		 try (OutputStream outputStream = new FileOutputStream(pdfName)) {
			 service.files().export(wordId, GlobalVariables.PDF_MIME_TYPE)
                    .executeMediaAndDownloadTo(outputStream);
		 }
        
		 File pdfFile = new File(pdfName);
		 
		 return pdfFile;
	}
	
	public File convertMultipartFileToFile(MultipartFile multipartFile, String name) throws IOException {
		name = pathTemp + name;
		File convFile = new File(name);
		try (FileOutputStream fos = new FileOutputStream(convFile)) {
			fos.write(multipartFile.getBytes());
		}
		return convFile;
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
