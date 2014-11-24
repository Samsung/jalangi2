var scaleBody = function (container, mobileWidth) {
    // height and width of the page-container element; note that these
    // should be set in CSS so we can do measure once here
    var computedStyles = window.getComputedStyle(container);
    var containerWidth = parseInt(computedStyles.width.replace('px', ''), 10);
    var containerHeight = parseInt(computedStyles.height.replace('px', ''), 10);
    var containerStyle = container.style;
    containerStyle.position = 'absolute';
    containerStyle['-webkit-transform-origin'] = '0 0 0';
    containerStyle.transform = '0 0 0';
    containerStyle.display = 'none';

    // resize page so that it fills it either horizontally or vertically
    var scaleLandscape = function () {
        // available height and width
        var availableWidth = document.documentElement.clientWidth;
        var availableHeight = document.documentElement.clientHeight;

        // work out ratio of available height to container height,
        // and the same for width
        var scaleWidth = availableWidth / containerWidth;
        var scaleHeight = availableHeight / containerHeight;

        // use a single scaling value for both width and height:
        // whichever is smaller, vertical or horizontal scale
        var scaleBoth = scaleWidth;
        if (scaleHeight < scaleWidth) {
            scaleBoth = scaleHeight;
        }

        var left = (availableWidth - (containerWidth * scaleBoth)) / 2;
        left = parseInt(left * (1 / scaleBoth), 10);

        var top = (availableHeight - (containerHeight * scaleBoth)) / 2;
        top = parseInt(top * (1 / scaleBoth), 10);

        var scaleTransform = 'scale(' + scaleBoth + ',' + scaleBoth + ')';
        var translateTransform = 'translate(' + left + 'px, ' + top + 'px)';

        containerStyle['-webkit-transform'] = scaleTransform + ' ' +
            translateTransform;
        containerStyle.transform = scaleTransform + ' ' +
            translateTransform;
    };

    // manually apply a pseudo landscape orientation where the client
    // width is smaller than its height
    var scaleWithPseudoOrientation = function () {
        // we rotate by 90deg around the top left corner
        var rotateTransform = 'rotate(90deg)';

        // figure out the available height and width
        var availableWidth = document.documentElement.clientWidth;
        var availableHeight = document.documentElement.clientHeight;

        // we have to fit the container's width into the client height
        // and container's height into its width, as it's rotated
        // work out ratio of available height to container height,
        // and the same for width
        var scaleWidth = availableWidth / containerHeight;
        var scaleHeight = availableHeight / containerWidth;

        // use a single scaling value for both width and height:
        // whichever is smaller, vertical or horizontal scale
        var scaleBoth = scaleWidth;
        if (scaleHeight < scaleWidth) {
            scaleBoth = scaleHeight;
        }

        var scaleTransform = 'scale(' + scaleBoth + ',' + scaleBoth + ')';

        // now we translate to centre the container in the client
        var left = (availableWidth - (containerHeight * scaleBoth)) / 2;
        left = parseInt(left * (1 / scaleBoth), 10) + containerHeight;

        var top = (availableHeight - (containerWidth * scaleBoth)) / 2;
        top = parseInt(top * (1 / scaleBoth), 10);

        var translateTransform = 'translate(' + left + 'px, ' + top + 'px)';

        containerStyle['-webkit-transform'] = scaleTransform + ' ' +
            translateTransform + ' ' +
            rotateTransform;
        containerStyle.transform = scaleTransform + ' ' +
            translateTransform + ' ' +
            rotateTransform;
    };

    // scale according
    var scale = function () {
        if ('lockOrientation' in screen) {
            // we are locked to landscape already
            scaleLandscape();
        }
        else {
            var doc = document.documentElement;

            // if the window is small, assume we're on mobile
            var onMobile = (doc.clientWidth <= mobileWidth);

            if (doc.clientWidth < doc.clientHeight && onMobile) {
                // we haven't locked to landscape orientation and the window is
                // taller than it is wide, so we apply a pseudo-landscape transform
                scaleWithPseudoOrientation();
            }
            else {
                scaleLandscape();
            }
        }
    };

    // lock orientation if possible
    if (screen.lockOrientation) {
        screen.lockOrientation('landscape');
    }

    // set up handlers
    window.onresize = scale;
    window.addEventListener('orientationchange', scale);

    // run first scale
    scale();

    // apply borders to the page container once it has had its first resize
    setTimeout(function () {
        containerStyle.display = 'block';
    }, 0);

};
