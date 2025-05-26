import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Subject, take} from 'rxjs';
import {Rating} from 'primeng/rating';


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
export default class ChatBoxComponent implements OnInit, OnDestroy {
  isSidebarCollapsed: boolean = false;
  userInput: string = '';
  isGenerating = false;
  private cancelGeneration = new Subject<void>();
  private generationInterval?: any;


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

  sendMessage() {
    if (!this.userInput.trim()) return;

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

    const responses = [
      "Entiendo tu consulta. Vamos a analizarla en detalle...",
      "Gracias por tu pregunta. Aquí tienes la información que necesitas:",
      "Interesante pregunta. Permíteme explicarte lo siguiente:",
      "Basado en los datos disponibles, puedo proporcionarte esta respuesta:"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    // Simular generación de respuesta con posibilidad de cancelar
    const fullResponse = `${randomResponse}\n\nLa inteligencia artificial como el Asistente Inteligente funciona procesando grandes cantidades de datos y encontrando patrones para generar respuestas coherentes. En este caso, estoy analizando tu pregunta y generando una respuesta basada en mi conocimiento.`;
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
