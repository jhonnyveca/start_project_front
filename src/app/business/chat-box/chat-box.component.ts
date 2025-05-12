import {Component, HostListener, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {NgClass, NgForOf, NgIf} from '@angular/common';

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
  selector: 'app-chat-box',
  imports: [
    FormsModule,
    ButtonDirective,
    NgIf,
    NgClass,
    NgForOf
  ],
  templateUrl: './chat-box.component.html',
  standalone: true,
  styleUrl: './chat-box.component.scss'
})
export default class ChatBoxComponent implements OnInit {

  isSidebarCollapsed: boolean = false;
  done:boolean = false;

  ngOnInit() {
    this.updateSidebarForScreenSize();
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

  chatHistory: ChatSession[] = [
    {
      id: 1, title: 'Consulta inicial', messages: [{role: 'bot', content: 'Hola, ¿en qué puedo ayudarte?'}],
      editing: false
    },
    {
      id: 2, title: 'Pedido de ayuda', messages: [{role: 'bot', content: 'Claro, dime más sobre tu problema.'}],
      editing: false
    }
  ];

  currentChat: { messages: { role: string; content: string }[]; id: number; title: string } = this.chatHistory[0]; // por defecto
  userInput: string = '';

  get messages(): {
    role: string; content: string }[] {
    return this.currentChat.messages;
  }

  sendMessage(): void {

    if (!this.userInput.trim()) return;

    // Añadir mensaje del usuario
    const userMessage: ChatMessage = {
      role: 'user',
      content: this.userInput.trim()
    };

    this.currentChat.messages.push(userMessage);

    const isFirstMessage = this.currentChat.messages.filter(m => m.role === 'user').length === 1;
    if (isFirstMessage) {
      const title = this.userInput.length > 30
        ? this.userInput.slice(0, 30) + '...'
        : this.userInput;
      this.currentChat.title = title;
    }

    this.userInput = '';

    // Simular respuesta del bot
    setTimeout(() => {
      const fullResponse = 'Incremento Volumen: Incremento del X%, enfocado principalmente en canal DEX (X TM), ' +
        'se visualiza que el volumen de Marzo 2025 es el más alto desde Enero 2024. ' +
        'Deterioro UB x TM: Reducción del X%, principalmente por incremento de MP(S/X) y CC(S/X) y reducción del P.Bruto(S/X); atenuado por menor Dcto Comerc (S/X) y Dcto Promoc. (S/ X).';
      const botMessage: ChatMessage & { done?: boolean } = { role: 'bot', content: '' };
      this.currentChat.messages.push(botMessage);

      let index = 0;
      const interval = setInterval(() => {
        if (index < fullResponse.length) {
          botMessage.content += fullResponse[index];
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);
    }, 500);
  }

  loadChat(chat: ChatSession): void {
    this.currentChat = chat;
  }

  newChat(): void {
    const newId = this.chatHistory.length + 1;
    const newSession: { messages: { role: string; content: string }[]; id: number; title: string } = {
      id: newId,
      title: `Nuevo chat ${newId}`,
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

}
