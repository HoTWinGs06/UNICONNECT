// ============================================
// UniConnect — Hash-Based SPA Router
// ============================================

export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.beforeEach = null;
    window.addEventListener('hashchange', () => this._handleRoute());
  }

  /** Register a route handler */
  on(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  /** Set a guard that runs before each navigation */
  guard(fn) {
    this.beforeEach = fn;
    return this;
  }

  /** Navigate to a route programmatically */
  navigate(path) {
    window.location.hash = path;
  }

  /** Get current route path */
  get current() {
    return this.currentRoute;
  }

  /** Start the router — resolve the current hash or fallback to default */
  start(defaultRoute = '/feed') {
    const hash = window.location.hash.slice(1) || defaultRoute;
    if (!window.location.hash) {
      window.location.hash = hash;
    } else {
      this._handleRoute();
    }
  }

  /** Internal: handle route change */
  _handleRoute() {
    const hash = window.location.hash.slice(1) || '/feed';
    const path = hash.split('?')[0]; // strip query params

    if (path === this.currentRoute) return;

    // Run guard if set
    if (this.beforeEach) {
      const canProceed = this.beforeEach(path, this.currentRoute);
      if (canProceed === false) return;
    }

    const handler = this.routes[path];
    if (handler) {
      this.currentRoute = path;
      handler(path);
    } else {
      // Fallback to default
      this.navigate('/feed');
    }
  }
}
