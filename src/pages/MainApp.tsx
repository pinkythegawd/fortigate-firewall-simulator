import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Download, Sun, Moon, Copy, Check, AlertTriangle, 
  RefreshCw, Eye, EyeOff, Save, FolderOpen, Trash2,
  Building2, GraduationCap, Wifi, Palette, Languages,
  FileCode, FileJson, Image as ImageIcon, Zap, BookOpen,
  BarChart3, Settings, ChevronDown, Bug, Fish, Gamepad2,
  Users, Video, MapPin, CheckCircle, Ticket, Sparkles,
  LogOut, UserCircle, Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { 
  BlockPageConfig, 
  FirewallMode, 
  ThemeMode, 
  Language, 
  SavedProfile,
  SimulatedAnalytics
} from '@/types';
import { 
  generateBlockedPageHTML, 
  generateZIPPackage 
} from '@/lib/firewall-templates';
import { 
  firewallModes, 
  categories, 
  blockTypes,
  sslInspectionOptions,
  actionTakenOptions
} from '@/lib/themes';
import { scenarioPresets } from '@/lib/scenarios';
import { useSavedProfiles } from '@/hooks/useLocalStorage';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { 
  generateSessionId, 
  generateTicketId,
  downloadFile,
  copyToClipboard,
  delay
} from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

// Default configuration
const DEFAULT_CONFIG: BlockPageConfig = {
  blockedUrl: 'https://malicious-site.example.com/payload',
  category: 'malware',
  customCategory: '',
  firewallName: 'FortiGate-01',
  firewallMode: 'fortinet',
  organization: 'Corporate Network',
  timestamp: new Date().toISOString(),
  ipAddress: '192.168.1.100',
  userName: '',
  errorCode: 'FG-1005',
  customErrorCode: '',
  blockType: 'intrusion-prevention',
  adminEmail: 'security@company.com',
  adminPhone: '+1 (555) 123-4567',
  adminPortal: 'https://firewall.company.com',
  showDisclaimer: true,
  showTechnicalDetails: true,
  showRequestAccess: true,
  theme: 'light',
  language: 'en',
  technicalDetails: {
    policyId: 'malware-block-001',
    firewallSerial: 'FGT60FTK21012345',
    threatId: 'W32/Malware.Generic',
    webFilterProfile: 'strict-security',
    securityProfile: 'antivirus-strict',
    sslInspection: 'enabled',
    actionTaken: 'blocked',
    sourceIp: '192.168.1.100',
    destinationIp: '185.220.101.42',
    destinationPort: '443',
    protocol: 'HTTPS',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: generateSessionId(),
    referrer: 'https://search-engine.example.com',
  },
  customColors: {
    primary: '#da291c',
    secondary: '#00b4b4',
    accent: '#0066cc',
  },
};

// Generate simulated analytics data
const generateSimulatedAnalytics = (): SimulatedAnalytics => {
  const cats = ['Malware', 'Phishing', 'Adult Content', 'Social Media', 'Games', 'Streaming'];
  const blocksByCategory: Record<string, number> = {};
  cats.forEach(cat => {
    blocksByCategory[cat] = Math.floor(Math.random() * 500) + 50;
  });

  const blocksByHour = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: Math.floor(Math.random() * 100) + 10,
  }));

  const timeline = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      blocks: Math.floor(Math.random() * 200) + 50,
      threats: Math.floor(Math.random() * 50) + 5,
    };
  });

  return {
    totalBlocks: Object.values(blocksByCategory).reduce((a, b) => a + b, 0),
    blocksByCategory,
    blocksByHour,
    topBlockedUrls: [
      { url: 'malware-site.example.com', count: 245 },
      { url: 'phishing-bank.example.com', count: 189 },
      { url: 'unauthorized-proxy.example.com', count: 156 },
      { url: 'gaming-site.example.com', count: 134 },
      { url: 'streaming-service.example.com', count: 98 },
    ],
    threatDistribution: cats.map(name => ({
      name,
      value: blocksByCategory[name],
    })),
    timeline,
  };
};

export default function MainApp() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State
  const [config, setConfig] = useState<BlockPageConfig>(DEFAULT_CONFIG);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [showPreview, setShowPreview] = useState(true);
  const [trainingMode, setTrainingMode] = useState(false);
  const [requestAccessDialog, setRequestAccessDialog] = useState(false);
  const [saveProfileDialog, setSaveProfileDialog] = useState(false);
  const [loadProfileDialog, setLoadProfileDialog] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [requestForm, setRequestForm] = useState({ name: '', email: '', reason: '' });
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');
  const [analytics] = useState<SimulatedAnalytics>(generateSimulatedAnalytics());
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { setLanguage, availableLanguages } = useLanguage('en');
  const { profiles, saveProfile, deleteProfile } = useSavedProfiles();

  // Update timestamp periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setConfig(prev => ({ ...prev, timestamp: new Date().toISOString() }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update config helper
  const updateConfig = useCallback((updates: Partial<BlockPageConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateTechnicalDetails = useCallback((updates: Partial<BlockPageConfig['technicalDetails']>) => {
    setConfig(prev => ({
      ...prev,
      technicalDetails: { ...prev.technicalDetails, ...updates },
    }));
  }, []);

  // Apply scenario preset
  const applyScenario = useCallback((scenarioId: string) => {
    const scenario = scenarioPresets.find(s => s.id === scenarioId);
    if (scenario) {
      setConfig(prev => ({
        ...prev,
        ...scenario.config,
        timestamp: new Date().toISOString(),
      }));
      toast.success(`Applied scenario: ${scenario.name}`);
    }
  }, []);

  // Export functions
  const handleExportHTML = useCallback(() => {
    const html = generateBlockedPageHTML(config);
    downloadFile(html, `firewall-block-${config.errorCode}.html`, 'text/html');
    toast.success('HTML file downloaded');
  }, [config]);

  const handleExportZIP = useCallback(async () => {
    try {
      const zipBlob = await generateZIPPackage(config);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `firewall-block-package-${config.errorCode}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('ZIP package downloaded');
    } catch (error) {
      toast.error('Failed to create ZIP package');
    }
  }, [config]);

  const handleExportJSON = useCallback(() => {
    const json = JSON.stringify(config, null, 2);
    downloadFile(json, `firewall-config-${config.errorCode}.json`, 'application/json');
    toast.success('Configuration exported');
  }, [config]);

  const handleCopyHTML = useCallback(async () => {
    const html = generateBlockedPageHTML(config);
    const success = await copyToClipboard(html);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('HTML copied to clipboard');
    } else {
      toast.error('Failed to copy');
    }
  }, [config]);

  const handleGenerateScreenshot = useCallback(async () => {
    if (!previewRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current);
      const link = document.createElement('a');
      link.download = `firewall-preview-${config.errorCode}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Screenshot saved');
    } catch (error) {
      toast.error('Failed to generate screenshot');
    }
  }, [config]);

  // Profile management
  const handleSaveProfile = useCallback(() => {
    if (!profileName.trim()) {
      toast.error('Please enter a profile name');
      return;
    }
    saveProfile(profileName, config);
    setProfileName('');
    setSaveProfileDialog(false);
    toast.success('Profile saved');
  }, [profileName, config, saveProfile]);

  const handleLoadProfile = useCallback((profile: SavedProfile) => {
    setConfig(profile.config);
    setLoadProfileDialog(false);
    toast.success(`Loaded profile: ${profile.name}`);
  }, []);

  // Request access
  const handleSubmitRequest = useCallback(async () => {
    if (!requestForm.name || !requestForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    await delay(1500);
    
    const ticketId = generateTicketId();
    setGeneratedTicketId(ticketId);
    setRequestSubmitted(true);
    toast.success('Access request submitted');
  }, [requestForm]);

  const resetRequestForm = useCallback(() => {
    setRequestForm({ name: '', email: '', reason: '' });
    setRequestSubmitted(false);
    setGeneratedTicketId('');
    setRequestAccessDialog(false);
  }, []);

  // Reset config
  const handleReset = useCallback(() => {
    setConfig({
      ...DEFAULT_CONFIG,
      timestamp: new Date().toISOString(),
      technicalDetails: {
        ...DEFAULT_CONFIG.technicalDetails,
        sessionId: generateSessionId(),
      },
    });
    toast.success('Configuration reset');
  }, []);

  // Theme colors for charts
  const CHART_COLORS = ['#da291c', '#00b4b4', '#0066cc', '#7c3aed', '#059669', '#ea580c'];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'instructor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'trainee':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        
        {/* Header */}
        <header className={`sticky top-0 z-50 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-[#da291c]" />
                  <div>
                    <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Firewall Block Simulator
                    </h1>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Training & Educational Platform
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  <Sparkles className="h-3 w-3 mr-1" />
                  v2.0
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
                  <TabsList>
                    <TabsTrigger value="generator">
                      <Zap className="h-4 w-4 mr-1" />
                      Generator
                    </TabsTrigger>
                    <TabsTrigger value="dashboard">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Separator orientation="vertical" className="h-6 hidden md:block" />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <div className="w-9 h-9 bg-[#da291c]/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-[#da291c]">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        <Badge className={`mt-2 w-fit text-xs ${getRoleBadgeColor(user?.role || '')}`}>
                          {user?.role}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Training Disclaimer Banner */}
        <div className="bg-amber-50 border-b-2 border-amber-400 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">TRAINING & EDUCATIONAL PURPOSES ONLY</p>
              <p className="text-sm text-amber-700">
                This platform generates simulated firewall block pages for cybersecurity training. 
                This is NOT a real security system.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'generator' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Panel - Configuration */}
              <div className="lg:col-span-5 space-y-4">
                {/* Quick Actions */}
                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Scenario Presets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {scenarioPresets.map(scenario => (
                        <Button
                          key={scenario.id}
                          variant="outline"
                          size="sm"
                          onClick={() => applyScenario(scenario.id)}
                          className="justify-start text-xs"
                        >
                          {scenario.id === 'malware' && <Bug className="h-3 w-3 mr-1" />}
                          {scenario.id === 'phishing' && <Fish className="h-3 w-3 mr-1" />}
                          {scenario.id === 'adult-content' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {scenario.id === 'gaming' && <Gamepad2 className="h-3 w-3 mr-1" />}
                          {scenario.id === 'geo-block' && <MapPin className="h-3 w-3 mr-1" />}
                          {scenario.id === 'social-media' && <Users className="h-3 w-3 mr-1" />}
                          {scenario.id === 'streaming' && <Video className="h-3 w-3 mr-1" />}
                          {scenario.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Configuration Form */}
                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Configuration
                      </CardTitle>
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSaveProfileDialog(true)}>
                              <Save className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Save Profile</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLoadProfileDialog(true)}>
                              <FolderOpen className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Load Profile</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset}>
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reset</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-[500px] pr-4">
                      {/* Firewall Mode */}
                      <div className="space-y-2 mb-4">
                        <Label>Firewall Mode</Label>
                        <Select value={config.firewallMode} onValueChange={(v) => updateConfig({ firewallMode: v as FirewallMode })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fortinet">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-[#da291c]" />
                                Fortinet FortiGate
                              </div>
                            </SelectItem>
                            <SelectItem value="corporate">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                Corporate Firewall
                              </div>
                            </SelectItem>
                            <SelectItem value="school">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-green-600" />
                                School Network Filter
                              </div>
                            </SelectItem>
                            <SelectItem value="isp">
                              <div className="flex items-center gap-2">
                                <Wifi className="h-4 w-4 text-purple-600" />
                                ISP Level Block
                              </div>
                            </SelectItem>
                            <SelectItem value="custom">
                              <div className="flex items-center gap-2">
                                <Palette className="h-4 w-4 text-orange-600" />
                                Custom Branded
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Theme */}
                      <div className="space-y-2 mb-4">
                        <Label>Theme</Label>
                        <Select value={config.theme} onValueChange={(v) => updateConfig({ theme: v as ThemeMode })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light Mode</SelectItem>
                            <SelectItem value="dark">Dark Mode</SelectItem>
                            <SelectItem value="legacy">Legacy Style</SelectItem>
                            <SelectItem value="minimal">Minimal UI</SelectItem>
                            <SelectItem value="alert">High Alert Mode</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Language */}
                      <div className="space-y-2 mb-4">
                        <Label>Language</Label>
                        <Select value={config.language} onValueChange={(v) => { setLanguage(v as Language); updateConfig({ language: v as Language }); }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableLanguages.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>
                                <div className="flex items-center gap-2">
                                  <Languages className="h-4 w-4" />
                                  {lang.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator className="my-4" />

                      {/* Basic Info */}
                      <div className="space-y-2 mb-4">
                        <Label>Blocked URL</Label>
                        <Input 
                          value={config.blockedUrl} 
                          onChange={(e) => updateConfig({ blockedUrl: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label>Category</Label>
                        <Select value={config.category} onValueChange={(v) => updateConfig({ category: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                  {cat.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {config.category === 'custom' && (
                          <Input
                            value={config.customCategory}
                            onChange={(e) => updateConfig({ customCategory: e.target.value })}
                            placeholder="Enter custom category"
                            className="mt-2"
                          />
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label>Block Type</Label>
                        <Select value={config.blockType} onValueChange={(v) => updateConfig({ blockType: v as BlockPageConfig['blockType'] })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {blockTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label>Error Code</Label>
                        <Select value={config.errorCode} onValueChange={(v) => updateConfig({ errorCode: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {firewallModes[config.firewallMode]?.defaultErrorCodes?.map(code => (
                              <SelectItem key={code.value} value={code.value}>{code.label}</SelectItem>
                            )) || (
                              <SelectItem value="CUSTOM-001">CUSTOM-001 - Custom Error</SelectItem>
                            )}
                            <SelectItem value="custom">Custom Error Code</SelectItem>
                          </SelectContent>
                        </Select>
                        {config.errorCode === 'custom' && (
                          <Input
                            value={config.customErrorCode}
                            onChange={(e) => updateConfig({ customErrorCode: e.target.value })}
                            placeholder="Enter custom error code"
                            className="mt-2"
                          />
                        )}
                      </div>

                      <Separator className="my-4" />

                      {/* Network Details */}
                      <div className="space-y-2 mb-4">
                        <Label>Organization</Label>
                        <Input 
                          value={config.organization} 
                          onChange={(e) => updateConfig({ organization: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label>Firewall Name</Label>
                        <Input 
                          value={config.firewallName} 
                          onChange={(e) => updateConfig({ firewallName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label>Client IP Address</Label>
                        <Input 
                          value={config.ipAddress} 
                          onChange={(e) => updateConfig({ ipAddress: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label>Username (Optional)</Label>
                        <Input 
                          value={config.userName} 
                          onChange={(e) => updateConfig({ userName: e.target.value })}
                          placeholder="john.doe"
                        />
                      </div>

                      <Separator className="my-4" />

                      {/* Admin Contact */}
                      <div className="space-y-2 mb-4">
                        <Label>Admin Email</Label>
                        <Input 
                          type="email"
                          value={config.adminEmail} 
                          onChange={(e) => updateConfig({ adminEmail: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label>Admin Phone</Label>
                        <Input 
                          value={config.adminPhone} 
                          onChange={(e) => updateConfig({ adminPhone: e.target.value })}
                        />
                      </div>

                      <Separator className="my-4" />

                      {/* Display Options */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showDisclaimer" className="cursor-pointer">Show Training Disclaimer</Label>
                          <Switch 
                            id="showDisclaimer"
                            checked={config.showDisclaimer} 
                            onCheckedChange={(v) => updateConfig({ showDisclaimer: v })} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showTechnical" className="cursor-pointer">Show Technical Details</Label>
                          <Switch 
                            id="showTechnical"
                            checked={config.showTechnicalDetails} 
                            onCheckedChange={(v) => updateConfig({ showTechnicalDetails: v })} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showRequest" className="cursor-pointer">Show Request Access Button</Label>
                          <Switch 
                            id="showRequest"
                            checked={config.showRequestAccess} 
                            onCheckedChange={(v) => updateConfig({ showRequestAccess: v })} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="trainingMode" className="cursor-pointer flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Training Mode
                          </Label>
                          <Switch 
                            id="trainingMode"
                            checked={trainingMode} 
                            onCheckedChange={setTrainingMode} 
                          />
                        </div>
                      </div>

                      {/* Technical Details Collapsible */}
                      <Collapsible className="mt-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                              Technical Details
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3 mt-3">
                          <div className="space-y-2">
                            <Label>Policy ID</Label>
                            <Input 
                              value={config.technicalDetails.policyId} 
                              onChange={(e) => updateTechnicalDetails({ policyId: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Firewall Serial</Label>
                            <Input 
                              value={config.technicalDetails.firewallSerial} 
                              onChange={(e) => updateTechnicalDetails({ firewallSerial: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Threat ID</Label>
                            <Input 
                              value={config.technicalDetails.threatId} 
                              onChange={(e) => updateTechnicalDetails({ threatId: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Web Filter Profile</Label>
                            <Input 
                              value={config.technicalDetails.webFilterProfile} 
                              onChange={(e) => updateTechnicalDetails({ webFilterProfile: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Security Profile</Label>
                            <Input 
                              value={config.technicalDetails.securityProfile} 
                              onChange={(e) => updateTechnicalDetails({ securityProfile: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>SSL Inspection</Label>
                            <Select 
                              value={config.technicalDetails.sslInspection} 
                              onValueChange={(v) => updateTechnicalDetails({ sslInspection: v as 'enabled' | 'disabled' | 'bypassed' })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {sslInspectionOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Action Taken</Label>
                            <Select 
                              value={config.technicalDetails.actionTaken} 
                              onValueChange={(v) => updateTechnicalDetails({ actionTaken: v as 'blocked' | 'logged' | 'quarantined' })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {actionTakenOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Destination IP</Label>
                            <Input 
                              value={config.technicalDetails.destinationIp} 
                              onChange={(e) => updateTechnicalDetails({ destinationIp: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Session ID</Label>
                            <Input 
                              value={config.technicalDetails.sessionId} 
                              onChange={(e) => updateTechnicalDetails({ sessionId: e.target.value })}
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={handleExportHTML} className="bg-[#da291c] hover:bg-[#b91d12]">
                        <FileCode className="h-4 w-4 mr-1" />
                        HTML
                      </Button>
                      <Button onClick={handleExportZIP} variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        ZIP
                      </Button>
                      <Button onClick={handleExportJSON} variant="outline">
                        <FileJson className="h-4 w-4 mr-1" />
                        JSON
                      </Button>
                      <Button onClick={handleCopyHTML} variant="outline">
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button onClick={handleGenerateScreenshot} variant="outline" className="col-span-2">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Screenshot
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Preview */}
              <div className="lg:col-span-7">
                <Card className={`h-full ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Live Preview
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {config.showRequestAccess && (
                          <Button size="sm" variant="outline" onClick={() => setRequestAccessDialog(true)}>
                            <Ticket className="h-4 w-4 mr-1" />
                            Request Access
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setShowPreview(!showPreview)}>
                          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showPreview ? (
                      <div 
                        ref={previewRef}
                        className="border rounded-lg overflow-hidden bg-white"
                        style={{ minHeight: '500px' }}
                      >
                        <iframe
                          srcDoc={generateBlockedPageHTML(config)}
                          className="w-full h-[600px] border-0"
                          title="Preview"
                        />
                      </div>
                    ) : (
                      <div className={`flex items-center justify-center h-96 border-2 border-dashed rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                        <div className="text-center text-gray-400">
                          <EyeOff className="h-12 w-12 mx-auto mb-2" />
                          <p>Preview hidden</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Analytics Dashboard */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Blocks</p>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {analytics.totalBlocks.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Shield className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Threats Blocked</p>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {Math.floor(analytics.totalBlocks * 0.15).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Sessions</p>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {Math.floor(Math.random() * 500 + 100)}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Zap className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Uptime</p>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>99.9%</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className="text-lg">Threat Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.threatDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analytics.threatDistribution.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className="text-lg">Blocks by Hour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.blocksByHour}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="count" fill="#da291c" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={`lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">30-Day Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.timeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate().toString()} />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="blocks" stroke="#da291c" strokeWidth={2} />
                        <Line type="monotone" dataKey="threats" stroke="#ea580c" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">Top Blocked URLs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.topBlockedUrls.map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-200 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>{item.url}</span>
                        </div>
                        <Badge variant="secondary">{item.count} blocks</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Save Profile Dialog */}
        <Dialog open={saveProfileDialog} onOpenChange={setSaveProfileDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Configuration Profile</DialogTitle>
              <DialogDescription>Save your current configuration for later use.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Profile Name</Label>
                <Input 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g., Corporate Malware Scenario"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveProfileDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile}>Save Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Load Profile Dialog */}
        <Dialog open={loadProfileDialog} onOpenChange={setLoadProfileDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Load Saved Profile</DialogTitle>
              <DialogDescription>Select a previously saved configuration.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2 py-4">
                {profiles.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No saved profiles yet.</p>
                ) : (
                  profiles.map(profile => (
                    <div 
                      key={profile.id} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
                    >
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleLoadProfile(profile)}>Load</Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteProfile(profile.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Request Access Dialog */}
        <Dialog open={requestAccessDialog} onOpenChange={(open) => { if (!open) resetRequestForm(); setRequestAccessDialog(open); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Access</DialogTitle>
              <DialogDescription>Submit a request to access this blocked resource.</DialogDescription>
            </DialogHeader>
            {!requestSubmitted ? (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Blocked URL:</p>
                  <p className="font-mono text-sm">{config.blockedUrl}</p>
                </div>
                <div className="space-y-2">
                  <Label>Your Name *</Label>
                  <Input 
                    value={requestForm.name} 
                    onChange={(e) => setRequestForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Your Email *</Label>
                  <Input 
                    type="email"
                    value={requestForm.email} 
                    onChange={(e) => setRequestForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reason for Access</Label>
                  <Textarea 
                    value={requestForm.reason} 
                    onChange={(e) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Explain why you need access to this resource..."
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Request Submitted!</h3>
                <p className="text-gray-600 mb-4">Your access request has been received.</p>
                <div className="bg-gray-100 rounded-lg p-4 inline-block">
                  <p className="text-sm text-gray-600">Ticket ID:</p>
                  <p className="font-mono text-lg font-bold">{generatedTicketId}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              {!requestSubmitted ? (
                <>
                  <Button variant="outline" onClick={() => setRequestAccessDialog(false)}>Cancel</Button>
                  <Button onClick={handleSubmitRequest}>Submit Request</Button>
                </>
              ) : (
                <Button onClick={resetRequestForm}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className={`border-t mt-12 py-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="mb-2">
                <strong>Firewall Block Page Simulator</strong> — For Educational & Training Purposes Only
              </p>
              <p>
                This tool is not affiliated with any firewall vendor. All trademarks belong to their respective owners.
              </p>
              <p className="mt-2 text-xs">
                Use responsibly. Only for authorized cybersecurity training and awareness programs.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-xs">Created by</span>
                <a 
                  href="https://github.com/pinkythegawd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#da291c] hover:underline font-medium"
                >
                  <Github className="h-4 w-4" />
                  @pinkythegawd (MikePinku)
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
