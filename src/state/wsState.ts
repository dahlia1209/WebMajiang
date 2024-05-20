import { reactive } from 'vue'

export interface WsState {
    ws?: WebSocket,
}

export const wsState: WsState = reactive({
    ws: undefined,
})

export type EventName = 'HELLO' | 'ROOM' | 'START' | 'END' | 'ERROR' | 'disconnect';

export interface IWsMessage {
    event_name: EventName;
    content: any;
}

function isValidEventName(value: any): value is EventName {
    return ['HELLO', 'ROOM', 'START', 'END', 'ERROR', 'disconnect'].includes(value);
}

export class WsMessage implements IWsMessage {
    event_name: EventName;
    content: any;

    constructor(event_name: EventName, content: any) {
        this.event_name = event_name;
        this.content = content;
    }

    static parseWsMessage(jsonString: string): WsMessage | null {
        try {
            const parsed = JSON.parse(jsonString);

            if (typeof parsed === 'object' &&
                parsed !== null &&
                isValidEventName(parsed.event_name) &&
                parsed.hasOwnProperty('content')) {
                return new WsMessage(parsed.event_name, parsed.content);
            }
        } catch (e) {
            console.error('変換エラー:', e);
        }

        return null;
    }
}