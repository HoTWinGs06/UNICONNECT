// ============================================
// UniConnect — Main Application Controller
// ============================================

import { Router } from './router.js';
import { renderOnboarding, initOnboarding } from './pages/onboarding.js';
import { renderFeed, initFeed } from './pages/feed.js';
import { renderServers, initServers } from './pages/servers.js';
import { renderGroups, initGroups } from './pages/groups.js';
import { renderMessages, initMessages } from './pages/messages.js';
import { renderGrades, initGrades } from './pages/grades.js';
import { renderEvents, initEvents } from './pages/events.js';
import { renderHelp, initHelp } from './pages/help.js';

// -- Page Registry --
const pages = {
  '/onboarding': { render: renderOnboarding, init: initOnboarding, hideNav: true, title: 'Onboarding' },
  '/feed':       { render: renderFeed,       init: initFeed,       hideNav: false, title: 'Campus Feed' },
  '/servers':    { render: renderServers,     init: initServers,    hideNav: false, title: 'Servers', fullWidth: true },
  '/groups':     { render: renderGroups,      init: initGroups,     hideNav: false, title: 'Study Groups' },
  '/messages':   { render: renderMessages,    init: initMessages,   hideNav: false, title: 'Messages', fullWidth: true },
  '/grades':     { render: renderGrades,      init: initGrades,     hideNav: false, title: 'Academics' },
  '/events':     { render: renderEvents,      init: initEvents,     hideNav: false, title: 'Events' },
  '/help':       { render: renderHelp,        init: initHelp,       hideNav: false, title: 'Help Request' },
};

// -- Navigation Items --
const navItems = [
  { path: '/feed',     icon: 'home',           label: 'Feed',     mobileNav: true },
  { path: '/servers',  icon: 'dns',            label: 'Servers',  mobileNav: true },
  { path: '/messages', icon: 'chat',           label: 'Messages', mobileNav: true, badge: 2 },
  { path: '/grades',   icon: 'school',         label: 'Grades',   mobileNav: true },
  { path: '/events',   icon: 'event',          label: 'Events',   mobileNav: true },
  { path: '/groups',   icon: 'group',          label: 'Groups',   mobileNav: false },
  { path: '/help',     icon: 'help_outline',   label: 'Get Help', mobileNav: false },
];

// -- App Initialization --
document.addEventListener('DOMContentLoaded', () => {
  const router = new Router();
  const content = document.getElementById('app-content');
  const sidebar = document.getElementById('app-sidebar');
  const mobileTopBar = document.getElementById('mobile-top-bar');
  const mobileBottomNav = document.getElementById('mobile-bottom-nav');
  const sidebarNav = document.getElementById('sidebar-nav');
  const mobileNavItems = document.getElementById('mobile-nav-items');
  const pageTitle = document.getElementById('page-title');

  // Build sidebar navigation
  if (sidebarNav) {
    sidebarNav.innerHTML = navItems.map(item => `
      <a href="#${item.path}" class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all font-label-md text-label-md" data-path="${item.path}">
        <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
        ${item.label}
        ${item.badge ? `<span class="ml-auto w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[10px] font-bold">${item.badge}</span>` : ''}
      </a>
    `).join('');
  }

  // Build mobile bottom navigation
  if (mobileNavItems) {
    mobileNavItems.innerHTML = navItems.filter(i => i.mobileNav).map(item => `
      <a href="#${item.path}" class="mobile-nav-link flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg text-on-surface-variant transition-colors relative" data-path="${item.path}">
        <span class="material-symbols-outlined text-[22px]">${item.icon}</span>
        <span class="text-[10px] font-medium">${item.label}</span>
        ${item.badge ? `<span class="absolute -top-0.5 right-0 w-4 h-4 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[8px] font-bold">${item.badge}</span>` : ''}
      </a>
    `).join('');
  }

  // -- Route Handler --
  function navigateTo(path) {
    const page = pages[path];
    if (!page) return;

    // Update content
    content.innerHTML = page.render();
    // Re-trigger entry animation
    content.style.animation = 'none';
    content.offsetHeight; // force reflow
    content.style.animation = '';

    // Init page interactivity
    page.init();

    // Update page title
    document.title = `UniConnect — ${page.title}`;
    if (pageTitle) pageTitle.textContent = page.title;

    // Show/hide nav
    const showNav = !page.hideNav;
    if (sidebar) sidebar.classList.toggle('hidden', !showNav);
    if (sidebar) sidebar.classList.toggle('md:flex', showNav);
    if (mobileTopBar) mobileTopBar.classList.toggle('hidden', !showNav);
    if (mobileTopBar) mobileTopBar.classList.toggle('md:hidden', showNav);
    if (mobileBottomNav) mobileBottomNav.classList.toggle('hidden', !showNav);
    if (mobileBottomNav) mobileBottomNav.classList.toggle('md:hidden', showNav);

    // Full-width content (servers, messages don't need max-width padding from shell)
    const mainWrap = document.getElementById('app-main');
    if (mainWrap) {
      mainWrap.classList.toggle('overflow-hidden', !!page.fullWidth);
    }

    // Update active nav links
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const isActive = link.dataset.path === path;
      link.classList.toggle('bg-surface-container-low', isActive);
      link.classList.toggle('text-on-surface', isActive);
      link.classList.toggle('font-semibold', isActive);
      if (isActive) {
        const icon = link.querySelector('.material-symbols-outlined');
        if (icon) icon.style.fontVariationSettings = "'FILL' 1";
      } else {
        const icon = link.querySelector('.material-symbols-outlined');
        if (icon) icon.style.fontVariationSettings = "";
      }
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      const isActive = link.dataset.path === path;
      link.classList.toggle('text-secondary', isActive);
      link.classList.toggle('text-on-surface-variant', !isActive);
      const icon = link.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = isActive ? "'FILL' 1" : "";
    });
  }

  // Register routes
  Object.keys(pages).forEach(path => {
    router.on(path, navigateTo);
  });

  // Start router
  router.start('/feed');
});
