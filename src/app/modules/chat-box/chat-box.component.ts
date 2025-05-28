import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {Subject} from 'rxjs';
import { Rating } from 'primeng/rating';
import { ChatService } from '../../core/service/chat.service';
import vegaEmbed from 'vega-embed';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface ChatMessage {
  role: 'user' | 'bot' | 'graph';
  content: string | any;
  rating?: number | null;
  done?: boolean;
  type?: 'text' | 'graph';
  hasGraph?: boolean;
}

interface ChatSession {
  editing: boolean;
  id: number;
  title: string;
  messages: ChatMessage[];

}

@Component({
  selector: 'app-chat-box',
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    NgForOf,
    Rating
  ],
  templateUrl: './chat-box.component.html',
  standalone: true,
  styleUrl: './chat-box.component.scss',
  animations: [
    trigger('fadeInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.3s ease-out')
      ])
    ])
  ]
})
export default class ChatBoxComponent implements AfterViewInit, OnInit, OnDestroy, AfterViewChecked {
  @ViewChildren('graphContainer') graphContainers!: QueryList<ElementRef>;
  @ViewChild('bottomAnchor') bottomAnchor!: ElementRef;

  isSidebarCollapsed: boolean = false;
  userInput: string = '';
  isGenerating = false;
  private cancelGeneration = new Subject<void>();
  private generationInterval?: any;

  typewriterText: string = '¿En qué puedo ayudarte?';
  displayedText: string = '';
  typewriterIndex: number = 0;

  showHelpSuggestions: boolean = false;

  constructor(private chatService: ChatService) {}

  ngAfterViewInit(): void {
    this.graphContainers.changes.subscribe(() => {
      this.renderAllGraphs();
    });
  }

  chatHistory: ChatSession[] = [
    {
      id: 1,
      title: 'Pedido de ayuda',
      messages: [{ role: 'bot', content: 'Claro, dime más sobre tu problema.', type: 'text' }],
      editing: false
    }
  ];

  currentChat: ChatSession = this.chatHistory[0];

  ngOnInit() {
    this.updateSidebarForScreenSize();
    this.initializeNewChat();
    this.startTypewriter();
  }

  startTypewriter() {
    const interval = setInterval(() => {
      if (this.typewriterIndex < this.typewriterText.length) {
        this.displayedText += this.typewriterText[this.typewriterIndex];
        this.typewriterIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40); // velocidad del efecto (en ms)
  }
  onMicClick() {
    console.log('Micrófono activado');

  }
  @HostListener('window:resize')
  onResize() {
    this.updateSidebarForScreenSize();
  }

  updateSidebarForScreenSize() {
    this.isSidebarCollapsed = window.innerWidth <= 960;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  loadChat(chat: ChatSession): void {
    this.currentChat = chat;
    this.scrollToBottom();
  }

  initializeNewChat() {
    const newId = this.chatHistory.length + 1;
    this.currentChat = {
      id: newId,
      title: 'Consulta incial',
      messages: [],
      editing: false
    };
    this.chatHistory.push(this.currentChat);
  }

  newChat(): void {
    const newId = this.chatHistory.length > 0
      ? Math.max(...this.chatHistory.map(c => c.id)) + 1
      : 1;

    const newSession: ChatSession = {
      id: newId,
      title: `Nuevo chat ${newId}`,
      messages: [],
      editing: false
    };

    this.chatHistory.unshift(newSession);
    this.currentChat = newSession;
  }

  editTitle(chat: ChatSession): void {
    chat.editing = true;
  }

  rateMessage(messageIndex: number, rating: number | null | undefined) {
    console.log(`Mensaje ${messageIndex} calificado con ${rating} estrellas`);
  }

  renderAllGraphs() {
    this.graphContainers.forEach((container, index) => {
      // Encontrar el mensaje de gráfico correspondiente
      const graphMessages = this.currentChat.messages.filter(m => m.type === 'graph');
      const message = graphMessages[index];

      if (message && message.content) {
        const graphData = {...message.content};
        /*if (graphData?.transform) {
          delete graphData.transform;
        }*/
        graphData.width = 'container';
        graphData.height = 200;

        // Limpiar el contenedor antes de renderizar
        container.nativeElement.innerHTML = '';

        vegaEmbed(container.nativeElement, graphData, { actions: false })
          .then(() => {

          })
          .catch(err => {
            console.error('Error al renderizar Vega:', err);
          });
      }
    });
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Añadir mensaje del usuario
    this.currentChat.messages.push({
      role: 'user',
      content: this.userInput.trim(),
      rating: null,
      done: true,
      type: 'text'
    });

    const userMessage = this.userInput.trim();
    this.userInput = '';
    this.isGenerating = true;
    this.scrollToBottom();


    this.chatService.sendMenssage({
      chatHeader : {
        id_project: "2",
        id_chat: "009",
        title_chat: "Chat prueba",
        id_user: "erodriguez",
        createdDate: "2025-03-12T14:00:12",
        lastUpdateDate: "2025-03-14T09:41:23"
      },
      id_session: "1",
      id_channel: "1",
      message: userMessage,
      index_message: 1
    }).subscribe({
      next: (res: any) => {
        if (!res) {
          throw new Error('La respuesta del servidor está vacía');
        }

        const responseText = res.message || 'No tengo una respuesta para eso.';
        const graphData = res.elements?.[0]?.object;

        console.log(graphData);

        // Mensaje de texto del bot
        const botMessage: ChatMessage = {
          role: 'bot',
          content: responseText,
          rating: graphData ? null : undefined ,
          done: true,
          type: 'text',
          hasGraph: !!graphData,
        };
        this.currentChat.messages.push(botMessage);

        // Mensaje de gráfico
        if (graphData) {
          const graphMessage: ChatMessage = {
            role: 'graph',
            content: graphData,
            done: true,
            type: 'graph',
            rating: null,
          };
          this.currentChat.messages.push(graphMessage);
        }

        this.isGenerating = false;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.isGenerating = false;

        // Mensaje de error del bot
        const errorMessage: ChatMessage = {
          role: 'bot',
          content: 'Lo siento, ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
          rating: null,
          done: true,
          type: 'text'
        };
        this.currentChat.messages.push(errorMessage);
        this.scrollToBottom();
      }
    });
  }

  stopGeneration() {
    this.cancelGeneration.next();
  }

  ngOnDestroy() {
    this.cancelGeneration.complete();
    clearInterval(this.generationInterval);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  suggestions = [
    { text: 'Aprende sobre la gestión del tiempo', icon: 'schedule', title: 'Gestión del tiempo' },
    { text: 'Aprende sobre el trading de acciones', icon: 'trending_up', title: 'Trading de acciones' },
    { text: 'Aprende sobre las habilidades de negociación para los negocios',
      icon: 'handshake', title: 'Habilidades de negociación' },
    { text: 'Aprende sobre cómo manejar conversaciones difíciles',
      icon: 'forum', title: 'Conversaciones difíciles' }
  ];
  animationStates: boolean[] = [];
// Métodos para manejar las sugerencias
  toggleHelpSuggestions() {
    this.showHelpSuggestions = !this.showHelpSuggestions;
    if (this.showHelpSuggestions) {
      this.animationStates = this.suggestions.map(() => false);
    }
  }

  onAnimationDone(index: number) {
    this.animationStates[index] = true;
  }

  selectSuggestion(text: string) {
    this.userInput = text;
    this.showHelpSuggestions = false;

    this.setFocusToInput();
  }
  private setFocusToInput() {
    // Usamos setTimeout para asegurar que el cambio de detección de Angular haya terminado
    setTimeout(() => {
      const inputElement = document.querySelector('.chat-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        // Opcional: mover el cursor al final del texto
        inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
      }
    }, 10); // Pequeño delay para garantizar que el DOM esté actualizado
  }

  private scrollToBottom(): void {
    try {
      this.bottomAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('No se pudo hacer scroll:', err);
    }
  }

}
