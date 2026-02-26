// Firewall Block Page Simulation & Training Platform - Types

export type FirewallMode = 'fortinet' | 'corporate' | 'school' | 'isp' | 'custom';
export type ThemeMode = 'light' | 'dark' | 'legacy' | 'minimal' | 'alert';
export type Language = 'en' | 'fr' | 'es';
export type BlockAction = 'blocked' | 'logged' | 'quarantined';

export interface TechnicalDetails {
  policyId: string;
  firewallSerial: string;
  threatId: string;
  webFilterProfile: string;
  securityProfile: string;
  sslInspection: 'enabled' | 'disabled' | 'bypassed';
  actionTaken: BlockAction;
  sourceIp: string;
  destinationIp: string;
  destinationPort: string;
  protocol: string;
  userAgent: string;
  sessionId: string;
  referrer: string;
}

export interface BlockPageConfig {
  // Basic Info
  blockedUrl: string;
  category: string;
  customCategory: string;
  
  // Network Details
  firewallName: string;
  firewallMode: FirewallMode;
  organization: string;
  
  // Client Info
  timestamp: string;
  ipAddress: string;
  userName: string;
  
  // Error Info
  errorCode: string;
  customErrorCode: string;
  blockType: 'intrusion-prevention' | 'web-filter' | 'application-control' | 'dns-filter';
  
  // Admin Contact
  adminEmail: string;
  adminPhone: string;
  adminPortal: string;
  
  // Display Options
  showDisclaimer: boolean;
  showTechnicalDetails: boolean;
  showRequestAccess: boolean;
  theme: ThemeMode;
  language: Language;
  
  // Technical Details
  technicalDetails: TechnicalDetails;
  
  // Custom Branding (for custom mode)
  customLogo?: string;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  config: Partial<BlockPageConfig>;
}

export interface SavedProfile {
  id: string;
  name: string;
  createdAt: string;
  config: BlockPageConfig;
}

export interface AccessRequest {
  id: string;
  ticketId: string;
  url: string;
  category: string;
  reason: string;
  requesterName: string;
  requesterEmail: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface SimulatedAnalytics {
  totalBlocks: number;
  blocksByCategory: Record<string, number>;
  blocksByHour: { hour: number; count: number }[];
  topBlockedUrls: { url: string; count: number }[];
  threatDistribution: { name: string; value: number }[];
  timeline: { date: string; blocks: number; threats: number }[];
}

export interface TrainingTooltip {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export type TranslationKey = 
  | 'app.title'
  | 'app.subtitle'
  | 'app.disclaimer'
  | 'nav.generator'
  | 'nav.dashboard'
  | 'nav.settings'
  | 'nav.help'
  | 'config.basicInfo'
  | 'config.blockedUrl'
  | 'config.category'
  | 'config.firewallMode'
  | 'config.organization'
  | 'config.networkDetails'
  | 'config.firewallName'
  | 'config.ipAddress'
  | 'config.userName'
  | 'config.errorInfo'
  | 'config.errorCode'
  | 'config.blockType'
  | 'config.adminContact'
  | 'config.adminEmail'
  | 'config.adminPhone'
  | 'config.adminPortal'
  | 'config.technicalDetails'
  | 'config.policyId'
  | 'config.firewallSerial'
  | 'config.threatId'
  | 'config.webFilterProfile'
  | 'config.securityProfile'
  | 'config.sslInspection'
  | 'config.actionTaken'
  | 'config.destinationIp'
  | 'config.destinationPort'
  | 'config.protocol'
  | 'config.sessionId'
  | 'config.displayOptions'
  | 'config.showDisclaimer'
  | 'config.showTechnicalDetails'
  | 'config.showRequestAccess'
  | 'config.theme'
  | 'config.language'
  | 'scenarios.title'
  | 'scenarios.malware'
  | 'scenarios.phishing'
  | 'scenarios.adultContent'
  | 'scenarios.gaming'
  | 'scenarios.geoBlock'
  | 'scenarios.socialMedia'
  | 'scenarios.streaming'
  | 'export.title'
  | 'export.html'
  | 'export.zip'
  | 'export.json'
  | 'export.copy'
  | 'export.screenshot'
  | 'preview.title'
  | 'preview.live'
  | 'requestAccess.title'
  | 'requestAccess.name'
  | 'requestAccess.email'
  | 'requestAccess.reason'
  | 'requestAccess.submit'
  | 'requestAccess.success'
  | 'requestAccess.ticketId'
  | 'training.title'
  | 'training.enable'
  | 'training.tooltip.webFilter'
  | 'training.tooltip.category'
  | 'training.tooltip.sslInspection'
  | 'training.tooltip.policy'
  | 'dashboard.title'
  | 'dashboard.totalBlocks'
  | 'dashboard.topCategories'
  | 'dashboard.timeline'
  | 'common.save'
  | 'common.load'
  | 'common.reset'
  | 'common.cancel'
  | 'common.close'
  | 'common.generate'
  | 'common.export'
  | 'common.copy'
  | 'common.copied'
  | 'common.error'
  | 'common.success';

export type Translations = Record<TranslationKey, string>;

// Authentication Types
export type UserRole = 'admin' | 'instructor' | 'trainee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  avatar?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends UserCredentials {
  name: string;
  role?: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface StoredUser extends User {
  passwordHash: string;
}

export interface UserSession {
  userId: string;
  token: string;
  expiresAt: number;
}
