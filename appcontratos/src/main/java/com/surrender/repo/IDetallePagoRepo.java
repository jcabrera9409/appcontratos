package com.surrender.repo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.DetallePago;

import dto.ReporteTipoAbonoDTO;
import jakarta.transaction.Transactional;

public interface IDetallePagoRepo extends IGenericRepo<DetallePago, Integer> {

	@Transactional
	@Modifying
	@Query("UPDATE DetallePago d SET d.estado = :estado, d.objVendedorActualizacion.id = :vendedorId, d.fechaActualizacion = :fechaActualizacion WHERE d.id = :id")
	int updateEstadoById(@Param("id") Integer id, @Param("estado") boolean estado,
			@Param("vendedorId") Integer vendedorId, @Param("fechaActualizacion") LocalDateTime fechaActualizacion);

	@Query("""
			    SELECT new dto.ReporteTipoAbonoDTO(dp.tipoAbono, SUM(dp.pago))
			    FROM DetallePago dp
			    JOIN dp.objContrato c
			    WHERE DATE(c.fechaContrato) BETWEEN :fechaInicio AND :fechaFin
			      AND c.estado <> 'Anulado'
			      AND dp.estado = true
			    GROUP BY dp.tipoAbono
			""")
	List<ReporteTipoAbonoDTO> obtenerIngresosDesdeDetallePago(@Param("fechaInicio") LocalDate fechaInicio,
			@Param("fechaFin") LocalDate fechaFin);

}
