import type { ThemeMode } from '@/types';

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    warning: string;
    error: string;
    success: string;
  };
  header: {
    height: string;
    gradient: string;
  };
  font: {
    family: string;
    size: {
      title: string;
      subtitle: string;
      body: string;
      small: string;
    };
  };
}

export const themes: Record<ThemeMode, ThemeConfig> = {
  light: {
    name: 'Light Mode',
    colors: {
      primary: '#da291c',
      secondary: '#00b4b4',
      accent: '#0066cc',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#333333',
      textMuted: '#666666',
      border: '#e0e0e0',
      warning: '#ffc107',
      error: '#dc2626',
      success: '#059669',
    },
    header: {
      height: '120px',
      gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
    },
    font: {
      family: 'Arial, Helvetica, sans-serif',
      size: {
        title: '32px',
        subtitle: '32px',
        body: '16px',
        small: '14px',
      },
    },
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      primary: '#ff4444',
      secondary: '#00dddd',
      accent: '#4488ff',
      background: '#1a1a2e',
      surface: '#16213e',
      text: '#e94560',
      textMuted: '#a0a0a0',
      border: '#0f3460',
      warning: '#ffaa00',
      error: '#ff4444',
      success: '#00cc88',
    },
    header: {
      height: '120px',
      gradient: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
    },
    font: {
      family: 'Arial, Helvetica, sans-serif',
      size: {
        title: '32px',
        subtitle: '32px',
        body: '16px',
        small: '14px',
      },
    },
  },
  legacy: {
    name: 'Legacy Style',
    colors: {
      primary: '#003366',
      secondary: '#006699',
      accent: '#6699cc',
      background: '#f0f0f0',
      surface: '#ffffff',
      text: '#000000',
      textMuted: '#666666',
      border: '#999999',
      warning: '#ffcc00',
      error: '#cc0000',
      success: '#006600',
    },
    header: {
      height: '80px',
      gradient: 'linear-gradient(180deg, #003366 0%, #002244 100%)',
    },
    font: {
      family: 'Verdana, Arial, sans-serif',
      size: {
        title: '24px',
        subtitle: '20px',
        body: '14px',
        small: '12px',
      },
    },
  },
  minimal: {
    name: 'Minimal UI',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#999999',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#222222',
      textMuted: '#888888',
      border: '#dddddd',
      warning: '#ff9500',
      error: '#ff3b30',
      success: '#34c759',
    },
    header: {
      height: '60px',
      gradient: 'none',
    },
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: {
        title: '28px',
        subtitle: '22px',
        body: '15px',
        small: '13px',
      },
    },
  },
  alert: {
    name: 'High Alert Mode',
    colors: {
      primary: '#ff0000',
      secondary: '#ff6600',
      accent: '#ffff00',
      background: '#fff5f5',
      surface: '#ffe0e0',
      text: '#660000',
      textMuted: '#993333',
      border: '#ff6666',
      warning: '#ff0000',
      error: '#cc0000',
      success: '#00aa00',
    },
    header: {
      height: '140px',
      gradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 50%, #990000 100%)',
    },
    font: {
      family: 'Arial Black, Arial, sans-serif',
      size: {
        title: '36px',
        subtitle: '28px',
        body: '16px',
        small: '14px',
      },
    },
  },
};

export const firewallModes = {
  fortinet: {
    name: 'Fortinet FortiGate',
    logo: 'fortinet',
    primaryColor: '#da291c',
    headerStyle: 'geometric',
    showSerialNumber: true,
    showThreatId: true,
    defaultErrorCodes: [
      { value: 'FG-1001', label: 'FG-1001 - Content Blocked' },
      { value: 'FG-1002', label: 'FG-1002 - Category Blocked' },
      { value: 'FG-1003', label: 'FG-1003 - Security Risk' },
      { value: 'FG-1004', label: 'FG-1004 - Policy Violation' },
      { value: 'FG-1005', label: 'FG-1005 - Malware Detected' },
      { value: 'FG-1006', label: 'FG-1006 - Phishing Attempt' },
    ],
  },
  corporate: {
    name: 'Corporate Firewall',
    logo: 'corporate',
    primaryColor: '#003366',
    headerStyle: 'simple',
    showSerialNumber: false,
    showThreatId: false,
    defaultErrorCodes: [
      { value: 'CORP-001', label: 'CORP-001 - Access Denied' },
      { value: 'CORP-002', label: 'CORP-002 - Policy Violation' },
      { value: 'CORP-003', label: 'CORP-003 - Security Block' },
    ],
  },
  school: {
    name: 'School Network Filter',
    logo: 'school',
    primaryColor: '#0066cc',
    headerStyle: 'friendly',
    showSerialNumber: false,
    showThreatId: false,
    defaultErrorCodes: [
      { value: 'EDU-001', label: 'EDU-001 - Content Filtered' },
      { value: 'EDU-002', label: 'EDU-002 - Not Educational' },
      { value: 'EDU-003', label: 'EDU-003 - Against School Policy' },
    ],
  },
  isp: {
    name: 'ISP Level Block',
    logo: 'isp',
    primaryColor: '#663399',
    headerStyle: 'official',
    showSerialNumber: true,
    showThreatId: true,
    defaultErrorCodes: [
      { value: 'ISP-001', label: 'ISP-001 - Legal Compliance' },
      { value: 'ISP-002', label: 'ISP-002 - Court Order' },
      { value: 'ISP-003', label: 'ISP-003 - Geographic Restriction' },
    ],
  },
  custom: {
    name: 'Custom Branded',
    logo: 'custom',
    primaryColor: '#custom',
    headerStyle: 'customizable',
    showSerialNumber: true,
    showThreatId: true,
    defaultErrorCodes: [
      { value: 'CUSTOM-001', label: 'CUSTOM-001 - Access Blocked' },
    ],
  },
};

export const categories = [
  { value: 'malware', label: 'Malware', color: '#dc2626' },
  { value: 'phishing', label: 'Phishing', color: '#ea580c' },
  { value: 'adult-content', label: 'Adult Content', color: '#be185d' },
  { value: 'gambling', label: 'Gambling', color: '#7c3aed' },
  { value: 'social-media', label: 'Social Media', color: '#0891b2' },
  { value: 'streaming', label: 'Streaming Media', color: '#059669' },
  { value: 'games', label: 'Games', color: '#2563eb' },
  { value: 'proxy', label: 'Proxy/Anonymizer', color: '#4b5563' },
  { value: 'hacking', label: 'Hacking', color: '#7f1d1d' },
  { value: 'warez', label: 'Warez/Piracy', color: '#854d0e' },
  { value: 'weapons', label: 'Weapons', color: '#991b1b' },
  { value: 'drugs', label: 'Drugs', color: '#065f46' },
  { value: 'violence', label: 'Violence/Hate', color: '#7c2d12' },
  { value: 'custom', label: 'Custom Category', color: '#525252' },
];

export const blockTypes = [
  { value: 'intrusion-prevention', label: 'Intrusion Prevention' },
  { value: 'web-filter', label: 'Web Filtering' },
  { value: 'application-control', label: 'Application Control' },
  { value: 'dns-filter', label: 'DNS Filtering' },
];

export const sslInspectionOptions = [
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'bypassed', label: 'Bypassed' },
];

export const actionTakenOptions = [
  { value: 'blocked', label: 'Blocked' },
  { value: 'logged', label: 'Logged Only' },
  { value: 'quarantined', label: 'Quarantined' },
];
