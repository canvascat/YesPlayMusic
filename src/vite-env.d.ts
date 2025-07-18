/// <reference types="vite/client" />

declare interface Window {
  IS_ELECTRON: boolean;
  ipcRenderer: any | null;
  resetApp: () => string;
}

// 声明模块扩展
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Howler 类型补充
declare module 'howler' {
  export interface HowlOptions {
    src: string | string[];
    volume?: number;
    html5?: boolean;
    loop?: boolean;
    preload?: boolean | 'none' | 'metadata' | 'auto';
    autoplay?: boolean;
    mute?: boolean;
    sprite?: { [key: string]: [number, number] | [number, number, boolean] };
    rate?: number;
    pool?: number;
    format?: string[];
    xhrWithCredentials?: boolean;
    onload?: () => void;
    onloaderror?: (id: number | undefined, error: any) => void;
    onplay?: (id: number) => void;
    onend?: (id: number) => void;
    onpause?: (id: number) => void;
    onstop?: (id: number) => void;
    onmute?: (id: number) => void;
    onvolume?: (id: number) => void;
    onrate?: (id: number) => void;
    onseek?: (id: number) => void;
    onfade?: (id: number) => void;
    onunlock?: (id: number) => void;
  }

  export class Howl {
    constructor(options: HowlOptions);
    play(id?: number): number;
    pause(id?: number): Howl;
    stop(id?: number): Howl;
    mute(muted?: boolean, id?: number): Howl | boolean;
    volume(vol?: number, id?: number): Howl | number;
    fade(from: number, to: number, duration: number, id?: number): Howl;
    rate(rate?: number, id?: number): Howl | number;
    seek(seek?: number, id?: number): Howl | number;
    playing(id?: number): boolean;
    duration(id?: number): number;
    state(): 'unloaded' | 'loading' | 'loaded';
    load(): Howl;
    unload(): void;
    on(event: string, listener: (...args: any[]) => void, id?: number): Howl;
    off(event?: string, listener?: (...args: any[]) => void, id?: number): Howl;
    once(event: string, listener: (...args: any[]) => void, id?: number): Howl;
  }

  export class Howler {
    static mute(muted?: boolean): Howler | boolean;
    static volume(vol?: number): Howler | number;
    static codecs(ext: string): boolean;
    static unload(): Howler;
    static usingWebAudio: boolean;
    static noAudio: boolean;
    static autoUnlock: boolean;
    static ctx: AudioContext;
    static masterGain: GainNode;
  }
}

// 网易云音乐API扩展类型
declare global {
  interface MediaMetadata {
    title: string;
    artist: string;
    album: string;
    artwork: MediaImage[];
  }

  interface MediaImage {
    src: string;
    sizes?: string;
    type?: string;
  }

  interface Navigator {
    mediaSession?: MediaSession;
  }

  interface MediaSession {
    metadata: MediaMetadata | null;
    playbackState: 'none' | 'paused' | 'playing';
    setActionHandler(action: MediaSessionAction, handler: MediaSessionActionHandler | null): void;
  }

  type MediaSessionAction = 'play' | 'pause' | 'seekbackward' | 'seekforward' | 'previoustrack' | 'nexttrack';
  type MediaSessionActionHandler = (details: MediaSessionActionDetails) => void;

  interface MediaSessionActionDetails {
    action: MediaSessionAction;
    seekOffset?: number;
    seekTime?: number;
    fastSeek?: boolean;
  }
}
