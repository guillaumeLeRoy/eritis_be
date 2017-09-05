webpackJsonp([2,4],{

/***/ 368:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(965)(__webpack_require__(672))

/***/ }),

/***/ 672:
/***/ (function(module, exports) {

module.exports = "/////    /////    /////    /////\n/////    /////    /////    /////\n/////    /////    /////    /////\n/////    /////    /////    /////\n/////             /////    /////\n/////             /////    /////\n/////    /////    /////    /////\n/////    /////    /////    /////\n         /////    /////\n         /////    /////\n/////    /////    /////    /////\n/////    /////    /////    /////\n/////    /////    /////    /////\n/////    /////    /////    /////\n\n/**\n * ScrollReveal\n * ------------\n * Version : 3.3.6\n * Website : scrollrevealjs.org\n * Repo    : github.com/jlmakes/scrollreveal.js\n * Author  : Julian Lloyd (@jlmakes)\n */\n\n;(function () {\n  'use strict'\n\n  var sr\n  var _requestAnimationFrame\n\n  function ScrollReveal (config) {\n    // Support instantiation without the `new` keyword.\n    if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {\n      return new ScrollReveal(config)\n    }\n\n    sr = this // Save reference to instance.\n    sr.version = '3.3.6'\n    sr.tools = new Tools() // *required utilities\n\n    if (sr.isSupported()) {\n      sr.tools.extend(sr.defaults, config || {})\n\n      sr.defaults.container = _resolveContainer(sr.defaults)\n\n      sr.store = {\n        elements: {},\n        containers: []\n      }\n\n      sr.sequences = {}\n      sr.history = []\n      sr.uid = 0\n      sr.initialized = false\n    } else if (typeof console !== 'undefined' && console !== null) {\n      // Note: IE9 only supports console if devtools are open.\n      console.log('ScrollReveal is not supported in this browser.')\n    }\n\n    return sr\n  }\n\n  /**\n   * Configuration\n   * -------------\n   * This object signature can be passed directly to the ScrollReveal constructor,\n   * or as the second argument of the `reveal()` method.\n   */\n\n  ScrollReveal.prototype.defaults = {\n    // 'bottom', 'left', 'top', 'right'\n    origin: 'bottom',\n\n    // Can be any valid CSS distance, e.g. '5rem', '10%', '20vw', etc.\n    distance: '20px',\n\n    // Time in milliseconds.\n    duration: 500,\n    delay: 0,\n\n    // Starting angles in degrees, will transition from these values to 0 in all axes.\n    rotate: { x: 0, y: 0, z: 0 },\n\n    // Starting opacity value, before transitioning to the computed opacity.\n    opacity: 0,\n\n    // Starting scale value, will transition from this value to 1\n    scale: 0.9,\n\n    // Accepts any valid CSS easing, e.g. 'ease', 'ease-in-out', 'linear', etc.\n    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',\n\n    // `<html>` is the default reveal container. You can pass either:\n    // DOM Node, e.g. document.querySelector('.fooContainer')\n    // Selector, e.g. '.fooContainer'\n    container: window.document.documentElement,\n\n    // true/false to control reveal animations on mobile.\n    mobile: true,\n\n    // true:  reveals occur every time elements become visible\n    // false: reveals occur once as elements become visible\n    reset: false,\n\n    // 'always' — delay for all reveal animations\n    // 'once'   — delay only the first time reveals occur\n    // 'onload' - delay only for animations triggered by first load\n    useDelay: 'always',\n\n    // Change when an element is considered in the viewport. The default value\n    // of 0.20 means 20% of an element must be visible for its reveal to occur.\n    viewFactor: 0.2,\n\n    // Pixel values that alter the container boundaries.\n    // e.g. Set `{ top: 48 }`, if you have a 48px tall fixed toolbar.\n    // --\n    // Visual Aid: https://scrollrevealjs.org/assets/viewoffset.png\n    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },\n\n    // Callbacks that fire for each triggered element reveal, and reset.\n    beforeReveal: function (domEl) {},\n    beforeReset: function (domEl) {},\n\n    // Callbacks that fire for each completed element reveal, and reset.\n    afterReveal: function (domEl) {},\n    afterReset: function (domEl) {}\n  }\n\n  /**\n   * Check if client supports CSS Transform and CSS Transition.\n   * @return {boolean}\n   */\n  ScrollReveal.prototype.isSupported = function () {\n    var style = document.documentElement.style\n    return 'WebkitTransition' in style && 'WebkitTransform' in style ||\n      'transition' in style && 'transform' in style\n  }\n\n  /**\n   * Creates a reveal set, a group of elements that will animate when they\n   * become visible. If [interval] is provided, a new sequence is created\n   * that will ensure elements reveal in the order they appear in the DOM.\n   *\n   * @param {Node|NodeList|string} [target]   The node, node list or selector to use for animation.\n   * @param {Object}               [config]   Override the defaults for this reveal set.\n   * @param {number}               [interval] Time between sequenced element animations (milliseconds).\n   * @param {boolean}              [sync]     Used internally when updating reveals for async content.\n   *\n   * @return {Object} The current ScrollReveal instance.\n   */\n  ScrollReveal.prototype.reveal = function (target, config, interval, sync) {\n    var container\n    var elements\n    var elem\n    var elemId\n    var sequence\n    var sequenceId\n\n    // No custom configuration was passed, but a sequence interval instead.\n    // let’s shuffle things around to make sure everything works.\n    if (config !== undefined && typeof config === 'number') {\n      interval = config\n      config = {}\n    } else if (config === undefined || config === null) {\n      config = {}\n    }\n\n    container = _resolveContainer(config)\n    elements = _getRevealElements(target, container)\n\n    if (!elements.length) {\n      console.log('ScrollReveal: reveal on \"' + target + '\" failed, no elements found.')\n      return sr\n    }\n\n    // Prepare a new sequence if an interval is passed.\n    if (interval && typeof interval === 'number') {\n      sequenceId = _nextUid()\n\n      sequence = sr.sequences[sequenceId] = {\n        id: sequenceId,\n        interval: interval,\n        elemIds: [],\n        active: false\n      }\n    }\n\n    // Begin main loop to configure ScrollReveal elements.\n    for (var i = 0; i < elements.length; i++) {\n      // Check if the element has already been configured and grab it from the store.\n      elemId = elements[i].getAttribute('data-sr-id')\n      if (elemId) {\n        elem = sr.store.elements[elemId]\n      } else {\n        // Otherwise, let’s do some basic setup.\n        elem = {\n          id: _nextUid(),\n          domEl: elements[i],\n          seen: false,\n          revealing: false\n        }\n        elem.domEl.setAttribute('data-sr-id', elem.id)\n      }\n\n      // Sequence only setup\n      if (sequence) {\n        elem.sequence = {\n          id: sequence.id,\n          index: sequence.elemIds.length\n        }\n\n        sequence.elemIds.push(elem.id)\n      }\n\n      // New or existing element, it’s time to update its configuration, styles,\n      // and send the updates to our store.\n      _configure(elem, config, container)\n      _style(elem)\n      _updateStore(elem)\n\n      // We need to make sure elements are set to visibility: visible, even when\n      // on mobile and `config.mobile === false`, or if unsupported.\n      if (sr.tools.isMobile() && !elem.config.mobile || !sr.isSupported()) {\n        elem.domEl.setAttribute('style', elem.styles.inline)\n        elem.disabled = true\n      } else if (!elem.revealing) {\n        // Otherwise, proceed normally.\n        elem.domEl.setAttribute('style',\n          elem.styles.inline +\n          elem.styles.transform.initial\n        )\n      }\n    }\n\n    // Each `reveal()` is recorded so that when calling `sync()` while working\n    // with asynchronously loaded content, it can re-trace your steps but with\n    // all your new elements now in the DOM.\n\n    // Since `reveal()` is called internally by `sync()`, we don’t want to\n    // record or intiialize each reveal during syncing.\n    if (!sync && sr.isSupported()) {\n      _record(target, config, interval)\n\n      // We push initialization to the event queue using setTimeout, so that we can\n      // give ScrollReveal room to process all reveal calls before putting things into motion.\n      // --\n      // Philip Roberts - What the heck is the event loop anyway? (JSConf EU 2014)\n      // https://www.youtube.com/watch?v=8aGhZQkoFbQ\n      if (sr.initTimeout) {\n        window.clearTimeout(sr.initTimeout)\n      }\n      sr.initTimeout = window.setTimeout(_init, 0)\n    }\n\n    return sr\n  }\n\n  /**\n   * Re-runs `reveal()` for each record stored in history, effectively capturing\n   * any content loaded asynchronously that matches existing reveal set targets.\n   * @return {Object} The current ScrollReveal instance.\n   */\n  ScrollReveal.prototype.sync = function () {\n    if (sr.history.length && sr.isSupported()) {\n      for (var i = 0; i < sr.history.length; i++) {\n        var record = sr.history[i]\n        sr.reveal(record.target, record.config, record.interval, true)\n      }\n      _init()\n    } else {\n      console.log('ScrollReveal: sync failed, no reveals found.')\n    }\n    return sr\n  }\n\n  /**\n   * Private Methods\n   * ---------------\n   */\n\n  function _resolveContainer (config) {\n    if (config && config.container) {\n      if (typeof config.container === 'string') {\n        return window.document.documentElement.querySelector(config.container)\n      } else if (sr.tools.isNode(config.container)) {\n        return config.container\n      } else {\n        console.log('ScrollReveal: invalid container \"' + config.container + '\" provided.')\n        console.log('ScrollReveal: falling back to default container.')\n      }\n    }\n    return sr.defaults.container\n  }\n\n  /**\n   * check to see if a node or node list was passed in as the target,\n   * otherwise query the container using target as a selector.\n   *\n   * @param {Node|NodeList|string} [target]    client input for reveal target.\n   * @param {Node}                 [container] parent element for selector queries.\n   *\n   * @return {array} elements to be revealed.\n   */\n  function _getRevealElements (target, container) {\n    if (typeof target === 'string') {\n      return Array.prototype.slice.call(container.querySelectorAll(target))\n    } else if (sr.tools.isNode(target)) {\n      return [target]\n    } else if (sr.tools.isNodeList(target)) {\n      return Array.prototype.slice.call(target)\n    }\n    return []\n  }\n\n  /**\n   * A consistent way of creating unique IDs.\n   * @returns {number}\n   */\n  function _nextUid () {\n    return ++sr.uid\n  }\n\n  function _configure (elem, config, container) {\n    // If a container was passed as a part of the config object,\n    // let’s overwrite it with the resolved container passed in.\n    if (config.container) config.container = container\n    // If the element hasn’t already been configured, let’s use a clone of the\n    // defaults extended by the configuration passed as the second argument.\n    if (!elem.config) {\n      elem.config = sr.tools.extendClone(sr.defaults, config)\n    } else {\n      // Otherwise, let’s use a clone of the existing element configuration extended\n      // by the configuration passed as the second argument.\n      elem.config = sr.tools.extendClone(elem.config, config)\n    }\n\n    // Infer CSS Transform axis from origin string.\n    if (elem.config.origin === 'top' || elem.config.origin === 'bottom') {\n      elem.config.axis = 'Y'\n    } else {\n      elem.config.axis = 'X'\n    }\n  }\n\n  function _style (elem) {\n    var computed = window.getComputedStyle(elem.domEl)\n\n    if (!elem.styles) {\n      elem.styles = {\n        transition: {},\n        transform: {},\n        computed: {}\n      }\n\n      // Capture any existing inline styles, and add our visibility override.\n      // --\n      // See section 4.2. in the Documentation:\n      // https://github.com/jlmakes/scrollreveal.js#42-improve-user-experience\n      elem.styles.inline = elem.domEl.getAttribute('style') || ''\n      elem.styles.inline += '; visibility: visible; '\n\n      // grab the elements existing opacity.\n      elem.styles.computed.opacity = computed.opacity\n\n      // grab the elements existing transitions.\n      if (!computed.transition || computed.transition === 'all 0s ease 0s') {\n        elem.styles.computed.transition = ''\n      } else {\n        elem.styles.computed.transition = computed.transition + ', '\n      }\n    }\n\n    // Create transition styles\n    elem.styles.transition.instant = _generateTransition(elem, 0)\n    elem.styles.transition.delayed = _generateTransition(elem, elem.config.delay)\n\n    // Generate transform styles, first with the webkit prefix.\n    elem.styles.transform.initial = ' -webkit-transform:'\n    elem.styles.transform.target = ' -webkit-transform:'\n    _generateTransform(elem)\n\n    // And again without any prefix.\n    elem.styles.transform.initial += 'transform:'\n    elem.styles.transform.target += 'transform:'\n    _generateTransform(elem)\n  }\n\n  function _generateTransition (elem, delay) {\n    var config = elem.config\n\n    return '-webkit-transition: ' + elem.styles.computed.transition +\n      '-webkit-transform ' + config.duration / 1000 + 's ' +\n      config.easing + ' ' +\n      delay / 1000 + 's, opacity ' +\n      config.duration / 1000 + 's ' +\n      config.easing + ' ' +\n      delay / 1000 + 's; ' +\n\n      'transition: ' + elem.styles.computed.transition +\n      'transform ' + config.duration / 1000 + 's ' +\n      config.easing + ' ' +\n      delay / 1000 + 's, opacity ' +\n      config.duration / 1000 + 's ' +\n      config.easing + ' ' +\n      delay / 1000 + 's; '\n  }\n\n  function _generateTransform (elem) {\n    var config = elem.config\n    var cssDistance\n    var transform = elem.styles.transform\n\n    // Let’s make sure our our pixel distances are negative for top and left.\n    // e.g. origin = 'top' and distance = '25px' starts at `top: -25px` in CSS.\n    if (config.origin === 'top' || config.origin === 'left') {\n      cssDistance = /^-/.test(config.distance)\n        ? config.distance.substr(1)\n        : '-' + config.distance\n    } else {\n      cssDistance = config.distance\n    }\n\n    if (parseInt(config.distance)) {\n      transform.initial += ' translate' + config.axis + '(' + cssDistance + ')'\n      transform.target += ' translate' + config.axis + '(0)'\n    }\n    if (config.scale) {\n      transform.initial += ' scale(' + config.scale + ')'\n      transform.target += ' scale(1)'\n    }\n    if (config.rotate.x) {\n      transform.initial += ' rotateX(' + config.rotate.x + 'deg)'\n      transform.target += ' rotateX(0)'\n    }\n    if (config.rotate.y) {\n      transform.initial += ' rotateY(' + config.rotate.y + 'deg)'\n      transform.target += ' rotateY(0)'\n    }\n    if (config.rotate.z) {\n      transform.initial += ' rotateZ(' + config.rotate.z + 'deg)'\n      transform.target += ' rotateZ(0)'\n    }\n    transform.initial += '; opacity: ' + config.opacity + ';'\n    transform.target += '; opacity: ' + elem.styles.computed.opacity + ';'\n  }\n\n  function _updateStore (elem) {\n    var container = elem.config.container\n\n    // If this element’s container isn’t already in the store, let’s add it.\n    if (container && sr.store.containers.indexOf(container) === -1) {\n      sr.store.containers.push(elem.config.container)\n    }\n\n    // Update the element stored with our new element.\n    sr.store.elements[elem.id] = elem\n  }\n\n  function _record (target, config, interval) {\n    // Save the `reveal()` arguments that triggered this `_record()` call, so we\n    // can re-trace our steps when calling the `sync()` method.\n    var record = {\n      target: target,\n      config: config,\n      interval: interval\n    }\n    sr.history.push(record)\n  }\n\n  function _init () {\n    if (sr.isSupported()) {\n      // Initial animate call triggers valid reveal animations on first load.\n      // Subsequent animate calls are made inside the event handler.\n      _animate()\n\n      // Then we loop through all container nodes in the store and bind event\n      // listeners to each.\n      for (var i = 0; i < sr.store.containers.length; i++) {\n        sr.store.containers[i].addEventListener('scroll', _handler)\n        sr.store.containers[i].addEventListener('resize', _handler)\n      }\n\n      // Let’s also do a one-time binding of window event listeners.\n      if (!sr.initialized) {\n        window.addEventListener('scroll', _handler)\n        window.addEventListener('resize', _handler)\n        sr.initialized = true\n      }\n    }\n    return sr\n  }\n\n  function _handler () {\n    _requestAnimationFrame(_animate)\n  }\n\n  function _setActiveSequences () {\n    var active\n    var elem\n    var elemId\n    var sequence\n\n    // Loop through all sequences\n    sr.tools.forOwn(sr.sequences, function (sequenceId) {\n      sequence = sr.sequences[sequenceId]\n      active = false\n\n      // For each sequenced elemenet, let’s check visibility and if\n      // any are visible, set it’s sequence to active.\n      for (var i = 0; i < sequence.elemIds.length; i++) {\n        elemId = sequence.elemIds[i]\n        elem = sr.store.elements[elemId]\n        if (_isElemVisible(elem) && !active) {\n          active = true\n        }\n      }\n\n      sequence.active = active\n    })\n  }\n\n  function _animate () {\n    var delayed\n    var elem\n\n    _setActiveSequences()\n\n    // Loop through all elements in the store\n    sr.tools.forOwn(sr.store.elements, function (elemId) {\n      elem = sr.store.elements[elemId]\n      delayed = _shouldUseDelay(elem)\n\n      // Let’s see if we should revealand if so,\n      // trigger the `beforeReveal` callback and\n      // determine whether or not to use delay.\n      if (_shouldReveal(elem)) {\n        elem.config.beforeReveal(elem.domEl)\n        if (delayed) {\n          elem.domEl.setAttribute('style',\n            elem.styles.inline +\n            elem.styles.transform.target +\n            elem.styles.transition.delayed\n          )\n        } else {\n          elem.domEl.setAttribute('style',\n            elem.styles.inline +\n            elem.styles.transform.target +\n            elem.styles.transition.instant\n          )\n        }\n\n        // Let’s queue the `afterReveal` callback\n        // and mark the element as seen and revealing.\n        _queueCallback('reveal', elem, delayed)\n        elem.revealing = true\n        elem.seen = true\n\n        if (elem.sequence) {\n          _queueNextInSequence(elem, delayed)\n        }\n      } else if (_shouldReset(elem)) {\n        //Otherwise reset our element and\n        // trigger the `beforeReset` callback.\n        elem.config.beforeReset(elem.domEl)\n        elem.domEl.setAttribute('style',\n          elem.styles.inline +\n          elem.styles.transform.initial +\n          elem.styles.transition.instant\n        )\n        // And queue the `afterReset` callback.\n        _queueCallback('reset', elem)\n        elem.revealing = false\n      }\n    })\n  }\n\n  function _queueNextInSequence (elem, delayed) {\n    var elapsed = 0\n    var delay = 0\n    var sequence = sr.sequences[elem.sequence.id]\n\n    // We’re processing a sequenced element, so let's block other elements in this sequence.\n    sequence.blocked = true\n\n    // Since we’re triggering animations a part of a sequence after animations on first load,\n    // we need to check for that condition and explicitly add the delay to our timer.\n    if (delayed && elem.config.useDelay === 'onload') {\n      delay = elem.config.delay\n    }\n\n    // If a sequence timer is already running, capture the elapsed time and clear it.\n    if (elem.sequence.timer) {\n      elapsed = Math.abs(elem.sequence.timer.started - new Date())\n      window.clearTimeout(elem.sequence.timer)\n    }\n\n    // Start a new timer.\n    elem.sequence.timer = { started: new Date() }\n    elem.sequence.timer.clock = window.setTimeout(function () {\n      // Sequence interval has passed, so unblock the sequence and re-run the handler.\n      sequence.blocked = false\n      elem.sequence.timer = null\n      _handler()\n    }, Math.abs(sequence.interval) + delay - elapsed)\n  }\n\n  function _queueCallback (type, elem, delayed) {\n    var elapsed = 0\n    var duration = 0\n    var callback = 'after'\n\n    // Check which callback we’re working with.\n    switch (type) {\n      case 'reveal':\n        duration = elem.config.duration\n        if (delayed) {\n          duration += elem.config.delay\n        }\n        callback += 'Reveal'\n        break\n\n      case 'reset':\n        duration = elem.config.duration\n        callback += 'Reset'\n        break\n    }\n\n    // If a timer is already running, capture the elapsed time and clear it.\n    if (elem.timer) {\n      elapsed = Math.abs(elem.timer.started - new Date())\n      window.clearTimeout(elem.timer.clock)\n    }\n\n    // Start a new timer.\n    elem.timer = { started: new Date() }\n    elem.timer.clock = window.setTimeout(function () {\n      // The timer completed, so let’s fire the callback and null the timer.\n      elem.config[callback](elem.domEl)\n      elem.timer = null\n    }, duration - elapsed)\n  }\n\n  function _shouldReveal (elem) {\n    if (elem.sequence) {\n      var sequence = sr.sequences[elem.sequence.id]\n      return sequence.active &&\n        !sequence.blocked &&\n        !elem.revealing &&\n        !elem.disabled\n    }\n    return _isElemVisible(elem) &&\n      !elem.revealing &&\n      !elem.disabled\n  }\n\n  function _shouldUseDelay (elem) {\n    var config = elem.config.useDelay\n    return config === 'always' ||\n      (config === 'onload' && !sr.initialized) ||\n      (config === 'once' && !elem.seen)\n  }\n\n  function _shouldReset (elem) {\n    if (elem.sequence) {\n      var sequence = sr.sequences[elem.sequence.id]\n      return !sequence.active &&\n        elem.config.reset &&\n        elem.revealing &&\n        !elem.disabled\n    }\n    return !_isElemVisible(elem) &&\n      elem.config.reset &&\n      elem.revealing &&\n      !elem.disabled\n  }\n\n  function _getContainer (container) {\n    return {\n      width: container.clientWidth,\n      height: container.clientHeight\n    }\n  }\n\n  function _getScrolled (container) {\n    // Return the container scroll values, plus the its offset.\n    if (container && container !== window.document.documentElement) {\n      var offset = _getOffset(container)\n      return {\n        x: container.scrollLeft + offset.left,\n        y: container.scrollTop + offset.top\n      }\n    } else {\n      // Otherwise, default to the window object’s scroll values.\n      return {\n        x: window.pageXOffset,\n        y: window.pageYOffset\n      }\n    }\n  }\n\n  function _getOffset (domEl) {\n    var offsetTop = 0\n    var offsetLeft = 0\n\n      // Grab the element’s dimensions.\n    var offsetHeight = domEl.offsetHeight\n    var offsetWidth = domEl.offsetWidth\n\n    // Now calculate the distance between the element and its parent, then\n    // again for the parent to its parent, and again etc... until we have the\n    // total distance of the element to the document’s top and left origin.\n    do {\n      if (!isNaN(domEl.offsetTop)) {\n        offsetTop += domEl.offsetTop\n      }\n      if (!isNaN(domEl.offsetLeft)) {\n        offsetLeft += domEl.offsetLeft\n      }\n      domEl = domEl.offsetParent\n    } while (domEl)\n\n    return {\n      top: offsetTop,\n      left: offsetLeft,\n      height: offsetHeight,\n      width: offsetWidth\n    }\n  }\n\n  function _isElemVisible (elem) {\n    var offset = _getOffset(elem.domEl)\n    var container = _getContainer(elem.config.container)\n    var scrolled = _getScrolled(elem.config.container)\n    var vF = elem.config.viewFactor\n\n      // Define the element geometry.\n    var elemHeight = offset.height\n    var elemWidth = offset.width\n    var elemTop = offset.top\n    var elemLeft = offset.left\n    var elemBottom = elemTop + elemHeight\n    var elemRight = elemLeft + elemWidth\n\n    return confirmBounds() || isPositionFixed()\n\n    function confirmBounds () {\n      // Define the element’s functional boundaries using its view factor.\n      var top = elemTop + elemHeight * vF\n      var left = elemLeft + elemWidth * vF\n      var bottom = elemBottom - elemHeight * vF\n      var right = elemRight - elemWidth * vF\n\n      // Define the container functional boundaries using its view offset.\n      var viewTop = scrolled.y + elem.config.viewOffset.top\n      var viewLeft = scrolled.x + elem.config.viewOffset.left\n      var viewBottom = scrolled.y - elem.config.viewOffset.bottom + container.height\n      var viewRight = scrolled.x - elem.config.viewOffset.right + container.width\n\n      return top < viewBottom &&\n        bottom > viewTop &&\n        left < viewRight &&\n        right > viewLeft\n    }\n\n    function isPositionFixed () {\n      return (window.getComputedStyle(elem.domEl).position === 'fixed')\n    }\n  }\n\n  /**\n   * Utilities\n   * ---------\n   */\n\n  function Tools () {}\n\n  Tools.prototype.isObject = function (object) {\n    return object !== null && typeof object === 'object' && object.constructor === Object\n  }\n\n  Tools.prototype.isNode = function (object) {\n    return typeof window.Node === 'object'\n      ? object instanceof window.Node\n      : object && typeof object === 'object' &&\n        typeof object.nodeType === 'number' &&\n        typeof object.nodeName === 'string'\n  }\n\n  Tools.prototype.isNodeList = function (object) {\n    var prototypeToString = Object.prototype.toString.call(object)\n    var regex = /^\\[object (HTMLCollection|NodeList|Object)\\]$/\n\n    return typeof window.NodeList === 'object'\n      ? object instanceof window.NodeList\n      : object && typeof object === 'object' &&\n        regex.test(prototypeToString) &&\n        typeof object.length === 'number' &&\n        (object.length === 0 || this.isNode(object[0]))\n  }\n\n  Tools.prototype.forOwn = function (object, callback) {\n    if (!this.isObject(object)) {\n      throw new TypeError('Expected \"object\", but received \"' + typeof object + '\".')\n    } else {\n      for (var property in object) {\n        if (object.hasOwnProperty(property)) {\n          callback(property)\n        }\n      }\n    }\n  }\n\n  Tools.prototype.extend = function (target, source) {\n    this.forOwn(source, function (property) {\n      if (this.isObject(source[property])) {\n        if (!target[property] || !this.isObject(target[property])) {\n          target[property] = {}\n        }\n        this.extend(target[property], source[property])\n      } else {\n        target[property] = source[property]\n      }\n    }.bind(this))\n    return target\n  }\n\n  Tools.prototype.extendClone = function (target, source) {\n    return this.extend(this.extend({}, target), source)\n  }\n\n  Tools.prototype.isMobile = function () {\n    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)\n  }\n\n  /**\n   * Polyfills\n   * --------\n   */\n\n  _requestAnimationFrame = window.requestAnimationFrame ||\n    window.webkitRequestAnimationFrame ||\n    window.mozRequestAnimationFrame ||\n    function (callback) {\n      window.setTimeout(callback, 1000 / 60)\n    }\n\n  /**\n   * Module Wrapper\n   * --------------\n   */\n  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {\n    define(function () {\n      return ScrollReveal\n    })\n  } else if (typeof module !== 'undefined' && module.exports) {\n    module.exports = ScrollReveal\n  } else {\n    window.ScrollReveal = ScrollReveal\n  }\n})();\n"

/***/ }),

/***/ 965:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	if (typeof execScript !== "undefined")
		execScript(src);
	else
		eval.call(null, src);
}


/***/ }),

/***/ 978:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(368);


/***/ })

},[978]);
//# sourceMappingURL=scripts.bundle.js.map