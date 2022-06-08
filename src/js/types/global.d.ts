declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

export type ArrayItem<T extends any[]> = T extends (infer Titem)[] ? Titem : never;
export type ResolvedType<T> = T extends Promise<infer R> ? R : T;
export type GeneratorType<T extends (...args: any) => any> = ResolvedType<ReturnType<T>>;

export type Card = {
  /**
   * ひとことコメント
   */
  comment: string;
  /**
   * コーデ名
   * @example 'アーガイルニットパープル'
   */
  coordinate: string;
  /**
   * 画像URL
   * @example 'https://i.imgur.com/ncONWye.jpg'
   */
  img: string;
  /**
   * マイキャラ名
   * @example 'ぱすた'
   */
  name: string;
  /**
   * QRバイナリ文字列
   * @example '54A303A4323C3F3CBB76A5D3B9FF843158C3FAF1BD403C11EBBE'
   */
  qr: string;
  /**
   * タグ
   * @example ['アーガイルニットパープル', '帽子', 'スカート']
   */
  tags: string[];
  /**
   * 投稿時のタイムスタンプ
   * @example '2022-06-08T07:24:39.679Z'
   */
  timestamp: string;
  /**
   * 所有者名
   * @example 'アイカツ仮面'
   */
  username: string;
};
