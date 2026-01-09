/* 📁 src/styles/primeng-custom-theme.css */

/* ========================================
   🎨 КОЛЬОРОВА ПАЛІТРА
   ======================================== */
:root {
  /* Основні кольори */
  --primary-color: #1976d2;
  --primary-hover: #1565c0;
  --primary-active: #0d47a1;
  --primary-light: #e3f2fd;
  
  --secondary-color: #9c27b0;
  --secondary-hover: #7b1fa2;
  
  --success-color: #4caf50;
  --success-hover: #388e3c;
  
  --danger-color: #f44336;
  --danger-hover: #d32f2f;
  
  --warning-color: #ff9800;
  --warning-hover: #f57c00;
  
  --info-color: #2196f3;
  --info-hover: #1976d2;
  
  /* Нейтральні кольори */
  --text-primary: #212121;
  --text-secondary: #666666;
  --text-disabled: #9e9e9e;
  
  --border-color: #e0e0e0;
  --border-hover: #bdbdbd;
  --border-focus: var(--primary-color);
  
  --background-white: #ffffff;
  --background-light: #f5f5f5;
  --background-hover: #fafafa;
  
  /* Тіні */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.15);
  
  /* Розміри */
  --border-radius: 8px;
  --border-radius-sm: 4px;
  --border-radius-lg: 12px;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Анімації */
  --transition-speed: 0.2s;
}

/* ========================================
   🔤 INPUT & TEXTAREA
   ======================================== */

/* Базові стилі для Input */
.p-inputtext {
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-primary);
  background: var(--background-white);
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: all var(--transition-speed) ease;
  width: 100%;
}

.p-inputtext:enabled:hover {
  border-color: var(--border-hover);
}

.p-inputtext:enabled:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.p-inputtext.p-invalid {
  border-color: var(--danger-color);
}

.p-inputtext.p-invalid:enabled:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.p-inputtext:disabled {
  background: var(--background-light);
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Small розмір */
.p-inputtext.p-inputtext-sm {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

/* Large розмір */
.p-inputtext.p-inputtext-lg {
  font-size: 1.125rem;
  padding: 1rem 1.25rem;
}

/* Textarea */
.p-inputtextarea {
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-primary);
  background: var(--background-white);
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: all var(--transition-speed) ease;
  resize: vertical;
  min-height: 100px;
}

.p-inputtextarea:enabled:hover {
  border-color: var(--border-hover);
}

.p-inputtextarea:enabled:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

/* Float Label */
.p-float-label label {
  color: var(--text-secondary);
  transition: all var(--transition-speed) ease;
}

.p-float-label .p-inputtext:focus ~ label,
.p-float-label .p-inputtext.p-filled ~ label {
  color: var(--primary-color);
  font-size: 0.875rem;
}

/* ========================================
   🔘 BUTTONS
   ======================================== */

.p-button {
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  border: none;
  transition: all var(--transition-speed) ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

/* Primary Button */
.p-button.p-button-primary,
.p-button:not(.p-button-outlined):not(.p-button-text) {
  background: var(--primary-color);
  color: white;
}

.p-button.p-button-primary:hover,
.p-button:not(.p-button-outlined):not(.p-button-text):hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.p-button.p-button-primary:active,
.p-button:not(.p-button-outlined):not(.p-button-text):active {
  background: var(--primary-active);
  transform: translateY(0);
}

/* Secondary Button */
.p-button.p-button-secondary {
  background: var(--secondary-color);
  color: white;
}

.p-button.p-button-secondary:hover {
  background: var(--secondary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Success Button */
.p-button.p-button-success {
  background: var(--success-color);
  color: white;
}

.p-button.p-button-success:hover {
  background: var(--success-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Danger Button */
.p-button.p-button-danger {
  background: var(--danger-color);
  color: white;
}

.p-button.p-button-danger:hover {
  background: var(--danger-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Warning Button */
.p-button.p-button-warning {
  background: var(--warning-color);
  color: white;
}

.p-button.p-button-warning:hover {
  background: var(--warning-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Outlined Button */
.p-button.p-button-outlined {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.p-button.p-button-outlined:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
}

.p-button.p-button-outlined.p-button-danger {
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.p-button.p-button-outlined.p-button-danger:hover {
  background: rgba(244, 67, 54, 0.1);
}

/* Text Button */
.p-button.p-button-text {
  background: transparent;
  color: var(--primary-color);
  padding: 0.5rem 1rem;
}

.p-button.p-button-text:hover {
  background: var(--primary-light);
}

/* Icon Only Button */
.p-button.p-button-icon-only {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  justify-content: center;
  border-radius: 50%;
}

/* Small & Large размеры */
.p-button.p-button-sm {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.p-button.p-button-lg {
  font-size: 1.125rem;
  padding: 1rem 2rem;
}

/* Disabled State */
.p-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Loading State */
.p-button .p-button-loading-icon {
  margin-right: 0.5rem;
}

/* ========================================
   🔔 TOAST (Notifications)
   ======================================== */

.p-toast {
  opacity: 1;
}

.p-toast .p-toast-message {
  margin: 0 0 1rem 0;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  border: none;
  backdrop-filter: blur(10px);
}

/* Success Toast */
.p-toast .p-toast-message.p-toast-message-success {
  background: var(--success-color);
  color: white;
}

.p-toast .p-toast-message.p-toast-message-success .p-toast-message-icon,
.p-toast .p-toast-message.p-toast-message-success .p-toast-icon-close {
  color: white;
}

/* Info Toast */
.p-toast .p-toast-message.p-toast-message-info {
  background: var(--info-color);
  color: white;
}

.p-toast .p-toast-message.p-toast-message-info .p-toast-message-icon,
.p-toast .p-toast-message.p-toast-message-info .p-toast-icon-close {
  color: white;
}

/* Warning Toast */
.p-toast .p-toast-message.p-toast-message-warn {
  background: var(--warning-color);
  color: white;
}

.p-toast .p-toast-message.p-toast-message-warn .p-toast-message-icon,
.p-toast .p-toast-message.p-toast-message-warn .p-toast-icon-close {
  color: white;
}

/* Error Toast */
.p-toast .p-toast-message.p-toast-message-error {
  background: var(--danger-color);
  color: white;
}

.p-toast .p-toast-message.p-toast-message-error .p-toast-message-icon,
.p-toast .p-toast-message.p-toast-message-error .p-toast-icon-close {
  color: white;
}

.p-toast .p-toast-message .p-toast-message-content {
  padding: 1rem 1.25rem;
}

.p-toast .p-toast-message .p-toast-summary {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.p-toast .p-toast-message .p-toast-detail {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.95;
}

.p-toast .p-toast-message .p-toast-icon-close {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  transition: all var(--transition-speed) ease;
}

.p-toast .p-toast-message .p-toast-icon-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ========================================
   📊 TABLE
   ======================================== */

.p-datatable {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.p-datatable .p-datatable-header {
  background: var(--background-light);
  border: 1px solid var(--border-color);
  border-bottom: none;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.p-datatable .p-datatable-thead > tr > th {
  background: var(--primary-color);
  color: white;
  padding: 1rem 1.5rem;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.p-datatable .p-datatable-tbody > tr {
  background: var(--background-white);
  color: var(--text-primary);
  transition: all var(--transition-speed) ease;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem 1.5rem;
  border: 1px solid var(--border-color);
  border-left: none;
  border-right: none;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background: var(--background-hover);
}

.p-datatable .p-datatable-tbody > tr.p-highlight {
  background: var(--primary-light);
  color: var(--primary-color);
}

/* Zebra Striping */
.p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even) {
  background: var(--background-light);
}

.p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even):hover {
  background: var(--background-hover);
}

/* Grid Lines */
.p-datatable.p-datatable-gridlines .p-datatable-tbody > tr > td {
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}

/* Small Size */
.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: 0.625rem 1rem;
}

.p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
  padding: 0.625rem 1rem;
}

/* Large Size */
.p-datatable.p-datatable-lg .p-datatable-tbody > tr > td {
  padding: 1.25rem 1.5rem;
}

.p-datatable.p-datatable-lg .p-datatable-thead > tr > th {
  padding: 1.25rem 1.5rem;
}

/* Pagination */
.p-datatable .p-paginator {
  background: var(--background-white);
  border: 1px solid var(--border-color);
  border-top: none;
  padding: 1rem;
}

.p-paginator .p-paginator-pages .p-paginator-page {
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius-sm);
  margin: 0 0.25rem;
  transition: all var(--transition-speed) ease;
}

.p-paginator .p-paginator-pages .p-paginator-page:hover {
  background: var(--primary-light);
  color: var(--primary-color);
}

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  background: var(--primary-color);
  color: white;
}

/* ========================================
   📋 DIALOG (Modal)
   ======================================== */

.p-dialog {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  border: none;
}

.p-dialog .p-dialog-header {
  background: var(--background-white);
  color: var(--text-primary);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
}

.p-dialog .p-dialog-title {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.p-dialog .p-dialog-header-icons {
  display: flex;
  gap: 0.5rem;
}

.p-dialog .p-dialog-header-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-speed) ease;
  color: var(--text-secondary);
}

.p-dialog .p-dialog-header-icon:hover {
  background: var(--background-light);
  color: var(--text-primary);
}

.p-dialog .p-dialog-content {
  background: var(--background-white);
  color: var(--text-primary);
  padding: 2rem;
  line-height: 1.6;
}

.p-dialog .p-dialog-footer {
  background: var(--background-light);
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Dialog Overlay */
.p-dialog-mask {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Maximized Dialog */
.p-dialog.p-dialog-maximized {
  border-radius: 0;
}

/* ========================================
   ✅ CONFIRM DIALOG
   ======================================== */

.p-confirm-dialog {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
}

.p-confirm-dialog .p-dialog-header {
  background: var(--background-white);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.p-confirm-dialog .p-dialog-content {
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.p-confirm-dialog .p-confirm-dialog-icon {
  font-size: 2.5rem;
  margin-top: 0.25rem;
}

/* Success Confirmation */
.p-confirm-dialog .p-confirm-dialog-icon.pi-check-circle {
  color: var(--success-color);
}

/* Warning Confirmation */
.p-confirm-dialog .p-confirm-dialog-icon.pi-exclamation-triangle {
  color: var(--warning-color);
}

/* Error/Danger Confirmation */
.p-confirm-dialog .p-confirm-dialog-icon.pi-times-circle {
  color: var(--danger-color);
}

/* Info Confirmation */
.p-confirm-dialog .p-confirm-dialog-icon.pi-info-circle {
  color: var(--info-color);
}

.p-confirm-dialog .p-confirm-dialog-message {
  flex: 1;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.p-confirm-dialog .p-dialog-footer {
  background: var(--background-white);
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* ========================================
   🎭 ANIMATIONS
   ======================================== */

/* Toast Animation */
@keyframes p-toast-message-enter {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes p-toast-message-leave {
  from {
    max-height: 1000px;
    opacity: 1;
    transform: scale(1);
  }
  to {
    max-height: 0;
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Dialog Animation */
.p-dialog-enter-active {
  animation: p-dialog-show 0.3s ease-out;
}

.p-dialog-leave-active {
  animation: p-dialog-hide 0.3s ease-in;
}

@keyframes p-dialog-show {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes p-dialog-hide {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
}

/* ========================================
   🌙 DARK MODE (опціонально)
   ======================================== */

@media (prefers-color-scheme: dark) {
  .dark-mode {
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --text-disabled: #666666;
    
    --border-color: #424242;
    --border-hover: #616161;
    
    --background-white: #1e1e1e;
    --background-light: #2a2a2a;
    --background-hover: #333333;
    
    --primary-light: rgba(25, 118, 210, 0.2);
  }
}