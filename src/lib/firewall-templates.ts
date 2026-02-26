import type { BlockPageConfig } from '@/types';
import { themes } from './themes';
import { formatTimestamp } from './utils';

// Generate Fortinet-style blocked page HTML
export const generateFortinetHTML = (config: BlockPageConfig): string => {
  const theme = themes[config.theme];
  const categoryLabel = config.category === 'custom' 
    ? config.customCategory 
    : config.category;
  const errorCode = config.errorCode === 'custom' 
    ? config.customErrorCode 
    : config.errorCode;

  const blockTitles: Record<string, { title: string; subtitle: string }> = {
    'intrusion-prevention': { title: 'FortiGuard Intrusion Prevention', subtitle: 'Access Blocked' },
    'web-filter': { title: 'FortiGuard Web Filtering', subtitle: 'Access Restricted' },
    'application-control': { title: 'FortiGate Application Control', subtitle: 'Application Blocked' },
    'dns-filter': { title: 'FortiGuard DNS Filtering', subtitle: 'DNS Request Blocked' },
  };

  const { title, subtitle } = blockTitles[config.blockType] || blockTitles['intrusion-prevention'];

  return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${subtitle}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: ${theme.font.family}; 
            background: ${theme.colors.background}; 
            color: ${theme.colors.text};
            min-height: 100vh;
            line-height: 1.6;
        }
        .header {
            background: ${theme.colors.background};
            border-bottom: 3px solid ${theme.colors.primary};
        }
        .logo-container {
            padding: 20px 40px;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 2px;
        }
        .logo-f {
            font-size: 28px;
            font-weight: bold;
            color: ${theme.colors.primary};
            letter-spacing: 2px;
        }
        .logo-bars {
            display: flex;
            gap: 2px;
            margin: 0 2px;
        }
        .logo-bar {
            width: 4px;
            height: 20px;
            background: ${theme.colors.primary};
        }
        .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: ${theme.colors.primary};
            letter-spacing: 2px;
        }
        .geometric-header {
            position: relative;
            height: ${theme.header.height};
            overflow: hidden;
            background: ${theme.header.gradient};
        }
        .geo-bar {
            position: absolute;
        }
        .geo-red-left {
            left: 0;
            top: 60px;
            width: 80px;
            height: 12px;
            background: ${theme.colors.primary};
        }
        .geo-teal {
            left: 120px;
            top: 30px;
            width: 40px;
            height: 80px;
            background: ${theme.colors.secondary};
        }
        .geo-dark {
            left: 170px;
            top: 0;
            width: 20px;
            height: 120px;
            background: #4a4a4a;
        }
        .geo-gray {
            left: 200px;
            top: 0;
            width: 35px;
            height: 70px;
            background: #b8b8b8;
        }
        .geo-red-right {
            right: 50px;
            top: 45px;
            width: 70px;
            height: 15px;
            background: ${theme.colors.primary};
        }
        .geo-blue {
            right: 0;
            top: 60px;
            width: 30px;
            height: 50px;
            background: ${theme.colors.accent};
        }
        .dots {
            position: absolute;
            right: 80px;
            top: 70px;
            width: 100px;
            height: 50px;
        }
        .dot {
            width: 4px;
            height: 4px;
            background: #999;
            border-radius: 50%;
            display: inline-block;
            margin: 3px;
            opacity: 0.4;
        }
        .content {
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
        }
        .title {
            font-size: ${theme.font.size.title};
            font-weight: bold;
            color: ${theme.colors.text};
            margin-bottom: 8px;
        }
        .subtitle {
            font-size: ${theme.font.size.subtitle};
            font-weight: bold;
            color: ${theme.colors.text};
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: ${theme.colors.textMuted};
            margin-bottom: 15px;
        }
        .description {
            font-size: ${theme.font.size.body};
            color: ${theme.colors.textMuted};
            line-height: 1.6;
            margin-bottom: 25px;
        }
        .info-table {
            margin-bottom: 25px;
        }
        .info-row {
            display: flex;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }
        .info-label {
            width: 160px;
            color: ${theme.colors.textMuted};
            font-size: 15px;
            flex-shrink: 0;
        }
        .info-value {
            color: ${theme.colors.text};
            font-size: 15px;
            font-family: monospace;
            word-break: break-all;
        }
        .re-eval {
            font-size: 15px;
            color: ${theme.colors.textMuted};
            margin-bottom: 30px;
        }
        .re-eval a {
            color: #0000ee;
            text-decoration: underline;
        }
        .re-eval a:hover {
            color: #551a8b;
        }
        .details-box {
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: 4px;
            padding: 20px;
            margin-top: 30px;
        }
        .details-title {
            font-size: 14px;
            font-weight: bold;
            color: ${theme.colors.textMuted};
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .disclaimer {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }
        .disclaimer-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
        }
        .disclaimer-text {
            font-size: 14px;
            color: #856404;
            line-height: 1.5;
        }
        .contact-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid ${theme.colors.border};
        }
        .contact-title {
            font-size: 14px;
            font-weight: bold;
            color: ${theme.colors.textMuted};
            margin-bottom: 10px;
        }
        .contact-item {
            font-size: 14px;
            color: ${theme.colors.textMuted};
            margin-bottom: 5px;
        }
        .request-access-btn {
            display: inline-block;
            background: ${theme.colors.primary};
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
            border: none;
            cursor: pointer;
        }
        .request-access-btn:hover {
            opacity: 0.9;
        }
        .technical-details {
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: 4px;
            padding: 20px;
            margin-top: 20px;
        }
        .technical-details summary {
            font-weight: bold;
            color: ${theme.colors.textMuted};
            cursor: pointer;
            outline: none;
        }
        .technical-details summary:hover {
            color: ${theme.colors.text};
        }
        @media (max-width: 600px) {
            .content { padding: 20px; }
            .title, .subtitle { font-size: 24px; }
            .info-row { flex-direction: column; }
            .info-label { width: auto; margin-bottom: 5px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container">
            <div class="logo">
                <span class="logo-f">F</span>
                <div class="logo-bars">
                    <div class="logo-bar"></div>
                    <div class="logo-bar"></div>
                    <div class="logo-bar"></div>
                </div>
                <span class="logo-text">RTINET</span>
            </div>
        </div>
        <div class="geometric-header">
            <div class="geo-bar geo-red-left"></div>
            <div class="geo-bar geo-teal"></div>
            <div class="geo-bar geo-dark"></div>
            <div class="geo-bar geo-gray"></div>
            <div class="geo-bar geo-red-right"></div>
            <div class="geo-bar geo-blue"></div>
            <div class="dots">
                ${Array(24).fill('<span class="dot"></span>').join('')}
            </div>
        </div>
    </div>
    
    <div class="content">
        <h1 class="title">${title}</h1>
        <h2 class="subtitle">- ${subtitle}</h2>
        
        <h3 class="section-title">Web Page Blocked</h3>
        
        <p class="description">
            You have tried to access a web page that is in violation of your Internet usage policy.
        </p>
        
        <div class="info-table">
            <div class="info-row">
                <span class="info-label">Category:</span>
                <span class="info-value">${categoryLabel}</span>
            </div>
            <div class="info-row">
                <span class="info-label">URL:</span>
                <span class="info-value">${config.blockedUrl}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Error Code:</span>
                <span class="info-value">${errorCode}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Timestamp:</span>
                <span class="info-value">${formatTimestamp(config.timestamp, config.language)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Client IP:</span>
                <span class="info-value">${config.ipAddress}</span>
            </div>
            ${config.userName ? `
            <div class="info-row">
                <span class="info-label">User:</span>
                <span class="info-value">${config.userName}</span>
            </div>
            ` : ''}
            <div class="info-row">
                <span class="info-label">Firewall:</span>
                <span class="info-value">${config.firewallName}</span>
            </div>
        </div>
        
        <p class="re-eval">
            To have the rating of this web page re-evaluated <a href="#">please click here</a>.
        </p>
        
        ${config.showRequestAccess ? `
        <button class="request-access-btn" onclick="alert('This would open a request access form in a real deployment.')">
            Request Access
        </button>
        ` : ''}
        
        ${config.showTechnicalDetails ? `
        <details class="technical-details">
            <summary>Technical Details</summary>
            <div class="info-table" style="margin-top: 15px;">
                <div class="info-row">
                    <span class="info-label">Policy ID:</span>
                    <span class="info-value">${config.technicalDetails.policyId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Serial Number:</span>
                    <span class="info-value">${config.technicalDetails.firewallSerial}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Threat ID:</span>
                    <span class="info-value">${config.technicalDetails.threatId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Web Filter Profile:</span>
                    <span class="info-value">${config.technicalDetails.webFilterProfile}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Security Profile:</span>
                    <span class="info-value">${config.technicalDetails.securityProfile}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">SSL Inspection:</span>
                    <span class="info-value">${config.technicalDetails.sslInspection}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Action Taken:</span>
                    <span class="info-value">${config.technicalDetails.actionTaken.toUpperCase()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Destination IP:</span>
                    <span class="info-value">${config.technicalDetails.destinationIp}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Destination Port:</span>
                    <span class="info-value">${config.technicalDetails.destinationPort}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Protocol:</span>
                    <span class="info-value">${config.technicalDetails.protocol}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Session ID:</span>
                    <span class="info-value">${config.technicalDetails.sessionId}</span>
                </div>
            </div>
        </details>
        ` : ''}
        
        <div class="details-box">
            <div class="details-title">Connection Details</div>
            <div class="info-row">
                <span class="info-label">Organization:</span>
                <span class="info-value">${config.organization || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Policy Applied:</span>
                <span class="info-value">${config.technicalDetails.webFilterProfile}</span>
            </div>
        </div>
        
        <div class="contact-info">
            <div class="contact-title">Network Administrator Contact</div>
            ${config.adminEmail ? `<div class="contact-item">Email: ${config.adminEmail}</div>` : ''}
            ${config.adminPhone ? `<div class="contact-item">Phone: ${config.adminPhone}</div>` : ''}
            ${config.adminPortal ? `<div class="contact-item">Portal: <a href="${config.adminPortal}">${config.adminPortal}</a></div>` : ''}
        </div>
        
        ${config.showDisclaimer ? `
        <div class="disclaimer">
            <div class="disclaimer-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                TRAINING SIMULATION NOTICE
            </div>
            <div class="disclaimer-text">
                <strong>This is a simulated page for training purposes only.</strong> This page was generated as part of a cybersecurity awareness training exercise. No actual security policy violation has occurred. This simulation is designed to help users recognize and understand network security controls.
            </div>
        </div>
        ` : ''}
    </div>
</body>
</html>`;
};

// Generate Corporate-style blocked page HTML
export const generateCorporateHTML = (config: BlockPageConfig): string => {
  const theme = themes[config.theme];
  const categoryLabel = config.category === 'custom' 
    ? config.customCategory 
    : config.category;
  const errorCode = config.errorCode === 'custom' 
    ? config.customErrorCode 
    : config.errorCode;

  return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Denied - Corporate Security Policy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: ${theme.font.family}; 
            background: ${theme.colors.background}; 
            color: ${theme.colors.text};
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: ${theme.colors.primary};
            padding: 20px 40px;
            color: white;
        }
        .header-content {
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .shield-icon {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .shield-icon svg {
            width: 24px;
            height: 24px;
            fill: ${theme.colors.primary};
        }
        .header-title {
            font-size: 20px;
            font-weight: bold;
        }
        .header-subtitle {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            flex: 1;
            padding: 40px;
            max-width: 1000px;
            margin: 0 auto;
            width: 100%;
        }
        .alert-box {
            background: #fee2e2;
            border-left: 4px solid ${theme.colors.error};
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 0 4px 4px 0;
        }
        .alert-title {
            color: ${theme.colors.error};
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .alert-text {
            color: #7f1d1d;
            font-size: 14px;
        }
        .main-title {
            font-size: 28px;
            font-weight: bold;
            color: ${theme.colors.text};
            margin-bottom: 20px;
        }
        .info-section {
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
        }
        .info-section-title {
            font-size: 16px;
            font-weight: bold;
            color: ${theme.colors.textMuted};
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 12px 20px;
        }
        .info-label {
            color: ${theme.colors.textMuted};
            font-size: 14px;
        }
        .info-value {
            color: ${theme.colors.text};
            font-size: 14px;
            font-family: monospace;
            word-break: break-all;
        }
        .action-section {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid ${theme.colors.border};
        }
        .action-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .action-buttons {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: none;
        }
        .btn-primary {
            background: ${theme.colors.primary};
            color: white;
        }
        .btn-secondary {
            background: ${theme.colors.surface};
            color: ${theme.colors.text};
            border: 1px solid ${theme.colors.border};
        }
        .footer {
            background: ${theme.colors.surface};
            border-top: 1px solid ${theme.colors.border};
            padding: 20px 40px;
            text-align: center;
            font-size: 12px;
            color: ${theme.colors.textMuted};
        }
        .disclaimer {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }
        .disclaimer-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
        }
        .disclaimer-text {
            color: #92400e;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .content { padding: 20px; }
            .info-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="shield-icon">
                <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            </div>
            <div>
                <div class="header-title">${config.organization || 'Corporate Security'}</div>
                <div class="header-subtitle">Network Protection System</div>
            </div>
        </div>
    </div>
    
    <div class="content">
        <div class="alert-box">
            <div class="alert-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Access Denied - Security Policy Violation
            </div>
            <div class="alert-text">
                Your request to access this resource has been blocked in accordance with company security policies.
            </div>
        </div>
        
        <h1 class="main-title">Request Blocked</h1>
        
        <div class="info-section">
            <div class="info-section-title">Request Details</div>
            <div class="info-grid">
                <span class="info-label">Blocked URL:</span>
                <span class="info-value">${config.blockedUrl}</span>
                
                <span class="info-label">Category:</span>
                <span class="info-value">${categoryLabel}</span>
                
                <span class="info-label">Error Code:</span>
                <span class="info-value">${errorCode}</span>
                
                <span class="info-label">Timestamp:</span>
                <span class="info-value">${formatTimestamp(config.timestamp, config.language)}</span>
                
                <span class="info-label">Your IP:</span>
                <span class="info-value">${config.ipAddress}</span>
                
                ${config.userName ? `
                <span class="info-label">Username:</span>
                <span class="info-value">${config.userName}</span>
                ` : ''}
            </div>
        </div>
        
        ${config.showTechnicalDetails ? `
        <div class="info-section">
            <div class="info-section-title">Technical Information</div>
            <div class="info-grid">
                <span class="info-label">Policy ID:</span>
                <span class="info-value">${config.technicalDetails.policyId}</span>
                
                <span class="info-label">Security Profile:</span>
                <span class="info-value">${config.technicalDetails.securityProfile}</span>
                
                <span class="info-label">Action:</span>
                <span class="info-value">${config.technicalDetails.actionTaken.toUpperCase()}</span>
            </div>
        </div>
        ` : ''}
        
        <div class="action-section">
            <div class="action-title">What can you do?</div>
            <div class="action-buttons">
                ${config.showRequestAccess ? `
                <button class="btn btn-primary" onclick="alert('Request access functionality')">
                    Request Exception
                </button>
                ` : ''}
                <a href="mailto:${config.adminEmail}" class="btn btn-secondary">
                    Contact IT Support
                </a>
            </div>
        </div>
        
        ${config.showDisclaimer ? `
        <div class="disclaimer">
            <div class="disclaimer-title">Training Simulation</div>
            <div class="disclaimer-text">
                This is a simulated page for training purposes only. No actual security policy violation has occurred.
            </div>
        </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <p>If you believe this is an error, please contact your IT department.</p>
        <p style="margin-top: 5px;">${config.adminEmail ? `Support: ${config.adminEmail}` : ''}</p>
    </div>
</body>
</html>`;
};

// Generate School-style blocked page HTML
export const generateSchoolHTML = (config: BlockPageConfig): string => {
  const categoryLabel = config.category === 'custom' 
    ? config.customCategory 
    : config.category;

  return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Blocked - School Network</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: #333;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        .mascot {
            width: 100px;
            height: 100px;
            background: #ffd700;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 50px;
        }
        .title {
            font-size: 28px;
            color: #5a67d8;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 18px;
            color: #718096;
            margin-bottom: 30px;
        }
        .message-box {
            background: #e6fffa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            text-align: left;
        }
        .message-title {
            font-weight: bold;
            color: #234e52;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .message-text {
            color: #285e61;
            font-size: 14px;
            line-height: 1.6;
        }
        .details {
            background: #f7fafc;
            border-radius: 12px;
            padding: 20px;
            text-align: left;
            margin-bottom: 25px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #718096;
            font-size: 14px;
        }
        .detail-value {
            color: #2d3748;
            font-size: 14px;
            font-weight: 600;
        }
        .alternatives {
            background: #fef5e7;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
        }
        .alternatives-title {
            font-weight: bold;
            color: #c05621;
            margin-bottom: 10px;
        }
        .alternatives-list {
            list-style: none;
            color: #744210;
            font-size: 14px;
        }
        .alternatives-list li {
            padding: 5px 0;
            padding-left: 20px;
            position: relative;
        }
        .alternatives-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #38a169;
        }
        .contact {
            font-size: 13px;
            color: #718096;
        }
        .disclaimer {
            background: #fffaf0;
            border: 2px solid #ed8936;
            border-radius: 12px;
            padding: 15px;
            margin-top: 20px;
            font-size: 12px;
            color: #c05621;
        }
        @media (max-width: 480px) {
            .card { padding: 25px; }
            .title { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="mascot">🔒</div>
        <h1 class="title">Oops! This Site is Blocked</h1>
        <p class="subtitle">${config.organization || 'School Network'} Protection</p>
        
        <div class="message-box">
            <div class="message-title">
                <span>📚</span> Learning First!
            </div>
            <div class="message-text">
                This website has been blocked because it doesn't support our educational mission. 
                We're here to help you learn and grow! 
            </div>
        </div>
        
        <div class="details">
            <div class="detail-row">
                <span class="detail-label">Website:</span>
                <span class="detail-value">${config.blockedUrl}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${categoryLabel}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Your Computer:</span>
                <span class="detail-value">${config.ipAddress}</span>
            </div>
        </div>
        
        <div class="alternatives">
            <div class="alternatives-title">Try these instead:</div>
            <ul class="alternatives-list">
                <li>Educational games on approved sites</li>
                <li>School library online resources</li>
                <li>Teacher-recommended websites</li>
                <li>Research databases</li>
            </ul>
        </div>
        
        <div class="contact">
            <p>Think this is a mistake? Talk to your teacher!</p>
            ${config.adminEmail ? `<p style="margin-top: 10px;">IT Support: ${config.adminEmail}</p>` : ''}
        </div>
        
        ${config.showDisclaimer ? `
        <div class="disclaimer">
            <strong>Training Simulation:</strong> This is a practice page for learning about internet safety.
        </div>
        ` : ''}
    </div>
</body>
</html>`;
};

// Generate ISP-style blocked page HTML
export const generateISPHTML = (config: BlockPageConfig): string => {
  const theme = themes[config.theme];
  const categoryLabel = config.category === 'custom' 
    ? config.customCategory 
    : config.category;
  const errorCode = config.errorCode === 'custom' 
    ? config.customErrorCode 
    : config.errorCode;

  return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Restricted - ${config.organization || 'Internet Service Provider'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: ${theme.font.family}; 
            background: ${theme.colors.background}; 
            color: ${theme.colors.text};
            min-height: 100vh;
        }
        .official-header {
            background: ${theme.colors.primary};
            color: white;
            padding: 15px 40px;
            font-size: 14px;
        }
        .official-header-content {
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .main-header {
            background: white;
            border-bottom: 1px solid ${theme.colors.border};
            padding: 30px 40px;
        }
        .main-header-content {
            max-width: 1000px;
            margin: 0 auto;
        }
        .isp-logo {
            font-size: 24px;
            font-weight: bold;
            color: ${theme.colors.primary};
        }
        .content {
            padding: 40px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .notice-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 4px;
            padding: 25px;
            margin-bottom: 30px;
        }
        .notice-title {
            font-size: 20px;
            font-weight: bold;
            color: #991b1b;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notice-text {
            color: #7f1d1d;
            font-size: 14px;
            line-height: 1.6;
        }
        .details-section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: ${theme.colors.text};
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid ${theme.colors.border};
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .details-table td {
            padding: 12px 15px;
            border-bottom: 1px solid ${theme.colors.border};
        }
        .details-table td:first-child {
            width: 200px;
            color: ${theme.colors.textMuted};
            font-weight: 500;
        }
        .details-table td:last-child {
            font-family: monospace;
            color: ${theme.colors.text};
        }
        .legal-section {
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: 4px;
            padding: 25px;
            margin-bottom: 30px;
        }
        .legal-title {
            font-size: 14px;
            font-weight: bold;
            color: ${theme.colors.textMuted};
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        .legal-text {
            font-size: 13px;
            color: ${theme.colors.textMuted};
            line-height: 1.8;
        }
        .contact-section {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid ${theme.colors.border};
        }
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .contact-card {
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: 4px;
            padding: 20px;
        }
        .contact-card-title {
            font-size: 14px;
            font-weight: bold;
            color: ${theme.colors.textMuted};
            margin-bottom: 10px;
        }
        .contact-card-info {
            font-size: 14px;
            color: ${theme.colors.text};
        }
        .footer {
            background: ${theme.colors.surface};
            border-top: 1px solid ${theme.colors.border};
            padding: 30px 40px;
            text-align: center;
        }
        .footer-content {
            max-width: 1000px;
            margin: 0 auto;
        }
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .footer-links a {
            color: ${theme.colors.primary};
            text-decoration: none;
            font-size: 14px;
        }
        .footer-links a:hover {
            text-decoration: underline;
        }
        .footer-copyright {
            font-size: 12px;
            color: ${theme.colors.textMuted};
        }
        .disclaimer {
            background: #fffbeb;
            border: 2px solid #f59e0b;
            border-radius: 4px;
            padding: 20px;
            margin-top: 30px;
        }
        .disclaimer-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
        }
        .disclaimer-text {
            color: #92400e;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .content { padding: 20px; }
            .official-header-content { flex-direction: column; gap: 10px; }
        }
    </style>
</head>
<body>
    <div class="official-header">
        <div class="official-header-content">
            <span>Official Notice - Reference: ${errorCode}</span>
            <span>${formatTimestamp(config.timestamp, config.language)}</span>
        </div>
    </div>
    
    <div class="main-header">
        <div class="main-header-content">
            <div class="isp-logo">${config.organization || 'Internet Service Provider'}</div>
        </div>
    </div>
    
    <div class="content">
        <div class="notice-box">
            <div class="notice-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Access to This Resource Has Been Restricted
            </div>
            <div class="notice-text">
                In compliance with legal requirements and our Terms of Service, access to the requested website 
                has been restricted. This action may be due to a court order, regulatory requirement, or 
                violation of acceptable use policies.
            </div>
        </div>
        
        <div class="details-section">
            <div class="section-title">Restriction Details</div>
            <table class="details-table">
                <tr>
                    <td>Requested URL:</td>
                    <td>${config.blockedUrl}</td>
                </tr>
                <tr>
                    <td>Restriction Type:</td>
                    <td>${categoryLabel}</td>
                </tr>
                <tr>
                    <td>Reference Number:</td>
                    <td>${errorCode}</td>
                </tr>
                <tr>
                    <td>Your IP Address:</td>
                    <td>${config.ipAddress}</td>
                </tr>
                ${config.showTechnicalDetails ? `
                <tr>
                    <td>Session ID:</td>
                    <td>${config.technicalDetails.sessionId}</td>
                </tr>
                ` : ''}
            </table>
        </div>
        
        <div class="legal-section">
            <div class="legal-title">Legal Information</div>
            <div class="legal-text">
                <p><strong>Why is this site blocked?</strong></p>
                <p style="margin-top: 10px;">
                    Internet service providers may be required to restrict access to certain websites in compliance 
                    with local laws, court orders, or to protect network integrity and user safety.
                </p>
                <p style="margin-top: 15px;">
                    <strong>Your rights:</strong> If you believe this restriction has been applied in error, 
                    you have the right to appeal this decision through the appropriate legal channels or 
                    contact our support team for clarification.
                </p>
            </div>
        </div>
        
        <div class="contact-section">
            <div class="section-title">Contact Information</div>
            <div class="contact-grid">
                <div class="contact-card">
                    <div class="contact-card-title">Customer Support</div>
                    <div class="contact-card-info">
                        ${config.adminEmail ? `<p>Email: ${config.adminEmail}</p>` : ''}
                        ${config.adminPhone ? `<p>Phone: ${config.adminPhone}</p>` : ''}
                    </div>
                </div>
                <div class="contact-card">
                    <div class="contact-card-title">Legal Department</div>
                    <div class="contact-card-info">
                        <p>For appeals and legal inquiries</p>
                        <p>legal@${config.organization?.toLowerCase().replace(/\s+/g, '') || 'isp'}.com</p>
                    </div>
                </div>
            </div>
        </div>
        
        ${config.showDisclaimer ? `
        <div class="disclaimer">
            <div class="disclaimer-title">Training Simulation Notice</div>
            <div class="disclaimer-text">
                This page is part of a cybersecurity training exercise. No actual access restriction has been applied.
            </div>
        </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <div class="footer-content">
            <div class="footer-links">
                <a href="#">Terms of Service</a>
                <a href="#">Acceptable Use Policy</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Contact Us</a>
            </div>
            <div class="footer-copyright">
                © ${new Date().getFullYear()} ${config.organization || 'Internet Service Provider'}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
};

// Generate Custom-branded blocked page HTML
export const generateCustomHTML = (config: BlockPageConfig): string => {
  const theme = themes[config.theme];
  const categoryLabel = config.category === 'custom' 
    ? config.customCategory 
    : config.category;
  const errorCode = config.errorCode === 'custom' 
    ? config.customErrorCode 
    : config.errorCode;

  const primaryColor = config.customColors?.primary || theme.colors.primary;

  return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Blocked - ${config.organization || 'Network Security'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: ${theme.font.family}; 
            background: ${theme.colors.background}; 
            color: ${theme.colors.text};
            min-height: 100vh;
        }
        .header {
            background: ${primaryColor};
            padding: 30px 40px;
            text-align: center;
        }
        .logo {
            max-width: 200px;
            max-height: 60px;
        }
        .content {
            padding: 50px 40px;
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        .icon {
            width: 80px;
            height: 80px;
            background: ${theme.colors.secondary};
            border-radius: 50%;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon svg {
            width: 40px;
            height: 40px;
            fill: white;
        }
        .title {
            font-size: 36px;
            font-weight: bold;
            color: ${theme.colors.text};
            margin-bottom: 15px;
        }
        .subtitle {
            font-size: 18px;
            color: ${theme.colors.textMuted};
            margin-bottom: 40px;
        }
        .info-box {
            background: ${theme.colors.surface};
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: left;
        }
        .info-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid ${theme.colors.border};
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            width: 150px;
            color: ${theme.colors.textMuted};
            font-weight: 500;
        }
        .info-value {
            flex: 1;
            color: ${theme.colors.text};
            font-family: monospace;
            word-break: break-all;
        }
        .actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 30px;
        }
        .btn {
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: none;
            transition: opacity 0.2s;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .btn-primary {
            background: ${primaryColor};
            color: white;
        }
        .btn-secondary {
            background: transparent;
            color: ${theme.colors.text};
            border: 2px solid ${theme.colors.border};
        }
        .footer {
            background: ${theme.colors.surface};
            border-top: 1px solid ${theme.colors.border};
            padding: 30px 40px;
            text-align: center;
        }
        .footer-text {
            font-size: 14px;
            color: ${theme.colors.textMuted};
        }
        .disclaimer {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin-top: 30px;
            text-align: left;
        }
        .disclaimer-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
        }
        .disclaimer-text {
            color: #92400e;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .title { font-size: 28px; }
            .info-row { flex-direction: column; }
            .info-label { width: auto; margin-bottom: 5px; }
        }
    </style>
</head>
<body>
    <div class="header">
        ${config.customLogo ? 
            `<img src="${config.customLogo}" alt="Logo" class="logo">` : 
            `<h1 style="color: white; font-size: 24px;">${config.organization || 'Network Security'}</h1>`
        }
    </div>
    
    <div class="content">
        <div class="icon">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        </div>
        
        <h1 class="title">Access Blocked</h1>
        <p class="subtitle">This resource is not accessible from your current location</p>
        
        <div class="info-box">
            <div class="info-row">
                <span class="info-label">URL:</span>
                <span class="info-value">${config.blockedUrl}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Category:</span>
                <span class="info-value">${categoryLabel}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Error Code:</span>
                <span class="info-value">${errorCode}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Timestamp:</span>
                <span class="info-value">${formatTimestamp(config.timestamp, config.language)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Your IP:</span>
                <span class="info-value">${config.ipAddress}</span>
            </div>
        </div>
        
        <div class="actions">
            ${config.showRequestAccess ? `
            <button class="btn btn-primary" onclick="alert('Request access form would open here')">
                Request Access
            </button>
            ` : ''}
            <a href="mailto:${config.adminEmail}" class="btn btn-secondary">
                Contact Support
            </a>
        </div>
        
        ${config.showDisclaimer ? `
        <div class="disclaimer">
            <div class="disclaimer-title">⚠️ Training Simulation</div>
            <div class="disclaimer-text">
                This is a simulated block page created for educational purposes. No actual access restriction is in place.
            </div>
        </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <p class="footer-text">
            ${config.adminEmail ? `Need help? Contact us at ${config.adminEmail}` : ''}
        </p>
        <p class="footer-text" style="margin-top: 10px;">
            © ${new Date().getFullYear()} ${config.organization || 'Network Security'}. All rights reserved.
        </p>
    </div>
</body>
</html>`;
};

// Main generator function that routes to the appropriate template
export const generateBlockedPageHTML = (config: BlockPageConfig): string => {
  switch (config.firewallMode) {
    case 'corporate':
      return generateCorporateHTML(config);
    case 'school':
      return generateSchoolHTML(config);
    case 'isp':
      return generateISPHTML(config);
    case 'custom':
      return generateCustomHTML(config);
    case 'fortinet':
    default:
      return generateFortinetHTML(config);
  }
};

// Generate ZIP package with HTML and assets
export const generateZIPPackage = async (config: BlockPageConfig): Promise<Blob> => {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  const html = generateBlockedPageHTML(config);
  zip.file('index.html', html);
  
  // Add README
  const readme = `# Firewall Block Page - ${config.firewallMode.toUpperCase()} Mode

Generated: ${new Date().toISOString()}
Mode: ${config.firewallMode}
Category: ${config.category}
Error Code: ${config.errorCode}

## Files
- index.html - The blocked page

## Usage
Open index.html in any web browser to view the blocked page.

## Disclaimer
This is a simulated page for training purposes only.
`;
  zip.file('README.txt', readme);
  
  return await zip.generateAsync({ type: 'blob' });
};
