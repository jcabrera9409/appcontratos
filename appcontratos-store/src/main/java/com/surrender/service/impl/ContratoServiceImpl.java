package com.surrender.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.dto.APIResponseDTO;
import com.surrender.dto.CarritoDTO;
import com.surrender.dto.DetalleCarritoDTO;
import com.surrender.model.Cliente;
import com.surrender.model.Contrato;
import com.surrender.model.DetalleContrato;
import com.surrender.model.DetalleMaterial;
import com.surrender.model.Material;
import com.surrender.model.Producto;
import com.surrender.model.Vendedor;
import com.surrender.repo.IClienteRepo;
import com.surrender.repo.IContratoRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IProductoRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IContratoService;
import com.surrender.util.UtilMethods;

import jakarta.transaction.Transactional;

@Service
public class ContratoServiceImpl extends CRUDImpl<Contrato, Integer> implements IContratoService {

	@Autowired
	private IContratoRepo contratoRepo;
	
	@Autowired
	private IClienteRepo clienteRepo;
	
	@Autowired
	private IProductoRepo productoRepo;
	
	@Autowired
	private IVendedorRepo vendedorRepo;
	
	@Override
	protected IGenericRepo<Contrato, Integer> getRepo() {
		return contratoRepo;
	}

	@Transactional
    @Override
    public APIResponseDTO<Contrato> registrarCarritoTransaccional(CarritoDTO carrito) {
        Contrato contrato = new Contrato();

        if (!validarClienteDatos(carrito)) {
            return APIResponseDTO.error("Los datos del cliente no son correctos.", 0);
        }

        if (carrito.getMontoEnvio() < 0) {
        	return APIResponseDTO.error("El monto del envío no es correcto.", 0);
        }

        List<DetalleContrato> detalle = new ArrayList<>();
        float total = 0;
        int tiempoMaxFabricacion = 0;
        
        if(carrito.getDetalle().size() <= 0) {
        	return APIResponseDTO.error("Debe haber al menos un producto.", 0);
        }

        for (DetalleCarritoDTO item : carrito.getDetalle()) {
            Optional<Producto> optionalProducto = productoRepo.findByIdAndEstadoTrue(item.getProducto().getId());

            if (item.getCantidad() <= 0) {
            	return APIResponseDTO.error("La cantidad solicitada debe ser más que cero.", 0);
            }
            
            if(optionalProducto.isEmpty()) {
            	return APIResponseDTO.error("El producto no existe.", 0);
            }

            Producto producto = optionalProducto.get();
            DetalleContrato det = crearDetalleContrato(producto, item.getMaterial(), item.getDetalleMaterial(), item);
            detalle.add(det);

            total += det.getPrecioTotal();
            tiempoMaxFabricacion = Math.max(tiempoMaxFabricacion, producto.getTiempoFabricacion());
        }

        Cliente cliente = obtenerOCrearCliente(carrito);
        Optional<Vendedor> vendedor = vendedorRepo.findByCorreo("jcabrera9409@gmail.com");

        contrato.setObjCliente(cliente);
        contrato.setObjVendedor(vendedor.orElse(null));
        contrato.setCodigo(carrito.getCodigo());
        contrato.setCorreo(carrito.getEmailCliente());
        contrato.setDireccionEntrega(carrito.getDireccionEntrega());
        contrato.setFechaContrato(UtilMethods.obtenerFechaActualAmericaLima());

        contrato.setFechaEntrega(contrato.getFechaContrato().plusDays(tiempoMaxFabricacion));
        contrato.setMovilidad(carrito.getMontoEnvio());
        contrato.setaCuenta(0f);
        contrato.setRecargo(0f);
        contrato.setTipoAbono("");
        contrato.setNotaPedido(carrito.getNotasPedido());
        contrato.setReferencia(carrito.getReferenciaEntrega());
        contrato.setTelefono(carrito.getTelefonoCliente());
        contrato.setGoogle_doc_id("");
        contrato.setGoogle_pdf_id("");

        float totalFinal = total + carrito.getMontoEnvio();
        contrato.setSaldo(totalFinal);
        contrato.setTotal(totalFinal);
        contrato.setEstado("Nuevo");
        contrato.setDetalleContrato(detalle);
        contrato.getDetalleContrato().forEach(d -> d.setObjContrato(contrato));
        
        Contrato contratoCreado = contratoRepo.save(contrato);
        contrato.setCodigo(contrato.getCodigo().concat("-").concat(contrato.getId().toString()));
        contratoCreado = contratoRepo.save(contrato);

        return APIResponseDTO.success("El pedido solicitado fue ingresado.", contratoCreado, 0);
    }
	
	private boolean validarClienteDatos(CarritoDTO carrito) {
        if (carrito.isEsPersonaNatural()) {
            return !carrito.getDocumentoCliente().isEmpty()
                && !carrito.getNombreCliente().isEmpty()
                && !carrito.getApellidoCliente().isEmpty();
        } else {
            return !carrito.getDocumentoCliente().isEmpty()
                && !carrito.getRazonSocialCliente().isEmpty();
        }
    }

    private Cliente obtenerOCrearCliente(CarritoDTO carrito) {
        Cliente cliente = clienteRepo.findByDocumentoCliente(carrito.getDocumentoCliente());

        if (cliente == null) {
            cliente = new Cliente();
            cliente.setEsPersonaNatural(carrito.isEsPersonaNatural());
            cliente.setDocumentoCliente(carrito.getDocumentoCliente());
            cliente.setNombreCliente(carrito.getNombreCliente());
            cliente.setApellidosCliente(carrito.getApellidoCliente());
            cliente.setRazonSocial(carrito.getRazonSocialCliente());
            cliente = clienteRepo.save(cliente);
        }

        return cliente;
    }

    private DetalleContrato crearDetalleContrato(Producto producto, Material material, DetalleMaterial detalleMaterial, DetalleCarritoDTO item) {
        DetalleContrato det = new DetalleContrato();
        det.setCantidad(item.getCantidad());
        det.setDescripcion(producto.getDescripcionTecnica().concat("\n\n").concat(material.getNombre()).concat(" ").concat(detalleMaterial.getNombre()));
        det.setPrecio(producto.getPrecioFinal());
        det.setPrecioTotal(producto.getPrecioFinal() * item.getCantidad());
        det.setObjPlantilla(producto.getObjPlantilla());
        det.setObjProducto(producto);
        return det;
    }
	
}
