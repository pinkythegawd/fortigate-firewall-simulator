import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimestamp = (isoString: string, locale: string = 'en-US'): string => {
  const date = new Date(isoString);
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
};

export const generateSessionId = (): string => {
  return 'sess_' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const generateTicketId = (): string => {
  const prefix = 'TKT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const generateSerialNumber = (): string => {
  const prefix = 'FGT' + Math.floor(Math.random() * 900 + 100);
  const suffix = Array(10).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
  return `${prefix}FTK${suffix}`;
};

export const generatePolicyId = (category: string): string => {
  const prefixes: Record<string, string> = {
    malware: 'malware-block',
    phishing: 'phishing-block',
    'adult-content': 'aup-violation',
    games: 'gaming-restriction',
    'social-media': 'social-media-block',
    streaming: 'streaming-block',
    gambling: 'gambling-block',
    proxy: 'proxy-block',
    hacking: 'hacking-block',
    warez: 'piracy-block',
    weapons: 'weapons-block',
    drugs: 'drugs-block',
    violence: 'hate-speech-block',
  };
  const prefix = prefixes[category] || 'policy';
  const suffix = Math.floor(Math.random() * 900 + 100).toString();
  return `${prefix}-${suffix}`;
};

export const generateThreatId = (category: string): string => {
  const prefixes: Record<string, string> = {
    malware: 'W32/',
    phishing: 'PHISH/',
    'adult-content': 'CAT/',
    games: 'APP/',
    'social-media': 'APP/',
    streaming: 'APP/',
    gambling: 'APP/',
    proxy: 'PROXY/',
    hacking: 'HACK/',
    warez: 'WAREZ/',
    weapons: 'WEAP/',
    drugs: 'DRUGS/',
    violence: 'HATE/',
  };
  const prefix = prefixes[category] || 'THREAT/';
  return prefix + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const getRandomIp = (): string => {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
};

export const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const truncateUrl = (url: string, maxLength: number = 60): string => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + '...';
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidIp = (ip: string): boolean => {
  const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
};
