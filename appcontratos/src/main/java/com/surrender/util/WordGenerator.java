package com.surrender.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.time.format.DateTimeFormatter;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.surrender.model.Cliente;
import com.surrender.model.Contrato;
import com.surrender.model.DetalleContrato;

@Component
public class WordGenerator {
	
	@Value("${document.word.template-contrato}")
	private String templateContrato;
	
	public File generateWordContrato(Contrato contrato) throws Exception {
		String outputWordFile = contrato.getCodigo()+".docx";
		
		FileInputStream fis = new FileInputStream(templateContrato);
        XWPFDocument document = new XWPFDocument(fis);
		
        replaceText(document, "<CODIGO_CONTRATO>", contrato.getCodigo());
        replaceText(document, "<FECHA_CONTRATO>", contrato.getFechaContrato().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        replaceText(document, "<FECHA_ENTREGA>", contrato.getFechaEntrega().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        replaceText(document, "<NOMBRE_CLIENTE>", contrato.getObjCliente().getNombreCliente() + " " + contrato.getObjCliente().getApellidosCliente());
        replaceText(document, "<DOCUMENTO_CLIENTE>", contrato.getObjCliente().getDocumentoCliente());
        replaceText(document, "<TELEFONO_CLIENTE>", contrato.getTelefono());
        replaceText(document, "<CORREO_CLIENTE>", contrato.getCorreo());
        replaceText(document, "<DIRECCION_ENTREGA>", contrato.getDireccionEntrega());
        replaceText(document, "<REFERENCIA_ENTREGA>", contrato.getReferencia());
        replaceText(document, "<TIPO_ABONO>", contrato.getTipoAbono());
        replaceText(document, "<A_CUENTA>", String.format("%.2f", contrato.getaCuenta()));
        replaceText(document, "<SALDO>", String.format("%.2f", contrato.getSaldo()));
        replaceText(document, "<TOTAL>", String.format("%.2f", contrato.getTotal()));
        
        XWPFTable table = document.getTables().get(1);
        
        for (DetalleContrato detalle : contrato.getDetalleContrato()) {
        	insertRowInTable(table, String.format("%.0f", detalle.getCantidad()) , detalle.getDescripcion(), String.format("%.2f", detalle.getPrecio()), String.format("%.2f", detalle.getPrecioTotal()));
		}
        
        if(contrato.getMovilidad() > 0) {
        	insertRowInTable(table, "1" , "Movilidad", String.format("%.2f", contrato.getMovilidad()), String.format("%.2f", contrato.getMovilidad()));
        } else {
        	insertRowInTable(table, "1" , "Incluye Movilidad", "0.00", "0.00");
        }
        
        table.removeRow(1);
                
        File fileTemp = new File(outputWordFile);
        FileOutputStream fos = new FileOutputStream(fileTemp);
        document.write(fos);
        fos.close();
        
        return fileTemp;
	}
	
	private void replaceText(XWPFDocument document, String target, String replacement) {
	    
	    document.getParagraphs().forEach(paragraph -> {
	        paragraph.getRuns().forEach(run -> {
	            String runText = run.getText(0); 
	            if (runText != null && runText.contains(target)) {
	                run.setText(runText.replace(target, replacement), 0); 
	            }
	        });
	    });

	    document.getTables().forEach(table -> {
	        table.getRows().forEach(row -> {
	            row.getTableCells().forEach(cell -> {
	                cell.getParagraphs().forEach(paragraph -> {
	                    paragraph.getRuns().forEach(run -> {
	                        String runText = run.getText(0); 
	                        if (runText != null && runText.contains(target)) {
	                            run.setText(runText.replace(target, replacement), 0);
	                        }
	                    });
	                });
	            });
	        });
	    });
	}
	
	private void insertRowInTable(XWPFTable table, String cantidad, String articulo, String precio, String precioTotal) {
	    XWPFTableRow newRow = table.createRow();

	    for (int i = 0; i < 4; i++) {
	        XWPFTableCell newCell = newRow.getCell(i);
	        newCell.setVerticalAlignment(XWPFTableCell.XWPFVertAlign.CENTER); 
	    }

	    XWPFParagraph paragraphCantidad = newRow.getCell(0).getParagraphArray(0);
	    paragraphCantidad.setAlignment(ParagraphAlignment.CENTER);
	    XWPFRun runCantidad = paragraphCantidad.createRun();
	    runCantidad.setText(cantidad);  

	    XWPFParagraph paragraphArticulo = newRow.getCell(1).getParagraphArray(0);
	    XWPFRun runArticulo = paragraphArticulo.createRun();
	    
	    String[] articuloPartes = articulo.trim().split("\n");
	    for (int i = 0; i < articuloPartes.length; i++) {
	    	runArticulo.setText(articuloPartes[i]);
	    	if(i + 1 < articuloPartes.length) {
	    		runArticulo.addBreak();
	    	}
	    }

	    XWPFParagraph paragraphPrecio = newRow.getCell(2).getParagraphArray(0);
	    paragraphPrecio.setAlignment(ParagraphAlignment.CENTER);
	    XWPFRun runPrecio = paragraphPrecio.createRun();
	    runPrecio.setText(precio); 
	    
	    XWPFParagraph paragraphPrecioTotal = newRow.getCell(3).getParagraphArray(0);
	    paragraphPrecioTotal.setAlignment(ParagraphAlignment.CENTER);
	    XWPFRun runPrecioTotal = paragraphPrecioTotal.createRun();
	    runPrecioTotal.setText(precioTotal); 
	    
	}

}
