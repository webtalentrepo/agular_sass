import { Injectable } from '@angular/core';

import { PeChatMessage, PeMessageColors } from '@pe/shared/chat';

import { PeMessageIntegrationThemeItemValues } from '../interfaces';

import { PeMessageService } from './message.service';

// tslint:disable:no-bitwise
@Injectable()
export class PeMessageThemeService {
  colors: PeMessageColors = {
    message: ['', ''],
    bgChat: '',
    accent: '',
    app: '',
  };

  constructor(private peMessageService: PeMessageService) { }

  setColors(settings: PeMessageIntegrationThemeItemValues) {
    this.colors = {
      bgChat: settings?.bgChatColor || '',
      accent: settings?.accentColor || '',
      app: settings?.messageAppColor || '',
      message: [settings?.messagesBottomColor || '', settings?.messagesTopColor || ''],
    };
  }

  public setMessageTheme(message: PeChatMessage, theme?: string) {
    message.theme = this.peMessageService.isLiveChat
      ? this.setTheme(this.colors.message[message.reply ? 1 : 0])
      : theme;
  }

  messageAccentColor(message: PeChatMessage): string {
    const amt = this.setTheme(this.colors.message[0]) === 'dark' ? 80 : -60;

    return message.reply
      ? this.colors.accent
      : this.adjustBrightness(this.colors.message[0], amt);
  }

  setTheme(color: string): string {
    const rgbArr = this.hexToRGBArr(color);
    const newColor = (rgbArr[0] > 80 && rgbArr[1] > 80 && rgbArr[2] > 80) ? 'light' : 'dark';

    return newColor;
  }

  hexToRGBArr(color: string): number[] {
    const colorForParse = color.substr(1, 6);
    const rgb = colorForParse.match(/.{2}/g) || ['00', '00', '00'];
    const r = parseInt(rgb[0], 16);
    const g = parseInt(rgb[1], 16);
    const b = parseInt(rgb[2], 16);

    return [r, g, b];
  }

  adjustBrightness(color: string, amt: number): string {
    let rgbArr = this.hexToRGBArr(color);
    rgbArr = rgbArr.map(item => Math.max(0, Math.min(255, item + amt)));
    const newColor = rgbArr[1] | (rgbArr[2] << 8) | (rgbArr[0] << 16);

    return `#${newColor.toString(16)}`;
  }
}
