package com.surrender.repo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.Contrato;

import dto.ReporteContratosIngresosDTO;
import dto.ReporteTipoAbonoDTO;
import jakarta.transaction.Transactional;

public interface IContratoRepo extends IGenericRepo<Contrato, Integer> {
	@Transactional
	@Modifying
	@Query("UPDATE Contrato c SET c.estado = :estado, c.objVendedorActualizacion.id = :vendedorId, c.fechaActualizacion = :fechaActualizacion WHERE c.id = :id")
	int updateEstadoById(@Param("id") Integer id, @Param("estado") String estado,
			@Param("vendedorId") Integer vendedorId, @Param("fechaActualizacion") LocalDateTime fechaActualizacion);

	@Query("SELECT c FROM Contrato c WHERE " + "LOWER(c.codigo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.objCliente.nombreCliente) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.objCliente.apellidosCliente) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.objCliente.razonSocial) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.objCliente.documentoCliente) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.telefono) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.correo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.direccionEntrega) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.referencia) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "CAST(c.fechaEntrega AS string) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "CAST(c.saldo AS string) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "CAST(c.total AS string) LIKE LOWER(CONCAT('%', :keyword, '%'))"
			+ "ORDER BY CASE WHEN c.estado = 'Entregado' OR c.estado = 'Anulado' THEN 1 ELSE 0 END, "
			+ "CASE WHEN c.estado = 'Entregado' OR c.estado = 'Anulado' THEN c.fechaEntrega END DESC, "
			+ "CASE WHEN c.estado <> 'Entregado' AND c.estado <> 'Anulado' THEN c.fechaEntrega END ASC")
	Page<Contrato> findOrderPageable(@Param("keyword") String keyword, Pageable pageable);

	Contrato findByCodigo(String codigo);

	List<Contrato> findByEstadoNotIn(List<String> estados);

	@Query("SELECT FUNCTION('DATE', c.fechaContrato) as fechaContrato, " 
			+ "COUNT(c.id) as nroContratos, "
			+ "SUM(c.aCuenta + c.saldo) as totalIngresos " 
			+ "FROM Contrato c "
			+ "WHERE FUNCTION('DATE', c.fechaContrato) BETWEEN :fechaInicio AND :fechaFin "
			+ "AND c.estado <> 'Anulado' " 
			+ "GROUP BY FUNCTION('DATE', c.fechaContrato) "
			+ "ORDER BY FUNCTION('DATE', c.fechaContrato) DESC")
	List<ReporteContratosIngresosDTO> obtenerReporteContratosIngresos(@Param("fechaInicio") LocalDate fechaInicio,
			@Param("fechaFin") LocalDate fechaFin);
	

	@Query("""
			    SELECT new dto.ReporteTipoAbonoDTO(c.tipoAbono, SUM(c.aCuenta))
			    FROM Contrato c
			    WHERE DATE(c.fechaContrato) BETWEEN :fechaInicio AND :fechaFin
			      AND c.estado <> 'Anulado'
			    GROUP BY c.tipoAbono
			""")
	List<ReporteTipoAbonoDTO> obtenerIngresosDesdeContrato(@Param("fechaInicio") LocalDate fechaInicio,
			@Param("fechaFin") LocalDate fechaFin);
}
