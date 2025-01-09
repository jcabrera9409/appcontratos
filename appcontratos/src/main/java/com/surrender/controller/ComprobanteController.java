package com.surrender.controller;

import java.io.File;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.surrender.model.Comprobante;
import com.surrender.model.DetalleComprobante;
import com.surrender.service.IComprobanteService;
import com.surrender.util.DriveUtil;
import com.surrender.util.GlobalVariables;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/comprobantes")
@PreAuthorize("@authenticationService.tieneAcceso('comprobante')")
public class ComprobanteController {

	@Value("${drive.google.comprobantes.folder-id}")
	private String folderIdComprobantes;
	
	@Autowired
	private DriveUtil driveService;
	
	@Autowired
	private IComprobanteService service;
	
	@GetMapping
	public ResponseEntity<?> listar() throws Exception {
		List<Comprobante> lista = service.listar();
		return new ResponseEntity<List<Comprobante>>(lista, HttpStatus.OK);
	}
	
	
	@GetMapping("/contrato/{codigo}")
	public ResponseEntity<?> buscarPorCodigoContrato(@PathVariable String codigo) throws Exception {
		Optional<Comprobante> comprobante = service.buscarPorCodigoContrato(codigo);
		if(comprobante.isPresent()) {
			return new ResponseEntity<Comprobante>(comprobante.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping
	public ResponseEntity<?> registrarComprobante(@RequestBody Comprobante c) throws Exception {
		Comprobante obj = service.registrar(c);
		return new ResponseEntity<Comprobante>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Comprobante c) throws Exception {
		Comprobante obj = service.modificar(c);
		return new ResponseEntity<Comprobante>(obj, HttpStatus.CREATED);
	}
	
	@PostMapping(value = "/detalle", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> registrarDetalleComprobante(
			@RequestPart("filePDF") MultipartFile filePDF,
			@RequestPart("fileZIP") MultipartFile fileZIP,
			@RequestPart("comprobante") Comprobante c) throws Exception {
		DetalleComprobante detalle = c.getDetalleComprobante().get(0);
		detalle.setComentario(c.getDetalleComprobante().get(0).getComentario());
		detalle.setGoogle_pdf_id("");
		detalle.setGoogle_zip_id("");
		detalle.setObjComprobante(c);
		
		DetalleComprobante obj = service.registrarDetalleComprobante(detalle);
		
		String filePDFName = c.getObjContrato().getCodigo() + "-" + obj.getId() + ".pdf";
		String fileZIPName = c.getObjContrato().getCodigo() + "-" + obj.getId() + ".zip";
		
		File pdfFile = driveService.convertMultipartFileToFile(filePDF, filePDFName);
		File zipFile = driveService.convertMultipartFileToFile(fileZIP, fileZIPName);
		
		String idUploadPDF = driveService.uploadFile(pdfFile, GlobalVariables.PDF_MIME_TYPE, folderIdComprobantes); 
		String idUploadZIP = driveService.uploadFile(zipFile, GlobalVariables.ZIP_MIME_TYPE, folderIdComprobantes); 
		
		pdfFile.delete();
		zipFile.delete();
		
		obj.setGoogle_pdf_id(idUploadPDF);
		obj.setGoogle_zip_id(idUploadZIP);
		
		obj = service.registrarDetalleComprobante(obj);
		
		return new ResponseEntity<DetalleComprobante>(obj, HttpStatus.OK);
	}
	
	
}
