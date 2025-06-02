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


type ChatRole = 'user' | 'bot' | 'graph';

interface ChatMessage {
  role: ChatRole;
  content: string | any;
  rating?: number | null;
  done?: boolean;
  type?: 'text' | 'graph';
  hasGraph?: boolean;
  date?: string;
}
interface ApiChatMessage {
  id_session: string;
  id_channel: string;
  index_message: number;
  actor: string; // Puede ser 'User' o 'Asistente' según tu API
  message: string;
  elements: any[];
  userFeedback: number | null;
  date: string;
}

interface ChatSession {
  previousTitle?: string;
  editing: boolean;
  id: number;
  title: string;
  messages: ChatMessage[];
  isNew?: boolean;
  isLoading?: boolean;
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

  showHelpSuggestions: boolean = true;
  isEmptyHistory: boolean = false;

  suggestions = [
    { text: 'Aprende sobre la gestión del tiempo', icon: 'schedule', title: 'Gestión del tiempo' },
    { text: 'Aprende sobre el trading de acciones', icon: 'trending_up', title: 'Trading de acciones' },
    { text: 'Aprende sobre las habilidades de negociación para los negocios',
      icon: 'handshake', title: 'Habilidades de negociación' },
    { text: 'Aprende sobre cómo manejar conversaciones difíciles',
      icon: 'forum', title: 'Conversaciones difíciles' }
  ];
  animationStates: boolean[] = [];

  chatHistory: ChatSession[] = [];
  currentChat: ChatSession = this.chatHistory[0];

  userId : string = "";

  constructor(private chatService: ChatService) {}

  ngAfterViewInit(): void {
    this.graphContainers.changes.subscribe(() => {
      this.renderAllGraphs();
    });
    this.startTypewriter();
  }
  ngOnInit() {
    this.updateSidebarForScreenSize();
    this.startTypewriter();
    /*this.initializeNewChat();*/

    //prueba historial
    this.loadChatHistory('erodriguez', '2');
    this.initializeEmptyChatState();

  }
  loadChatHistory(idUser: string, idProject: string): void {
    this.chatService.getChatHistory(idUser, idProject)
      .subscribe({
        next: (response) => {
          if (response?.chats?.length > 0) {
            console.log(response)

            // Mapear la respuesta del API a tu estructura de chatHistory
            this.chatHistory = response.chats.map((chat: any) => ({
              id: chat.id_chat,
              title: chat.title_chat,
              messages: [], // Cargar mensajes
              editing: false,
              createdDate: chat.createdDate,
              lastUpdateDate: chat.lastUpdateDate
            }));

            // Cargar el primer chat del historial
         /*   if (this.chatHistory.length > 0) {
              this.loadChat(this.chatHistory[0]);
            }
          }else {
            this.isEmptyHistory = true;
            this.initializeNewChat();*/
          }
        },
        error: (error) => {
          console.error('Error al cargar historial:', error);
          this.isEmptyHistory = true;
          this.initializeNewChat();
        }
      });
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
    // Evitar recarga si ya es el chat actual
    if (this.currentChat?.id === chat.id) return;

    // Mostrar indicador de carga
    chat.isLoading = true;
    this.currentChat = chat;
    this.userId = chat.id.toString();

    // Solo cargar mensajes si no los tiene
    if (chat.messages.length === 0) {
      this.chatService.getChatMessages('erodriguez', '2', chat.id.toString())
        .subscribe({
          next: (response: any) => {
            chat.isLoading = false;
            if (response?.sequenceMessage?.length > 0) {
              chat.messages = this.mapApiMessagesToChatMessages(response.sequenceMessage);
            }
            this.scrollToBottom();
          },
          error: (error) => {
            chat.isLoading = false;
            console.error('Error al cargar mensajes:', error);
          }
        });
    } else {
      chat.isLoading = false;
      this.scrollToBottom();
    }
  }

  private mapApiMessagesToChatMessages(apiMessages: ApiChatMessage[]): ChatMessage[] {
    return apiMessages.flatMap(apiMsg => {
      // Convertir el actor del API a tu tipo de rol
      const role: ChatRole = this.determineRole(apiMsg.actor);

      // Mensaje base
      const baseMessage: ChatMessage = {
        role,
        content: apiMsg.message,
        rating: apiMsg.userFeedback || null,
        done: true,
        type: 'text',
        date: apiMsg.date
      };

      // Verificar si tiene elementos gráficos
      const graphElement = apiMsg.elements?.find((el: any) => el.type === 'GRAPH');

      if (graphElement) {
        return [
          baseMessage,
          {
            role: 'graph',
            content: graphElement.object,
            done: true,
            type: 'graph',
            rating: apiMsg.userFeedback || null,
            date: apiMsg.date
          } as ChatMessage // Asegurar el tipo
        ];
      }

      return baseMessage;
    });
  }
  private determineRole(apiActor: string): ChatRole {
    switch(apiActor.toLowerCase()) {
      case 'user':
        return 'user';
      case 'asistente':
        return 'bot';
      default:
        return 'bot'; // Valor por defecto
    }
  }
  initializeNewChat() {
    const newId = this.chatHistory.length > 0
      ? Math.max(...this.chatHistory.map(c => c.id)) + 1
      : 1;

    this.currentChat = {
      id: newId,
      title: 'Nuevo chat',
      messages: [],
      editing: false,
      isNew: true
    };
    const exists = this.chatHistory.some(chat => chat.id === this.currentChat.id);
    if (!exists) {
      this.chatHistory.unshift(this.currentChat);
    }

    this.userId = this.currentChat.id.toString();
    this.isEmptyHistory = false;
  }
  initializeEmptyChatState() {
    // Crear un chat vacío si no existe uno actual

    if (!this.currentChat) {
      this.currentChat = {
        id: this.chatHistory.length > 0 ? Math.max(...this.chatHistory.map(c => c.id)) + 1 : 1,
        title: 'Nuevo chat',
        messages: [],
        editing: false,
        isNew: true
      };
    }
  }

  newChat(): void {
    this.startTypewriter();
    const newId = this.chatHistory.length > 0
      ? Math.max(...this.chatHistory.map(c => c.id)) + 1
      : 1;

    const newSession: ChatSession = {
      id: newId,
      title: `Nuevo chat ${newId}`,
      messages: [],
      editing: false,
      isNew: true
    };

    this.chatHistory.unshift(newSession);
    this.currentChat = newSession;
    this.userId = newId.toString();
    if (this.isEmptyHistory) {
      this.isEmptyHistory = false;
    }
    this.scrollToBottom();
  }
  saveTitle(chat: ChatSession) {
    chat.editing = false;
    // Aquí podrías añadir lógica para guardar el cambio en tu backend
  }
  cancelEdit(chat: ChatSession) {
    if (chat.previousTitle) {
      chat.title = chat.previousTitle;
    }
    chat.editing = false;
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
        graphData.width = 250;
        graphData.height = 200;

        // Limpiar el contenedor antes de renderizar
        container.nativeElement.innerHTML = '';

        vegaEmbed(container.nativeElement, graphData, {
          actions: false,
          renderer: 'svg'
        }).catch(err => {
          console.error('Error al renderizar gráfico:', err);
        });
      }
    });
  }
  sendMessage() {
    if (!this.userInput.trim()) return;

    this.userId = this.currentChat.id.toString();

    if (this.currentChat.isNew && this.currentChat.messages.length === 0) {
      this.updateChatTitle(this.userInput.trim());
      this.currentChat.isNew = false; // Ya no es nuevo

      if (this.isEmptyHistory) {
        this.chatHistory.unshift(this.currentChat);
        this.isEmptyHistory = false;
      }
    }
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

    console.log(this.currentChat.title);


    this.chatService.sendMenssage({
      chatHeader : {
        id_project: "2",
        id_chat: this.userId,
        title_chat: !this.currentChat.title ? this.currentChat.title : 'Nuevo chat',
        id_user: "erodriguez", //jvelasquez
        createdDate: new Date().toISOString(),
        lastUpdateDate: new Date().toISOString()
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
  updateChatTitle(userQuestion: string): void {
    // Limita la longitud del título y limpia el texto
    let newTitle = userQuestion.substring(0, 50); // Limita a 50 caracteres
    newTitle = newTitle.replace(/\?/g, ''); // Elimina signos de interrogación

    // Si está vacío después de limpiar, usa un título por defecto
    if (!newTitle.trim()) {
      newTitle = 'Consulta del usuario';
    }

    this.currentChat.title = newTitle;

    // Actualiza también en el historial si es necesario
    const chatInHistory = this.chatHistory.find(c => c.id === this.currentChat.id);
    if (chatInHistory) {
      chatInHistory.title = newTitle;
    }
  }
  editTitle(chat: ChatSession, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Evita que se active el loadChat
    }

    chat.editing = true;
    chat.previousTitle = chat.title;

    // Enfoca el input después de un pequeño delay
    setTimeout(() => {
      const inputElement = document.querySelector(`.history-item input`) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    }, 0);
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
