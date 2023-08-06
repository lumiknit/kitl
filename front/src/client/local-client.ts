// Dummy local client

import { IClient } from './client';

export class LocalClient implements IClient {
  isConnected(): boolean {
    return true;
  }
}