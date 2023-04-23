import { IConnector } from '../definitions';

export class SocketEmulator implements IConnector {
    onmessage: (ev: { data: string; }) => void;

    send(data: string) {
        this.onmessage({ data });
    }
}