import {TestBed, waitForAsync} from '@angular/core/testing';
import {PeMessageChat} from '../../../../shared/chat/src';
import {of} from 'rxjs';

import {PeMessageChatRoomListService} from './message-chat-room-list.service';
import {MessageBus, PE_ENV} from "@pe/common";
import {ApmService} from "@elastic/apm-rum-angular";
import {PeAuthService} from "@pe/auth";
import {SnackbarService} from "@pe/snackbar";
import {TranslateService} from "@pe/i18n-core";
import {
  ChatListFacade,
  ConversationFacade,
  MessageStateService,
  PeMessageApiService,
  PeMessageGuardService,
  PeMessageService,
  PeMessageWebSocketService
} from "@pe/message";

describe('PeMessageChatRoomListService', () => {

  let peMessageChatRoomListService: PeMessageChatRoomListService;
  let apmService: ApmService;
  let messageBus: MessageBus;
  let peAuthService: PeAuthService;
  let snackbarService: SnackbarService;
  let translateService: TranslateService;
  let chatListInstance: ChatListFacade;
  let conversationFacade: ConversationFacade;
  let peMessageApiService: PeMessageApiService;
  let peMessageGuardService: PeMessageGuardService;
  let peMessageService: PeMessageService;
  let peMessageStateService: MessageStateService;
  let peMessageWebSocketService: PeMessageWebSocketService;

  beforeEach(
    waitForAsync(() => {

      const translateServiceSpy = jasmine.createSpyObj<TranslateService>('TranslateService', {
        translate: 'translated',
      });

      const peMessageChatRoomListServiceSpy = jasmine.createSpyObj<PeMessageChatRoomListService>(
        'PeMessageChatRoomListService',
        {
          activeChat: of([]),
        },
      );

      TestBed.configureTestingModule({
        providers: [
          {provide: PeMessageChatRoomListService, useValue: peMessageChatRoomListServiceSpy},
          {provide: ApmService, useValue: {}},
          {provide: MessageBus, useValue: {}},
          {
            provide: PeAuthService, useValue: {
              getUserData: () => ({uuid: '10101010'}),
            },
          },
          {provide: SnackbarService, useValue: {}},
          {provide: TranslateService, useValue: translateServiceSpy},
          ChatListFacade,
          {provide: ConversationFacade, useValue: {}},
          {provide: PeMessageApiService, useValue: {}},
          {provide: PeMessageGuardService, useValue: {}},
          {provide: MessageStateService, useValue: {}},
          {provide: PeMessageService, useValue: {}},
          {provide: PeMessageWebSocketService, useValue: {}},
          {provide: PE_ENV, useValue: {}},
        ],
      });
      peMessageChatRoomListService = TestBed.inject(PeMessageChatRoomListService);
      apmService = TestBed.inject(ApmService);
      messageBus = TestBed.inject(MessageBus);
      peAuthService = TestBed.inject(PeAuthService);
      snackbarService = TestBed.inject(SnackbarService);
      translateService = TestBed.inject(TranslateService);
      chatListInstance = TestBed.inject(ChatListFacade);
      conversationFacade = TestBed.inject(ConversationFacade);
      peMessageApiService = TestBed.inject(PeMessageApiService);
      peMessageGuardService = TestBed.inject(PeMessageGuardService);
      peMessageService = TestBed.inject(PeMessageService);
      peMessageStateService = TestBed.inject(MessageStateService);
      peMessageWebSocketService = TestBed.inject(PeMessageWebSocketService);
    }),
  );

  const messageChat: PeMessageChat = {
    _id: 'b095a56c-3be3-4ff1-a4d4-4946d3ed705b',
    title: 'test title',
  };

  it('should be defined', () => {
    expect(peMessageChatRoomListService).toBeDefined();
  });

  it('should pass an object of PeMessageChat interface to active chat stream',
    () => {
      peMessageChatRoomListService.activeChat = messageChat;
      expect(peMessageChatRoomListService.activeChat).toEqual(messageChat);
    }
  );

  it('should pass null to active chat stream',
    () => {
      peMessageChatRoomListService.activeChat = null;
      expect(peMessageChatRoomListService.activeChat).toEqual(null);
    }
  );

});
