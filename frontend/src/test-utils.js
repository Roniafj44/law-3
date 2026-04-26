import { __TEST_INTERNALS } from 'react';

export async function act(cb) {
  await cb();

  // Process effects
  if (__TEST_INTERNALS.pendingEffects) {
    const effects = __TEST_INTERNALS.pendingEffects;
    __TEST_INTERNALS.pendingEffects = [];
    for (const effect of effects) {
      const cleanup = effect();
      if (typeof cleanup === 'function') {
        if (!__TEST_INTERNALS.cleanups) __TEST_INTERNALS.cleanups = [];
        __TEST_INTERNALS.cleanups.push(cleanup);
      }
    }
  }

  // Microtask tick
  await new Promise(resolve => setTimeout(resolve, 0));
}

function resolveTree(element) {
  if (element === null || element === undefined || typeof element === 'boolean') {
    return null;
  }

  if (typeof element !== 'object') {
    return element;
  }

  if (Array.isArray(element)) {
    return element.map(resolveTree).flat().filter(x => x !== null && x !== undefined && typeof x !== 'boolean');
  }

  if (typeof element.type === 'function') {
    return resolveTree(element.type(element.props));
  }

  if (element.props && 'children' in element.props) {
    return {
      ...element,
      props: {
        ...element.props,
        children: resolveTree(element.props.children)
      }
    };
  }

  return element;
}

export function render(element) {
  __TEST_INTERNALS.hookIndex = 0;
  __TEST_INTERNALS.hooks = [];
  __TEST_INTERNALS.pendingEffects = [];

  let vdom;
  const doRender = () => {
    __TEST_INTERNALS.hookIndex = 0;
    vdom = resolveTree(element);
  };

  __TEST_INTERNALS.render = doRender;
  doRender();

  return {
    vdom,
    rerender: () => {
      doRender();
      return vdom;
    }
  };
}

// Improved helper to find elements in VDOM
export function find(vdom, predicate) {
  if (vdom === null || vdom === undefined) return [];

  if (Array.isArray(vdom)) {
    return vdom.flatMap(child => find(child, predicate));
  }

  const results = predicate(vdom) ? [vdom] : [];

  const children = vdom.props?.children;
  if (children) {
    results.push(...find(children, predicate));
  }

  return results;
}
