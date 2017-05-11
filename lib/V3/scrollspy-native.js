
/* Native Javascript for Bootstrap 3 | ScrollSpy
-----------------------------------------------*/

// SCROLLSPY DEFINITION
// ====================
var ScrollSpy = function(element, options) {

  // initialization element, the element we spy on
  element = queryElement(element);

  // DATA API
  var targetData = queryElement(element[getAttribute](dataTarget));

  // set options
  options = options || {};
  if ( !options[target] && !targetData ) { return; } // invalidate

  // event targets, constants
  var spyTarget = options[target] && queryElement(options[target]) || targetData,
      links = spyTarget && spyTarget[getElementsByTagName]('A'),
      items = [], targetItems = [], scrollOffset,
      userOffset = options.offset || 0,
      gapTop = options.gapTop || 0, gapBottom = options.gapBottom || 0,
      scrollTarget = element[offsetHeight] < element[scrollHeight] ? element : globalObject, // determine which is the real scrollTarget
      isWindow = scrollTarget === globalObject;

  // populate items and targets
  for (var i=0, il=links[length]; i<il; i++) {
    var href = links[i][getAttribute]('href'),
        targetItem = href && targetsReg.test(href) && queryElement(href);
    if ( !!targetItem ) {
      items.push(links[i]);
      targetItems.push(targetItem[parentNode][parentNode]);
    }
  }

  // private methods
  var updateItem = function(index) {
      var parent = items[index][parentNode], // item's parent LI element
        targetItem = targetItems[index], // the menu item targets this element
        dropdown = getClosest(parent,'.dropdown'),
        targetRect = isWindow && targetItem[getBoundingClientRect](),

        isActive = hasClass(parent,active) || false,

        topEdge = isWindow ? targetRect[top] + scrollOffset - gapTop : targetItem[offsetTop] - (targetItems[index-1] ? 0 : 10) - gapTop,
        bottomEdge = isWindow ? targetRect[bottom] + scrollOffset + gapBottom : targetItems[index+1] ? targetItems[index+1][offsetTop] + gapBottom : element[scrollHeight],

        // first element in toc is always active
        topEdge = targetItems[index-1] ? topEdge : 0,
        inside = targetItems[index-1] ? (scrollOffset >= topEdge - userOffset && bottomEdge - userOffset > scrollOffset) : true;
      if ( !isActive && inside ) {
        if ( parent.tagName === 'LI' && !hasClass(parent,active) ) {
          addClass(parent,active);
          isActive = true;
          bootstrapCustomEvent.call(element, 'activate', 'scrollspy', items[index]);
        }
      } else if ( !inside ) {
        if ( parent.tagName === 'LI' && hasClass(parent,active) ) {
          removeClass(parent,active);
          isActive = false;
        }
      } else if ( !inside && !isActive || isActive && inside ) {
        return;
      }
    },
    updateItems = function(){
      scrollOffset = isWindow ? getScroll().y : element[scrollTop];
      for (var index=0, itl=items[length]; index<itl; index++) {
        updateItem(index)
      }
    };

  // public method
  this.refresh = function () {
    updateItems();
  }

  // init
  if ( !(stringScrollSpy in element) ) { // prevent adding event handlers twice
    on( scrollTarget, scrollEvent, this.refresh );
    !isIE8 && on( globalObject, resizeEvent, this.refresh );
  }
  this.refresh();
  element[stringScrollSpy] = this;
};

// SCROLLSPY DATA API
// ==================
initializeDataAPI(stringScrollSpy, ScrollSpy, dataSpy);
