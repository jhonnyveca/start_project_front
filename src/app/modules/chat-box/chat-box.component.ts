import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Subject, take} from 'rxjs';
import {Rating} from 'primeng/rating';
import {ChatService} from '../../core/service/chat.service';
import vegaEmbed from 'vega-embed';


interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  rating?: number | null;
  done?: boolean;
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
  styleUrl: './chat-box.component.scss'
})
export default class ChatBoxComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('vegaGraph', { static: true }) vegaGraph!: ElementRef;

  isSidebarCollapsed: boolean = false;
  userInput: string = '';
  isGenerating = false;
  private cancelGeneration = new Subject<void>();
  private generationInterval?: any;

  constructor(private chatService: ChatService) {}

  ngAfterViewInit(): void {

    vegaEmbed(this.vegaGraph.nativeElement, {}, { actions: false })
      .catch(err => console.error('Error al renderizar Vega:', err));
    }


  chatHistory: ChatSession[] = [
    {
      id: 1,
      title: 'Pedido de ayuda',
      messages: [{ role: 'bot', content: 'Claro, dime más sobre tu problema.' }],
      editing: false
    }
  ];

  currentChat: ChatSession = this.chatHistory[0];

  ngOnInit() {
    this.updateSidebarForScreenSize();
    this.initializeNewChat();

  }
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

  loadChat(chat: ChatSession): void {
    this.currentChat = chat;
    this.scrollToBottom();
  }

  initializeNewChat() {
    const newId = this.chatHistory.length + 1;
    this.currentChat = {
      id: newId,
      title: 'Consulta incial',
      messages: [], // Chat completamente vacío
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

  suggestQuestion(question: string): void {
    this.userInput = question;
  }

  rateMessage(messageIndex: number, rating: number | null | undefined) {
    console.log(`Mensaje ${messageIndex} calificado con ${rating} estrellas`);

  }

  rederGraph(graphChat:any) {

    if (graphChat?.transform) {
      delete graphChat.transform;
    }
    graphChat.width = 200;
    graphChat.height = 200;

    if (graphChat) {
      vegaEmbed(this.vegaGraph.nativeElement, graphChat, { actions: false })
        .catch(err => console.error('Error al renderizar Vega:', err));
    }
  }
  sendMessage() {

    let mensaje : string = ''
    if (!this.userInput.trim()) return;
    this.chatService.sendMenssage({
      id_project:'12',
      id_chat: '1',
      id_session:'1',
      id_channel:'1',
      id_user:'erodriguez',
      message: this.userInput.trim().toString(),
      index_message: 1
    }).subscribe(
      (res: any) => {
        console.log('Respuesta del servidor:', res.message);
        mensaje = res.message;
        //this.responses = res.response;
        const fullResponse = mensaje;
        let currentPosition = 0;

        // Cancelar cualquier generación previa
        this.cancelGeneration.next();

        // Añadir mensaje vacío del bot
        const botMessage: ChatMessage = {
          role: 'bot',
          content: '' ,
          rating: null,
          done: false
        };
        console.log('Bot Message: ', botMessage);
        this.currentChat.messages.push(botMessage);


        // Simular generación con efecto de escritura
        this.generationInterval = setInterval(() => {
          if (currentPosition < fullResponse.length) {
            botMessage.content += fullResponse[currentPosition];
            currentPosition++;
            this.scrollToBottom();
          } else {
            this.stopGeneration();
            botMessage.done = true;
          }
        }, 5);

        // Manejar cancelación
        this.cancelGeneration.pipe(take(1)).subscribe(() => {
          clearInterval(this.generationInterval);
          if (botMessage.content.length === 0) {
            // Si no se generó nada, eliminar el mensaje vacío
            this.currentChat.messages = this.currentChat.messages.filter(m => m !== botMessage);
          } else {
            // Marcar como completado si se cancela pero hay contenido
            botMessage.done = true;
          }
          this.isGenerating = false;
        });
        const graphChat = res.elements?.[0].object
        console.log(graphChat)
        this.rederGraph(graphChat)

      },
      (error) => {
        console.error('Error al enviar mensaje:', error);
        //this.responses = 'Ocurrió un error';
      }
    );

    // Añadir mensaje del usuario
    this.currentChat.messages.push({
      role: 'user',
      content: this.userInput.trim(),
      rating: null,
      done: true
    });

    this.userInput = '';
    this.isGenerating = true;
    this.scrollToBottom();

    // Simular generación de respuesta con posibilidad de cancelar
  }

  stopGeneration() {
    this.cancelGeneration.next();
  }
  ngOnDestroy() {
    this.cancelGeneration.complete();
    clearInterval(this.generationInterval);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }

}
