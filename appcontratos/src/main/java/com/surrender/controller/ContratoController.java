package com.surrender.controller;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.exception.ModeloNotFoundException;
import com.surrender.model.Contrato;
import com.surrender.model.DetallePago;
import com.surrender.service.IContratoService;
import com.surrender.util.DriveUtil;
import com.surrender.util.EmailUtil;
import com.surrender.util.GlobalVariables;
import com.surrender.util.Mail;
import com.surrender.util.WordGenerator;

import dto.ChangeStatusRequest;

@RestController
@RequestMapping("/contratos")
@PreAuthorize("@authenticationService.tieneAcceso('contrato')")
public class ContratoController {

	@Value("${drive.google.contratos.folder-id}")
	private String folderIdContratos;
	
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
	
	@GetMapping("/codigo/{codigo}")
	public ResponseEntity<?> listarPorCodigo(@PathVariable String codigo) throws Exception {
		Contrato obj = service.listarPorCodigo(codigo);
		
		if(obj == null ) {
			throw new ModeloNotFoundException("Contrato no encontrado " + codigo);
		}
		
		return new ResponseEntity<Contrato>(obj, HttpStatus.OK);
	}
	
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Contrato c) throws Exception {
		
		c.setGoogle_doc_id("");
		c.setGoogle_pdf_id("");
		
		Contrato obj = service.registrarContratoTransaccional(c);		
		obj.setCodigo(obj.getCodigo() + "-" + obj.getId());
		
		File file = wordGenerator.generateWordContrato(obj);
		String idUploadFileWord  = driveService.uploadFile(file, GlobalVariables.WORD_DOCUMENT_MIME_TYPE, folderIdContratos);
		String idConvertedDoc = driveService.convertWordToGoogleDoc(idUploadFileWord);
		File pdfFile = driveService.converGoogleDocToPDF(idConvertedDoc, obj.getCodigo() + ".pdf");
		String idConvertedPdf = driveService.uploadFile(pdfFile, GlobalVariables.PDF_MIME_TYPE, folderIdContratos); 
		
		obj.setGoogle_doc_id(idConvertedDoc);
		obj.setGoogle_pdf_id(idConvertedPdf);
		
		obj = service.modificar(obj);
		
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
		
		String idUploadFileWord  = driveService.uploadFile(file, GlobalVariables.WORD_DOCUMENT_MIME_TYPE, folderIdContratos);
		String idConvertedDoc = driveService.convertWordToGoogleDoc(idUploadFileWord);
		File pdfFile = driveService.converGoogleDocToPDF(idConvertedDoc, c.getCodigo() + ".pdf");
		
		byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());
		
		file.delete();
		pdfFile.delete();
		driveService.deleteFile(idUploadFileWord);
		driveService.deleteFile(idConvertedDoc);
		
		return new ResponseEntity<byte[]>(pdfBytes, HttpStatus.OK);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Contrato c) throws Exception {
		Contrato objBusqueda = service.listarPorId(c.getId());
		if(objBusqueda != null) {
			c.setEstado(objBusqueda.getEstado());
			c.setGoogle_doc_id(objBusqueda.getGoogle_doc_id());
			c.setGoogle_pdf_id(objBusqueda.getGoogle_pdf_id());
			c.setFechaContrato(objBusqueda.getFechaContrato());
			c.setObjVendedor(objBusqueda.getObjVendedor());
			
			File file = wordGenerator.generateWordContrato(c);
			String idUploadFileWord  = driveService.uploadFile(file, GlobalVariables.WORD_DOCUMENT_MIME_TYPE, folderIdContratos);
			String idConvertedDoc = driveService.convertWordToGoogleDocAsNewVersion(idUploadFileWord, c.getGoogle_doc_id());
			File pdfFile = driveService.converGoogleDocToPDF(idConvertedDoc, c.getCodigo() + ".pdf");
			driveService.uploadFileAsNewVersion(pdfFile, GlobalVariables.PDF_MIME_TYPE, c.getGoogle_pdf_id()); 
			
			c.setDetallePago(objBusqueda.getDetallePago());
			Contrato obj = service.modificarContratoTransaccional(c);
			
			Mail mail = new Mail();
			mail.setTo(obj.getCorreo());
			mail.setSubject("Te enviamos tu contrato actualizado!");
			mail.setTemplate("email/contrato-template");
			mail.addCc(obj.getObjVendedor().getCorreo());
			mail.addCc(obj.getObjVendedorActualizacion().getCorreo());
			
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
			
		} else {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PutMapping("cambiar_estado")
	public ResponseEntity<?> cambiarEstado(@RequestBody ChangeStatusRequest request) throws Exception {
		int filasAfectadas = service.actualizarEstadoPorId(request.getId(), request.getEstadoString(), request.getObjVendedor().getCorreo(), request.getFechaActualizacion());
		if(filasAfectadas > 0) {			
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		else
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
	}
	
	@PostMapping("pago")
	public ResponseEntity<?> registrarDetallePago(@RequestBody Contrato contrato) throws Exception {
		DetallePago detallePago = new DetallePago();
		detallePago = contrato.getDetallePago().get(0);
		detallePago.setObjContrato(contrato);		
		DetallePago obj = service.registrarDetallePago(detallePago);
		
		return new ResponseEntity<DetallePago>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping("pago")
	public ResponseEntity<?> modificarDetallePago(@RequestBody Contrato contrato) throws Exception {
		DetallePago detallePago = new DetallePago();
		detallePago = contrato.getDetallePago().get(0);
		detallePago.setObjContrato(contrato);		
		DetallePago obj = service.registrarDetallePago(detallePago);
		
		return new ResponseEntity<DetallePago>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping("pago/cambiar_estado")
	public ResponseEntity<?> cambiarEstadoDetallePago(@RequestBody ChangeStatusRequest request) throws Exception {
		int filasAfectadas = service.actualizarEstadoDetallePagoPorId(request.getId(), request.isEstado(), request.getObjVendedor().getCorreo(), request.getFechaActualizacion());
		if(filasAfectadas > 0) {			
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		else
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
	}
}
