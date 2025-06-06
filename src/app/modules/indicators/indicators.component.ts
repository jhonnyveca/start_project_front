import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Toolbar} from "primeng/toolbar";
import vegaEmbed from 'vega-embed';
import {FormsModule} from '@angular/forms';
import { ButtonDirective} from 'primeng/button';
import {Select} from 'primeng/select';
import {Panel} from 'primeng/panel';
import {FloatLabel} from "primeng/floatlabel";
import IndicatorService from '../../core/service/indicator.service';


interface Anio {
  name: string;
  code: string;
}
interface Category {
  name: string;
  code: string;
}
@Component({
  selector: 'app-indicators',
    imports: [
        Toolbar,
        FormsModule,
        ButtonDirective,
        Select,
        Panel,
        FloatLabel
    ],
  templateUrl: './indicators.component.html',
  standalone: true,
  styleUrl: './indicators.component.scss'
})
export default class IndicatorsComponent implements OnInit{
  @ViewChild('vegaContainer', { static: true }) vegaContainer!: ElementRef;
  @ViewChild('vegaLineChart', { static: true }) vegaLineChart!: ElementRef;

  data: any;
  constructor(private indicator: IndicatorService) {}


  vegaSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "width": "container",
    "height": 200,
    "autosize":true,
    "data": {
      "values": [
        {"category":"A", "group": "x", "value":0.1},
        {"category":"A", "group": "y", "value":0.6},
        {"category":"A", "group": "z", "value":0.9},
        {"category":"B", "group": "x", "value":0.7},
        {"category":"B", "group": "y", "value":0.2},
        {"category":"B", "group": "z", "value":1.1},
        {"category":"C", "group": "x", "value":0.6},
        {"category":"C", "group": "y", "value":0.1},
        {"category":"C", "group": "z", "value":0.2}
      ]
    },
    "mark": "bar",
    "encoding": {
      "x": {"field": "category"},
      "y": {"field": "value", "type": "quantitative"},
      "xOffset": {"field": "group"},
      "color": {"field": "group"}
    }
  };

/*
  lineChartSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "description": "Stock prices of 5 Tech Companies over Time.",
    "width": "container",
    "height": 200,
    "autosize":true,
    "data": {"values": [
        { "date": 'Sat, 01 Jan 2000 05:00:00 GMT', "price": 29.673333333333325 ,"symbol":"MSFT"},
        { "date": 'Mon, 01 Jan 2001 05:00:00 GMT', "price": 25.3475 ,"symbol":"AMZN"},
        { "date": 'Tue, 01 Jan 2002 05:00:00 GMT', "price": 21.826666666666668 ,"symbol":"IBM"},
        { "date": 'Wed, 01 Jan 2003 05:00:00 GMT', "price": 20.934166666666666 ,"symbol":"GOOG"},
      ]},
    "mark": {
      "type": "line",
      "point": true
    },
    "encoding": {
      "x": {"timeUnit": "year", "field": "date"},
      "y": {"aggregate":"mean", "field": "price", "type": "quantitative"},
      "color": {"field": "symbol", "type": "nominal"}
    }
  };
*/

  anios : Anio[] | undefined
  category : Category[] | undefined
  value1: Anio | undefined;
  value2: Category | undefined;
  ngOnInit(): void {

   this.indicator.getData().subscribe((response: any) => {
      this.data = response;

     const graph = response.elements?.[0].object
     console.log(graph)

    /* if (graph?.transform) {
       delete graph.transform;
     }*/
     graph.width = 'container';
     graph.height = 200;

     if (graph) {
       // @ts-ignore
       vegaEmbed(this.vegaLineChart.nativeElement, graph, { actions: false })
         .catch(err => console.error('Error al renderizar Vega:', err));
     }

    });


    this.anios  = [
      { name: '2025', code: '1' },
      { name: '2024', code: '2' },
      { name: '2023', code: '3' }
    ];
    this.category = [
      { name: 'A', code: '1' },
      { name: 'B', code: '2' },
      { name: 'C', code: '3' }
    ];
    // @ts-ignore
    vegaEmbed(this.vegaContainer.nativeElement, this.vegaSpec, { actions: false })
      .catch(error => console.error('Error al renderizar Vega:', error));

   /* // @ts-ignore
    vegaEmbed(this.vegaLineChart.nativeElement, this.lineChartSpec, { actions: false })
      .catch(err => console.error('Error al renderizar el gráfico de líneas:', err));*/
  }
}
