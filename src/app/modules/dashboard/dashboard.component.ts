import {
  Component, ElementRef,
  HostListener, OnInit, ViewChild,
} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import vegaEmbed from 'vega-embed';
import { ButtonDirective} from 'primeng/button';
import {Panel} from 'primeng/panel';
import {Select} from 'primeng/select';
import {Toolbar} from 'primeng/toolbar';
import {FloatLabel} from 'primeng/floatlabel';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

interface ChatSession {
  editing: boolean;
  id: number;
  title: string;
  messages: ChatMessage[];
}
interface Anio {
  name: string;
  code: string;
}
interface Category {
  name: string;
  code: string;
}
@Component({
  selector: 'app-dashboard',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    ButtonDirective,
    Panel,
    Select,
    Toolbar,
    FloatLabel
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements OnInit {

  isSidebarCollapsed: boolean = false;


  @HostListener('window:resize')
  onResize() {
    this.updateSidebarForScreenSize();
  }

  updateSidebarForScreenSize() {
    this.isSidebarCollapsed = window.innerWidth <= 768;
  }


  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  chatHistory: ChatSession[] = [
    {
      id: 2, title: 'Dashboard 2', messages: [{role: 'bot', content: 'Claro, dime más sobre tu problema.'}],
      editing: false
    },
    {
      id: 1, title: 'Dashboard 1', messages: [{role: 'bot', content: 'Hola, ¿en qué puedo ayudarte?'}],
      editing: false
    }

  ];

  currentChat: { messages: { role: string; content: string }[]; id: number; title: string } = this.chatHistory[0]; // por defecto


  loadChat(chat: ChatSession): void {
    this.currentChat = chat;
  }

  newChat(): void {
    const newId = this.chatHistory.length + 1;
    const newSession: { messages: { role: string; content: string }[]; id: number; title: string } = {
      id: newId,
      title: `Nuevo dashboard ${newId}`,
      messages: [{
        role: 'bot',
        content: 'Hola, ¿cómo puedo ayudarte?'
      }]
    };

    this.chatHistory.unshift(<ChatSession>newSession);
    this.currentChat = newSession;
  }

  editTitle(chat: ChatSession): void {
    chat.editing = true;
  }

  anios : Anio[] | undefined
  category : Category[] | undefined
  value1: Anio | undefined;
  value2: Category | undefined;

  /// Graficos
  @ViewChild('chart1', {static: true}) chart1Ref!: ElementRef;
  @ViewChild('chart2', {static: true}) chart2Ref!: ElementRef;
  @ViewChild('chart3', {static: true}) chart3Ref!: ElementRef;
  @ViewChild('chart4', {static: true}) chart4Ref!: ElementRef;

  lineChartSpec(title: string, data: any[]) {
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: title,
      width: 'container',
      height: 250,
      data: {values: data},
      mark: 'line',
      encoding: {
        x: {field: 'date', type: 'temporal', title: 'Fecha'},
        y: {field: 'value', type: 'quantitative', title: 'Valor'}
      },
      title
    };
  }


  ngOnInit(): void {
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
    this.updateSidebarForScreenSize();
    const data1 = [
      {date: '2024-01-01', value: 10},
      {date: '2024-02-01', value: 20},
      {date: '2024-03-01', value: 15}
    ];

    const data2 = [
      {date: '2024-01-01', value: 30},
      {date: '2024-02-01', value: 50},
      {date: '2024-03-01', value: 40}
    ];

    const data3 = [
      {date: '2024-01-01', value: 5},
      {date: '2024-02-01', value: 25},
      {date: '2024-03-01', value: 35}
    ];

    const data4 = [
      {date: '2024-01-01', value: 60},
      {date: '2024-02-01', value: 30},
      {date: '2024-03-01', value: 90}
    ];

    // @ts-ignore
    vegaEmbed(this.chart1Ref.nativeElement, this.lineChartSpec('Gráfico 1', data1), {actions: false});
    // @ts-ignore
    vegaEmbed(this.chart2Ref.nativeElement, this.lineChartSpec('Gráfico 2', data2), {actions: false});
    // @ts-ignore
    vegaEmbed(this.chart3Ref.nativeElement, this.lineChartSpec('Gráfico 3', data3), {actions: false});
    // @ts-ignore
    vegaEmbed(this.chart4Ref.nativeElement, this.lineChartSpec('Gráfico 4', data4), {actions: false});
  }
}
