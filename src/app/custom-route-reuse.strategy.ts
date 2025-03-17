// import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

// export class CustomRouteReuseStrategy implements RouteReuseStrategy {
//   shouldDetach(route: ActivatedRouteSnapshot): boolean {
//     return false; // 🚀 Always destroy and reload components
//   }

//   store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}

//   shouldAttach(route: ActivatedRouteSnapshot): boolean {
//     return false; // 🚀 Prevent restoring previous component state
//   }

//   retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
//     return null;
//   }

//   shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//     return future.routeConfig === curr.routeConfig; // ✅ Allow route reuse only if configs match
//   }
// }



import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false; // ❌ Don't store any routes
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // ❌ Do nothing, we don't want to store any route
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false; // ❌ Always load routes fresh
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null; // ❌ No cached routes
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig; // ✅ Only reuse if it's the same route
  }
}
