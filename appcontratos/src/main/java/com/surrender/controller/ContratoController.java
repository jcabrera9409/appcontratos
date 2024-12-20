package com.surrender.controller;

import java.io.File;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.exception.ModeloNotFoundException;
import com.surrender.model.Contrato;
import com.surrender.service.IContratoService;
import com.surrender.util.DriveUtil;
import com.surrender.util.EmailUtil;
import com.surrender.util.GlobalVariables;
import com.surrender.util.Mail;
import com.surrender.util.WordGenerator;

@RestController
@RequestMapping("/contratos")
@PreAuthorize("@authenticationService.tieneAcceso('contrato')")
public class ContratoController {

	@Autowired
	private IContratoService service;
	
	@Autowired
	private DriveUtil driveService;
	
	@Autowired
	private WordGenerator wordGenerator;
	
	@Autowired
	private EmailUtil emailUtil;

	@GetMapping
	public ResponseEntity<?> listar() throws Exception {
		List<Contrato> lista = service.listar();
		return new ResponseEntity<List<Contrato>>(lista, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> listarPorId(@PathVariable Integer id) throws Exception {
		Contrato obj = service.listarPorId(id);
		
		if(obj == null) {
			throw new ModeloNotFoundException("Contrato no encontrado " + id);
		}
		
		return new ResponseEntity<Contrato>(obj, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Contrato c) throws Exception {
		
		
		File file = wordGenerator.generateWordContrato(c);
		String idUploadFileWord  = driveService.uploadFile(file, GlobalVariables.WORD_DOCUMENT_MIME_TYPE);
		String idConvertedDoc = driveService.convertWordToGoogleDoc(idUploadFileWord);
		File pdfFile = driveService.converGoogleDocToPDF(idConvertedDoc, c.getCodigo() + ".pdf");
		String idConvertedPdf = driveService.uploadFile(pdfFile, GlobalVariables.PDF_MIME_TYPE); 
		
		c.setGoogle_doc_id(idConvertedDoc);
		c.setGoogle_pdf_id(idConvertedPdf);
		
		Contrato obj = service.registrarContratoTransaccional(c);
		
		Mail mail = new Mail();
		mail.setTo(obj.getCorreo());
		mail.setSubject("Te enviamos tu contrato!");
		mail.setTemplate("email/contrato-template");
		mail.addCc(obj.getObjVendedor().getCorreo());
		
		String nombreUsuario = obj.getObjCliente().getNombreCliente();
		if(!obj.getObjCliente().isEsPersonaNatural()) {
			nombreUsuario = obj.getObjCliente().getRazonSocial();
		}
		
		Map<String, Object> model = new HashMap<>();
		model.put("nombreUsuario", nombreUsuario);
		
		mail.setModel(model);
		mail.setFileToAttach(pdfFile);	
		
		emailUtil.enviarMail(mail);
		
		file.delete();
		pdfFile.delete();
		driveService.deleteFile(idUploadFileWord);
		
		return new ResponseEntity<Contrato>(obj, HttpStatus.CREATED);
	}
	
	@PostMapping(value = "/previsualizar", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	public ResponseEntity<byte[]> previsualizarPdfContrato(@RequestBody Contrato c) throws Exception {
		File file = wordGenerator.generateWordContrato(c);
		
		String idUploadFileWord  = driveService.uploadFile(file, GlobalVariables.WORD_DOCUMENT_MIME_TYPE);
		String idConvertedDoc = driveService.convertWordToGoogleDoc(idUploadFileWord);
		File pdfFile = driveService.converGoogleDocToPDF(idConvertedDoc, c.getCodigo() + ".pdf");
		
		byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());
		
		file.delete();
		pdfFile.delete();
		driveService.deleteFile(idUploadFileWord);
		driveService.deleteFile(idConvertedDoc);
		
		return new ResponseEntity<byte[]>(pdfBytes, HttpStatus.OK);
	}
	
	
	/*@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Contrato c) throws Exception {
		Contrato obj = service.registrar(c);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
		return ResponseEntity.created(location).build();
	}*/
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Contrato c) throws Exception {
		Contrato obj = service.modificar(c);
		return new ResponseEntity<Contrato>(obj, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminar(@PathVariable Integer id) throws Exception {
		service.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
}
