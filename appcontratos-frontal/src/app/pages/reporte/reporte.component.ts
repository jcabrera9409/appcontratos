import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import es_ES from "@amcharts/amcharts5/locales/es_ES";

import { ReporteService } from '../../_service/reporte.service';
import { CustomDateAdapter } from '../../material/custom-date-adapter';
import { V } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, ReactiveFormsModule],
  providers: [
    provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit {

  constructor(
    private reporteService: ReporteService
  ) { }

  filtroFecha = new FormGroup({
    fechaInicio: new FormControl(),
    fechaFin: new FormControl()
  });

  private roots: { [key: string]: am5.Root } = {};

  ngOnInit(): void {
    const today = new Date();
    const past = new Date(today);
    past.setDate(today.getDate() - 30);
    this.filtroFecha.setValue({
      fechaInicio: past,
      fechaFin: today
    })

    this.llenarGraficoContratoIngresos(past, today);
    this.llenarGraficoTipoAbono(past, today);
    this.llenarGraficoPlantillaIngresos(past, today);
  }

  llenarGraficoPlantillaIngresos(fechaInicio: Date, fechaFin: Date): void {
    this.reporteService.reportePlantillaIngresos(fechaInicio, fechaFin).subscribe(data => {
      if (!data || data.length === 0) {
        console.warn("No hay datos para el período seleccionado.");
        data = [];
      }

      const dataGraficoPlantilla = this.convertirDatosParaGraficoPlantilla(data);

      this.generarGraficoBarrasInvertida("chart3", dataGraficoPlantilla, "{value} veces");
    });
  }

  private convertirDatosParaGraficoPlantilla(data: any[]): { nombre: string; value: number }[] {
    return data
      .map(reporte => ({
        nombre: reporte.nombre,
        value: reporte.cantidad ?? 0
      }))
      .sort((a, b) => a.value - b.value);
  }

  llenarGraficoTipoAbono(fechaInicio: Date, fechaFin: Date): void {
    this.reporteService.reporteTipoAbono(fechaInicio, fechaFin).subscribe(data => {
      if (!data || data.length === 0) {
        console.warn("No hay datos para el período seleccionado.");
        data = [];
      }

      const dataGraficoTipoAbono = this.convertirDatosParaGraficoTipoAbono(data);

      this.generarGraficoPie("chart4", dataGraficoTipoAbono, "{category}: S/. {value.formatNumber('#,###.00')}");

    });
  }

  private convertirDatosParaGraficoTipoAbono(data: any[]): { category: string; value: number }[] {
    return data.map(reporte => ({
      category: reporte.tipoAbono,
      value: reporte.totalIngresos ?? 0
    }));
  }

  llenarGraficoContratoIngresos(fechaInicio: Date, fechaFin: Date): void {
    this.reporteService.reporteContratosIngresos(fechaInicio, fechaFin).subscribe(data => {
      if (!data || data.length === 0) {
        console.warn("No hay datos para el período seleccionado.");
        data = [];
      }

      const dataGraficoContratos = this.convertirDatosParaGrafico(data, "nroContratos");
      const dataGraficoIngresos = this.convertirDatosParaGrafico(data, "totalIngresos");

      this.generarGraficoBarras("chart1", this.completarFechas(dataGraficoContratos), "{valueY} contratos");
      this.generarGraficoBarras("chart2", this.completarFechas(dataGraficoIngresos), "S/. {value.formatNumber('#,###.00')}");
    });
  }

  private convertirDatosParaGrafico(data: any[], campo: "nroContratos" | "totalIngresos"): { date: number; value: number }[] {
    return data
      .filter(reporte => reporte.fechaContrato)
      .map(reporte => ({
        date: new Date(reporte.fechaContrato + "T00:00:00").getTime(),
        value: reporte[campo] ?? 0
      }));
  }

  actualizarPeriodo() {
    this.llenarGraficoContratoIngresos(this.filtroFecha.value.fechaInicio, this.filtroFecha.value.fechaFin);
    this.llenarGraficoTipoAbono(this.filtroFecha.value.fechaInicio, this.filtroFecha.value.fechaFin);
    this.llenarGraficoPlantillaIngresos(this.filtroFecha.value.fechaInicio, this.filtroFecha.value.fechaFin);
  }

  generarGraficoPie(contenedor, data, labelText) {
    if (this.roots[contenedor]) {
      this.roots[contenedor].dispose();
    }

    this.roots[contenedor] = am5.Root.new(contenedor);

    let root = this.roots[contenedor];

    root.locale = es_ES;

    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root)
    ]);


    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270
      })
    );

    series.set("tooltip", am5.Tooltip.new(root, {
      labelText: labelText,
    }));

    series.states.create("hidden", {
      endAngle: -90
    });

    series.get("colors").set("colors", [
      am5.color("#4a235a"),  // Color principal oscuro
      am5.color("#5b2c6f"),  // Color principal medio
      am5.color("#6c3483"),  // Color acento
      am5.color("#7d3c98"),  // Color acento oscuro
      am5.color("#8e44ad"),  // Color acento claro
      am5.color("#a569bd"),  // Color acento claro
      am5.color("#bb8fce"),  // Color acento claro
      am5.color("#d2b4de"),  // Color acento claro
      am5.color("#e8daef"),  // Color acento claro
      am5.color("#f4ecf7"),  // Color acento claro
    ]);

    series.data.setAll(data);

    series.appear(1000, 100);
  }

  generarGraficoBarras(contenedor, data, labelText) {
    if (this.roots[contenedor]) {
      this.roots[contenedor].dispose();
    }

    this.roots[contenedor] = am5.Root.new(contenedor);

    let root = this.roots[contenedor];

    root.locale = es_ES;

    let customTheme = am5.Theme.new(root);

    customTheme.rule("ColorSet").setAll({
      colors: [
        am5.color("#b366b3"),
      ],
      reuse: true
    });

    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
      customTheme
    ]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0
    }));

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: false,
        minorLabelsEnabled: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.set("minorDateFormats", {
      "day": "dd",
      "month": "MM"
    });


    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: labelText,
        keepTargetHover: true,
        labelHTML: "<div style='text-align: center; font-size: 13px; color: #ffffff; font-weight: bold;'>" + labelText + "</div>"
      })
    }));

    series.columns.template.setAll({ strokeOpacity: 0 })

    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);
  }

  generarGraficoBarrasInvertida(contenedor, data, labelText) {
    if (this.roots[contenedor]) {
      this.roots[contenedor].dispose();
    }

    this.roots[contenedor] = am5.Root.new(contenedor);
    let root = this.roots[contenedor];

    root.locale = es_ES;

    let customTheme = am5.Theme.new(root);

    customTheme.rule("ColorSet").setAll({
      colors: [
        am5.color("#b366b3"),
      ],
      reuse: true
    });

    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
      customTheme
    ]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: true,
      wheelX: "panY",
      wheelY: "zoomY",
      paddingLeft: 0,
      layout: root.verticalLayout
    }));

    let yRenderer = am5xy.AxisRendererY.new(root, {});

    yRenderer.grid.template.set("location", 1);

    let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "nombre",
      renderer: yRenderer
    }));

    yAxis.get("renderer").labels.template.setAll({
      oversizedBehavior: "wrap",
      maxWidth: 120,
      textAlign: "right",
      fontSize: 12,
    });


    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0.1,
        minGridDistance: 80
      })
    }));

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "nombre",
      tooltip: am5.Tooltip.new(root, {
        labelText: labelText,
        pointerOrientation: "horizontal",
        labelHTML: "<div style='text-align: center; font-size: 13px; color: #ffffff; font-weight: bold;'>" + labelText + "</div>"
      })
    }));

    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0,
      tooltipText: labelText,
      interactive: true
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: labelText,
          centerY: am5.percent(50),
          populateText: true
        })
      });
    });

    chart.set("scrollbarY", am5.Scrollbar.new(root, {
      orientation: "vertical"
    }));

    yAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);
  }

  completarFechas(data) {
    let fechas: Set<number> = new Set(data.map(d => new Date(d.date).getTime()));  // Fechas existentes
    let fechaInicio = Math.min(...fechas);
    let fechaFin = Math.max(...fechas);

    let nuevaData = [];
    for (let d = fechaInicio; d <= fechaFin; d += 86400000) { // Itera día por día
      if (fechas.has(d)) {
        nuevaData.push(data.find(x => new Date(x.date).getTime() === d));
      } else {
        nuevaData.push({ date: d, value: null });  // 👈 Agrega fechas vacías
      }
    }
    return nuevaData;
  }
}
