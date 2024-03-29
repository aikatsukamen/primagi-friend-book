/* eslint-disable @typescript-eslint/ban-types */
import { Color } from './Color';

/**
 * JSONの取得
 * @param url 取得先のURL
 * @return JSONオブジェクト
 * @throws 通信エラー
 * @throws JSON変換エラー
 */
export const fetchJson = async <T>(url: string): Promise<T> => {
  try {
    const result = await fetch(url, { cache: 'no-store' });
    const config = await result.json();
    return config as T;
  } catch (e) {
    console.error(e);
    throw new Error(`通信エラーが発生しました。 ${e.message}`);
  }
};

export const postJson = async <T>(url: string, body: object): Promise<T> => {
  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return (await result.json()) as T;
  } catch (e) {
    console.error(e);
    throw new Error(`通信エラーが発生しました。 ${e.message}`);
  }
};

export const postFile = async <T>(url: string, file: File): Promise<T> => {
  try {
    const formData = new FormData();
    formData.append(file.name, file);

    const result = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return (await result.json()) as T;
  } catch (e) {
    console.error(e);
    throw new Error(`通信エラーが発生しました。 ${e.message}`);
  }
};

/**
 * 色の補色を返す
 * @param color #123456
 * @returns
 */
export const compColor = (baseColor: string) => {
  const color = Color.parse(baseColor);
  color.spin(180);
  return color.cssRGB();
};

export const binToStr = (qrData: { byte: number[]; data: string; version: number } | null): string => {
  if (!qrData) return '';

  return qrData.byte.map((item) => `00${item.toString(16)}`.slice(-2)).join('');
};
