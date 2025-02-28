package com.surrender.controller;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import com.surrender.model.Contrato;
import com.surrender.model.DetalleComprobante;
import com.surrender.service.IComprobanteService;
import com.surrender.service.IContratoService;
import com.surrender.util.DriveUtil;
import com.surrender.util.EmailUtil;
import com.surrender.util.GlobalVariables;
import com.surrender.util.Mail;

import dto.SendEmailDetalleComprobanteRequest;

import org.springframework.web.bind.annotation.DeleteMapping;
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
	
	@Autowired
	private IContratoService serviceContrato;
	
	@Autowired
	private EmailUtil emailUtil;
	
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
			@RequestPart(value = "fileZIP", required = false) MultipartFile fileZIP,
			@RequestPart("comprobante") Comprobante c) throws Exception {
		DetalleComprobante detalle = c.getDetalleComprobante().get(0);
		detalle.setComentario(c.getDetalleComprobante().get(0).getComentario());
		detalle.setGoogle_pdf_id("");
		detalle.setGoogle_zip_id("");
		detalle.setObjComprobante(c);
		
		DetalleComprobante obj = service.registrarDetalleComprobante(detalle);
		
		String filePDFName = c.getObjContrato().getCodigo() + "-" + obj.getId() + ".pdf";		
		File pdfFile = driveService.convertMultipartFileToFile(filePDF, filePDFName);		
		String idUploadPDF = driveService.uploadFile(pdfFile, GlobalVariables.PDF_MIME_TYPE, folderIdComprobantes); 		
		pdfFile.delete();
		obj.setGoogle_pdf_id(idUploadPDF);
		
		if(fileZIP != null && !fileZIP.isEmpty()) {
			String fileZIPName = c.getObjContrato().getCodigo() + "-" + obj.getId() + ".zip";
			File zipFile = driveService.convertMultipartFileToFile(fileZIP, fileZIPName);
			String idUploadZIP = driveService.uploadFile(zipFile, GlobalVariables.ZIP_MIME_TYPE, folderIdComprobantes); 
			zipFile.delete();
			obj.setGoogle_zip_id(idUploadZIP);
		}
		
		obj = service.registrarDetalleComprobante(obj);
		
		return new ResponseEntity<DetalleComprobante>(obj, HttpStatus.OK);
	}
	
	@PostMapping("/enviar/cliente")
	public ResponseEntity<?> enviarDetalleCliente(@RequestBody SendEmailDetalleComprobanteRequest request) throws Exception {
		Optional<DetalleComprobante> detalle = service.buscarDetalleComprobantePorId(request.getId_detalleComprobante());
		Contrato contrato = serviceContrato.listarPorId(request.getId_contrato());
		
		if(detalle.isPresent() && contrato != null) {
			File pdfFile = driveService.downloadFile(detalle.get().getGoogle_pdf_id(), "comprobante.pdf");
			File zipFile = null;
			if(!detalle.get().getGoogle_zip_id().equalsIgnoreCase("")) {
				zipFile = driveService.downloadFile(detalle.get().getGoogle_zip_id(), "comprobante.zip");
			}
			
			Mail mail = new Mail();
			mail.setTo(contrato.getCorreo());
			mail.setSubject("Te enviamos el comprobante de tu compra " + contrato.getCodigo() + "!");
			mail.setTemplate("email/comprobante-template");
			mail.addCc(contrato.getObjVendedor().getCorreo());
			
			String nombreUsuario = contrato.getObjCliente().getNombreCliente();
			if(!contrato.getObjCliente().isEsPersonaNatural()) {
				nombreUsuario = contrato.getObjCliente().getRazonSocial();
			}
			
			Map<String, Object> model = new HashMap<>();
			model.put("nombreUsuario", nombreUsuario);
			
			mail.setModel(model);
			mail.setFileToAttach(pdfFile);
			if(zipFile != null) mail.setFileToAttach(zipFile);
			
			emailUtil.enviarMail(mail);
			
			pdfFile.delete();
			if(zipFile != null) zipFile.delete();
			
			service.actualizarVecesEnviado(detalle.get().getId(), detalle.get().getVeces_enviado() + 1);
			
			return new ResponseEntity<Void>(HttpStatus.OK);
		} else {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	@DeleteMapping("/detalle/{id}")
	public ResponseEntity<?> eliminarDetalleComprobante(@PathVariable Integer id) throws Exception {
		
		Optional<DetalleComprobante> opDetalle = service.buscarDetalleComprobantePorId(id);
		
		if(opDetalle.isPresent()) {
			DetalleComprobante obj = opDetalle.get();
			this.driveService.deleteFile(obj.getGoogle_pdf_id());
			this.driveService.deleteFile(obj.getGoogle_zip_id());
			
			this.service.eliminarDetalleComprobante(obj.getId());
			
			return new ResponseEntity<Void>(HttpStatus.OK);
		} else {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		
	}
	
}
