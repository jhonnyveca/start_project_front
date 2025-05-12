import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  PLATFORM_ID,
  QueryList,
  ViewChildren
} from '@angular/core';

import {isPlatformBrowser, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UIChart} from 'primeng/chart';

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
@Component({
  selector: 'app-dashboard',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    FormsModule,
    UIChart
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements AfterViewInit{
  isSidebarCollapsed: boolean = false;


  @HostListener('window:resize')
  onResize() {
    this.updateSidebarForScreenSize();
  }

  updateSidebarForScreenSize() {
    this.isSidebarCollapsed = window.innerWidth <= 768;
  }

  @ViewChildren(UIChart) charts!: QueryList<UIChart>;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    // Esperar a que la animación/estilos terminen
    setTimeout(() => {
      this.charts?.forEach(chart => chart?.refresh());
    }, 300); // debe coincidir con tu transición en CSS
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

  data: any;

  options: any;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart();
  }
  ngAfterViewInit(): void {
    this.refreshCharts();
    this.updateSidebarForScreenSize();
  }
  refreshCharts(): void {
    this.cd.detectChanges(); // Asegura que los cambios en DOM estén aplicados
    this.charts?.forEach(chart => chart?.refresh());
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: 'My Second dataset',
            backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };
      this.cd.markForCheck()
    }
  }

}
